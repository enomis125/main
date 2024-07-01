"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function PartnerInsert() {

    const [partner, setPartner] = useState({
        Name: '',
    });


    const handleInputPartner = (event) => {
        setPartner({ ...partner, [event.target.name]: event.target.value });
    };

    const handleSubmitPartner = (event) => {
        event.preventDefault();

        if (!partner.Name) {
            alert("Preencha os campos corretamente");
            return;
        }

        axios.put('/api/hotel/partners', {
            data: {
                ...partner,
            }
        })
            .then(response => {console.log(response); window.location.reload();})
            .catch(err => console.log(err));
    };

    return { 
        handleInputPartner, 
        handleSubmitPartner, 
    };
}

export function partnerEdit(partnerID) {

    const { data: session } = useSession();

    const [valuesPartner, setValuesPartner] = useState({
        Name: '',
    });

    useEffect(() => {
        if (partnerID) {
            axios.get('/api/hotel/partners/' + partnerID)
                .then(res => {
                    const partnerData = res.data.response[0];
                    setValuesPartner({
                        ...valuesPartner,
                        partnerID: partnerData.partnerID,
                        Name: partnerData.Name,
                    });
                })
                .catch(err => console.log(err));
        }
    }, [partnerID]);

    function handleUpdatePartner(e) {
        e.preventDefault();

        axios.patch('/api/hotel/partners/' + partnerID, {
            Name: valuesPartner.Name,
        })
            .then(response => {
                console.log(response);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return {
        handleUpdatePartner,
        setValuesPartner,
        valuesPartner
    };
}