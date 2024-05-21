import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.users.findMany({
        where: {
            userID: parseInt(id)
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
        const { data } = await request.json();

        const updateRecord = await prisma.users.update({
            where: {
                userID: parseInt(id),
            },
            data: {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                fiscalNumber: parseInt(data.fiscalNumber),
                phoneNumber: parseInt(data.phoneNumber),
                address1: data.address1,
                address2: data.address2,
                country: data.country,
                district: data.district,
                zipCode: data.zipCode,
                password: data.password,
                roleID: parseInt(data.roleID)
            }
        })
        return new NextResponse(JSON.stringify({ updateRecord, status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request, context) {

    try {
        const { id } = context.params;

        const response = await prisma.users.delete({
            where: {
                userID: parseInt(id),
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




