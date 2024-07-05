
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.application_categories.findMany({
        where: {
            applicationCategoryID: parseInt(id)
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

        const response = await prisma.application_categories.update({
            where: {
                applicationCategoryID: parseInt(id),
            },
            data: {
                name: data.Name
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

        const response = await prisma.application_categories.delete({
            where: {
                applicationCategoryID: parseInt(id),
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {

        if (error.code === 'P2003') {
            return new NextResponse(JSON.stringify({ error: 'Cannot delete category. It is associated with other records.' }), { status: 409 });
        }

        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




