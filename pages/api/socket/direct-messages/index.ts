import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";
import { ProfilCurent } from "@/lib/profil-curent-pagini";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await ProfilCurent(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await db.conversatie.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            membruA: {
              profilId: profile.id,
            },
          },
          {
            membruB: {
              profilId: profile.id,
            },
          },
        ],
      },
      include: {
        membruA: {
          include: {
            profil: true,
          },
        },
        membruB: {
          include: {
            profil: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.membru.profileId === profile.id
        ? conversation.membruA
        : conversation.membruB;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.mesajeDirecte.create({
      data: {
        continut,
        filaUrl,
        conversatieId: conversationId as string,
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

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
