import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { MesajeDirecte } from "@prisma/client";
import { NextResponse } from "next/server";

const MESAJE_MAX = 10;

export async function GET(request: Request) {
  try {
    const profil = await ProfilCurent();
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");
    const idconversatie = searchParams.get("idconversatie");

    if (!profil) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }
    if (!idconversatie) {
      return new NextResponse("Channel Id missing!", { status: 400 });
    }

    let mesaje: MesajeDirecte[] = [];
    if (cursor) {
      mesaje = await db.mesajeDirecte.findMany({
        take: MESAJE_MAX,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          idconversatie,
        },
        include: {
          membru: {
            include: {
              profil: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      mesaje = await db.mesajeDirecte.findMany({
        take: MESAJE_MAX,
        where: {
          idconversatie,
        },
        include: {
          membru: {
            include: {
              profil: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (mesaje.length === MESAJE_MAX) {
      nextCursor = mesaje[MESAJE_MAX - 1].id;
    }
    return NextResponse.json({
      items: mesaje,
      nextCursor,
    });
  } catch (e) {
    console.log("[DIRECT_MESSAGES_GET", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
