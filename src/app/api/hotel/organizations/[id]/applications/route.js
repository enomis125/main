
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.organizations_applications.findMany({
        where: {
            organizationID: parseInt(id)
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