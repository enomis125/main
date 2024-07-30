"use server"

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
    const language = cookies().get('language')?.value || 'en';
    return new NextResponse(JSON.stringify({ language, status: 200 }), { status: 200 });
}

export async function POST(request, context) {
    const { data } = await request.json();

    cookies().set('language', data.language)

    return new NextResponse(JSON.stringify({ status: 200 }));
}