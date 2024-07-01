"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function AppCategoriesInsert() {

    const [appCategories, setAppCategories] = useState({
        Name: '',
    });


    const handleInputAppCategory = (event) => {
        setAppCategories({ ...appCategories, [event.target.name]: event.target.value });
    };

    const handleSubmitAppCategory = (event) => {
        event.preventDefault();

        if (!appCategories.Name) {
            alert("Preencha os campos corretamente");
            return;
        }

        axios.put('/api/hotel/applications-categories', {
            data: {
                ...appCategories,
            }
        })
            .then(response => {console.log(response); window.location.reload();})
            .catch(err => console.log(err));
    };

    return { 
        handleInputAppCategory, 
        handleSubmitAppCategory, 
    };
}

export function AppCategoriesEdit(AppCategoryID) {


    const [valuesAppCategory, setValuesAppCategory] = useState({
        Name: '',
    });

    useEffect(() => {
        axios.get('/api/hotel/applications-categories/' + AppCategoryID)
            .then(res => {
                const appCategoriesData = res.data.response;
                setValuesAppCategory({
                    ...valuesAppCategory,
                    AppCategoryID: appCategoriesData.AppCategoryID,
                    Name: appCategoriesData.Name,
                });
            })
            .catch(err => console.log(err));
    }, [AppCategoryID]);


    function handleUpdateAppCategory(e) {
        e.preventDefault();

        axios.patch('/api/hotel/applications-categories/' + AppCategoryID, {
            data: {
                Name: valuesAppCategory.Name,
            }
        })
            .then(response => {
                console.log(response);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return {
        handleUpdateAppCategory,
        setValuesAppCategory,
        valuesAppCategory
    };
}