
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const userPropertiesApplications = await prisma.users_properties_applications.findMany({
        where: {
            userID: parseInt(id)
        }
    })

    const properties_applications = await prisma.properties_applications.findMany({
        where: {
            propertyApplicationID: {
                in: userPropertiesApplications.map(userPropertyApplication => userPropertyApplication.propertyApplicationID)
            }
        },
    })

    const properties = await prisma.properties.findMany({
        where: {
            propertyID: {
                in: properties_applications.map(propertyApplication => propertyApplication.propertyID)
            }
        },
    })

    const response = properties.map(property => ({
        id: property.propertyID,
        name: property.name
    }));


    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

// export async function DELETE(request, context) {

//     try {
//         const { id } = context.params;

//         const response = await prisma.properties_applications.delete({
//             where: {
//                 propertyApplicationID: parseInt(id),
//             }
//         })
//         return new NextResponse(JSON.stringify({ status: 200 }));

//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
//     } finally {
//         await prisma.$disconnect();
//     }
// }




