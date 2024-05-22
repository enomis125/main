"use client";
import React from "react";

//import de axios para BD
import axios from "axios";
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";


import { Modal, ModalContent, ModalHeader, ModalBody, Avatar, ModalFooter, Checkbox } from "@nextui-org/react";

import {
    Input,
    Button,
    useDisclosure,

    //imports de tabelas
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination,

} from "@nextui-org/react"

//imports de icons

import { MdClose } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";

import FormUsersApplications from "@/components/Modal/modals/modalUsersApplications"


const users_applications = ({ idProperty, idApplication, formTypeModal, buttonName,
    buttonIcon,
    modalHeader,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [usersApplicationsFetched, setUsersApplicationFetched] = useState(false);
    const [usersInApplication, setUsersInApplications] = useState([])

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const getuserApplications = async () => {
            if (!usersApplicationsFetched) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`/api/hotel/properties/` + idProperty + `/applications/`+ idApplication + `/users`);
                    setUsersInApplications(response.data.response);
                    setUsersApplicationFetched(true);
                } catch (error) {
                    console.error("Erro ao encontrar os utilizadores associadas à aplicação:", error.message);
                } finally {
                    setIsLoading(false);
                }
            };
        }
        getuserApplications();
    }, []);

    return (
        <>
            {formTypeModal === 10 && (
                <>
                    <Button onPress={onOpen} color={buttonColor} className="w-fit">
                        {buttonName} {buttonIcon}
                    </Button>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                            body: "h-full ",

                        }}
                        size="full"
                        hideCloseButton="true"
                        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        <div className="flex flex-row justify-start gap-4">
                                            {modalHeader}{modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
                                        <Button>
                                            <FormUsersApplications
                                                buttonName={"Novo"}
                                                buttonColor={"transparent"}
                                                modalHeader={"Associar Utilizador à Aplicação -"}
                                                formTypeModal={11}
                                                modalEdit={` ID: ${idProperty}`}
                                                idApplication={idApplication}
                                                idProperty={idProperty}
                                            ></FormUsersApplications>
                                            </Button>
                                            <Button color="transparent" onPress={onClose} type="submit"><TfiSave size={25} /></Button>
                                            <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                            <Button color="transparent" onPress={onClose}><MdClose size={30} /></Button>
                                            
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        {isLoading ? (
                                            <div>Loading...</div>
                                        ) : (
                                            <div className="mx-5 h-[65vh] min-h-full overflow-auto">
                                                <Table
                                                    isHeaderSticky={true}
                                                    layout="fixed"
                                                    removeWrapper
                                                    classNames={{
                                                        wrapper: "min-h-[222px]",
                                                    }}
                                                    className="h-full"
                                                >
                                                    <TableHeader>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            USER ID
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            NAME
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            LASTNAME
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            EMAIL
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {usersInApplication.map((users, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{users.id}</TableCell>
                                                                <TableCell>{users.name}</TableCell>
                                                                <TableCell>{users.lastName}</TableCell>
                                                                <TableCell>{users.email}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};
export default users_applications;
