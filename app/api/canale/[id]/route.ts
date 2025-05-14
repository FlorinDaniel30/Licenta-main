import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { MembruRol } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profil = await ProfilCurent();
    if (!profil) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }
    if (!params.id) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        membrii: {
          some: {
            idutilizator: profil.id,
            rol: {
              in: [MembruRol.ADMIN, MembruRol.MODERATOR],
            },
          },
        },
      },
      data: {
        canale: {
          delete: {
            id: params.id,
            nume: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("[CHANNEL_ID_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profil = await ProfilCurent();
    if (!profil) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { nume, tip } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }
    if (!params.id) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }
    if (nume === "general") {
      return new NextResponse('Name cannot be "general"', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        membrii: {
          some: {
            idutilizator: profil.id,
            rol: {
              in: [MembruRol.ADMIN, MembruRol.MODERATOR],
            },
          },
        },
      },
      data: {
        canale: {
          update: {
            where: {
              id: params.id,
              NOT: {
                nume: "general",
              },
            },
            data: {
              nume,
              tip,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("[CHANNEL_ID_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
