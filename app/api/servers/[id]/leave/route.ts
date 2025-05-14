import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await ProfilCurent();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.id) {
      return new NextResponse("Bad Request: No serverId present", { status: 400 });
    }

    // 🧠 Verificăm dacă utilizatorul este membru pe acel server și NU este creatorul
    const server = await db.server.findFirst({
      where: {
        id: params.id,
        idutilizator: {
          not: profile.id, // userul să nu fie creatorul serverului
        },
        membrii: {
          some: {
            idutilizator: profile.id,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Server not found or you are not a member", { status: 400 });
    }

    // ✅ Ștergem utilizatorul din membrii
    const updatedServer = await db.server.update({
      where: {
        id: params.id,
      },
      data: {
        membrii: {
          deleteMany: {
            idutilizator: profile.id,
          },
        },
      },
    });

    return NextResponse.json(updatedServer);
  } catch (e) {
    console.log("[SERVER_ID_LEAVE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
