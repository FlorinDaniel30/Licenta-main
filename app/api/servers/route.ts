import { v4 as uuidv4 } from "uuid";
import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MembruRol } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profil = await ProfilCurent();

    if (!profil) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
        data:{
            idutilizator: profil.id,
            nume:name,
            imagineUrl:imageUrl,
            codinvitatie: uuidv4(),
            canale: {
                create:[
                    { nume: "general", idutilizator: profil.id }
                ]
            },
            membrii: {
                create: [
                    { idutilizator: profil.id, rol: MembruRol.ADMIN }
                ]
            }
        }
    });
    
    return NextResponse.json(server);
  } catch (error) {
    console.log("[Servers_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
