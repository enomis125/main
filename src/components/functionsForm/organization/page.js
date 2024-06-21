"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function OrgEdit(idOrg){
    //edição na tabela role
    const [valuesOrg, setValuesOrg] = useState({
        Name: '',
        Email: '',
        FiscalNumber: '',
        Address1: '',
        Address2: '',
        PhoneNumber: '',
        Country: '',
        District: '',
        ZipCode: '',
        active: 0
    })


    useEffect(() => {
        axios.get('/api/hotel/organizations/' + idOrg)
            .then(res => {
                const userData = res.data.response[0];
                setValuesOrg({ ...valuesOrg,
                    Name: userData.name,
                    Email: userData.email,
                    FiscalNumber: userData.fiscalNumber,
                    Address1: userData.address1,
                    Address2: userData.address2,
                    PhoneNumber: userData.phoneNumber,
                    Country: userData.country,
                    District: userData.district,
                    ZipCode: userData.zipCode,
                    active: userData.del
                })
            })
            .catch(err => console.log(err))
    }, [])


    function handleUpdateOrg(e) {
        e.preventDefault()
        axios.patch('/api/hotel/organizations/' + idOrg, {
            data: {
                Name: valuesOrg.Name,
                Email: valuesOrg.Email,
                FiscalNumber: valuesOrg.FiscalNumber,
                Address1: valuesOrg.Address1,
                Address2: valuesOrg.Address2,
                PhoneNumber: valuesOrg.PhoneNumber,
                Country: valuesOrg.Country,
                District: valuesOrg.District,
                ZipCode: valuesOrg.ZipCode,
                active: valuesOrg.active ? 1 : 0
            }
        })
        .then(response => {console.log(response); window.location.reload();})
        .catch(err => console.log(err))
    }

    return { 
        handleUpdateOrg, setValuesOrg, valuesOrg 
    };
}