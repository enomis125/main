
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.licenses_onprempms.findMany({
        where: {
            propertyID: parseInt(id)
        },
    })

    // const response = await prisma.licenses.findMany({
    //     where: {
    //         propertyApplicationID: {
    //             in: propertiesApplications.map(propertyApplication => propertyApplication.propertyApplicationID)
    //         }
    //     },
    // })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
