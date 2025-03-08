import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const ProfilCurent = async () => {
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