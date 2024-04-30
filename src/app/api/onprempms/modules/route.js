import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(request) {
    try {

        const response = await axios.get('http://172.27.192.9:91/pp_xml_ckit_xmodules')

        // console.log(response.data)


        // const data = response.data;

        for (const item of response.data) {
            await prisma.xmodules.create({
                data: {
                    ID: item.ref,
                    pmsHotel: item.mpehotel,
                    modRef: item.modref,
                    modName: item.modname,
                    generic: item.generic,
                    param1: item.param1,
                    param2: item.param2,
                    param3: item.param3,
                    param4: item.param4,
                    param5: item.param5,
                    license: "" + item.license,
                    startDate: item.startdate,
                    expDate: item.expdate,
                    del: Boolean(item._del),
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