import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { ProfilCurent } from "@/lib/profil-curent-pagini";
import { Membru } from "@prisma/client";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponseServerIo
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profil = await ProfilCurent(request);
    const { continut, filaUrl } = request.body;
    const { serverId, canalId } = request.query;

    if (!profil) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return response.status(400).json({ error: "Server ID missing" });
    }

    if (!canalId) {
      return response.status(400).json({ error: "Channel ID missing" });
    }

    if (!continut) {
      return response.status(400).json({ error: "Content missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        membrii: {
          some: {
            idutilizator: profil.id,
          },
        },
      },
      include: {
        membrii: true,
      },
    });

    if (!server) {
      return response.status(404).json({ message: "Server not found" });
    }

    const canal = await db.canal.findFirst({
      where: {
        id: canalId as string,
        serverId: serverId as string,
      },
    });

    if (!canal) {
      return response.status(404).json({ message: "Channel not found" });
    }

    const membru = server.membrii.find(
      (membru) => membru.idutilizator === profil.id
    );

    if (!membru) {
      return response.status(404).json({ message: "Member not found" });
    }

    const message = await db.mesaje.create({
      data: {
        continut,
        filaUrl,
        canalId: canalId as string,
        membruId: membru.id,
      },
      include: {
        membru: {
          include: {
            profil: true,
          },
        },
      },
    });

    const channelKey = `chat:${canalId}:messages`;

    response?.socket?.server?.io?.emit(channelKey, message);

    return response.status(200).json(message);
  } catch (e) {
    console.log("[MESSAGES_POST]", e);
    return response.status(500).json({ message: "Internal Error" });
  }
}
