"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function UserInsert() {

    const [user, setUser] = useState({
        Name: '',
        LastName: '',
        Email: '',
        FiscalNumber: '',
        PhoneNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        Password: '',
        OrganizationID: '',
        RoleID: ''
    });

    const { data: session } = useSession();

    const handleInputUser = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleOrganizationSelect = (selectedOrganization) => {
        setUser({ ...user, OrganizationID: selectedOrganization });
    };

    const handleSubmitUser = (event) => {
        event.preventDefault();

        if (!user.Name || !user.Email || !user.Password || !user.OrganizationID || !user.RoleID) {
            alert("Preencha os campos corretamente");
            return;
        }

        const organizationID = user.OrganizationID || session.user.organization;

        axios.put('/api/hotel/users', {
            data: {
                ...user,
                OrganizationID: organizationID
            }
        })
            .then(response => { console.log(response); window.location.reload(); })
            .catch(err => console.log(err));
    };

    return {
        handleInputUser,
        handleSubmitUser,
        handleOrganizationSelect
    };
}

export function userEdit(userID) {

    const { data: session } = useSession();

    const [valuesUser, setValuesUser] = useState({
        Name: '',
        LastName: '',
        Email: '',
        FiscalNumber: '',
        PhoneNumber: '',
        Address1: '',
        Address2: '',
        Country: '',
        District: '',
        ZipCode: '',
        Password: '',
        RoleID: '',
        OrganizationID: ''
    });

    useEffect(() => {
        axios.get('/api/hotel/users/' + userID)
            .then(res => {
                const userData = res.data.response[0];
                setValuesUser({
                    ...valuesUser,
                    userID: userData.userID,
                    Name: userData.name,
                    LastName: userData.lastName,
                    Email: userData.email,
                    FiscalNumber: userData.fiscalNumber,
                    PhoneNumber: userData.phoneNumber,
                    Address1: userData.address1,
                    Address2: userData.address2,
                    Country: userData.country,
                    District: userData.district,
                    ZipCode: userData.zipCode,
                    Password: userData.password,
                    RoleID: userData.roleID,
                    OrganizationID: userData.organizationID || session.user.organization
                });
            })
            .catch(err => console.log(err));
    }, [userID]);


    const handleOrganizationEdit = (selectedOrganization) => {
        setValuesUser(prevValues => ({
            ...prevValues,
            OrganizationID: selectedOrganization
        }));
    };

    function handleUpdateUser(e) {
        e.preventDefault();

        const organizationID = valuesUser.OrganizationID || session.user.organization;

        axios.patch('/api/hotel/users/' + userID, {
            data: {
                Name: valuesUser.Name,
                LastName: valuesUser.LastName,
                Email: valuesUser.Email,
                FiscalNumber: valuesUser.FiscalNumber,
                PhoneNumber: valuesUser.PhoneNumber,
                Address1: valuesUser.Address1,
                Address2: valuesUser.Address2,
                Country: valuesUser.Country,
                District: valuesUser.District,
                ZipCode: valuesUser.ZipCode,
                Password: valuesUser.Password,
                RoleID: valuesUser.RoleID,
                OrganizationID: organizationID
            }
        })
            .then(response => {
                console.log(response);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return {
        handleUpdateUser,
        setValuesUser,
        handleOrganizationEdit,
        valuesUser
    };
}