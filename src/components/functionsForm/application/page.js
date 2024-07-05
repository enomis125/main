"use client"
import { useState, useEffect } from "react";
import axios from 'axios';

export default function ApplicationInsert() {
    const [application, setApplication] = useState({
        Description: '',
        Abbreviation: '',
        CategoryID: '',
        PartnerID: ''
    });

    const handleInputApplication = (event) => {
        setApplication({ ...application, [event.target.name]: event.target.value });
    };

    const handleCategorySelect = (selectedCategory) => {
        setApplication({ ...application, CategoryID: selectedCategory });
    };

    const handlePartnerSelect = (selectedPartner) => {
        setApplication({ ...application, PartnerID: selectedPartner });
    };

    const handleSubmitApplication = async (event) => {
        event.preventDefault();

        if (!application.Description || !application.Abbreviation) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {
            const response = await axios.put('/api/hotel/applications', {
                data: {
                    ...application
                }
            });
            console.log(response);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return {
        handleInputApplication,
        handleSubmitApplication,
        handleCategorySelect,
        handlePartnerSelect
    };
}


export function ApplicationEdit(applicationID) {

    const [valuesApplication, setValuesApplication] = useState({
        Description: '',
        Abbreviation: '',
        CategoryID: '',
        PartnerID: ''
    });

    useEffect(() => {
        axios.get('/api/hotel/applications/' + applicationID)
            .then(res => {
                const applicationData = res.data.response;
                setValuesApplication({
                    ...valuesApplication,
                    Description: applicationData.description,
                    Abbreviation: applicationData.abbreviation,
                    CategoryID: applicationData.categoryID,
                    PartnerID: applicationData.partnerID
                });
            })
            .catch(err => console.log(err));
    }, [applicationID]);

    // const handleCategorySelectEdit = (selectedCategory) =>{
    //     setValuesApplication(prevValues =>({ ...prevValues, CategoryID: selectedCategory }));
    // }

    // const handlePartnerSelectEdit = (selectedPartner) =>{
    //     setValuesApplication(prevValues =>({ ...prevValues, PartnerID: selectedPartner}));
    // }

    const handleCategorySelectEdit = (selectedCategory) => {
        setValuesApplication({ ...valuesApplication, CategoryID: selectedCategory });
    };

    const handlePartnerSelectEdit = (selectedPartner) => {
        setValuesApplication({ ...valuesApplication, PartnerID: selectedPartner });
    };

    function handleUpdateApplication(e) {
        e.preventDefault();

        axios.patch('/api/hotel/applications/' + applicationID, {
            data: {
                Description: valuesApplication.Description,
                Abbreviation: valuesApplication.Abbreviation,
                CategoryID: valuesApplication.CategoryID,
                PartnerID: valuesApplication.PartnerID
            }
        })
            .then(response => {
                console.log(response);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return {
        handleUpdateApplication,
        setValuesApplication,
        handleCategorySelectEdit,
        handlePartnerSelectEdit,
        valuesApplication
    };
}
