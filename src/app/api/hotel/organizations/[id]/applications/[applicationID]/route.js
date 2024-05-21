
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id, applicationID } = context.params;

    const response = await prisma.organizations_applications.findMany({
        where: {
            organizationID: parseInt(id),
            applicationID: parseInt(applicationID)
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
        const { id, applicationID } = context.params;
        const { data } = await request.json();

        console.log(data.connectionString)

        const response = await prisma.organizations_applications.update({
            where: {
                organizationID_applicationID: {
                    organizationID: parseInt(id),
                    applicationID: parseInt(applicationID)
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