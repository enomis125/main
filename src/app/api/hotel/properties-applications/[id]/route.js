
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.properties_applications.findMany({
        where: {
            propertyApplicationID: parseInt(id)
        }
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PATCH(request, context) {

    try {
        const { id } = context.params;

        const response = await prisma.properties_applications.update({
            where: {
                propertyApplicationID: parseInt(id),
            },
            data: {
                ip: data.ip,
                port: parseInt(data.port),
                prefix: data.prefix,
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}

export async function DELETE(request, context) {

    try {
        const { id } = context.params;

        const propertyApplication = await prisma.properties_applications.delete({
            where: {
                propertyApplicationID: parseInt(id),
            }
        })

        const propertyOrganization = await prisma.properties.findUnique({
            where: {
                propertyID: propertyApplication.propertyID
            }
        })

        const organizationProperties = await prisma.properties.findMany({
            where: {
                organizationID: propertyOrganization.organizationID
            }
        })

        const propertiesApplications = await prisma.properties_applications.findMany({
            where: {
                applicationID: propertyApplication.applicationID,
                propertyID: {
                    in: organizationProperties.map(organizationProperty => organizationProperty.propertyID)
                }
            }
        })

        if (propertiesApplications == "") {
            const organizationApplication = await prisma.organizations_applications.delete({
                where: {
                    organizationID_applicationID: {
                        organizationID: propertyOrganization.organizationID,
                        applicationID: propertyApplication.applicationID
                    }
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




