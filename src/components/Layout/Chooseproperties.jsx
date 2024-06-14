import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Image, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react"
import axios from 'axios';
import { useRouter } from "next/navigation";
import FormModals from "@/components/Modal/modalChooseProperty";
import {useTranslations} from 'next-intl';

const ChooseOrganization = () => {
    const [isHovered1, setIsHovered1] = useState(false)
    const [properties, setProperties] = useState([])
    const [apps, setApps] = useState([])
    const t = useTranslations('Index');

    const { data: session, status } = useSession()
    const router = useRouter();

    const isAdmin = () => {
        return session?.user?.admin;
    };

    useEffect(() => {
        const getData = async () => {
            if (status !== "loading") {
                try {
                    const userID = session.user.id;
                    const res = await axios.get('/api/hotel/users/' + userID + '/properties')
                    setProperties(res.data.response)
                } catch (error) {
                    console.error("Error fetching data:", error)
                }
            }
        };
        getData()
    }, [session])

    useEffect(() => {
        if (isAdmin()) {
            router.push('/homepage');
        }
    }, [session]);

    return (
        <>
            {!isAdmin() && (
                <>
                    <p className="text-center text-3xl mt-60 antialiased">{t('propertySelect.label')}</p>
                    <div className="flex justify-center items-center mt-16">
                        <div className="grid grid-cols-2 gap-6">
                            {properties.map((property, index) => (
                                <div
                                    className={`card mx-auto ${isHovered1 ? 'hover:scale-105 shadow-lg rounded-lg shadow-slate-300' : ''}`}
                                    onMouseEnter={() => setIsHovered1(true)}
                                    onMouseLeave={() => setIsHovered1(false)}
                                >

                                    <FormModals
                                        buttonName={property.name}
                                        modalHeader={t('applicationSelect.label')}
                                        formTypeModal={10}
                                        idProperty={property.id}
                                    ></FormModals>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ChooseOrganization;