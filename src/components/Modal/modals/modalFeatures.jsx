"use client"
import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";

import axios from "axios";


//icons
import { MdClose } from "react-icons/md";
import { LiaExpandSolid } from "react-icons/lia";
import { GoGear } from "react-icons/go";
import { FiEdit3, FiCheck } from "react-icons/fi";

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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [featuresFetch, setFeaturesFetched] = useState(false);
    const [features, setFeatures] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
        if (!featuresFetch) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/hotel/properties/` + idProperty + `/applications/` + idApplication)
                console.log(response)
                const res = await axios.get(`/api/hotel/properties-applications/` + response.data.response.propertyApplicationID);
                setFeatures(res.data.response);
                setFeaturesFetched(true);
                console.log(res.data.response)
            } catch (error) {
                console.error("Erro ao encontrar a propriedades da aplicação:", error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const saveChanges = () => {
        // axios.patch(`/api/hotel/properties-applications/` + response.data.response.propertyApplicationID, {
        //     data: {
        //         ip: valuesFeature.Ip,
        //         port: valuesFeature.Port,
        //         prefix: valuesFeature.Prefix,
        //     }
        // })
        // .catch(err => console.log(err))
        setIsEditing(false);
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
                                                            IP
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            PORTA
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            PREFIX
                                                        </TableColumn>
                                                        <TableColumn className="bg-primary-600 text-white font-bold">
                                                            AÇÕES
                                                        </TableColumn>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {features.map((feature, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {isEditing ? (
                                                                        <input
                                                                            type="text"
                                                                            value={feature.ip}
                                                                            onChange={(e) => {
                                                                                const newFeatures = [...features];
                                                                                newFeatures[index].ip = e.target.value;
                                                                                setFeatures(newFeatures);
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        feature.ip
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {isEditing ? (
                                                                        <input
                                                                            type="text"
                                                                            value={feature.port}
                                                                            onChange={(e) => {
                                                                                const newFeatures = [...features];
                                                                                newFeatures[index].port = e.target.value;
                                                                                setFeatures(newFeatures);
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        feature.port
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {isEditing ? (
                                                                        <input
                                                                            type="text"
                                                                            value={feature.prefix}
                                                                            onChange={(e) => {
                                                                                const newFeatures = [...features];
                                                                                newFeatures[index].prefix = e.target.value;
                                                                                setFeatures(newFeatures);
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        feature.prefix
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {isEditing ? (
                                                                        <Button
                                                                            color="transparent"
                                                                            onClick={saveChanges}
                                                                        >
                                                                            <FiCheck size={20} />
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            color="transparent"
                                                                            onClick={toggleEdit}
                                                                        >
                                                                            <FiEdit3 size={20} />
                                                                        </Button>
                                                                    )}
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
export default modalfeatures;