import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async(
    {params} : InviteCodePageProps
) => {
    const profil = await ProfilCurent();

    if (!profil){
        return redirectToSignIn();
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