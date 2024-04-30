import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"

export async function GET(request) {

    const organizations = await prisma.organizations.findMany()

    const response = await Promise.all(organizations.map(async (organization) => {
        const organizationData = {
            organizationID: organization.organizationID,
            name: organization.name,
            fiscalNumber: organization.fiscalNumber,
            email: organization.email,
            phoneNumber: organization.phoneNumber,
            address1: organization.address1,
            address2: organization.address2,
            country: organization.country,
            district: organization.district,
            zipCode: organization.zipCode,
            del: organization.del,
            properties: 0,
            users: 0
        }

        const properties = await prisma.properties.count({
            where: {
                organizationID: organization.organizationID
            }
        })

        const users = await prisma.users.count({
            where: {
                organizationID: organization.organizationID
            }
        })

        if (properties) {
            organizationData.properties = properties;
        }

        if (users) {
            organizationData.users = users;
        }

        return organizationData;
    }));

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PUT(request) {

    try {
        const { data } = await request.json();
        const response = await prisma.organizations.create({
            data: {
                name: data.name,
                fiscalNumber: data.fiscalNumber,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address1: data.address1,
                address2: data.address2,
                country: data.country,
                district: data.district,
                zipCode: data.zipCode
            }
        });

        return new NextResponse(JSON.stringify({ response, status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}