import { db } from "./db";

export const getOrCreateConv = async (membruAid: string, membruBid: string) => {
  let conv =
    (await findConversation(membruAid, membruBid)) ||
    (await findConversation(membruBid, membruAid));

  if (!conv) {
    conv = await createNewConv(membruAid, membruBid);
  }
  return conv;
};

const findConversation = async (membruAid: string, membruBid: string) => {
  try {
    return await db.conversatie.findFirst({
      where: {
        AND: [{ membruAid: membruAid }, { membruBid: membruBid }],
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
  } catch (e) {
    return null;
  }
};

const createNewConv = async (membruAid: string, membruBid: string) => {
  try {
    return await db.conversatie.create({
      data: {
        membruAid,
        membruBid,
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
  } catch (e) {
    return null;
  }
};
