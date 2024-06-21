"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function roleEdit(id){
    //edição na tabela role
    const [valuesRole, setValuesRole] = useState({
        name: '',
        description: ''
    })


    useEffect(() => {
        axios.get('/api/hotel/roles/' + id)
            .then(res => {
                setValuesRole({ ...valuesRole,
                    name: res.data.response.name,
                    description: res.data.response.description
                })
            })
            .catch(err => console.log(err))
    }, [])


    function handleUpdateRole(e) {
        e.preventDefault()
        axios.patch('/api/hotel/roles/' + id, {
            data: {
                name: valuesRole.name,
                description: valuesRole.description
            }
        })
        .then(response => {console.log(response); window.location.reload();})
        .catch(err => console.log(err))
    }

    return { 
        handleUpdateRole, setValuesRole, valuesRole 
    };
}