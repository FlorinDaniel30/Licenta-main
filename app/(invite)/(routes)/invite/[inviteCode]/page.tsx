import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async({ params }: InviteCodePageProps) => {
    const profil = await ProfilCurent();

    
    if (!profil) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUrl = `${origin}/sign-in?redirect_url=/invite/${params.inviteCode}`;

  return redirect(redirectUrl);
}

    

    if (!params.inviteCode){
        return redirect("/");
    }


    const existingServer = await db.server.findFirst({
        where:{
            codinvitatie: params.inviteCode,
            membrii: {
                some: {
                    idutilizator: profil.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            codinvitatie: params.inviteCode,
        },
        data: {
            membrii: {
                create: [
                    {
                        idutilizator: profil.id,
                    }
                ]
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return null;
}
 
export default InviteCodePage;