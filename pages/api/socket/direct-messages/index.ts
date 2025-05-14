import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/database";
import { ProfilCurent } from "@/lib/profil-curent-pagini";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profil = await ProfilCurent(req);
    const { continut, filaUrl } = req.body;
    const { conversatieId } = req.query;

    if (!profil) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversatieId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!continut) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversatie = await db.conversatie.findFirst({
      where: {
        id: conversatieId as string,
        OR: [
          {
            membruA: {
              idutilizator: profil.id,
            },
          },
          {
            membruB: {
              idutilizator: profil.id,
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
      return res.status(404).json({ message: "Conversation not found" });
    }

    const membru =
      conversatie.membruA.idutilizator === profil.id
        ? conversatie.membruA
        : conversatie.membruB;

    if (!membru) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.mesajeDirecte.create({
      data: {
        continut,
        filaUrl,
        idconversatie: conversatieId as string,
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

    const channelKey = `chat:${conversatieId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
