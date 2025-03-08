import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const ProfilCurent = async (request: NextApiRequest) => {
  const { userId } = getAuth(request);

  if (!userId) {
    return null;
  }

  const profil = await db.profil.findUnique({
    where: {
      idutilizator:userId,
    },
  });

  return profil;
};
