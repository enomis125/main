import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function PATCH(request, context) {

    try {
        const { id } = context.params;
        const { data } = await request.json();

        const response = await prisma.roles.update({
            where: {
                roleID: parseInt(id),
            },
            data: {
                name: data.name,
                description: data.description
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}


export async function DELETE(request, context) {

    try {
        const { id } = context.params;

        const response = await prisma.roles.delete({
            where: {
                roleID: parseInt(id),
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}