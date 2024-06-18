import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"

export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.organizations.findMany({
        where: {
            organizationID: parseInt(id)
        }
    })

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PATCH(request, context) {

    try {
        const { id } = context.params;
        const { data } = await request.json();

        const activeProperties = await prisma.properties.findMany({
            where: {
                organizationID: parseInt(id),
                del: 0
            }
        })

        if (activeProperties.length > 0) {
            return new NextResponse(JSON.stringify({ error: "You can't archive this organization. There are active properties!" }));
        }

        const response = await prisma.organizations.update({
            where: {
                organizationID: parseInt(id),
            },
            data: {
                name: data.Name,
                email: data.Email,
                fiscalNumber: data.FiscalNumber,
                address1: data.Address1,
                address2: data.Address2,
                phoneNumber: data.PhoneNumber,
                country: data.Country,
                district: data.District,
                zipCode: data.ZipCode,
                del: parseInt(data.active)
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

        const response = await prisma.organizations.delete({
            where: {
                organizationID: parseInt(id),
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}