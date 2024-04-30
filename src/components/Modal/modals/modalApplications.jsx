"use client"
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure , Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import axios from 'axios';

//icons
import { MdClose } from "react-icons/md";
import { LiaExpandSolid } from "react-icons/lia";


const modalapplications = ({buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    idApplication,
    idProperty,
modalEdit
    }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [applicationUsersFetch, setApplicationUsersFetched] = useState(false);
    const [propertyApplicationsUsers, setPropertyApplicationsUsers] = useState([]);


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    
    const toggleFirstModal = async () => {
        setIsFirstModalOpen(!isFirstModalOpen);
        if (!applicationUsersFetch) {
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/hotel/properties/` + idProperty + `/applications/` + idApplication + `/users`);
                setPropertyApplicationsUsers(res.data.response);
                setApplicationUsersFetched(true);
                console.log(res.data.response)
            } catch (error) {
                console.error("Erro ao encontrar os utilizadores associadas à aplicação:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {formTypeModal === 1 && (
                <>
                    <Button onPress={toggleFirstModal} color={buttonColor} className="w-fit">
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
                        isOpen={isFirstModalOpen}
                        onOpenChange={toggleFirstModal}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        <div className="flex flex-row justify-start gap-4">
                                        {modalHeader}{modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
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
                                                    <TableColumn className="bg-primary-600 text-white font-bold">NAME</TableColumn>
                                                    <TableColumn className="bg-primary-600 text-white flex justify-center items-center" />
                                                    </TableHeader>
                                                    <TableBody>
                                                    {propertyApplicationsUsers.map((user, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{user.name}</TableCell>
                                                                <TableCell className="flex justify-center" />
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
export default modalapplications;