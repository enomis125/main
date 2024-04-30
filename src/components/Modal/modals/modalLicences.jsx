"use client"
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure , Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import axios from 'axios';

//icons

import { MdClose } from "react-icons/md";
import { LiaExpandSolid } from "react-icons/lia";


const modallicence = ({buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    idProperty,
    modalEdit,
    }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [propertyLicense, setPropertyLicense] = useState([]);
    const [licencesFetched, setLicencesFetched] = useState(false);



    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    
    const toggleFirstModal = async () => {
        setIsFirstModalOpen(!isFirstModalOpen);
        if (!licencesFetched) {
            setIsLoading(true);
            try {
                    const res = await axios.get(`/api/hotel/properties/` + idProperty + `/licenses/`);
                    setPropertyLicense(res.data.response);
                    setLicencesFetched(true);
                } catch (error) {
                    console.error("Erro ao encontrar as licenças associadas à propriedade:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            {formTypeModal === 2 && (
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
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                ID
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                ABV
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                BEDROOMS
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                WORKSTATIONS
                                                            </TableColumn>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {propertyLicense.map((licenses, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{licenses.pmsh}</TableCell>
                                                                    <TableCell>{licenses.abbreviation}</TableCell>
                                                                    <TableCell>{licenses.numOfRooms}</TableCell>
                                                                    <TableCell>{licenses.workstationId}</TableCell>
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
export default modallicence;