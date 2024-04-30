
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {

    const response = await prisma.properties_applications.findMany()

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PUT(request) {

    try {
        const { data } = await request.json();
        const newPropertyApplication = await prisma.properties_applications.create({
            data: {
                propertyID: parseInt(data.propertyID),
                applicationID: parseInt(data.applicationID),

            }
        });

        const property = await prisma.properties.findUnique({
            where: {
                propertyID: parseInt(data.propertyID)
            }
        })

        const organizationApplication = await prisma.organizations_applications.findMany({
            where: {
                organizationID: parseInt(property.organizationID),
                applicationID: parseInt(data.applicationID),
            }
        })

        if (organizationApplication == "") {
            const newOrganizationApplication = await prisma.organizations_applications.create({
                data: {
                    organizationID: parseInt(property.organizationID),
                    applicationID: parseInt(data.applicationID),

                }
            });
        }

        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}



