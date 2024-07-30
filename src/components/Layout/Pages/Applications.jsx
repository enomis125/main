"use client";
import React from "react";

//import de axios para BD
import axios from "axios";
import { useSession } from "next-auth/react"

import { useState, useEffect } from "react";
import {
    Input,
    Button,
    useDisclosure,

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


import FormModal from "@/components/Modal/modalApplications";
import PaginationComponent from "@/components/Pagination/Pagination";


export default function users() {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [searchValue, setSearchValue] = React.useState("");

    const { data: session, status } = useSession()

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [Applications, setApplications] = useState([]);

    const t = useTranslations('Index');

    const handleOpenModal = (Applications) => {
        setSelectedRoom(Applications);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setSelectedRoom(null);
        setIsModalOpen(false);
      };

    const filteredItems = React.useMemo(() => {
        return Applications.filter((application) =>
            application.description.toLowerCase().includes(
                searchValue.toLowerCase()
            ) ||
            application.id.toString().toLowerCase().includes(
                searchValue.toLowerCase()
            )
        );
    }, [Applications, searchValue]);

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.autoTable({ html: "#TableToPDF" })
        pdf.save("Utilizadores.pdf")
    }

    useEffect(() => {
        const getDataApplications = async () => {
            const response = await axios.get("/api/hotel/applications");
            console.log(response)
            setApplications(response.data.response);
        };
        getDataApplications();
    }, []);


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
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta aplicação?");
        console.log()
        if (confirmDelete) {
            try {
                const response = await axios.delete(`/api/hotel/applications/` + id);
                console.log(response.data);
                alert("Aplicação removida com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao remover Aplicação:", error.message);
            }
        }
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">{t("applications.label")}</p>
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
                        <Button onClick={() => handleOpenModal()} color={"primary"} className="w-fit">
                            {t("general.newRecord")} <FiPlus size={15} />
                        </Button>
                        </div>
                        <FormModal
                            modalHeader={t("applications.new.modalHeader")}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                            isOpen={!selectedRoom && isModalOpen}
                            onClose={handleCloseModal}
                            Applications={selectedRoom}
                        ></FormModal>
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
                            <TableColumn className="bg-primary-600 text-white font-bold uppercase">
                                {t("applications.datatable.description")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold uppercase">
                                {t("applications.datatable.abbreviation")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold uppercase">
                                {t("applications.datatable.category")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold uppercase">
                                {t("applications.datatable.partner")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                <GoGear size={20} />
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {items.map((Applications, index) => (
                                <TableRow key={index}>
                                    <TableCell>{Applications.description}</TableCell>
                                    <TableCell>{Applications.abbreviation}</TableCell>
                                    <TableCell>{Applications.application_categories.name}</TableCell>
                                    <TableCell>{Applications.partners.name}</TableCell>
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
                                            <DropdownItem key="edit" onClick={() => handleOpenModal(Applications)}>
                                                    {t("general.editRecord")}
                                                </DropdownItem>
                                                <DropdownItem><button onClick={() => handleDelete(Applications.id)}>{t("general.removeRecord")}</button></DropdownItem>
                                                
                                            </DropdownMenu>
                                        </Dropdown>
                                                    <FormModal
                                                        modalHeader={t("applications.edit.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${Applications.id}`}
                                                        formTypeModal={11}
                                                        ApplicationID={Applications.id}
                                                        isOpen={selectedRoom?.id === Applications.id && isModalOpen}
                                                        onClose={handleCloseModal}
                                                        Applications={selectedRoom}
                                                    ></FormModal>
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
                            Email: item.email,
                            Role: item.role,
                            Properties: item.properties,
                        }))}
                        filename={"Utilizadores"}
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
