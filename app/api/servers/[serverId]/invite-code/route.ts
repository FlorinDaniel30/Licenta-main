import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profil = await ProfilCurent();
        if(!profil){
            return new NextResponse("Unauthorized", {status:401});
        }

        if (!params.serverId) {
            return new NextResponse("Server ID Missing", {status: 400});
        }

        const server = await db.server.update({
            where:{
                id: params.serverId,
                idutilizator: profil.id,
            },
            data: {
                codinvitatie: uuidv4(),
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}