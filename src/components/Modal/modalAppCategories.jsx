"use client"
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";

import axios from 'axios';


//icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";

import  AppCategoriesInsert, { AppCategoriesEdit } from "../functionsForm/applicationCategories/page";

import { useTranslations } from 'next-intl';


const modalAppCategory = ({
    AppCategoryID,
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    editIcon,
    modalEditArrow,
    modalEdit,
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

    const { handleInputAppCategory, handleSubmitAppCategory } = AppCategoriesInsert();
    const { handleUpdateAppCategory, setValuesAppCategory, valuesAppCategory } = AppCategoriesEdit(AppCategoryID);

    return (
        <>
            {formTypeModal === 10 && ( 
                <>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                            body: "h-full ",
                        }}
                        size="full"
                        hideCloseButton="true"
                        isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            
                            {(onClose) => (
                                <>
                                    <form onSubmit={handleSubmitAppCategory}>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                            {modalHeader}
                                            <div className='flex flex-row items-center mr-5'>
                                                <Button color="transparent" type="submit"><TfiSave size={25} /></Button>
                                                <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                                <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                            <div className="w-1/2 flex flex-col gap-4">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant}
                                                        className="flex w-1/2 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                                                    >
                                                        <Input type="text" name="Name" onChange={handleInputAppCategory} variant={variant} label={t("profiles.users.nameLabel")} />
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


            {formTypeModal === 11 && ( // edit
                <>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded ? "w-full h-screen " : "lg:pl-72 h-screen w-full",
                            body: "h-full ",
                        }}
                        size="full"
                        isOpen={isOpen} onOpenChange={onClose} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form onSubmit={(e) => handleUpdateAppCategory(e)}>
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
                                            <div className="w-full flex flex-col gap-2">
                                                {variants.map((variant) => (
                                                    <div key={variant} className="flex w-1/2 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                                        <Input type="text" name="Name" value={valuesAppCategory.Name} onChange={e => setValuesAppCategory({ ...valuesAppCategory, Name: e.target.value })} variant={variant} label={t("profiles.users.nameLabel")} />
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

export default modalAppCategory;