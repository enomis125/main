"use client";
import React from "react";

//import de axios para BD
import axios from "axios";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"

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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

import {useTranslations} from 'next-intl';

import FormModals from "@/components/Modal/modalPartners"
import PaginationComponent from "@/components/Pagination/Pagination";


export default function partner() {

    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [searchValue, setSearchValue] = React.useState("");
    const { data: session, status } = useSession()
    const t = useTranslations('Index');


    const [partners, setPartners] = useState([]);


    const filteredItems = React.useMemo(() => {
        return partners.filter((partner) =>
            partner.name.toLowerCase().includes(
                searchValue.toLowerCase()
            ) ||
            partner.partnerID.toString().toLowerCase().includes(
                searchValue.toLowerCase()
            )
        );
    }, [partners, searchValue]);

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

    const handleSearchChange = (value) => {
        setSearchValue(value);
        setPage(1);
    };

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.autoTable({ html: "#TableToPDF" })
        pdf.save("Parceiros.pdf")
    }

    useEffect(() => {
        const getDataPartners = async () => {
            const response = await axios.get("/api/hotel/partners");
            console.log("aaa" + response)
            setPartners(response.data.response);
        };
        getDataPartners();
    }, []);


    const handleDelete = async (partnerID) => {

        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este parceiro?");
        console.log()
        if (confirmDelete) {
            try {
                const response = await axios.delete(`/api/hotel/partners/` + partnerID);
                console.log(response.data);
                alert("Parceiro removido com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao remover Parceiro:", error.message);
            }
        }
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">{t("partners.label")}</p>
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
                            modalHeader={t("partners.new.modalHeader")}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                        ></FormModals>
                    </div>
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
                                {t("partners.datatable.id")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("partners.datatable.name")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                <GoGear size={20} />
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {items.map((partners) => (
                                <TableRow>
                                    <TableCell>{partners.partnerID}</TableCell>
                                    <TableCell>{partners.name}</TableCell>
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
                                            <DropdownMenu aria-label="Static Actions" closeOnSelect={false} isOpen={true}>
                                                <DropdownItem key="edit">
                                                    <FormModals
                                                        buttonName={t("general.editRecord")}
                                                        editIcon={<FiEdit3 size={25} />}
                                                        buttonColor={"transparent"}
                                                        modalHeader={t("partners.edit.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${partners.partnerID}`}
                                                        formTypeModal={11}
                                                        partnerID={partners.partnerID}
                                                        NamePartner={partners.name}
                                                    ></FormModals>
                                                </DropdownItem>
                                                <DropdownItem><button onClick={() => handleDelete(partners.partnerID)}>{t("general.removeRecord")}</button></DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="bg-tableFooter border border-tableFooterBorder flex justify-end items-center lg:pl-72 w-full min-h-10vh fixed bottom-0 right-0 z-20 text-sm text-default-400 py-3">
                <div className="space-x-4">
                    <Button onClick={exportToPDF}>PDF <IoMdDownload /></Button>
                    <Button>                    <CSVLink
                        data={items.map((item) => ({
                            Name: item.name,
                        }))}
                        filename={"Parceiros"}
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
};
