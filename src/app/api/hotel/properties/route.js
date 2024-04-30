
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {

    try {
        const organizationID = request.nextUrl.searchParams.get('organization') || "";

        if (organizationID == "") {
            const properties = await prisma.properties.findMany({
                include: {
                    organizations: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            const response = properties.map(property => {
                const propertyData = {
                    propertyID: property.propertyID,
                    name: property.name,
                    fiscalNumber: property.fiscalNumber,
                    email: property.email,
                    phoneNumber: property.phoneNumber,
                    address1: property.address1,
                    country: property.country,
                    district: property.district,
                    zipCode: property.zipCode,
                    description: property.description,
                    designation: property.designation,
                    abbreviation: property.abbreviation,
                    del: property.del,
                    organization: property.organizations ? property.organizations.name : ""
                };

                return propertyData;
            });

            return new NextResponse(JSON.stringify({ response, status: 200 }));
        }

        const response = await prisma.properties.findMany({
            where: {
                organizationID: parseInt(organizationID)
            }
        })

        return new NextResponse(JSON.stringify({ response, status: 200 }));
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request) {

    try {
        const { data } = await request.json();
        const response = await prisma.properties.create({
            data: {
                name: data.Name,
                email: data.Email,
                fiscalNumber: parseInt(data.FiscalNumber),
                address1: data.Address1,
                country: data.Country,
                district: data.District,
                zipCode: data.ZipCode,
                phoneNumber: data.PhoneNumber,
                description: data.Description,
                abbreviation: data.Abbreviation,
                designation: data.Designation,
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

/*
export async function PATCH(request) {

    const prisma = new PrismaClient()

    try {
        const { idCarateristics, Description, Abreviature, Details } = await request.json();
        const updateRecord = await prisma.characteristics.update({
            where: {
                characteristicID: idCarateristics,
            },
            data: {
                description: Description,
                abreviature: Abreviature,
                details: Details
            }
        })
        return new NextResponse(JSON.stringify({status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
*/



