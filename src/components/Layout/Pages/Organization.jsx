"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
    Input,
    Checkbox,
    Divider,
    Autocomplete, AutocompleteItem, Avatar, Button, Switch
} from "@nextui-org/react"
import axios from "axios";
import { useSession } from "next-auth/react"

//icons
import { TfiSave } from "react-icons/tfi";
import { BsPencil } from 'react-icons/bs'
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import { IoApps } from "react-icons/io5";
import { FaPlug } from "react-icons/fa";



import Modalorg from "@/components/Modal/modalOrganization"
import FormModals from "@/components/Modal/modalOrganization"
import FormOrganizationApplication from "@/components/Modal/modals/modalOrganizationApplication";


const Contact = () => {

    const variants = ["underlined"];
    const [isExpanded, setIsExpanded] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [page, setPage] = React.useState(1);
    const [searchValue, setSearchValue] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const { data: session, status } = useSession()
    const [isSelected, setIsSelected] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const handleInput = (event) => {
        setUser({ ...organizations, [event.target.name]: event.target.value })
    }

    const filteredItems = React.useMemo(() => {
        return organizations.filter((organizations) =>
            organizations.name.toLowerCase().includes(
                searchValue.toLowerCase()
            ) ||
            organizations.organizationID.toString().toLowerCase().includes(
                searchValue.toLowerCase()
            )
        );
    }, [organizations, searchValue]);


    useEffect(() => {
        const getData = async () => {
            if (status !== "loading") {
                try {
                    const res = await axios.get(`/api/hotel/organizations/` + session.user.organization);
                    setOrganizations(res.data.response);
                } catch (error) {
                    console.error("Erro ao obter as propriedades:", error.message);
                }
            }
        }; getData();
    }, []);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    return (
        <>
            {items.map((organizations, index) => (
                <div key={index} className="flex flex-col mx-16 my-8">
                    <div className='flex flex-row justify-end items-center mr-5 bg-primary-600 py-2 w-full rounded-2xl'>
                        <Modalorg
                            buttonIcon={<BsPencil size={20} color={"white"} />}
                            buttonColor={""}
                            modalHeader={"Editar Organização"}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                            idOrg={organizations.organizationID}
                            editIcon={<FiEdit3 size={25} />}
                            modalEditArrow={<BsArrowRight size={25} />}
                            modalEdit={`ID: ${organizations.organizationID}`}
                        ></Modalorg>

<FormModals
                            buttonName={<BiSpreadsheet size={20} color={"white"}/>}
                            buttonColor={""}
                            modalHeader={"Todas as Licenças das Propriedades"}
                            variant="light"
                            className="flex flex-row justify-center"
                            formTypeModal={13}
                            idOrg={organizations.organizationID}
                        ></FormModals>

                        <FormOrganizationApplication
                            buttonIcon={<FaPlug size={20} className="text-white" />}
                            buttonColor={"gray-500"}
                            modalHeader={"Aplicações da Organização"}
                            modalIcons={"bg-red"}
                            formTypeModal={1}
                            idOrganization={organizations.organizationID} // Make sure this is the correct ID
                        />
                    </div>
                    <div className="w-full flex flex-col gap-4 my-4">
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-1/2 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input type="text" variant={variant} label="Name" value={organizations.name} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col gap-4 my-4">
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input type="text" variant={variant} label="Company Name" value={organizations.name} />
                                <Input type="text" variant={variant} label="Fiscal Number" value={organizations.fiscalNumber} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col gap-4 my-4">
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input type="text" variant={variant} label="Email" value={organizations.email} />
                                <Input type="text" variant={variant} label="Phone Number" value={organizations.phoneNumber} />
                            </div>
                        ))}
                    </div>

                    <Divider className="my-8 horizontal" />

                    <div className="w-full flex flex-col gap-4">
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input variant={variant} label="Address 1" value={organizations.address1} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col gap-4 my-4">
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input variant={variant} label="Address 2" value={organizations.address2} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        {variants.map((variant) => (
                            <div
                                key={variant}
                                className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                            >
                                <Input type="text" name="Country" onChange={handleInput} variant={variant} label="Country" value={organizations.country} />
                                <Input type="text" name="District" onChange={handleInput} variant={variant} label="District" value={organizations.district} />
                                <Input type="number" name="ZipCode" onChange={handleInput} variant={variant} label="zipCode" value={organizations.zipCode} />
                            </div>
                        ))}
                    </div>
                    <Divider className="my-8 horizontal" />
                </div>
            ))}
        </>
    );
};

export default Contact;