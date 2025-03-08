import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { Mesaje } from "@prisma/client";
import { NextResponse } from "next/server";

const MESAJE_MAX = 10;

export async function GET(request: Request) {
  try {
    const profil = await ProfilCurent();
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");
    const canalId = searchParams.get("canalId");

    if (!profil) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }
    if (!canalId) {
      return new NextResponse("Channel Id missing!", { status: 400 });
    }

    let mesaje: Mesaje[] = [];
    if (cursor) {
      mesaje = await db.mesaje.findMany({
        take: MESAJE_MAX,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          canalId,
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
      mesaje = await db.mesaje.findMany({
        take: MESAJE_MAX,
        where: {
          canalId,
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
    console.log("[MESSAGES_GET", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
