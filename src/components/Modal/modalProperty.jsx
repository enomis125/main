"use client"
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import {
    Modal, Switch, ModalContent, Badge, ModalHeader, ModalBody, Avatar, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem,
    //imports de tabelas
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination,
} from "@nextui-org/react";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';


//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FaUser, FaArrowLeft, FaPlug } from "react-icons/fa";
import { IoApps } from "react-icons/io5";
import { BiSpreadsheet } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { Checkbox } from "@nextui-org/react";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { GrUserSettings } from "react-icons/gr";

import FormModals from "@/components/Modal/modals/modalApplications";
import FormModalsLicence from "@/components/Modal/modals/modalLicences"
import FormModalsFeature from "@/components/Modal/modals/modalFeatures"
import FormModalPropertiesUsers from "@/components/Modal/modals/modalPropertiesUsers"
import FormUsersInApplications from "@/components/Modal/modals/modalUsersInApplication"

import propertyInsert, { propertyEdit } from "../functionsForm/property/page";

import { useTranslations } from 'next-intl';
import organization from "@/app/homepage/organization/page";


const modalpropertie = ({ buttonName, buttonIcon, modalHeader, formTypeModal, buttonColor, idProperty, editIcon, modalEditArrow, modalEdit, OrganizationName }) => {

    const variants = ["underlined"];

    /* Variaveis de uso*/
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInvisible, setIsInvisible] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { handleInputProperty, handleSubmitProperty, handleOrganizationSelect } = propertyInsert();
    const { handleUpdateProperty, setValuesProperty, handleOrganizationEdit, valuesProperty } = propertyEdit(idProperty);


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSelected, setIsSelected] = useState(true);

    /* Modals Open*/
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /*Array para listar */
    const [propertyUsers, setPropertyUsers] = useState([]);
    const [propertyApplication, setPropertyApplications] = useState([]);

    /*Data Info*/
    const [applicationFetched, setApplicationFetched] = useState(false);
    const [fetchUsers, setFetchUsers] = useState(false);
    const [userCount, setUserCount] = useState(null);

    const { data: session, status } = useSession()

    const t = useTranslations('Index');

    const isAdmin = () => {
        return session?.user?.admin;
    };

    /*Paths para os Modals*/
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSecondModal = async () => {
        setIsSecondModalOpen(!isSecondModalOpen);
        if (!fetchUsers) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/properties/` + idProperty + `/users`);
                console.log(response)
                setPropertyUsers(response.data.response);
                setFetchUsers(true);
            } catch (error) {
                console.error("Erro ao encontrar os utilizadores associados à propriedade:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const [allApplications, setAllApplications] = useState([]);

    useEffect(() => {
        const fetchAllApplications = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/applications`);
                setAllApplications(response.data.response);
            } catch (error) {
                console.error("Erro ao buscar todas as aplicações:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllApplications();
    }, []);


    const toggleThirdModal = async () => {
        setIsThirdModalOpen(!isThirdModalOpen);
        if (!applicationFetched) {
            setIsLoading(true);
            try {
                let response;
                if (isAdmin()) { // Se for um administrador
                    response = await axios.get(`/api/hotel/applications`);
                } else { // Se não for um administrador
                    response = await axios.get(`/api/hotel/properties/${idProperty}/applications`);
                }
                setPropertyApplications(response.data.response);
                console.log(response.data.response)
                setApplicationFetched(true);
            } catch (error) {
                console.error("Erro ao encontrar as aplicações:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleModalOpenChange = async () => {
        setIsModalOpen(!isModalOpen);
    };

    const [switchState, setSwitchState] = useState(false);

    const handleSwitchToggle = async (applicationID, active) => {
        try {
            const requestData = {
                propertyID: parseInt(idProperty),
                applicationID: parseInt(applicationID)
            };

            var response
            console.log("Switch active state:", active);
            setSwitchState(active);
            console.log(active)

            if (active) {

                const property = await axios.get("/api/hotel/properties/" + idProperty)

                const organizationID = property.data.response.organizationID

                const organizationApplication = await axios.get("/api/hotel/organizations-applications?organization=" + organizationID + "&application=" + applicationID)


                if (organizationApplication.data.response == null) {

                    console.log("Organization application is null, opening modal");
                    handleModalOpenChange();

                    const newOrganizationApplication = await axios.put("/api/hotel/organizations-applications", {
                        data: {
                            organizationID: organizationID,
                            applicationID: applicationID,
                            connectionString: connectionString
                        }
                    })
                }

                response = await axios.put("/api/hotel/properties-applications", {
                    data: {
                        propertyID: idProperty,
                        applicationID: applicationID
                    }
                });

            } else {
                const propertyApplication = await axios.get("/api/hotel/properties-applications?propertyID=" + idProperty + "&applicationID=" + applicationID);

                response = await axios.delete("/api/hotel/properties-applications/" + propertyApplication.data.response.propertyApplicationID)
            }

            if (response.status === 200) {
                console.log("Aplicação ativada com sucesso na propriedade.");
            } else {
                console.error("Falha ao ativar a aplicação na propriedade.");
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação PUT:", error);
        }
    };



    useEffect(() => {
        async function fetchUserCount() {
            try {
                const response = await axios.get('/api/hotel/properties/' + idProperty + '/users/count');
                setUserCount(response.data.response);
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        }
        fetchUserCount();
    }, []);

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('/api/hotel/organizations');
                const result = await response.json();
                if (response.ok) {
                    setItems(result.response.map(org => ({ value: org.organizationID, OrganizationName: org.name })));
                } else {
                    console.error('Failed to fetch organizations:', result.error);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);


    return (
        <>
            {formTypeModal === 10 && ( //Properties
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
                                    <form onSubmit={handleSubmitProperty}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">{modalHeader}
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-2">
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input type="text" name="Name" onChange={handleInputProperty} variant={variant} label={t("organization.properties.nameLabel")} />
                                                        <Input type="text" name="FiscalNumber" onChange={handleInputProperty} variant={variant} label={t("organization.properties.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input onChange={handleInputProperty} name="Email" type="text" variant={variant} label={t("organization.properties.emailLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2 "
                                                    >
                                                        <Input type="number" name="PhoneNumber" onChange={handleInputProperty} variant={variant} label={t("organization.properties.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input type="text" name="Address1" onChange={handleInputProperty} variant={variant} label={t("organization.properties.mainAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input type="text" name="Country" onChange={handleInputProperty} variant={variant} label={t("organization.properties.countryLabel")} />
                                                        <Input type="text" name="District" onChange={handleInputProperty} variant={variant} label={t("organization.properties.districtLabel")} />
                                                        <Input type="text" name="ZipCode" onChange={handleInputProperty} variant={variant} label={t("organization.properties.zipcodeLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input type="text" name="Description" onChange={handleInputProperty} variant={variant} label={t("organization.properties.descriptionLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2"
                                                    >
                                                        <Input type="text" name="Abbreviation" onChange={handleInputProperty} variant={variant} label={t("organization.properties.shortnameLabel")} />
                                                        <Input type="text" name="Designation" onChange={handleInputProperty} variant={variant} label={t("organization.properties.designationLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2">
                                                        {isAdmin() && (
                                                            <Autocomplete
                                                                variant={variant}
                                                                label={t("organization.properties.selectOrganization")}
                                                                defaultItems={items}
                                                                defaultSelectedKey=""
                                                                className="w-1/4"
                                                                onSelectionChange={handleOrganizationSelect}
                                                            >
                                                                {items.map((item) => (
                                                                    <AutocompleteItem key={item.value} value={item.value}>{item.OrganizationName}</AutocompleteItem>
                                                                ))}
                                                            </Autocomplete>
                                                        )}
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
            )}

            {formTypeModal === 11 && ( //Properties view
                <>
                    <Button fullWidth={true} size="md" onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3" >
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
                                    <form onSubmit={handleSubmitProperty}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                            <div className="flex flex-row justify-start gap-4">
                                                {modalHeader} {modalEditArrow} {modalEdit}
                                            </div>
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4">
                                            <div className="flex justify-end gap-2">
                                                <div className="bg-gray-100 p-1 rounded border border-gray-300 mr-2">
                                                    <Badge color="success" content={userCount} isInvisible={!userCount} shape="circle">
                                                        <Button color="transparent" onPress={toggleSecondModal}>
                                                            <FaUser size={20} className="text-gray-500" />
                                                        </Button>
                                                    </Badge>
                                                    <Modal
                                                        classNames={{
                                                            base: "max-h-screen",
                                                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                                                            body: "h-full",
                                                        }}
                                                        size="full"
                                                        hideCloseButton="true"
                                                        isOpen={isSecondModalOpen}
                                                        onClose={toggleSecondModal}
                                                        isDismissable={false}
                                                        isKeyboardDismissDisabled={true}
                                                    >
                                                        <ModalContent>
                                                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                                                <div className="flex flex-row justify-start gap-4">
                                                                    {modalHeader} {modalEditArrow} {modalEdit} <p>{t("organization.properties.users.label")}</p>
                                                                </div>
                                                                <div className='flex flex-row items-center mr-5'>
                                                                    <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                                    <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                                                </div>
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                {isLoading ? (<p>{t("general.loadingStatus")}</p>
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
                                                                                    {t("organization.properties.users.datatable.name")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.lastName")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.email")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.role")}
                                                                                </TableColumn>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {propertyUsers.map((user, index) => (
                                                                                    <TableRow key={index}>
                                                                                        <TableCell>{user.name}</TableCell>
                                                                                        <TableCell>{user.surname}</TableCell>
                                                                                        <TableCell>{user.email}</TableCell>
                                                                                        <TableCell>{user.role}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                )}
                                                            </ModalBody>
                                                        </ModalContent>
                                                    </Modal>
                                                </div>
                                                <div className="bg-gray-100 p-1 rounded border border-gray-300">
                                                    <Button color="transparent" onPress={toggleThirdModal}>
                                                        <IoApps size={20} className="text-gray-500" />
                                                    </Button>
                                                    <Modal
                                                        classNames={{
                                                            base: "max-h-screen",
                                                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                                                            body: "h-full",
                                                        }}
                                                        size="full"
                                                        hideCloseButton="true"
                                                        isOpen={isThirdModalOpen}
                                                        onClose={toggleThirdModal}
                                                        isDismissable={false}
                                                        isKeyboardDismissDisabled={true}
                                                    >
                                                        <ModalContent>
                                                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                                                <div className="flex flex-row justify-start gap-4">
                                                                    {modalHeader} {modalEditArrow} {modalEdit} <p>{t("organization.properties.applications.label")}</p>
                                                                </div>
                                                                <div className='flex flex-row items-center mr-5'>
                                                                    <Button color="transparent" onClick={toggleSecondModal}><FaArrowLeft size={25} /></Button>
                                                                    <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                                    <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                                                </div>
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                {isLoading ? (<p>{t("general.loadingStatus")}</p>
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
                                                                                    {t("organization.properties.applications.datatable.system")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.available")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.license")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.features")}
                                                                                </TableColumn>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {isAdmin() ? ( // Se o utilizador for admin
                                                                                    allApplications.map((application, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                <FormModals
                                                                                                    buttonName={application.description}
                                                                                                    buttonColor={"transparent"}
                                                                                                    modalHeader={"Utilizadores da Aplicação -"}
                                                                                                    formTypeModal={1}
                                                                                                    modalEdit={` ID: ${idProperty}`}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                ></FormModals>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Switch
                                                                                                    className="mr-auto"
                                                                                                    size="sm"
                                                                                                    onChange={(e) => handleSwitchToggle(application.id, e.target.checked)}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsLicence
                                                                                                        buttonName={<BiSpreadsheet size={25} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={2}
                                                                                                        modalHeader={t("organizations.properties.applications.features.modalHeader")}
                                                                                                        modalEdit={` ID: ${idProperty}`}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsLicence>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsFeature
                                                                                                        buttonName={<FaPlug size={20} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={3}
                                                                                                        modalHeader={t("organization.properties.applications.features.modalHeader")}
                                                                                                        modalEdit={` ID: ${idProperty}`}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsFeature>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                ) : ( // Se o utilizador nao for admin
                                                                                    propertyApplication.map((application, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                <FormModals
                                                                                                    buttonName={application.description}
                                                                                                    buttonColor={"transparent"}
                                                                                                    formTypeModal={1}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                ></FormModals>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Checkbox defaultSelected color="success"></Checkbox>
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsLicence
                                                                                                        buttonName={<BiSpreadsheet size={25} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={2}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsLicence>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20}
                                                                                                    /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsFeature
                                                                                                        buttonName={<FaPlug size={20} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={3}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsFeature>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                )}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                )}
                                                            </ModalBody>
                                                        </ModalContent>
                                                    </Modal>
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" value={valuesProperty.Name} onChange={handleInputProperty} variant={variant} label={t("organization.properties.nameLabel")} />
                                                        <Input type="text" name="FiscalNumber" value={valuesProperty.FiscalNumber} onChange={handleInputProperty} variant={variant} label={t("organization.properties.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input onChange={handleInputProperty} name="Email" value={valuesProperty.Email} type="text" variant={variant} label={t("organization.properties.emailLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="number" name="PhoneNumber" value={valuesProperty.PhoneNumber} onChange={handleInputProperty} variant={variant} label={t("organization.properties.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" value={valuesProperty.Address1} onChange={handleInputProperty} variant={variant} label={t("organization.properties.mainAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" value={valuesProperty.Country} onChange={handleInputProperty} variant={variant} label={t("organization.properties.countryLabel")} />
                                                        <Input type="text" name="District" value={valuesProperty.District} onChange={handleInputProperty} variant={variant} label={t("organization.properties.districtLabel")} />
                                                        <Input type="text" name="ZipCode" value={valuesProperty.ZipCode} onChange={handleInputProperty} variant={variant} label={t("organization.properties.zipcodeLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Description" value={valuesProperty.Description} onChange={handleInputProperty} variant={variant} label={t("organization.properties.descriptionLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Abbreviation" value={valuesProperty.Abbreviation} onChange={handleInputProperty} variant={variant} label={t("organization.properties.shortnameLabel")} />
                                                        <Input type="text" name="Designation" value={valuesProperty.Designation} onChange={handleInputProperty} variant={variant} label={t("organization.properties.designationLabel")} />
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
            )}


            {formTypeModal === 12 && ( //Properties edit
                <>
                    <Button fullWidth={true} size="md" onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3" >
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
                                    <form onSubmit={(e) => handleUpdateProperty(e)}>
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
                                        <ModalBody className="flex flex-col mx-5 my-5">
                                            <div className="flex justify-end gap-2">
                                                <Switch
                                                    className="mr-auto"
                                                    size="sm"
                                                    defaultSelected={!valuesProperty.active}
                                                    onChange={e => setValuesProperty({ ...valuesProperty, active: !e.target.checked })}
                                                >
                                                    {valuesProperty.active ? t("organization.properties.edit.statusInactive") : t("organization.properties.edit.statusActive")}

                                                </Switch>

                                                <div className="bg-gray-100 p-1 rounded border border-gray-300 mr-2">
                                                    <Badge color="success" content={userCount} isInvisible={isInvisible} shape="circle">
                                                        <Button color="transparent" onPress={toggleSecondModal}>
                                                            <FaUser size={20} className="text-gray-500" />
                                                        </Button>
                                                    </Badge>
                                                    <Modal
                                                        classNames={{
                                                            base: "max-h-screen",
                                                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                                                            body: "h-full",
                                                        }}
                                                        size="full"
                                                        hideCloseButton="true"
                                                        isOpen={isSecondModalOpen}
                                                        onClose={toggleSecondModal}
                                                        isDismissable={false}
                                                        isKeyboardDismissDisabled={true}
                                                    >
                                                        <ModalContent>
                                                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                                                <div className="flex flex-row justify-start gap-4">
                                                                    {editIcon} {modalHeader} {modalEditArrow} {modalEdit} <p>{t("organization.properties.users.label")}</p>
                                                                </div>
                                                                <div className='flex flex-row items-center mr-5'>
                                                                    <Button>
                                                                        <FormModalPropertiesUsers
                                                                            buttonName={t("general.newRecord")}
                                                                            editIcon={<FiEdit3 size={25} />}
                                                                            buttonColor={"transparent"}
                                                                            modalHeader={t("organization.properties.users.assign.modalHeader")}
                                                                            modalEditArrow={<BsArrowRight size={25} />}
                                                                            modalEdit={`ID: ${idProperty}`}
                                                                            formTypeModal={10}
                                                                            propertyID={idProperty}
                                                                        /></Button>
                                                                    <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                                    <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>

                                                                </div>

                                                            </ModalHeader>
                                                            <ModalBody>
                                                                {isLoading ? (<p>{t("general.loadingStatus")}</p>
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
                                                                                    {t("organization.properties.users.datatable.name")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.lastName")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.email")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.users.datatable.role")}
                                                                                </TableColumn>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {propertyUsers.map((user, index) => (
                                                                                    <TableRow key={index}>
                                                                                        <TableCell>{user.name}</TableCell>
                                                                                        <TableCell>{user.surname}</TableCell>
                                                                                        <TableCell>{user.email}</TableCell>
                                                                                        <TableCell>{user.role}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                )}
                                                            </ModalBody>
                                                        </ModalContent>
                                                    </Modal>
                                                </div>
                                                <div className="bg-gray-100 p-1 rounded border border-gray-300">
                                                    <Button color="transparent" onPress={toggleThirdModal}>
                                                        <IoApps size={20} className="text-gray-500" />
                                                    </Button>
                                                    <Modal
                                                        classNames={{
                                                            base: "max-h-screen",
                                                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                                                            body: "h-full",
                                                        }}
                                                        size="full"
                                                        hideCloseButton="true"
                                                        isOpen={isThirdModalOpen}
                                                        onClose={toggleThirdModal}
                                                        isDismissable={false}
                                                        isKeyboardDismissDisabled={true}
                                                    >
                                                        <ModalContent>
                                                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                                                <div className="flex flex-row justify-start gap-4">
                                                                    {editIcon} {modalHeader} {modalEditArrow} {modalEdit} <p>{t("organization.properties.applications.label")}</p>
                                                                </div>
                                                                <div className='flex flex-row items-center mr-5'>
                                                                    <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                                    <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                                                </div>
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                {isLoading ? (<p>{t("general.loadingStatus")}</p>
                                                                ) : (
                                                                    <div className="mx-5 h-[65vh] min-h-full ">
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
                                                                                    {t("organization.properties.applications.datatable.system")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.available")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.license")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.features")}
                                                                                </TableColumn>
                                                                                <TableColumn className="bg-primary-600 text-white font-bold">
                                                                                    {t("organization.properties.applications.datatable.users")}
                                                                                </TableColumn>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {isAdmin() ? ( // Se o utilizador for admin
                                                                                    allApplications.map((application, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                <FormModals
                                                                                                    buttonName={application.description}
                                                                                                    buttonColor={"transparent"}
                                                                                                    modalHeader={"Utilizadores da Aplicação -"}
                                                                                                    formTypeModal={1}
                                                                                                    modalEdit={` ID: ${idProperty}`}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                ></FormModals>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Switch
                                                                                                    className="mr-auto"
                                                                                                    size="sm"
                                                                                                    checked={switchState}
                                                                                                    onChange={(e) => handleSwitchToggle(application.id, e.target.checked)}
                                                                                                />
                                                                                                <Modal
                                                                                                    isOpen={isModalOpen}
                                                                                                    onOpenChange={handleModalOpenChange}
                                                                                                    isDismissable={false}
                                                                                                    isKeyboardDismissDisabled={true}
                                                                                                >
                                                                                                    <ModalContent>
                                                                                                        {(onClose) => (
                                                                                                            <>
                                                                                                                <ModalHeader className="flex flex-col gap-1">New Connection String</ModalHeader>
                                                                                                                <ModalBody>
                                                                                                                    <Input />
                                                                                                                </ModalBody>
                                                                                                                <ModalFooter>
                                                                                                                    <Button color="danger" variant="light" onPress={onClose}>
                                                                                                                        X
                                                                                                                    </Button>
                                                                                                                    <Button color="primary" onPress={onClose}>
                                                                                                                        ADD
                                                                                                                    </Button>
                                                                                                                </ModalFooter>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </ModalContent>
                                                                                                </Modal>
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsLicence
                                                                                                        buttonName={<BiSpreadsheet size={25} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={2}
                                                                                                        modalHeader={t("organization.properties.applications.licenses.modalHeader")}
                                                                                                        modalEdit={` ID: ${idProperty}`}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsLicence>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsFeature
                                                                                                        buttonName={<FaPlug size={20} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={3}
                                                                                                        modalHeader={t("organization.properties.applications.features.modalHeader")}
                                                                                                        modalEdit={` ID: ${idProperty}`}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsFeature>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormUsersInApplications
                                                                                                    buttonName={<GrUserSettings size={25} />}
                                                                                                    buttonColor={"transparent"}
                                                                                                    modalHeader={t("organization.properties.applications.assign.modalHeader")}
                                                                                                    formTypeModal={10}
                                                                                                    modalEdit={` ID: ${idProperty}`}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                />
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                ) : ( // Se o utilizador nao for admin
                                                                                    propertyApplication.map((application, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                <FormModals
                                                                                                    buttonName={application.description}
                                                                                                    buttonColor={"transparent"}
                                                                                                    formTypeModal={1}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                ></FormModals>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <Checkbox defaultSelected color="success"></Checkbox>
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsLicence
                                                                                                        buttonName={<BiSpreadsheet size={25} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={2}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsLicence>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20}
                                                                                                    /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                                                {application.description === "OnPremPMS" ? (
                                                                                                    <FormModalsFeature
                                                                                                        buttonName={<FaPlug size={20} />}
                                                                                                        buttonColor={"transparent"}
                                                                                                        formTypeModal={3}
                                                                                                        idApplication={application.id}
                                                                                                        idProperty={idProperty}
                                                                                                    ></FormModalsFeature>
                                                                                                ) : (
                                                                                                    <Button className={"bg-transparent hover:bg-transparent"}><FaLock size={20} /></Button>
                                                                                                )}
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <FormUsersInApplications
                                                                                                    buttonName={<GrUserSettings size={25} />}
                                                                                                    buttonColor={"transparent"}
                                                                                                    modalHeader={t("organization.properties.applications.assign.modalHeader")}
                                                                                                    formTypeModal={10}
                                                                                                    modalEdit={` ID: ${idProperty}`}
                                                                                                    idApplication={application.id}
                                                                                                    idProperty={idProperty}
                                                                                                />
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))
                                                                                )}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                )}
                                                            </ModalBody>
                                                        </ModalContent>
                                                    </Modal>
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" value={valuesProperty.Name} onChange={e => setValuesProperty({ ...valuesProperty, Name: e.target.value })} variant={variant} label={t("organization.properties.nameLabel")} />
                                                        <Input type="text" name="FiscalNumber" value={valuesProperty.FiscalNumber} onChange={e => setValuesProperty({ ...valuesProperty, FiscalNumber: e.target.value })} variant={variant} label={t("organization.properties.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input value={valuesProperty.Email} onChange={e => setValuesProperty({ ...valuesProperty, Email: e.target.value })} name="Email" type="text" variant={variant} label={t("organization.properties.emailLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="number" name="PhoneNumber" value={valuesProperty.PhoneNumber} onChange={e => setValuesProperty({ ...valuesProperty, PhoneNumber: e.target.value })} variant={variant} label={t("organization.properties.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" value={valuesProperty.Address1} onChange={e => setValuesProperty({ ...valuesProperty, Address1: e.target.value })} variant={variant} label={t("organization.properties.mainAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" value={valuesProperty.Country} onChange={e => setValuesProperty({ ...valuesProperty, Country: e.target.value })} variant={variant} label={t("organization.properties.countryLabel")} />
                                                        <Input type="text" name="District" value={valuesProperty.District} onChange={e => setValuesProperty({ ...valuesProperty, District: e.target.value })} variant={variant} label={t("organization.properties.districtLabel")} />
                                                        <Input type="text" name="ZipCode" value={valuesProperty.ZipCode} onChange={e => setValuesProperty({ ...valuesProperty, ZipCode: e.target.value })} variant={variant} label={t("organization.properties.zipcodeLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Description" value={valuesProperty.Description} onChange={e => setValuesProperty({ ...valuesProperty, Description: e.target.value })} variant={variant} label={t("organization.properties.descriptionLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Abbreviation" value={valuesProperty.Abbreviation} onChange={e => setValuesProperty({ ...valuesProperty, Abbreviation: e.target.value })} variant={variant} label={t("organization.properties.shortnameLabel")} />
                                                        <Input type="text" name="Designation" value={valuesProperty.Designation} onChange={e => setValuesProperty({ ...valuesProperty, Designation: e.target.value })} variant={variant} label={t("organization.properties.designationLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-1">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-2">
                                                        {isAdmin() && (
                                                            <Autocomplete
                                                                variant={variant}
                                                                label={t("organization.properties.changeOrganizationLabel")}
                                                                defaultItems={items}
                                                                defaultSelectedKey={valuesProperty.OrganizationID}
                                                                className="w-1/4"
                                                                defaultInputValue={OrganizationName}
                                                                onSelectionChange={handleOrganizationEdit} 
                                                            >
                                                                {items.map((item) => (
                                                                    <AutocompleteItem key={item.value} value={item.value}>{item.OrganizationName}</AutocompleteItem>
                                                                ))}
                                                            </Autocomplete>
                                                        )}
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
            )}
        </>
    );
};

export default modalpropertie;