
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;
    const { propertyID } = context.params;

    const userPropertiesApplications = await prisma.users_properties_applications.findMany({
        where: {
            userID: parseInt(id)
        }
    })

    const propertiesApplications = await prisma.properties_applications.findMany({
        where: {
            propertyApplicationID: {
                in: userPropertiesApplications.map(propertyApplications => propertyApplications.propertyApplicationID)
            },
            propertyID: parseInt(propertyID)
        }
    })

    const applications = await prisma.applications.findMany({
        where: {
            id: {
                in: propertiesApplications.map(application => application.applicationID)
            }
        }
    });

    const response = applications.map(application => ({
        id: application.id,
        name: application.description
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




