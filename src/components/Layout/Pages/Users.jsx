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


import Modaluser from "@/components/Modal/modalUser";
import PaginationComponent from "@/components/Pagination/Pagination";


export default function users() {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [searchValue, setSearchValue] = React.useState("");
    const [user, setUser] = useState([]);
    const { data: session, status } = useSession()
    const t = useTranslations('Index');

    const filteredItems = React.useMemo(() => {
        return user.filter((user) =>
            user.name.toLowerCase().includes(
                searchValue.toLowerCase()
            ) ||
            user.userID.toString().toLowerCase().includes(
                searchValue.toLowerCase()
            )
        );
    }, [user, searchValue]);

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.autoTable({ html: "#TableToPDF" })
        pdf.save("Utilizadores.pdf")
    }

    useEffect(() => {
        const getData = async () => {

            if (status !== "loading"){
                const res = await axios.get(`/api/hotel/organizations/`+ session.user.organization + `/users`);
                setUser(res.data.response);
            }
        };
        getData();
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
        setPage(1); // Reset page to 1 when changing rows per page
    };

    const handleSearchChange = (value) => {
        setSearchValue(value);
        setPage(1);
    };
    const handleDelete = async (userID) => {

        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este utilizador?");
        console.log()
        if (confirmDelete) {
            try {
                const response = await axios.delete(`/api/hotel/users/` + userID);
                console.log(response.data);
                alert("Utilizador removido com sucesso!");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao remover Utilizador:", error.message);
            }
        }
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">{t("profiles.users.label")}</p>
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
                        <Modaluser
                            buttonName={t("general.newRecord")}
                            buttonIcon={<FiPlus size={15} />}
                            buttonColor={"primary"}
                            modalHeader={t("profiles.users.new.modalHeader")}
                            modalIcons={"bg-red"}
                            formTypeModal={10}
                        ></Modaluser>
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
                        {/*<TableColumn className="bg-primary-600 text-white font-bold">
                                ID
                    </TableColumn>`*/}
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("profiles.users.datatable.name")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("profiles.users.datatable.email")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("profiles.users.datatable.role")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                {t("profiles.users.datatable.properties")}
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                <GoGear size={20} />
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {items.map((user, index) => (
                                <TableRow key={index}>
                                    {/*<TableCell>{user.id}</TableCell>*/}
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.properties}</TableCell>
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
                                                    <Modaluser
                                                        buttonName={t("general.editRecord")}
                                                        editIcon={<FiEdit3 size={25} />}
                                                        buttonColor={"transparent"}
                                                        modalHeader={t("profiles.users.edit.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${user.id}`}
                                                        formTypeModal={11}
                                                        idUser={user.id}
                                                        PropertiesUserName={user.properties}
                                                        NameUser={user.name}
                                                    ></Modaluser>
                                                </DropdownItem>
                                                <DropdownItem><button onClick={() => handleDelete(user.id)}>{t("general.removeRecord")}</button></DropdownItem>
                                                <DropdownItem>
                                                <Modaluser
                                                        buttonName={t("general.viewRecord")}
                                                        buttonColor={"transparent"}
                                                        modalHeader={t("profiles.users.view.modalHeader")}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${user.id}`}
                                                        formTypeModal={11}
                                                        idUser={user.id}
                                                        PropertiesUserName={user.properties}
                                                        NameUser={user.name}
                                                    ></Modaluser>
                                                </DropdownItem>
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
