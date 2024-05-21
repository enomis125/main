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


import Modaluser from "@/components/Modal/modalUser";


export default function users() {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [searchValue, setSearchValue] = React.useState("");
    const [user, setUser] = useState([]);
    const { data: session, status } = useSession()

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

        if (confirmDelete) {
            try {
                const response = await axios.delete(`/api/hotel/users/` + userID);
                alert("Utilizador removido com sucesso!");
            } catch (error) {
                console.error("Erro ao remover Utilizador:", error.message);
            }
        }
    };

    return (
        <>
            <main>
                <div className="flex flex-col mt-5 py-3">
                    <p className="text-xs px-6">Utilizador</p>
                    <div className="flex flex-row justify-between items-center mx-5">
                        <div className="flex flex-row">
                            <div className="flex flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    className="mt-4 w-80"
                                    placeholder="Procurar..."
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
                            buttonName={"Inserir Utilizador"}
                            buttonIcon={<FiPlus size={15} />}
                            buttonColor={"primary"}
                            modalHeader={"Inserir Utilizador"}
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
                                NAME
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                EMAIL
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                ROLE
                            </TableColumn>
                            <TableColumn className="bg-primary-600 text-white font-bold">
                                PROPERTY
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
                                                        buttonName={"Editar"}
                                                        editIcon={<FiEdit3 size={25} />}
                                                        buttonColor={"transparent"}
                                                        modalHeader={"Editar Utilizador"}
                                                        modalEditArrow={<BsArrowRight size={25} />}
                                                        modalEdit={`ID: ${user.id}`}
                                                        formTypeModal={11}
                                                        idUser={user.id}
                                                        PropertiesUserName={user.properties}
                                                        NameUser={user.name}
                                                    ></Modaluser>
                                                </DropdownItem>
                                                <DropdownItem><button onClick={() => handleDelete(user.id)}>Remover</button></DropdownItem>
                                                <DropdownItem>
                                                <Modaluser
                                                        buttonName={"Ver"}
                                                        buttonColor={"transparent"}
                                                        modalHeader={"Ver Utilizador"}
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
                    <div className="flex flex-row items-center">
                        <Pagination
                            isCompact
                            showControls
                            color="primary"
                            variant="flat"
                            page={page}
                            total={Math.ceil(filteredItems.length / rowsPerPage)}
                            onChange={handleChangePage} 
                            className="mx-5"
                        />
                        <div>
                            <span className="text-sm text-black">Items por página:</span>
                            <select
                                value={rowsPerPage}
                                onChange={handleChangeRowsPerPage} 
                                className="ml-2 py-1 px-2 border rounded bg-transparent text-sm text-default-600 mx-5"
                            >
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="ml-5 mr-10 text-black">
                            {items.length > 0
                                ? `${(page - 1) * rowsPerPage + 1}-${Math.min(
                                    page * rowsPerPage,
                                    filteredItems.length
                                )} de ${filteredItems.length}`
                                : "0 resultados"}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
