"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function organizationInsert() {

    const [organization, setOrganization] = useState({
        Name: '',
        Email: '',
        FiscalNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        PhoneNumber: ''
    })

    const handleInputOrganization = (event) => {
        setOrganization({ ...organization, [event.target.name]: event.target.value })
    }

    function handleSubmitOrganization(event) {
        event.preventDefault()
        if (!organization.Name || !organization.Email || !organization.PhoneNumber || !organization.FiscalNumber || !organization.Address1 || 
            !organization.Country || !organization.District || !organization.ZipCode || !organization.Address2) {
            alert("Fill in the fields correctly");
            return;
        }
        axios.put('/api/hotel/organizations', {
            data: {
                name: organization.Name,
                email: organization.Email,
                fiscalNumber: organization.FiscalNumber,
                address1: organization.Address1,
                address2: organization.Address2,
                country: organization.Country,
                district: organization.District,
                zipCode: organization.ZipCode,
                phoneNumber: organization.PhoneNumber
            }
        })
            .then(response => {console.log(response); window.location.reload();})
            .catch(err => console.log(err))
    }
    return {
        handleInputOrganization, handleSubmitOrganization, setOrganization, organization
    };
}

export function organizationEdit(idOrganization) {

    const [valuesOrganization, setValuesOrganization] = useState({
        Name: '',
        Email: '',
        FiscalNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        PhoneNumber: '',
        active: 0
    })

    useEffect(() => {
        axios.get('/api/hotel/organizations/' + idOrganization)
            .then(res => {
                const organizationData = res.data.response[0];
                setValuesOrganization({ ...valuesOrganization,
                    idOrganization: valuesOrganization.organizationID,
                    Name: organizationData.name,
                    Email: organizationData.email,
                    FiscalNumber: organizationData.fiscalNumber,
                    PhoneNumber: organizationData.phoneNumber,
                    Address1: organizationData.address1,
                    Address2: organizationData.address2,
                    Country: organizationData.country,
                    District: organizationData.district,
                    ZipCode: organizationData.zipCode,
                    Password: organizationData.password,
                    RoleID: organizationData.roleID,
                    active: organizationData.del
                })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateOrganization(e) {
        e.preventDefault()
        axios.patch('/api/hotel/organizations/' + idOrganization, {
            data: {  
                Name: valuesOrganization.Name,
                Email: valuesOrganization.Email,
                FiscalNumber: valuesOrganization.FiscalNumber,
                Address1: valuesOrganization.Address1,
                Address2: valuesOrganization.Address2,
                Country: valuesOrganization.Country,
                District: valuesOrganization.District,
                ZipCode: valuesOrganization.ZipCode,
                PhoneNumber: valuesOrganization.PhoneNumber,
                active: valuesOrganization.active ? 1 : 0
            }
        })
            .then(response => {console.log(response); window.location.reload();})
            .catch(err => console.log(err))
    }

    return {
        handleUpdateOrganization, setValuesOrganization, valuesOrganization
    };
}
