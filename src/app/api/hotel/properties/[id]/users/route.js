
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const propertiesUsers = await prisma.properties_users.findMany({
        where: {
            propertyID: parseInt(id)
        },
    })

    const users = await prisma.users.findMany({
        where: {
            userID: {
                in: propertiesUsers.map(propertiesUsers => propertiesUsers.userID)
            }
        },
    })

    const response = await Promise.all(users.map(async (user) => {
        const userData = {
            id: user.userID,
            name: user.name,
            surname: user.lastName,
            email: user.email,
            role: ''
        };

        const role = await prisma.roles.findUnique({
            where: {
                roleID: user.roleID
            }
        });

        if (role) {
            userData.role = role.name;
        }

        return userData;
    }));

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}
