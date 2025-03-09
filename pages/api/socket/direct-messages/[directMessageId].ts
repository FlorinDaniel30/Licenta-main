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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
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

    if (!conversatie) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member =
      conversatie.membruA.profilId === profile.id
        ? conversatie.membruA
        : conversatie.membruB;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let directMessage = await db.mesajeDirecte.findFirst({
      where: {
        id: directMessageId as string,
        conversatieId: conversationId as string,
      },
      include: {
        membru: {
          include: {
            profil: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.membruId === member.id;
    const isAdmin = member.role === MembruRol.ADMIN;
    const isModerator = member.role === MembruRol.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.mesajeDirecte.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          filaUrl: null,
          continut: "This message has been deleted.",
          deleted: true,
        },
        include: {
          membru: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      directMessage = await db.mesajeDirecte.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = `chat:${conversatie.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
