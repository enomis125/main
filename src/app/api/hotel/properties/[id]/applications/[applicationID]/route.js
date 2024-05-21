
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id, applicationID } = context.params;

    const response = await prisma.properties_applications.findUnique({
        where: {
            propertyID_applicationID: {
                propertyID: parseInt(id),
                applicationID: parseInt(applicationID)
            }
        }
    });

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
