"use client"
import React, { useState, useEffect } from "react";
import { Modal, ScrollShadow, ModalContent, ModalHeader, ModalBody, Avatar, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem,Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, } from "@nextui-org/react";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';

//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import userInsert, { userEdit } from "../functionsForm/user/page";
import OrgEdit from "../functionsForm/organization/page";
import organization from "@/app/homepage/organization/page";


const modalorg = ({
    idOrg,
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit
}) => {
    console.log("organização:", idOrg)
    const [isExpanded, setIsExpanded] = useState(false);
    const variants = ["underlined"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [organizationsLicenses, setOrganizationsLicenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSecondModal = () => {
        setIsSecondModalOpen(!isSecondModalOpen);
    };


    const { handleUpdateOrg, setValuesOrg, valuesOrg } = OrgEdit(idOrg);

    useEffect(() => {
        const getData = async () => {
            if (!dataFetched){
                setIsLoading(true);
                try {
                    const res = await axios.get(`/api/hotel/organizations/` + idOrg + `/properties/licenses`);
                    setOrganizationsLicenses(res.data.response);
                    setDataFetched(true);
                } catch (error) {
                    console.error("Erro ao encontrar as licenças associadas à organização:", error.message);
            }finally {
                setIsLoading(false);
            }
        };
        }
        getData();
    }, []);

    return (
        <>
            {formTypeModal === 10 && ( //organization
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
                                    <form onSubmit={(e) => handleUpdateOrg(e)}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" onPress={onClose} type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-1/2 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" variant={variant} label="Name" value={valuesOrg.Name} onChange={e => setValuesOrg({ ...valuesOrg, Name: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" variant={variant} label="Company Name" value={valuesOrg.Name} onChange={e => setValuesOrg({ ...valuesOrg, Name: e.target.value })}/>
                                                        <Input type="text" variant={variant} label="Fiscal Number" value={valuesOrg.FiscalNumber} onChange={e => setValuesOrg({ ...valuesOrg, FiscalNumber: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" variant={variant} label="Email" value={valuesOrg.Email} onChange={e => setValuesOrg({ ...valuesOrg, Email: e.target.value })}/>
                                                        <Input type="text" variant={variant} label="Phone Number" value={valuesOrg.PhoneNumber} onChange={e => setValuesOrg({ ...valuesOrg, PhoneNumber: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input variant={variant} label="Address 1" value={valuesOrg.Address1} onChange={e => setValuesOrg({ ...valuesOrg, Address1: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input variant={variant} label="Address 2" value={valuesOrg.Address2} onChange={e => setValuesOrg({ ...valuesOrg, Address2: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" variant={variant} label="Country" value={valuesOrg.Country} onChange={e => setValuesOrg({ ...valuesOrg, Country: e.target.value })}/>
                                                        <Input type="text" name="District" variant={variant} label="District" value={valuesOrg.District} onChange={e => setValuesOrg({ ...valuesOrg, District: e.target.value })}/>
                                                        <Input type="number" name="ZipCode" variant={variant} label="zipCode" value={valuesOrg.ZipCode} onChange={e => setValuesOrg({ ...valuesOrg, ZipCode: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </ModalBody>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )
            }

{formTypeModal === 13 && ( //organization licences
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
                                    <form onSubmit={(e) => handleUpdateOrg(e)}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            <div className='flex flex-row items-center mr-5'>
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
                                                                ID
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                ABBREVIATION
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                BEDROOMS
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                WORKSTATIONS
                                                            </TableColumn>
                                                        </TableHeader>
                                                        <TableBody>
                                                        {organizationsLicenses.map((licenses, index) => (
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

export default modalorg;