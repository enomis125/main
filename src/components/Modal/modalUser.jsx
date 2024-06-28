"use client"
import React, { useState, useEffect } from "react";
import { Modal, ScrollShadow, ModalContent, ModalHeader, ModalBody, Avatar, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';
import { useSession } from 'next-auth/react';

//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { PiInfo } from "react-icons/pi";
import { BsArrowRight } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";

import userInsert, { userEdit } from "../functionsForm/user/page";
import ModalUserProperty from "../Modal/modals/modalUsersProperties"

import {useTranslations} from 'next-intl';


const modaluser = ({
    userID,
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit,
    OrganizationName,
    PropertiesUserName,
    NameUser
}) => {

    console.log(userID)
    const [isExpanded, setIsExpanded] = useState(false);
    const variants = ["underlined"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const t = useTranslations('Index');

    const { data: session, status } = useSession()

    const isAdmin = () => {
        return session?.user?.admin;
    };


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    
    const { handleInputUser, handleSubmitUser , handleOrganizationSelect} = userInsert();
    const { handleUpdateUser, setValuesUser, handleOrganizationEdit, valuesUser } = userEdit(userID);

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
            {formTypeModal === 10 && ( //Users
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
                                    <form onSubmit={handleSubmitUser}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                            {modalHeader}
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent"  type="submit"><TfiSave size={25} /></Button>
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
                                                        <Input type="text" name="Name" onChange={handleInputUser} variant={variant} label={t("profiles.users.nameLabel")} />
                                                        <Input type="text" name="LastName" onChange={handleInputUser} variant={variant} label={t("profiles.users.lastNameLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Email" onChange={handleInputUser} variant={variant} label={t("profiles.users.emailLabel")} />
                                                        <Input type="text" name="FiscalNumber" onChange={handleInputUser} variant={variant} label={t("profiles.users.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="text" name="PhoneNumber" onChange={handleInputUser} variant={variant} label={t("profiles.users.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" onChange={handleInputUser} variant={variant} label={t("profiles.users.mainAddressLabel")} />
                                                        <Input type="text" name="Address2" onChange={handleInputUser} variant={variant} label={t("profiles.users.secondAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" onChange={handleInputUser} variant={variant} label={t("profiles.users.countryLabel")} />
                                                        <Input type="text" name="District" onChange={handleInputUser} variant={variant} label={t("profiles.users.districtLabel")} />
                                                        <Input type="text" name="ZipCode" onChange={handleInputUser} variant={variant} label={t("profiles.users.zipcodeLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="password"className="w-1/4" name="Password" onChange={handleInputUser} variant={variant} label={t("profiles.users.passwordLabel")} />
                                                        <Input type="number" className="w-1/4" name="RoleID" onChange={handleInputUser} variant={variant} label={t("profiles.users.roleLabel")} />
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
            )
            }


            {formTypeModal === 11 && ( //Users edit
                <>
                    <Button fullWidth={true} size="md" onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3" >
                        {buttonName} {buttonIcon}
                    </Button>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen " : "lg:pl-72 h-screen w-full",
                            body: "h-full ",
                        }
                        }
                        size="full"
                        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form onSubmit={(e) => handleUpdateUser(e)}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                            <div className="flex flex-row justify-start gap-2">
                                                {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            </div>
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" onPress={onClose} type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4">
                                            <div className="w-1/2 flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-1/2flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Organization" value={OrganizationName} variant={variant} label={t("profiles.users.organizationLabel")} />

                                                        <Input type="text" name="Properties" value={PropertiesUserName} variant={variant} label={t("profiles.users.propertiesLabel")} />

                                                        <Button  color="transparent" ><PiInfo size={30} /></Button>


                                                        <ModalUserProperty
                                                            buttonName={<CiCirclePlus size={30} />}
                                                            buttonColor={"transparent"}
                                                            modalHeader={t("profiles.users.properties.modalHeader")}
                                                            modalEditArrow={<BsArrowRight size={25} />}
                                                            modalEdit={NameUser}
                                                            formTypeModal={10}
                                                            userID={userID}
                                                            NameUser={NameUser}
                                                            OrganizationUserName={OrganizationName}
                                                            PropertiesUserName={PropertiesUserName}
                                                        ></ModalUserProperty>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" value={valuesUser.Name} onChange={e => setValuesUser({ ...valuesUser, Name: e.target.value })} variant={variant} label={t("profiles.users.nameLabel")} />
                                                        <Input type="text" name="LastName" value={valuesUser.LastName} onChange={e => setValuesUser({ ...valuesUser, LastName: e.target.value })} variant={variant} label={t("profiles.users.lastNameLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Email" value={valuesUser.Email} onChange={e => setValuesUser({ ...valuesUser, Email: e.target.value })} variant={variant} label={t("profiles.users.emailLabel")} />
                                                        <Input type="text" name="FiscalNumber" value={valuesUser.FiscalNumber} onChange={e => setValuesUser({ ...valuesUser, FiscalNumber: e.target.value })} variant={variant} label={t("profiles.users.fiscalNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="max-w-xs flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex max-w-xs flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 "
                                                    >
                                                        <Input type="text" name="PhoneNumber" value={valuesUser.PhoneNumber} onChange={e => setValuesUser({ ...valuesUser, PhoneNumber: e.target.value })} variant={variant} label={t("profiles.users.phoneNumberLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Address1" value={valuesUser.Address1} onChange={e => setValuesUser({ ...valuesUser, Address1: e.target.value })} variant={variant} label={t("profiles.users.mainAddressLabel")} />
                                                        <Input type="text" name="Address2" value={valuesUser.Address2} onChange={e => setValuesUser({ ...valuesUser, Address2: e.target.value })} variant={variant} label={t("profiles.users.secondAddressLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" value={valuesUser.Country} onChange={e => setValuesUser({ ...valuesUser, Country: e.target.value })} variant={variant} label={t("profiles.users.countryLabel")} />
                                                        <Input type="text" name="District" value={valuesUser.District} onChange={e => setValuesUser({ ...valuesUser, District: e.target.value })} variant={variant} label={t("profiles.users.districtLabel")} />
                                                        <Input type="text" name="ZipCode" value={valuesUser.ZipCode} onChange={e => setValuesUser({ ...valuesUser, ZipCode: e.target.value })} variant={variant} label={t("profiles.users.zipcodeLabel")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="password" className="w-1/4" name="Password" value={valuesUser.Password} onChange={e => setValuesUser({ ...valuesUser, Password: e.target.value })} variant={variant} label={t("profiles.users.passwordLabel")} />

                                                        <Input type="number" className="w-1/4" name="RoleID" value={valuesUser.RoleID} onChange={e => setValuesUser({ ...valuesUser, RoleID: e.target.value })} variant={variant} label={t("profiles.users.roleLabel")} />

                                                        {isAdmin() && (
                                                            <Autocomplete
                                                                variant={variant}
                                                                label={t("organization.properties.changeOrganizationLabel")}
                                                                defaultItems={items}
                                                                defaultSelectedKey={valuesUser.OrganizationID}
                                                                className="w-1/4"
                                                                efaultInputValue={OrganizationName}
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
            )
            }
        </>
    );
};

export default modaluser;