
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"

export async function GET(request) {
    const propertyID = request.nextUrl.searchParams.get('property') || "";
    const applicationID = request.nextUrl.searchParams.get('application') || "";

    if (propertyID === "" && applicationID === "") {
        const response = await prisma.properties_users.findMany();
        await prisma.$disconnect();
        return new NextResponse(JSON.stringify({ response, status: 200 }));
    }

    const propertyUsers = await prisma.properties_users.findMany({
        where: {
            propertyID: parseInt(propertyID),
        },
        include: {
            users: {
                select: {
                    userID: true,
                    name: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    const propertyUserIDs = propertyUsers.map((propertyUser) => propertyUser.userID);

    if (!applicationID) {
        await prisma.$disconnect();
        const users = propertyUsers.map((propertyUser) => propertyUser.user);
        return new NextResponse(JSON.stringify({ response: users, status: 200 }));
    }

    const propertyApplication = await prisma.properties_applications.findUnique({
        where: {
            propertyID_applicationID: {
                propertyID: parseInt(propertyID),
                applicationID: parseInt(applicationID)
            }
        }
    });

    if (!propertyApplication) {
        await prisma.$disconnect();
        return new NextResponse(JSON.stringify({ response: [], status: 200 }));
    }

    const propertyApplicationUsers = await prisma.users_properties_applications.findMany({
        where: {
            propertyApplicationID: propertyApplication.propertyApplicationID
        }
    });

    const propertyApplicationUserIDs = propertyApplicationUsers.map((propertyApplicationUser) => propertyApplicationUser.userID);

    const usersNotInPropertySoftware = propertyUsers
        .filter((propertyUser) => !propertyApplicationUserIDs.includes(propertyUser.userID))
        .map((propertyUser) => propertyUser.users);

    await prisma.$disconnect();

    return new NextResponse(JSON.stringify({ response: usersNotInPropertySoftware, status: 200 }));
}


export async function PUT(request) {
    try {
        const { dataToSave } = await request.json();

        const propertyID = dataToSave[0].idProperty;
        const applicationID = dataToSave[0].idApplication;

        const propertyApplication = await prisma.properties_applications.findUnique({
            where: {
                propertyID_applicationID: {
                    propertyID,
                    applicationID
                }
            }
        });

        if (!propertyApplication) {
            throw new Error('Property application not found');
        }

        const createData = dataToSave.map(item => ({
            userID: item.userID,
            propertyApplicationID: propertyApplication.propertyApplicationID
        }));

        const response = await prisma.users_properties_applications.createMany({
            data: createData
        });

        if (dataToSave[0].idApplication == 1) {

            const property = await prisma.properties.findUnique({
                where: {
                    propertyID: parseInt(propertyID)
                }
            })

            const organizationApplication = await prisma.organizations_applications.findUnique({
                where: {
                    organizationID_applicationID: {
                        organizationID: parseInt(property.organizationID),
                        applicationID: parseInt(applicationID)
                    }
                }
            })

            const usersIDS = dataToSave.map(item => ({
                userID: item.userID
            }))

            const ids = usersIDS.map(user => user.userID);

            const users = await prisma.users.findMany({
                where: {
                    userID: {
                        in: ids
                    }
                }
            })

            const newSysPMSUsers = axios.put(process.env.PMS_IP + "/api/v1/sysMain/users", {
                data: {
                    connectionString: organizationApplication.connectionString,
                    users: users
                }
            })

        }

        return new NextResponse(JSON.stringify({ response, status: 200 }), { status: 200 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request, context) {

    try {
        const { data } = await request.json();

        const propertyApplication = await prisma.properties_applications.findUnique({
            where: {
                propertyID_applicationID: {
                    propertyID: data.propertyID,
                    applicationID: data.applicationID
                }
            }
        })

        const response = await prisma.users_properties_applications.delete({
            where: {
                propertyApplicationID_userID: {
                    propertyApplicationID: propertyApplication.propertyApplicationID,
                    userID: data.userID
                }
            }
        })

        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




