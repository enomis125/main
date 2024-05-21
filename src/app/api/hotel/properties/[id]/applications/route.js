
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const propertiesApplications = await prisma.properties_applications.findMany({
        where: {
            propertyID: parseInt(id)
        },
    })

    const response = await prisma.applications.findMany({
        where: {
            id: {
                in: propertiesApplications.map(propertyApplication => propertyApplication.applicationID)
            }
        },
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
