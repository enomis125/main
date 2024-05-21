
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const properties = await prisma.properties.findMany({
        where: {
            organizationID: parseInt(id)
        },
    })

    const response = await prisma.licenses_onprempms.findMany({
        where: {
            propertyID: {
                in: properties.map(property => property.propertyID)
            }
        },
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
