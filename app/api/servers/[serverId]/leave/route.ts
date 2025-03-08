import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: {serverId: string} }
) {
    try {
        const profile = await ProfilCurent();
        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!params.serverId){
            return new NextResponse("Bad Request: No serverId present", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                idutilizator: {
                    not: profile.id
                },
                membrii: {
                    some: {
                        idutilizator: profile.id
                    }
                }
            },
            data: {
                membrii: {
                    deleteMany: {
                        idutilizator: profile.id
                    }
                }
            }
        });
        return NextResponse.json(server);
    } catch(e){
        console.log("[SERVER_ID_LEAVE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}