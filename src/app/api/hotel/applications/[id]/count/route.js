
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.properties_applications.count({
        where: {
            applicationID: parseInt(id)
        }
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ response: 0, status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}