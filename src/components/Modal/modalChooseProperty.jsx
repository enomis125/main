"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"
import {
    Modal, ModalContent, ModalHeader, ModalBody,
    Button,
    useDisclosure,
    Card, CardHeader,
    Image
} from "@nextui-org/react";

import axios from 'axios';
import { useRouter } from "next/navigation";



//icons

import { MdClose } from "react-icons/md";



const modalchooseproperty = ({

    buttonName,
    buttonIcon,
    modalHeader,
    formTypeModal,
    buttonColor,
    idProperty,
    onClickCallback
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: session, status } = useSession()
    const [apps, setApps] = useState([])
    const router = useRouter(); // Inicialize o useRouter



    useEffect(() => {
        const getData = async () => {
            if (status !== "loading") {
                try {
                    const response = await axios.get(`/api/hotel/users/` + session.user.id + `/properties/` + idProperty + `/applications`)
                    setApps(response.data.response)
                    console.log(response)
                } catch (error) {
                    console.error("Erro ao encontrar as aplicações associadas à aplicação:", error.message);
                }
            }
        };
        getData();
    }, [session]);

    const handleCookies = async (propertyID, application) => {

        if (application == 5) {
            const res = await axios.get(`/api/hotel/organizations/` + session.user.organization + `/applications/` + application)

            const connectionString = res.data.response[0].connectionString
            const userID = session.user.id

            const setCookie = await axios.post(`/api/cookies`, {
                data: {
                    userID: userID,
                    propertyID: propertyID,
                    connectionString: connectionString
                }
            })

            window.location.assign("http://213.146.218.25")
        }

    }


    return (
        <>
            {formTypeModal === 10 && (
                <>
                    <Button onPress={() => {
                        onOpen(); // Abre o modal
                    }} className="w-44 h-44 flex flex-col justify-center items-center border-4  bg-white border-green-600">
                        {buttonName}
                        <Image src="/images/hotel.png" alt="Descrição da imagem" className="w-20 h-20 mt-1.5" />
                        {buttonIcon}
                    </Button>
                    <Modal
                        classNames={{
                            base: "max-h-screen",
                            wrapper: "w-full h-screen",
                            body: "h-full ",
                        }}
                        size="full"
                        hideCloseButton="true"
                        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                        {modalHeader}
                                        <div className="flex flex-row items-center mr-5">
                                            <Button
                                                color="transparent"
                                                variant="light"
                                                onPress={onClose}
                                            >
                                                <MdClose size={30} />
                                            </Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col mx-10 my-5">
                                        {apps.map((application, index) => (
                                            <a
                                                key={index}
                                                href="/homepage"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent default link behavior
                                                    handleCookies(idProperty, application.id)
                                                    onClose(); // Close the modal
                                                }}
                                            >
                                                <Card className="w-44 h-44 flex flex-col justify-center items-center border-4 border-green-600 ml-auto mr-auto mt-16">
                                                    <CardHeader className="flex flex-col items-center justify-center">
                                                        <p>{application.name}</p>
                                                        <Image
                                                            className="w-20 h-20 mt-2"
                                                            src="/images/Logo-Login.png"
                                                        />
                                                    </CardHeader>
                                                </Card>
                                            </a>
                                        ))}
                                    </ModalBody>
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

export default modalchooseproperty;
