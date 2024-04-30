
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.applications.findMany({
        where: {
            applicationID: parseInt(id)
        }
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

// export async function PATCH(request, context) {

//     try {
//         const { id } = context.params;

//         const response = await prisma.properties_applications.update({
//             where: {
//                 propertyApplicationID: parseInt(id),
//             },
//             data: {
//                 ip: data.ip,
//                 port: data.port,
//                 prefix: parseInt(data.prefix),
//             }
//         })
//         return new NextResponse(JSON.stringify({ status: 200 }));

//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
//     } finally {
//         await prisma.$disconnect();
//     }

// }

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




