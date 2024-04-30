
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const properties = await prisma.properties.findMany({
        where: {
            organizationID: parseInt(id)
        }
    })

    const propertiesApplications = await prisma.properties_applications.findMany({
        where: {
            propertyID: {
                in: properties.map(property => property.propertyID)
            }
        },
    })

    const applications = await prisma.applications.findMany();

    const applicationNames = {};
    applications.forEach(application => {
        applicationNames[application.id] = application.description;
    });

    const countsByName = {};
    propertiesApplications.forEach(item => {
        const { applicationID } = item;
        const applicationName = applicationNames[applicationID];

        countsByName[applicationName] = (countsByName[applicationName] || 0) + 1;
    });

    const response = countsByName

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}