// pages/allproperties.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
    Input,
    Button,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@nextui-org/react";

//imports de icons
import { GoGear } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import { BiSpreadsheet } from "react-icons/bi";

import FormModals from "@/components/Modal/modalProperty";
import PaginationComponent from "@/components/Pagination/Pagination";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { useTranslations } from 'next-intl';


export default function AllProperties() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchValue, setSearchValue] = useState("");
    const [property, setProperty] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession()
    const t = useTranslations('Index');

    const [selectedAllProperty, setSelectedAllProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (property) => {
        setSelectedAllProperty(property);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAllProperty(null);
        setIsModalOpen(false);
    };


    const filteredItems = React.useMemo(() => {
        return property.filter((property) =>
            property.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            property.propertyID.toString().toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [property, searchValue]);

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.autoTable({ html: "#TableToPDF" });
        pdf.save("Propriedades.pdf");
    };

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "loading") {
                try {
                    const res = await axios.get("/api/hotel/properties");
                    setProperty(res.data.response);
                    console.log(res);
                } catch (error) {
                    console.error("Erro ao obter as propriedades:", error.message);
                }
            }
        };
        fetchData();
    }, [status]);

    const handleSearchChange = (value) => {
        setSearchValue(value);
        setPage(1);
    };

    const handleDelete = async (propertyID) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta propriedade?");
        if (confirmDelete) {
            try {
                const res = await axios.delete(`/api/hotel/properties/${propertyID}`);

                alert("Propriedade removida com sucesso!");
                window.location.reload();
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        alert('Cannot delete property. It is associated with other records.');
                    } else {
                        alert(`Erro: ${error.response.data.error}`);
                    }
                } else if (error.request) {
                    alert('Erro: Sem resposta do servidor.');
                } else {
                    alert(`Erro: ${error.message}`);
                }
                console.error("Erro ao remover Propriedade:", error);
            }
        }
    };

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
        setPage(1);
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">{t("allProperties.label")}</p>
                    <div className="flex flex-row justify-between items-center mx-5">
                        <div className="flex flex-row">
                            <div className="flex flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    className="mt-4 w-80"
                                    placeholder={t('general.search')}
                                    labelPlacement="outside"
                                    startContent={<FiSearch color={"black"} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    value={searchValue}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            </div>
                            <Button onClick={() => handleOpenModal()} color={"primary"} className="w-fit">
                                {t("general.newRecord")} <FiPlus size={15} />
                            </Button>
                        </div>
                        <FormModals
                            modalHeader={t("organization.properties.new.modalHeader")}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                            isOpen={!selectedAllProperty && isModalOpen}
                            onClose={handleCloseModal}
                            property={selectedAllProperty}
                        ></FormModals>
                    
                </div>
                <div className="mx-5 h-[65vh] min-h-full">
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
                                {t("allProperties.datatable.id")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.name")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.address")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.description")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.shortname")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.designation")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("allProperties.datatable.organization")}
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
                                    <TableCell>{property.organization}</TableCell>
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
                                            <DropdownMenu aria-label="Static Actions" isOpen={true}>
                                                <DropdownItem key="edit" onClick={() => handleOpenModal(property)}>
                                                    {t("general.editRecord")}
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleDelete(property.propertyID)}>{t("general.removeRecord")}</DropdownItem>
                                                <DropdownItem key="view" onClick={() => handleOpenModal(property)} >{t("general.viewRecord")}
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <FormModals
                                            buttonName={<BiSpreadsheet size={20} className="text-gray-400"
                                            />}
                                            buttonColor={"transparent"}
                                            modalHeader={"Licença"}
                                            variant="light"
                                            className="flex flex-row justify-center"
                                            formTypeModal={13}
                                            idProperty={property.propertyID}
                                        />
                                        <FormModals
                                            modalHeader={t("allProperties.edit.modalHeader")}
                                            modalEditArrow={<BsArrowRight size={25} />}
                                            modalEdit={`ID: ${property.propertyID}`}
                                            formTypeModal={12}
                                            idProperty={property.propertyID}
                                            OrganizationName={property.organization}
                                            isOpen={selectedAllProperty?.propertyID === property.propertyID && isModalOpen}
                                            onClose={handleCloseModal}
                                            property={selectedAllProperty}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="bg-tableFooter border border-tableFooterBorder flex justify-end items-center lg:pl-72 w-full min-h-10vh fixed bottom-0 right-0 z-20 text-sm text-default-400 py-3">
                    <div className="space-x-4">
                        <Button onClick={exportToPDF}>PDF <IoMdDownload /></Button>
                        <Button>
                            <CSVLink
                                data={items.map((item) => ({
                                    propertyID: item.propertyID,
                                    Name: item.name,
                                    Address1: item.address1,
                                    Description: item.description,
                                    Abbreviation: item.abbreviation,
                                    Designation: item.designation
                                }))}
                                filename={"Propriedades.csv"}
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
            </main>
        </>
    );
}
