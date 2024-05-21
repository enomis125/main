"use client"
import React, { useState, useEffect } from "react";
import { Modal, ScrollShadow, ModalContent, ModalHeader, ModalBody, Avatar, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox, } from "@nextui-org/react";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';

//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";



const modalpropertiesusers = ({
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    modalEditArrow,
    idProperty
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [dataFetched, setDataFetched] = useState(false);
    const [propertiesUsers, setPropertiesUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const getData = async () => {
            if (!dataFetched){
                setIsLoading(true);
                try {
                    const res = await axios.get(`/api/hotel/properties-users?property=`+ idProperty);
                    setPropertiesUsers(res.data.response);
                    console.log("aaaaa" + res.data.response)
                    setDataFetched(true);
                } catch (error) {
                    console.error("Erro ao encontrar os utilizadores não associadas à propriedade:", error.message);
            }finally {
                setIsLoading(false);
            }
        };
        }
        getData();
    }, []);

    return (
        <>
            {formTypeModal === 10 && ( 
                <>
                    <Button onPress={onOpen} color={buttonColor} className="bg-gray-300 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">
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
                                    <form>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        <div className="flex flex-row justify-start gap-4">
                                            {modalHeader}{modalEditArrow} {idProperty}
                                            </div>
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" onPress={onClose} type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        {isLoading ? (<p>A Carregar...</p>
                                            ) : (
                                                <div className="mx-5 h-[65vh] min-h-full">
                                                    <Table
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
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                ADD
                                                            </TableColumn>
                                                        </TableHeader>
                                                        <TableBody>
                                                        {propertiesUsers.map((propertiesusers, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{propertiesusers.userID}</TableCell>
                                                                <TableCell>{propertiesusers.name}</TableCell>
                                                                <TableCell>{propertiesusers.lastName}</TableCell>
                                                                <TableCell>{propertiesusers.email}</TableCell>
                                                                <TableCell><Checkbox/></TableCell>
                                                            </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
                                        </ModalBody>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )
            }
        </>
    );
};

export default modalpropertiesusers;