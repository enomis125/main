"use client"
import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input
} from "@nextui-org/react";

import axios from "axios";

//icons
import { MdClose } from "react-icons/md";
import { LiaExpandSolid } from "react-icons/lia";
import { useTranslations } from 'next-intl';

const modalfeatures = ({
    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    idProperty,
    idApplication,
    modalEdit
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [featuresFetch, setFeaturesFetched] = useState(false);
    const [features, setFeatures] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [editIp, setEditIp] = useState("");
    const [editPort, setEditPort] = useState("");
    const [editPrefix, setEditPrefix] = useState("");

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const t = useTranslations('Index');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
        if (!featuresFetch) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/properties/` + idProperty + `/applications/` + idApplication);
                const res = await axios.get(`/api/hotel/properties-applications/` + response.data.response.propertyApplicationID);
                setFeatures(res.data.response);
                setFeaturesFetched(true);
            } catch (error) {
                console.error("Erro ao encontrar a propriedades da aplicação:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = (feature) => {
        setSelectedFeature(feature);
        setEditIp(feature.ip);
        setEditPort(feature.port);
        setEditPrefix(feature.prefix);
        onOpen();
    };

    const handleSave = async () => {
        try {

            const updatedFeature = {
                    ip: editIp,
                    port: editPort,
                    prefix: editPrefix
            };

            console.log("aaa", selectedFeature)

            await axios.patch(`/api/hotel/properties-applications/${selectedFeature.propertyApplicationID}`, {
                data: updatedFeature
            });

            setFeatures(features.map(feature => feature.propertyApplicationID === selectedFeature.propertyApplicationID ? { ...feature, ...updatedFeature } : feature));
            

            onOpenChange(false);
        } catch (error) {
            console.error("Erro ao atualizar a propriedade da aplicação:", error.message);
        }
    };

    return (
        <>
            {formTypeModal === 3 && (
                <>
                    <Button
                        onPress={toggleModal}
                        color={buttonColor}
                        className="w-fit"
                    >
                        {buttonName} {buttonIcon}
                    </Button>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: isExpanded
                                ? "w-full h-screen"
                                : "lg:pl-72 h-screen w-full",
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
                                            {modalHeader}{modalEdit}
                                        </div>
                                        <div className="flex flex-row items-center mr-5">
                                            
                                            <Button color="transparent" onClick={toggleExpand}>
                                                <LiaExpandSolid size={30} />
                                            </Button>
                                            <Button color="transparent" onPress={onClose}>
                                                <MdClose size={30} />
                                            </Button>

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
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t("organization.properties.applications.features.datatable.ip")}
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t("organization.properties.applications.features.datatable.port")}
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t("organization.properties.applications.features.datatable.prefix")}
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            {t("organization.properties.applications.features.datatable.actions")}
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {features.map((feature, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {feature.ip}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {feature.port}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {feature.prefix}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button className="bg-transparent" onPress={() => handleEdit(feature)}>Edit</Button>
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit Connection String</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Input
                                            label="IP"
                                            placeholder="IP"
                                            name="ip"
                                            value={editIp}
                                            onChange={(e) => setEditIp(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            label="Port"
                                            placeholder="Enter Port"
                                            name="port"
                                            value={editPort}
                                            onChange={(e) => setEditPort(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            label="Prefix"
                                            placeholder="Enter Prefix"
                                            name="prefix"
                                            value={editPrefix}
                                            onChange={(e) => setEditPrefix(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>Close</Button>
                                <Button onClick={handleSave}>Save</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default modalfeatures;
