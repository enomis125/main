
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id, applicationID } = context.params;

    // const propertiesApplications = await prisma.properties_applications.findMany({
    //     where: {
    //         propertyID: parseInt(id),
    //         applicationID: parseInt(applicationID)
    //     },
    // })

    // const usersPropertiesApplications = await prisma.users_properties_applications.findMany({
    //     where: {
    //         propertyApplicationID: {
    //             in: propertiesApplications.map(propertyApplication => propertyApplication.propertyApplicationID)
    //         }
    //     },
    // })

    // const users = await prisma.users.findMany({
    //     where: {
    //         userID: {
    //             in: usersPropertiesApplications.map(userPropertyApplication => userPropertyApplication.userID)
    //         }
    //     },
    // })

    const users = await prisma.users.findMany({
        where: {
            users_properties_applications: {
                some: {
                    properties_applications: {
                        propertyID: parseInt(id),
                        applicationID: parseInt(applicationID)
                    }
                }
            }
        },
        include: {
            users_properties_applications: {
                include: {
                    properties_applications: true
                }
            }
        },
        distinct: ["userID"]
    })

    const response = users.map(user => ({
        id: user.userID,
        name: user.name,
        lastName: user.lastName,
        email: user.email
    }));

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
