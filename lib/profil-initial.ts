import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const utilizator = await currentUser();

  if (!utilizator) {
    return redirectToSignIn();
  }

  const profil = await db.profil.findUnique({
    where: {
        idutilizator: utilizator.id
    }
  });

  if(profil) {
    return profil;
  }

  const profilNou = await db.profil.create({
    data: {
        idutilizator: utilizator.id,
        nume: `${utilizator.firstName} ${utilizator.lastName}`,
        imagineUrl: utilizator.imageUrl,
        email: utilizator.emailAddresses[0].emailAddress
    }
  });

  return profilNou;

};
