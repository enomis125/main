
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {

    const users = await prisma.users.findMany({
        include: {
            organizations: {
                select: {
                    name: true
                }
            },
            properties_users: true
        }
    });

    const response = await Promise.all(users.map(async (user) => {
        const userData = {
            userID: user.userID,
            name: user.name,
            lastName: user.name,
            fiscalNumber: user.fiscalNumber,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address1: user.address1,
            address2: user.address2,
            country: user.country,
            district: user.district,
            zipCode: user.zipCode,
            organization: user.organizations.name,
            properties: []
        };

        const propertyIDs = user.properties_users.map(property => property.propertyID);

        console.log(propertyIDs)

        const properties = await prisma.properties.findMany({
            where: {
                propertyID: {
                    in: propertyIDs
                }
            },
            select: {
                name: true
            }
        });

        if (properties.length > 0) {
            userData.properties = properties.map(property => property.name).join(', ');
        }

        return userData;
    }));


    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PUT(request) {

    try {
        const { data } = await request.json();
        const response = await prisma.users.create({
            data: {
                name: data.Name,
                lastName: data.LastName,
                email: data.Email,
                fiscalNumber: parseInt(data.FiscalNumber),
                phoneNumber: parseInt(data.PhoneNumber),
                address1: data.Address1,
                address2: data.Address2,
                country: data.Country,
                district: data.District,
                zipCode: data.ZipCode,
                password: data.Password,
                roleID: parseInt(data.RoleID),
                organizationID: parseInt(data.OrganizationID)
            }
        });

        return new NextResponse(JSON.stringify({ response, status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




