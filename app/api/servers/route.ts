import { v4 as uuidv4 } from "uuid";
import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { MembruRol } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { nume, imagineUrl } = await req.json();
    const profil = await ProfilCurent();

    if (!profil) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Creează serverul
    const server = await db.server.create({
      data: {
        idutilizator: profil.id,
        nume,
        imagineUrl,
        codinvitatie: uuidv4(),
        membrii: {
          create: [
            {
              idutilizator: profil.id,
              rol: MembruRol.ADMIN,
            },
          ],
        },
      },
    });

    // 2. Creează canalul default
    await db.canal.create({
      data: {
        nume: "general",
        idutilizator: profil.id,
        serverId: server.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[Servers_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
