"use client"
import React, { useState } from "react";
import {
    Modal, ModalContent, ModalHeader, ModalBody,
    Button, useDisclosure, Input,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Switch,
    //imports de dropdown menu
    DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
} from "@nextui-org/react";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';

//icons
import { FaRegUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { IoMdDownload } from "react-icons/io";

import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { IoApps } from "react-icons/io5";

import organizationInsert, { organizationEdit } from "../functionsForm/organizations/page";

import ModalUser from "@/components/Modal/modalUser";
import FormModals from "@/components/Modal/modalProperty";
import FormOrganizationApplication from "@/components/Modal/modals/modalOrganizationApplication";

import {useTranslations} from 'next-intl';


const modaluser = ({
    idOrganization,
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit,
    idUser,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const variants = ["underlined"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
    const [organizationProperties, setOrganizationProperties] = useState([]);
    const [organizationUsers, setOrganizationUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [dataUserFetched, setUserDataFetched] = useState(false)
    const [isSelected, setIsSelected] = useState(true);
    const t = useTranslations('Index');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSecondModal = async () => {
        setIsSecondModalOpen(!isSecondModalOpen);
        if (!dataFetched) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/organizations/` + idOrganization + `/properties`);
                setOrganizationProperties(response.data.response);
                setDataFetched(true);
            } catch (error) {
                console.error("Erro ao encontrar os propriedades associados à Organização:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleThirdModal = async () => {
        setIsThirdModalOpen(!isThirdModalOpen);
        if (!dataUserFetched) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/organizations/` + idOrganization + `/users`);
                setOrganizationUsers(response.data.response);
                setUserDataFetched(true);

            } catch (error) {
                console.error("Erro ao encontrar os users associados à Organização:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDelete = async (propertyID) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir esta propriedade?");
        if (confirmDelete) {
            try {
                const res = await axios.delete(`/api/hotel/properties/` + propertyID);
                console.log(res.data);
                alert("Propriedade removida com sucesso!");
            } catch (error) {
                console.error("Erro ao remover Propriedade:", error.message);
            }
        }
    };

    const { handleInputOrganization, handleSubmitOrganization } = organizationInsert();
    const { handleUpdateOrganization, setValuesOrganization, valuesOrganization } = organizationEdit(idOrganization);



    return (
        <>
            {formTypeModal === 10 && ( //create organizations
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
                                    <form onSubmit={handleSubmitOrganization}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        <div className="flex flex-row justify-start gap-4">
                                            {modalHeader} {modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                                </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" onChange={handleInputOrganization} variant={variant} label="Name" />
                                                        <Input type="text" name="Email" onChange={handleInputOrganization} variant={variant} label="E-Mail" />
                                                        <Input type="text" name="Name" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.companyNameLabel")} />
                                                        <Input type="text" name="Email" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.emailLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="FiscalNumber" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="text" name="PhoneNumber" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.mainAddressLabel")} />
                                                        <Input type="text" name="Address2" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.secondAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.countryLabel")} />
                                                        <Input type="text" name="District" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.districtLabel")} />
                                                        <Input type="text" name="ZipCode" onChange={handleInputOrganization} variant={variant} label={t("allOrganizations.zipcodeLabel")} />
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


            {formTypeModal === 11 && ( //edit organizations
                <>
                    <Button fullWidth={true} size="md" onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3">
                        {buttonName} {buttonIcon}
                    </Button>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                            body: "h-full ",

                        }}
                        size="full"
                        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form onSubmit={handleUpdateOrganization}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                            <div className="flex flex-row justify-start gap-4">
                                                {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            </div>
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" onPress={onClose} type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                            <div className=" bg-gray-100 p-1 rounded border d-flex justify-content-end">
                                            <Switch
                                                    size="sm"
                                                    className="mr-auto"
                                                    defaultSelected={!valuesOrganization.active}
                                                    onChange={e => setValuesOrganization({...valuesOrganization, active: !e.target.checked})}
                                                >
                                                    {valuesOrganization.active ? t("allOrganizations.edit.statusInactive") : t("allOrganizations.edit.statusActive")}
                                                </Switch>
                                                <FormOrganizationApplication
                                                    buttonIcon={<IoApps size={20} className="text-gray-500" />}
                                                    buttonColor={"gray-500"}
                                                    modalHeader={t("allOrganizations.applications.modalHeader")}
                                                    modalIcons={"bg-red"}
                                                    formTypeModal={1}
                                                    idOrganization={idOrganization}
                                                />
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" value={valuesOrganization.Name} onChange={e => setValuesOrganization({ ...valuesOrganization, Name: e.target.value })} variant={variant} label={t("allOrganizations.companyNameLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Email" value={valuesOrganization.Email} onChange={e => setValuesOrganization({ ...valuesOrganization, Email: e.target.value })} variant={variant} label={t("allOrganizations.emailLabel")} />
                                                        <Input type="text" name="FiscalNumber" value={valuesOrganization.FiscalNumber} onChange={e => setValuesOrganization({ ...valuesOrganization, FiscalNumber: e.target.value })} variant={variant} label={t("allOrganizations.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="text" name="PhoneNumber" value={valuesOrganization.PhoneNumber} onChange={e => setValuesOrganization({ ...valuesOrganization, PhoneNumber: e.target.value })} variant={variant} label={t("allOrganizations.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" value={valuesOrganization.Address1} onChange={e => setValuesOrganization({ ...valuesOrganization, Address1: e.target.value })} variant={variant} label={t("allOrganizations.mainAddressLabel")} />
                                                        <Input type="text" name="Address2" value={valuesOrganization.Address2} onChange={e => setValuesOrganization({ ...valuesOrganization, Address2: e.target.value })} variant={variant} label={t("allOrganizations.secondAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" value={valuesOrganization.Country} onChange={e => setValuesOrganization({ ...valuesOrganization, Country: e.target.value })} variant={variant} label={t("allOrganizations.countryLabel")} />
                                                        <Input type="text" name="District" value={valuesOrganization.District} onChange={e => setValuesOrganization({ ...valuesOrganization, District: e.target.value })} variant={variant} label={t("allOrganizations.districtLabel")} />
                                                        <Input type="text" name="ZipCode" value={valuesOrganization.ZipCode} onChange={e => setValuesOrganization({ ...valuesOrganization, ZipCode: e.target.value })} variant={variant} label={t("allOrganizations.zipcodeLabel")} />
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
            
            {formTypeModal === 13 && (
                <>
                    <Button onPress={toggleSecondModal} color={buttonColor} className="w-fit">
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
                        isOpen={isSecondModalOpen}
                        onOpenChange={toggleSecondModal}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                    <div className="flex flex-row justify-start gap-4">
                                            {modalHeader} {modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
                                            <Button color="transparent" onPress={onClose}><MdClose size={30} /></Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        {isLoading ? (
                                            <div>{t("general.loadingStatus")}</div>
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
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.properties.datatable.id")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.properties.datatable.name")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.properties.datatable.address")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.properties.datatable.country")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.properties.datatable.email")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                                            <GoGear size={20} />
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {organizationProperties.map((organizationProperties, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{organizationProperties.propertyID}</TableCell>
                                                                <TableCell>{organizationProperties.name}</TableCell>
                                                                <TableCell>{organizationProperties.address1}</TableCell>
                                                                <TableCell>{organizationProperties.country}</TableCell>
                                                                <TableCell>{organizationProperties.email}</TableCell>
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
                                                                        <DropdownMenu aria-label="Static Actions" isOpen={true} closeOnSelect={false}>
                                                                            <DropdownItem key="edit">
                                                                                <FormModals
                                                                                    buttonName={t("general.editRecord")}
                                                                                    editIcon={<FiEdit3 size={25} />}
                                                                                    buttonColor={"transparent"}
                                                                                    modalHeader={t("allOrganizations.properties.edit.modalHeader")}
                                                                                    modalEditArrow={<BsArrowRight size={25} />}
                                                                                    modalEdit={`ID: ${organizationProperties.propertyID}`}
                                                                                    formTypeModal={12}
                                                                                    idProperty={organizationProperties.propertyID}
                                                                                ></FormModals>
                                                                            </DropdownItem>
                                                                            <DropdownItem onClick={() => handleDelete(organizationProperties.propertyID)}>{t("general.removeRecord")}</DropdownItem>
                                                                            <DropdownItem >
                                                                                <FormModals
                                                                                    buttonName={t("general.viewRecord")}
                                                                                    buttonColor={"transparent"}
                                                                                    modalHeader={t("allOrganizations.properties.view.modalHeader")}
                                                                                    formTypeModal={11}
                                                                                    modalEditArrow={<BsArrowRight size={25} />}
                                                                                    modalEdit={`ID: ${organizationProperties.propertyID}`}
                                                                                    idProperty={organizationProperties.propertyID}
                                                                                ></FormModals>
                                                                            </DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </TableCell>
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
            {formTypeModal === 14 && (
                <>
                    <Button onPress={toggleThirdModal} color={buttonColor} className="w-fit">
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
                        isOpen={isThirdModalOpen}
                        onOpenChange={toggleThirdModal}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                    <div className="flex flex-row justify-start gap-4">
                                            {modalHeader} {modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
                                            <Button color="transparent" onPress={onClose}><MdClose size={30} /></Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        {isLoading ? (
                                            <div>{t("general.loadingStatus")}</div>
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
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.users.datatable.id")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.users.datatable.name")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.users.datatable.email")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">{t("allOrganizations.users.datatable.properties")}</TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white flex justify-center items-center">
                                                            <GoGear size={20} />
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {organizationUsers.map((organizationUsers, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{organizationUsers.id}</TableCell>
                                                                <TableCell>{organizationUsers.name}</TableCell>
                                                                <TableCell>{organizationUsers.email}</TableCell>
                                                                <TableCell>{organizationUsers.properties}</TableCell>
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
                                                                        <DropdownMenu aria-label="Static Actions" isOpen={true} closeOnSelect={false}>
                                                                            <DropdownItem key="edit">
                                                                                <ModalUser
                                                                                    buttonName={t("general.editRecord")}
                                                                                    editIcon={<FiEdit3 size={25} />}
                                                                                    buttonColor={"transparent"}
                                                                                    modalHeader={t("allOrganizations.users.edit.modalHeader")}
                                                                                    modalEditArrow={<BsArrowRight size={25} />}
                                                                                    modalEdit={`ID: ${organizationUsers.id}`}
                                                                                    formTypeModal={11}
                                                                                    idUser={organizationUsers.id}
                                                                                ></ModalUser>
                                                                            </DropdownItem>
                                                                            <DropdownItem onClick={() => handleDelete(organizationUsers.id)}>{t("general.removeRecord")}</DropdownItem>
                                                                            <DropdownItem >
                                                                                <ModalUser
                                                                                    buttonName={t("general.viewRecord")}
                                                                                    buttonColor={"transparent"}
                                                                                    modalHeader={t("allOrganizations.users.view.modalHeader")}
                                                                                    formTypeModal={11}
                                                                                    idUser = {organizationUsers.id}
                                                                                ></ModalUser>
                                                                            </DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </TableCell>
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

export default modaluser;