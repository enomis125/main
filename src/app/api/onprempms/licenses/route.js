import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(request) {
    try {

        const response = await axios.get('http://172.27.192.9:91/pp_xml_ckit_lizenz')

        // console.log(response.data)


        // const data = response.data;

        for (const item of response.data) {
            await prisma.licenses_onprempms.create({
                data: {
                    pmsh: item.mpehotel,
                    pmsg: item.mpegroup,
                    pmsLic: item.mpelic,
                    pmsHq: item.mpehq,
                    pmsHqcl: item.mpehqcl,
                    pmsPool: item.mpepool,
                    demoID: item.demo,
                    smartLicid: item.smartlic,
                    smartOption: item.smartopt,
                    customerId: item.kdnr,
                    lang: item.lang,
                    license: item.lizenz,
                    hotel: item.hotel,
                    abbreviation: item.short,
                    homepage: item.homepage,
                    dealerName: item.haendler,
                    hotelnum: item.hotelno,
                    hotelnum2: item.hotelno2,
                    startDate: item.start,
                    expiryDate: item.ablauf,
                    numOfRooms: item.zimmer,
                    workstationId: item.work_id,
                    code: item.code,
                    locationRef: item.location,
                    roomTypeColor: item.rtcolor,
                    hotelTypeRef: item.type,
                    class0Ref: item.class0,
                    class1Ref: item.class1,
                    class2Ref: item.class2,
                    class3Ref: item.class3,
                    class4Ref: item.class4,
                    inet: item.inet,
                    deletionMark: item._del,
                    propertyID: 1

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