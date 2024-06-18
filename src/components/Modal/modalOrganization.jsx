"use client"
import React, { useState, useEffect } from "react";
import { Modal, Switch, ModalContent, ModalHeader, ModalBody, Avatar, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem,Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, } from "@nextui-org/react";
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

import {useTranslations} from 'next-intl';


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

    const [isExpanded, setIsExpanded] = useState(false);
    const variants = ["underlined"];
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [organizationsLicenses, setOrganizationsLicenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const t = useTranslations('Index');

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
                                        <div className="flex flex-row justify-start gap-4">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                        </div>
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        <div className="w-full flex flex-col gap-4">
                                            <Switch
                                                    size="sm"
                                                    className="mr-auto"
                                                    defaultSelected={!valuesOrg.active}
                                                    onChange={e => setValuesOrg({...valuesOrg, active: !e.target.checked})}
                                                >
                                                    {valuesOrg.active ? t('organization.account.edit.statusInactive') : t('organization.account.edit.statusActive')}
                                                </Switch>
                                                </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" variant={variant} label={t('organization.account.companyNameLabel')} value={valuesOrg.Name} onChange={e => setValuesOrg({ ...valuesOrg, Name: e.target.value })}/>
                                                        <Input type="text" variant={variant} label={t('organization.account.fiscalNumberLabel')} value={valuesOrg.FiscalNumber} onChange={e => setValuesOrg({ ...valuesOrg, FiscalNumber: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" variant={variant} label={t('organization.account.emailLabel')} value={valuesOrg.Email} onChange={e => setValuesOrg({ ...valuesOrg, Email: e.target.value })}/>
                                                        <Input type="text" variant={variant} label={t('organization.account.phoneNumberLabel')} value={valuesOrg.PhoneNumber} onChange={e => setValuesOrg({ ...valuesOrg, PhoneNumber: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input variant={variant} label={t('organization.account.mainAddressLabel')} value={valuesOrg.Address1} onChange={e => setValuesOrg({ ...valuesOrg, Address1: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4 my-4">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input variant={variant} label={t('organization.account.secondAddressLabel')} value={valuesOrg.Address2} onChange={e => setValuesOrg({ ...valuesOrg, Address2: e.target.value })}/>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Country" variant={variant} label={t('organization.account.countryLabel')} value={valuesOrg.Country} onChange={e => setValuesOrg({ ...valuesOrg, Country: e.target.value })}/>
                                                        <Input type="text" name="District" variant={variant} label={t('organization.account.districtLabel')} value={valuesOrg.District} onChange={e => setValuesOrg({ ...valuesOrg, District: e.target.value })}/>
                                                        <Input type="text" name="ZipCode" variant={variant} label={t('organization.account.zipcodeLabel')} value={valuesOrg.ZipCode} onChange={e => setValuesOrg({ ...valuesOrg, ZipCode: e.target.value })}/>
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
                                        {isLoading ? (<p>{t('general.loadingStatus')}</p>
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
                                                                {t('organization.account.propertyLicenses.datatable.id')}
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                {t('organization.account.propertyLicenses.datatable.shortname')}
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                {t('organization.account.propertyLicenses.datatable.bedrooms')}
                                                            </TableColumn>
                                                            <TableColumn className="bg-primary-600 text-white font-bold">
                                                                {t('organization.account.propertyLicenses.datatable.workstations')}
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