"use client"
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';


//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";

import ApplicationInsert, { ApplicationEdit } from "../functionsForm/application/page";

import { useTranslations } from 'next-intl';


const modalApplication = ({
    ApplicationID,
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit,
    NamePartner,
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
}) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const variants = ["underlined"];
    const t = useTranslations('Index');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const [items, setItems] = useState([]);
    const [itemsPartner, setItemsPartner] = useState([]);
    const { handleInputApplication, handleSubmitApplication, handleCategorySelect, handlePartnerSelect } = ApplicationInsert();
    const { handleUpdateApplication, setValuesApplication, handleCategorySelectEdit, handlePartnerSelectEdit, valuesApplication } = ApplicationEdit(ApplicationID);

    console.log("teste" + valuesApplication)

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch('/api/hotel/applications-categories');
                const result = await response.json();
                if (response.ok) {
                    setItems(result.response.map(catg => ({ value: catg.applicationCategoryID, Name: catg.name })));
                } else {
                    console.error('Failed to fetch categories:', result.error);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const response = await fetch('/api/hotel/partners');
                const result = await response.json();
                if (response.ok) {
                    setItemsPartner(result.response.map(partner => ({ value: partner.partnerID, Name: partner.name })));
                } else {
                    console.error('Failed to fetch partners:', result.error);
                }
            } catch (error) {
                console.error('Error fetching partners:', error);
            }
        };
        fetchPartner();
    }, []);



    return (
        <>
            {formTypeModal === 10 && (
                <>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                            body: "h-full",
                        }}
                        size="full"
                        isOpen={isOpen}
                        hideCloseButton={true}
                        onOpenChange={onClose}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <form onSubmit={handleSubmitApplication}>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        {modalHeader}
                                        <div className='flex flex-row items-center mr-5'>
                                            <Button color="transparent" type="submit"><TfiSave size={25} /></Button>
                                            <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                            <Button color="transparent" variant="light" onClick={onClose}><MdClose size={30} /></Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        <div className="w-full flex flex-col gap-4">
                                            <div className="flex w-1/2 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                <Input variant={variants} type="text" name="Description" onChange={handleInputApplication} label={t("applications.description")} />
                                                <Input variant={variants} type="text" name="Abbreviation" onChange={handleInputApplication} label={t("applications.abbreviation")} />
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col gap-4">
                                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                <Autocomplete
                                                    label={t("applications.selectCategory")}
                                                    defaultItems={items}
                                                    onSelectionChange={handleCategorySelect}
                                                    className="w-1/4"
                                                    variant={variants}
                                                >
                                                    {items.map((item) => (
                                                        <AutocompleteItem key={item.value} value={item.value}>{item.Name}</AutocompleteItem>
                                                    ))}
                                                </Autocomplete>
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col gap-4">
                                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                <Autocomplete
                                                    label={t("applications.selectPartner")}
                                                    defaultItems={itemsPartner}
                                                    onSelectionChange={handlePartnerSelect}
                                                    className="w-1/4"
                                                    variant={variants}
                                                >
                                                    {itemsPartner.map((item) => (
                                                        <AutocompleteItem key={item.value} value={item.value}>{item.Name}</AutocompleteItem>
                                                    ))}
                                                </Autocomplete>
                                            </div>
                                        </div>
                                    </ModalBody>
                                </form>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}


            {formTypeModal === 11 && (
                <>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen " : "lg:pl-72 h-screen w-full",
                            body: "h-full",
                        }}
                        size="full"
                        isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form onSubmit={(e) => handleUpdateApplication(e)}>
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
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" name="Description" value={valuesApplication.Description} onChange={e => setValuesApplication({...valuesApplication, Description: e.target.value})} variant={variant} label={t("applications.description")} />
                                                        <Input type="text" name="Abbreviation" value={valuesApplication.Abbreviation} onChange={e => setValuesApplication({...valuesApplication, Abbreviation: e.target.value})} variant={variant} label={t("applications.abbreviation")} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Autocomplete
                                                            variant={variant}
                                                            label={t("applications.selectCategory")}
                                                            defaultItems={items}
                                                            selectedKey={valuesApplication.CategoryID}
                                                            className="w-1/4"
                                                            onSelectionChange={handleCategorySelectEdit}
                                                        >
                                                            {items.map((item) => (
                                                                <AutocompleteItem key={item.value} value={item.value}>{item.Name}</AutocompleteItem>
                                                            ))}
                                                        </Autocomplete>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Autocomplete
                                                            variant={variant}
                                                            label={t("applications.selectPartner")}
                                                            defaultItems={itemsPartner}
                                                            selectedKey={valuesApplication.PartnerID}
                                                            className="w-1/4"
                                                            onSelectionChange={handlePartnerSelectEdit}
                                                        >
                                                            {itemsPartner.map((item) => (
                                                                <AutocompleteItem key={item.value} value={item.value}>{item.Name}</AutocompleteItem>
                                                            ))}
                                                        </Autocomplete>
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

export default modalApplication;