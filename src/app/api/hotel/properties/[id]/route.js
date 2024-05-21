
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.properties.findUnique({
        where: {
            propertyID: parseInt(id)
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

        const response = await prisma.properties.update({
            where: {
                propertyID: parseInt(id),
            },
            data: {
                name: data.Name,
                email: data.Email,
                fiscalNumber: parseInt(data.FiscalNumber),
                address1: data.Address1,
                country: data.Country,
                district: data.District,
                zipCode: data.ZipCode,
                phoneNumber: data.PhoneNumber,
                description: data.Description,
                abbreviation: data.Abbreviation,
                designation: data.Designation,
                del: data.active
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

        const response = await prisma.properties.delete({
            where: {
                propertyID: parseInt(id),
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




