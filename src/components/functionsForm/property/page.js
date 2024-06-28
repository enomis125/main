"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from 'axios';

export default function PropertyInsert() {
    const [property, setProperty] = useState({
        Name: '',
        Email: '',
        FiscalNumber: '',
        Address1: '',
        Country: '',
        District: '',
        ZipCode: '',
        PhoneNumber: '',
        Description: '',
        Abbreviation: '',
        Designation: '',
        OrganizationID: ''
    });

    const { data: session } = useSession();

    const handleInputProperty = (event) => {
        setProperty({ ...property, [event.target.name]: event.target.value });
    };

    const handleOrganizationSelect = (selectedOrganization) => {
        setProperty({ ...property, OrganizationID: selectedOrganization });
    };

    const handleSubmitProperty = (event) => {
        event.preventDefault();

        if (!property.Name || !property.Email || !property.PhoneNumber || !property.FiscalNumber || !property.Address1 || !property.Country || !property.District || !property.ZipCode || !property.Abbreviation || !property.Description || !property.Designation) {
            alert("Preencha os campos corretamente");
            return;
        }

        const organizationID = property.OrganizationID || session.user.organization;

        axios.put('/api/hotel/properties', {
            data: {
                ...property,
                OrganizationID: organizationID
            }
        })
            .then(response => {console.log(response); window.location.reload();})
            .catch(err => console.log(err));
    };

    return {
        handleInputProperty,
        handleSubmitProperty,
        handleOrganizationSelect
    };
}


export function propertyEdit(idProperty) {

    const { data: session } = useSession();
    
    const [valuesProperty, setValuesProperty] = useState({

        Name: '',
        Email: '',
        FiscalNumber: '',
        Address1: '',
        Country: '',
        District: '',
        ZipCode: '',
        PhoneNumber: '',
        Description: '',
        Abbreviation: '',
        Designation: '',
        active: 0,
        OrganizationID: ''
    });

    useEffect(() => {
        axios.get('/api/hotel/properties/' + idProperty)
            .then(res => {
                const property = res.data.response;
                setValuesProperty({
                    ...valuesProperty,
                    idProperty: property.propertyID,
                    Name: property.name,
                    Email: property.email,
                    FiscalNumber: property.fiscalNumber,
                    Address1: property.address1,
                    Country: property.country,
                    District: property.district,
                    ZipCode: property.zipCode,
                    PhoneNumber: property.phoneNumber,
                    Description: property.description,
                    Abbreviation: property.abbreviation,
                    Designation: property.designation,
                    active: property.del,
                    OrganizationID: property.organizationID || session.user.organization 
                });
            })
            .catch(err => console.log(err));
    }, [idProperty]);

    const handleOrganizationEdit = (selectedOrganization) => {
        setValuesProperty(prevValues => ({
            ...prevValues,
            OrganizationID: selectedOrganization 
        }));
    };

    function handleUpdateProperty(e) {
        e.preventDefault();

        const organizationID = valuesProperty.OrganizationID || session.user.organization;

        axios.patch('/api/hotel/properties/' + idProperty, {
            data: {
                Name: valuesProperty.Name,
                Email: valuesProperty.Email,
                FiscalNumber: valuesProperty.FiscalNumber,
                Address1: valuesProperty.Address1,
                Country: valuesProperty.Country,
                District: valuesProperty.District,
                ZipCode: valuesProperty.ZipCode,
                PhoneNumber: valuesProperty.PhoneNumber,
                Description: valuesProperty.Description,
                Abbreviation: valuesProperty.Abbreviation,
                Designation: valuesProperty.Designation,
                OrganizationID: organizationID,
                active: valuesProperty.active ? 1 : 0
            }
        })
        .then(response => {
            console.log(response);
            window.location.reload();
        })
        .catch(err => console.log(err));
    }

    return {
        handleUpdateProperty,
        setValuesProperty,
        handleOrganizationEdit,
        valuesProperty
    };
}