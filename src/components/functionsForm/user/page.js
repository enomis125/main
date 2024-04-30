"use client"
import { useState, useEffect } from "react";
import axios from 'axios';

export default function userInsert(){

    //inserção na tabela user
    const [user, setUser] = useState({
        Name: '',
        LastName: '',
        Email: '',
        FiscalNumber: '',
        PhoneNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        Password: '',
    })

    const handleInputUser = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }
    function handleSubmitUser(event) {
        event.preventDefault()
        if (!user.Name || !user.LastName || !user.Email || !user.FiscalNumber || !user.PhoneNumber || !user.Address1 || !user.Address2 || !user.Country || !user.District || !user.ZipCode || !user.Password || !user.OrganizationID || !user.RoleID) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/hotel/users', {
            data: {
                Name: user.Name,
                LastName: user.LastName,
                Email: user.Email,
                FiscalNumber: user.FiscalNumber,
                PhoneNumber: user.PhoneNumber,
                Address1: user.Address1,
                Address2: user.Address2,
                Country: user.Country,
                District: user.Country,
                ZipCode: user.ZipCode,
                Password: user.Password,
                OrganizationID: user.OrganizationID,
                RoleID: user.RoleID
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputUser , handleSubmitUser
    };
}

export function userEdit(idUser){
    //edição na tabela USER
    const [valuesUser, setValuesUser] = useState({
        Name: '',
        LastName: '',
        Email: '',
        FiscalNumber: '',
        PhoneNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        Password: '',
        RoleID: ''
    })

    /*useEffect(() => {
        axios.get('/api/hotel/users/' + idUser)
            .then(res => {
                setValuesUser({ ...valuesUser, 
                    Name: res.data.response.name, 
                    LastName: res.data.response.lastName, 
                    Email: res.data.response.email, 
                    FiscalNumber: res.data.response.fiscalNumber, 
                    PhoneNumber: res.data.response.phoneNumber, 
                    Address1: res.data.response.address1, 
                    Address2: res.data.response.address2, 
                    Country: res.data.response.country,
                    District: res.data.response.district, 
                    ZipCode: res.data.response.zipCode, 
                    Password: res.data.response.password, 
                    RoleID: res.data.response.roleID, 
                    OrganizationID: res.data.response.organizationID})
            })
            .catch(err => console.log(err))
    }, [])*/

    useEffect(() => {
        axios.get('/api/hotel/users/' + idUser)
            .then(res => {
                const userData = res.data.response[0];
                setValuesUser({ ...valuesUser,
                    Name: userData.name,
                    LastName: userData.lastName,
                    Email: userData.email,
                    FiscalNumber: userData.fiscalNumber,
                    PhoneNumber: userData.phoneNumber,
                    Address1: userData.address1,
                    Address2: userData.address2,
                    Country: userData.country,
                    District: userData.district,
                    ZipCode: userData.zipCode,
                    Password: userData.password,
                    RoleID: userData.roleID
                })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateUser(e) {
        e.preventDefault()
        axios.patch('/api/hotel/users/' + idUser, {
            data: {
                name: valuesUser.Name,
                lastName: valuesUser.LastName,
                email: valuesUser.Email,
                fiscalNumber: valuesUser.FiscalNumber,
                phoneNumber: valuesUser.PhoneNumber,
                address1: valuesUser.Address1,
                address2: valuesUser.Address2,
                country: valuesUser.Country,
                district: valuesUser.District,
                zipCode: valuesUser.ZipCode,
                password: valuesUser.Password,
                roleID: valuesUser.RoleID
            }
        })
        .catch(err => console.log(err))
    }

    return { 
        handleUpdateUser, setValuesUser, valuesUser 
    };
}