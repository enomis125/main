"use client";
import React from "react";

//import de axios para BD
import axios from "axios";
import { useSession } from "next-auth/react"

import { useState, useEffect } from "react";
import {
    Input,
    Button,

    //imports de tabelas
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination,

    //imports de dropdown menu
    DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
} from "@nextui-org/react"

//imports de icons
import { GoGear } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";

import FormModals from "@/components/Modal/modalProperty";
import LoadingBackdrop from "@/components/Loader/LoaderV2";
import PaginationComponent from "@/components/Pagination/Pagination";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

import {useTranslations} from 'next-intl';


export default function Contact() {

    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [searchValue, setSearchValue] = React.useState("");
    const [property, setProperty] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession()
    const t = useTranslations('Index');

    // const filteredItems = property.filter(
    //     (property) =>
    //         property.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    //         property.propertyID.toString().toLowerCase().includes(searchValue.toLowerCase())
    // );
    // const items = filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const filteredItems = React.useMemo(() => {
        return property.filter((property) =>
            property.name.toLowerCase().includes(
                searchValue.toLowerCase()
            ) ||
            property.propertyID.toString().toLowerCase().includes(
                searchValue.toLowerCase()
            )
        );
    }, [property, searchValue]);

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.autoTable({ html: "#TableToPDF" })
        pdf.save("Propriedades.pdf")
    }
    /*---------------------------------------------------------------------------------------- */
    useEffect(() => {
        const getData = async () => {
            if (status !== "loading") {
                try {
                    const res = await axios.get(`/api/hotel/organizations/` + session.user.organization + `/properties`);
                    setProperty(res.data.response);
                } catch (error) {
                    console.error("Erro ao obter as propriedades:", error.message);
                }finally{
                    setIsLoading(false);
                }
            };
        }
        getData();
    }, []);

    const handleSearchChange = (value) => {
        setSearchValue(value);
        setPage(1);
    };

    const handleDelete = async (propertyID) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta propriedade?");
        if (confirmDelete) {
            try {
                const res = await axios.delete(`/api/hotel/properties/` + propertyID);
                console.log(res.data);
                alert("Propriedade removida com sucesso!");
            } catch (error) {
                console.error("Erro ao remover Propriedade:", error.message);
            }
        }
    };
    /*---------------------------------------------------------------------------------------- */
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const handleChangePage = (page) => {
        setPage(page);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1); // Reset page to 1 when changing rows per page
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">{t("organization.properties.label")}</p>
                    <div className="flex flex-row justify-between items-center mx-5">
                        <div className="flex flex-row">
                            <div className="flex flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    className="mt-4 w-80"
                                    placeholder={t('general.search')}
                                    labelPlacement="outside"
                                    startContent={
                                        <FiSearch color={"black"} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    value={searchValue}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                        <FormModals
                            buttonName={t("general.newRecord")}
                            buttonIcon={<FiPlus size={15} />}
                            buttonColor={"primary"}
                            modalHeader={t("organization.properties.new.modalHeader")}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                        ></FormModals>
                    </div>
                </div>
                <div className="mx-5 h-[65vh] min-h-full">
                <LoadingBackdrop open={isLoading} />
                        {!isLoading && (
                    <Table
                        id="TableToPDF"
                        isHeaderSticky={"true"}
                        layout={"fixed"}
                        removeWrapper
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                        className="h-full overflow-auto"
                    >
                        <TableHeader>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.id")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.name")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.address")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.description")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.shortname")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("organization.properties.datatable.designation")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                <GoGear size={20} />
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {items.map((property, index) => (
                                <TableRow key={index}>
                                    <TableCell>{property.propertyID}</TableCell>
                                    <TableCell>{property.name}</TableCell>
                                    <TableCell>{property.address1}</TableCell>
                                    <TableCell>{property.description}</TableCell>
                                    <TableCell>{property.abbreviation}</TableCell>
                                    <TableCell>{property.designation}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    variant="light"
                                                    className="flex flex-row justify-center"

                                                >
                                                    <BsThreeDotsVertical size={20} className="text-gray-400" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Static Actions" isOpen={true} closeOnSelect={false}>
                                                <DropdownItem key="edit">
                                                    <FormModals
                                                        buttonName={t("general.editRecord")}
                                                        editIcon={<FiEdit3 size={25} />}
                                                        buttonColor={"transparent"}
                                                        modalHeader={t("organization.properties.edit.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${property.propertyID}`}
                                                        formTypeModal={12}
                                                        idProperty={property.propertyID}
                                                    ></FormModals>
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleDelete(property.propertyID)}>{t("general.removeRecord")}</DropdownItem>
                                                <DropdownItem >
                                                    <FormModals
                                                        buttonName={t("general.viewRecord")}
                                                        buttonColor={"transparent"}
                                                        modalHeader={t("organization.properties.view.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${property.propertyID}`}
                                                        formTypeModal={11}
                                                        idProperty={property.propertyID}
                                                    ></FormModals>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        {/* <FormModals
                                                        buttonName={<BiSpreadsheet  size={20} className="text-gray-400"/>}
                                                        buttonColor={"transparent"}
                                                        modalHeader={"Licença"}
                                                        variant="light"
                                                        className="flex flex-row justify-center"
                                                        formTypeModal={13}
                                                        idProperty={property.propertyID}
                                                    ></FormModals> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                        )}
                </div>
                <div className="bg-tableFooter border border-tableFooterBorder flex justify-end items-center lg:pl-72 w-full min-h-10vh fixed bottom-0 right-0 z-20 text-sm text-default-400 py-3">
                    <div className="space-x-4">
                    <Button onClick={exportToPDF}>PDF <IoMdDownload /></Button>
                    <Button>                    <CSVLink
                        data={items.map((item) => ({
                            propertyID: item.propertyID,
                            Name: item.name,
                            Address1: item.address1,
                            Description: item.description ,
                            Abbreviation: item.abbreviation ,
                            Designation: item.designation
                        }))}
                        filename={"Propriedades"}
                        separator=";"
                        enclosingCharacter=""
                    >
                        CSV
                    </CSVLink><IoMdDownload />
                    </Button>
                    </div>
                    <PaginationComponent
                        page={page}
                        totalItems={filteredItems.length}
                        rowsPerPage={rowsPerPage}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    
                </div>
            </main >
        </>
    );
};
