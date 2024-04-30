
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {

    try {
        const organizationID = request.nextUrl.searchParams.get('organization') || "";

        if (organizationID == "") {
            const response = await prisma.roles.findMany()
            return new NextResponse(JSON.stringify({ response, status: 200 }));
        }

        const response = await prisma.roles.findMany({
            where: {
                organizationID: parseInt(organizationID)
            }
        })

        return new NextResponse(JSON.stringify({ response, status: 200 }));
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request) {

    try {
        const { data } = await request.json();
        const response = await prisma.roles.create({
            data: {
                name: data.Name,
                description: data.Description,
            }
        });

        return new NextResponse(JSON.stringify({ response, status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}


export async function PATCH(request) {

    try {
        const { roleID, Name, Description } = await request.json();
        const response = await prisma.roles.update({
            where: {
                roleID: roleID,
            },
            data: {
                name: Name,
                description: Description,
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




