"use server"

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function GET(request) {
    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function POST(request, context) {
    const { data } = await request.json();

    // console.log(data.propertyID)

    // cookies().set('propertyID', data.propertyID)

    const payload = {
        userID: data.userID,
        propertyID: data.propertyID,
        connectionString: data.connectionString
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    cookies().set('jwt', token, {
        domain: '.mypms.pt',
        path: '/',
    });

    return new NextResponse(JSON.stringify({ status: 200 }));
}