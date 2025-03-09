import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { ProfilCurent } from "@/lib/profil-curent-pagini";

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
    const { serverId, channelId } = request.query;

    if (!profil) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return response.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
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
            profilId: profil.id,
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

    const channel = await db.canal.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return response.status(404).json({ message: "Channel not found" });
    }

    const member = server.membrii.find(
      (membru) => membru.profileId === profil.id
    );

    if (!member) {
      return response.status(404).json({ message: "Member not found" });
    }

    const message = await db.mesaje.create({
      data: {
        continut,
        filaUrl,
        canalId: channelId as string,
        membruId: member.id,
      },
      include: {
        membru: {
          include: {
            profil: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    response?.socket?.server?.io?.emit(channelKey, message);

    return response.status(200).json(message);
  } catch (e) {
    console.log("[MESSAGES_POST]", e);
    return response.status(500).json({ message: "Internal Error" });
  }
}
