
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {
    const propertyID = request.nextUrl.searchParams.get('propertyID') || "";
    const applicationID = request.nextUrl.searchParams.get('applicationID') || "";

    if (propertyID == "" && applicationID == "") {
        const response = await prisma.properties_applications.findMany()

        prisma.$disconnect()

        return new NextResponse(JSON.stringify({ response, status: 200 }));

    }

    const response = await prisma.properties_applications.findUnique({
        where: {
            propertyID_applicationID: {
                propertyID: parseInt(propertyID),
                applicationID: parseInt(applicationID)
            }
        }
    })

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

        const organizationApplication = await prisma.organizations_applications.findUnique({
            where: {
                organizationID_applicationID: {
                    organizationID: parseInt(property.organizationID),
                    applicationID: parseInt(data.applicationID)
                }

            }
        })

        if (organizationApplication == null) {
            const newOrganizationApplication = await prisma.organizations_applications.create({
                data: {
                    organizationID: parseInt(property.organizationID),
                    applicationID: parseInt(data.applicationID),

                }
            });
        }

        if (data.applicationID == 1) {
            const organizationApplication = await prisma.organizations_applications.findUnique({
                where: {
                    organizationID_applicationID: {
                        organizationID: parseInt(property.organizationID),
                        applicationID: parseInt(data.applicationID)
                    }
                }
            })

            const newSysPMSProperty = axios.put("http://127.0.0.1:60123/api/v1/sysMain/properties", {
                data: {
                    connectionString: organizationApplication.connectionString,
                    property: property
                }
            })

        }

        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}



