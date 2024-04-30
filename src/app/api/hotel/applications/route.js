
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"


export async function GET(request) {

    const response = await prisma.applications.findMany()

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

// export async function PUT(request) {

//     try {
//         const { data } = await request.json();
//         const response = await prisma.properties_applications.create({
//             data: {
//                 propertyID: parseInt(data.propertyID),
//                 applicationID: parseInt(data.applicationID),

//             }
//         });

//         return new NextResponse(JSON.stringify({ response, status: 200 }));

//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
//     } finally {
//         await prisma.$disconnect();
//     }
// }



