import React from "react";
import { useState } from "react";
import {
    Input,
    Divider,
    Autocomplete,
    AutocompleteItem,
    Avatar,
    Button,
    Image,
    Link,
} from "@nextui-org/react";

const Contact = () => {
    const variants = ["underlined"];

    const Distritos = [
        { label: "Viana do Castelo", value: "VianadoCastelo", description: "" },
        { label: "Braga", value: "Braga", description: "" },
        { label: "Porto", value: "Porto", description: "" },
        { label: "Vila Real", value: "VilaReal", description: "" },
        { label: "Viseu", value: "Viseu", description: "" },
        { label: "Aveiro", value: "Aveiro", description: "" },
        { label: "Guarda", value: "Guarda", description: "" }
    ];

    return (
        <div style={{ backgroundColor: "#f7f7f7", maxWidth: "1000px", height: "80vh", borderRadius: "20px", overflow: "hidden", marginTop: "80px", boxShadow: "0px 0px 10px rgba(2, 2, 2, 0.3)"}} className="container mx-auto flex flex-row justify-center items-center">
            <div className="w-1/2 p-4">
                <div className="max-w-lg mx-auto px-4 py-8">
                    <div className="flex flex-col gap-2 mb-4">
                        <p style={{fontWeight: "bold", fontSize: "25px", textAlign:"center", marginBottom:"20px"}}>Sign Up</p>
                        {variants.map((variant) => (
                            <div key={variant} className="flex w-full flex-wrap gap-2">
                                <div className="flex-1">
                                    <Input type="First Name" variant={variant} label="First Name" size="sm" />
                                </div>
                                <div className="flex-1">
                                    <Input type="Last Name" variant={variant} label="Last Name" size="sm" />
                                </div>
                            </div>
                    ))}
                </div>
            <div className="flex flex-col gap-2 mb-4">
                {variants.map((variant) => (
                    <div key={variant} className="flex w-full flex-wrap gap-2">
                        <Input type="Email Adress" variant={variant} label="Email Adress" size="sm" />
                        <Input type="Phone Number" variant={variant} label="Phone Number" size="sm" />
                        <Input type="Password" variant={variant} label="Password" size="sm" />
                    </div>
                ))}
            </div>

            <Divider className="my-4 horizontal" />

            <div className="flex flex-col gap-2">
                {variants.map((variant) => (
                    <div key={variant} className="flex w-full flex-wrap gap-2">
                        <Input type="Adress 1" variant={variant} label="Adress 1" size="sm" />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 mb-4">
                {variants.map((variant) => (
                    <div key={variant} className="flex w-full flex-wrap gap-2">
                        <Input type="Adress 2" variant={variant} label="Adress 2" size="sm" />
                    </div>
                ))}
            </div>
            <div className="w-full">
                <div className="max-w-2xl flex flex-row gap-4 my-4 mr-8">
                    <Autocomplete
                        label="Select country"
                    >
                        <AutocompleteItem
                            key="Portugal"
                            startContent={<Avatar alt="Portugal" className="w-6 h-6" src="https://flagcdn.com/pt.svg" />}
                        >
                            Portugal
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="brazil"
                            startContent={<Avatar alt="Brazil" className="w-6 h-6" src="https://flagcdn.com/br.svg" />}
                        >
                            Brazil
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="switzerland"
                            startContent={
                                <Avatar alt="Switzerland" className="w-6 h-6" src="https://flagcdn.com/ch.svg" />
                            }
                        >
                            Switzerland
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="germany"
                            startContent={<Avatar alt="Germany" className="w-6 h-6" src="https://flagcdn.com/de.svg" />}
                        >
                            Germany
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="spain"
                            startContent={<Avatar alt="Spain" className="w-6 h-6" src="https://flagcdn.com/es.svg" />}
                        >
                            Spain
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="france"
                            startContent={<Avatar alt="France" className="w-6 h-6" src="https://flagcdn.com/fr.svg" />}
                        >
                            France
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="italy"
                            startContent={<Avatar alt="Italy" className="w-6 h-6" src="https://flagcdn.com/it.svg" />}
                        >
                            Italy
                        </AutocompleteItem>
                        <AutocompleteItem
                            key="mexico"
                            startContent={<Avatar alt="Mexico" className="w-6 h-6" src="https://flagcdn.com/mx.svg" />}
                        >
                            Mexico
                        </AutocompleteItem>
                    </Autocomplete>
                    {variants.map((variant) => (
                        <div key={variant} className=" max-w-xl flex flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Autocomplete
                                variant="outlined"
                                defaultItems={Distritos}
                                label="Distrito"
                                className="max-w-lg"
                            >
                                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {variants.map((variant) => (
                    <div key={variant} className="flex w-full flex-wrap gap-2">
                        <Input type="City" variant={variant} label="City" size="sm" />
                        <Input type="Zip Code" variant={variant} label="Zip Code" size="sm" />
                    </div>
                ))}
            </div>

                    
            <Divider className="my-4 horizontal" />
            
            <div className="flex gap-4 items-center">  
                <Button size="lg" color="primary">
                    Register
                </Button>   
            </div>
            
        </div>
    </div>
    <Divider  orientation="vertical"/>
    <div className="w-1/2 mt-4 text-center">
                <Image src="/images/Logo-Login.png" width={500} height={300} alt="Your Image" />
                <p>If you already have an account? <Link href="#"> Try this! </Link>
</p>
            </div>
</div>
    );
};

export default Contact