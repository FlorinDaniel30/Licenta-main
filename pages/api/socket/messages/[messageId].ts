import { NextApiRequest } from "next";
import { MembruRol } from "@prisma/client";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { ProfilCurent } from "@/lib/profil-curent-pagini";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await ProfilCurent(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        membrii: {
          some: {
            profilId: profile.id,
          },
        },
      },
      include: {
        membrii: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const canal = await db.canal.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!canal) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const membru = server.membrii.find(
      (membru) => membru.profileId === profile.id
    );

    if (!membru) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.mesaje.findFirst({
      where: {
        id: messageId as string,
        canalId: channelId as string,
      },
      include: {
        membru: {
          include: {
            profil: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.membruId === membru.id;
    const isAdmin = membru.rol === MembruRol.ADMIN;
    const isModerator = membru.rol === MembruRol.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      mesaje = await db.mesaje.update({
        where: {
          id: messageId as string,
        },
        data: {
          filaUrl: null,
          continut: "This message has been deleted.",
          deleted: true,
        },
        include: {
          membru: {
            include: {
              profil: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      mesaje = await db.mesaje.update({
        where: {
          id: messageId as string,
        },
        data: {
          continut,
        },
        include: {
          membru: {
            include: {
              profil: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
