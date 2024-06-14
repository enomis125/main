import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Modal, ModalContent, ModalHeader, Badge, ModalBody, Button, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { MdClose, MdEdit, MdSave } from "react-icons/md";
import { LiaExpandSolid } from "react-icons/lia";
import { FaPlug } from "react-icons/fa";
import { useSession, signOut } from 'next-auth/react';
import { BsArrowRight } from "react-icons/bs";

import FormConnectionString from "@/components/Modal/modals/modalConnectionString"

import {useTranslations} from 'next-intl';


const ModalOrganizationApplication = ({ buttonName, buttonIcon, modalHeader, modalEditArrow, modalEdit, formTypeModal, buttonColor, idOrganization }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isInvisible, setIsInvisible] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertiesCount, setPropertiesCount] = useState([]);
    const t = useTranslations('Index');




    const { data: session, status } = useSession()

    const isAdmin = () => {
        return session?.user?.admin;
    };


    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        const fetchPropertiesCount = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/organizations/${idOrganization}/applications/count`);
                setPropertiesCount(response.data.response);
            } catch (error) {
                console.error("Error fetching properties Count:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPropertiesCount();
    }, [idOrganization]);

    return (
        <>
            {formTypeModal === 1 && (
                <>
                    <Button onPress={toggleModal} color={buttonColor} className="w-fit">
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
                        isOpen={isModalOpen}
                        onOpenChange={toggleModal}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        <div className="flex flex-row justify-start gap-4">
                                            {modalHeader} {modalEditArrow} {modalEdit}
                                        </div>
                                        <div className='flex flex-row items-center mr-5'>
                                            <Button color="transparent" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                            <Button color="transparent" onPress={onClose}><MdClose size={30} /></Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-5 my-5 space-y-8">
                                        {isLoading ? (
                                            <div>{t('general.loadingStatus')}</div>
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
                                                            {t('organization.account.applications.datatable.applicationName')}
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t('organization.account.applications.datatable.details')}
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t('organization.account.applications.datatable.properties')}
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {Object.entries(propertiesCount).map(([applicationName, count], index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{applicationName}</TableCell>
                                                                <TableCell>
                                                                    {isAdmin() ? (
                                                                        <FormConnectionString
                                                                            buttonName={<FaPlug size={20} />}
                                                                            buttonColor={"transparent"}
                                                                            formTypeModal={1}
                                                                            modalHeader={t("allOrganizations.applications.connectionString.modalHeader")}
                                                                            idOrganization={idOrganization}
                                                                            idApplication={applicationName} // Assuming applicationName is the correct ID
                                                                        />
                                                                    ) : (
                                                                        "***"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{count}</TableCell>
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

export default ModalOrganizationApplication;
