import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { MembruRol } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const profil = await ProfilCurent();
        const { nume, tip } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
        if(!profil){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!serverId){
            return new NextResponse("Bad request: No server id present", { status: 400 });
        }
        if(nume === 'general'){
            return new NextResponse("Name can't be general", { status: 400 }); // daca da bypass cineva la frontend
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                membrii: {
                    some: {
                        idutilizator: profil.id,
                        rol: {
                            in: [MembruRol.ADMIN, MembruRol.MODERATOR]
                        }
                    }
                }
            },
            data: {
                canale: {
                    create: {
                        idutilizator: profil.id,
                        nume, 
                        tip 
                    }
                }
            }
        });
        return NextResponse.json(server);
    } catch (e) {
        console.log("Channls_post", e);
        return new NextResponse("Internal Error", {status: 500});
    }
}