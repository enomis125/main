
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"

export async function GET(request, context) {

    const applicationID = request.nextUrl.searchParams.get('application') || "";
    const organizationID = request.nextUrl.searchParams.get('organization') || "";

    const response = await prisma.organizations_applications.findUnique({
        where: {
            organizationID_applicationID: {
                organizationID: parseInt(organizationID),
                applicationID: parseInt(applicationID)
            }
        },
        include: {
            applications: {
                select: {
                    description: true
                }
            }
        }
    })

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PATCH(request, context) {

    try {
        const { data } = await request.json();

        const response = await prisma.organizations_applications.update({
            where: {
                organizationID_applicationID: {
                    organizationID: parseInt(data.organizationID),
                    applicationID: parseInt(data.applicationID)
                }
            },
            data: {
                connectionString: data.connectionString,
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}

export async function PUT(request) {

    try {
        const { data } = await request.json();

        const newOrganizationApplication = await prisma.organizations_applications.create({
            data: {
                organizationID: parseInt(data.organizationID),
                applicationID: parseInt(data.applicationID),
                connectionString: data.connectionString
            }
        });

        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}



