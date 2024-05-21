import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(request) {
    try {

        const response = await axios.get('http://172.27.192.9:91/pp_xml_ckit_mpegroup')

        // console.log(response.data)


        // const data = response.data;

        for (const item of response.data) {
            await prisma.pmsgroup.create({
                data: {
                    pmsg: item.ref,
                    name: item.groupname,
                    abbreviature: item.groupref
                }

            })
            // console.log(item)
        }

        console.log('Dados inseridos com sucesso.');

        return new NextResponse(JSON.stringify({ status: 200 }));
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
        return new NextResponse(JSON.stringify({ status: 404 }));
    } finally {
        await prisma.$disconnect();
    }
}