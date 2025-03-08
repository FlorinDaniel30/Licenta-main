import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: {serverId: string } }
) {
    try{
        const profil = await ProfilCurent();
        const { nume, imagineUrl } = await req.json();

        if (!profil){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where:{
                id:params.serverId,
                idutilizator: profil.id
            },
            data: {
                nume, 
                imagineUrl,
            }
        });

        return NextResponse.json(server);
    } catch (error){
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {serverId: string } }
) {
    try{
        const profil = await ProfilCurent();

        if (!profil){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.delete({
            where:{
                id:params.serverId,
                idutilizator: profil.id
            }
        });

        return NextResponse.json(server);
    } catch (error){
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}