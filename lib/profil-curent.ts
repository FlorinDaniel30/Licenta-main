import { auth } from "@clerk/nextjs";
import { db } from "@/lib/database";
import { Profil } from "@prisma/client";

export const ProfilCurent = async (): Promise<Profil | null> => {
    const { userId } = auth();

    if (!userId) {
        return null;
    }

    const profil = await db.profil.findUnique({
        where: {
            idutilizator: userId
        }
    });
    
    return profil;
}