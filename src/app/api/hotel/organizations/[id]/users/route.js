import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"

export async function GET(request, context) {

    const { id } = context.params;

    const users = await prisma.users.findMany({
        where: {
            organizationID: parseInt(id)
        }
    })

    const response = await Promise.all(users.map(async (user) => {
        const userData = {
            id: user.userID,
            name: user.name,
            surname: user.lastName,
            email: user.email,
            role: '',
            properties: []
        }

        const role = await prisma.roles.findUnique({
            where: {
                roleID: user.roleID
            }
        })

        const properties_users = await prisma.properties_users.findMany({
            where: {
                userID: user.userID
            }
        })

        const propertyIDs = properties_users.map(property => property.propertyID);

        const properties = await prisma.properties.findMany({
            where: {
                propertyID: {
                    in: propertyIDs
                }
            }
        });

        if (role) {
            userData.role = role.name;
        }

        if (properties.length > 0) {
            userData.properties = properties.map(property => property.name).join(', ');
        }

        return userData;
    }));

    


    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

