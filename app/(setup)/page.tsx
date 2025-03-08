import { initialProfile } from "@/lib/profil-initial";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/componente/modals/initial-modal";

const SetupPage = async () => {
    const profil = await initialProfile();
    const server = await db.server.findFirst({
        where: {
            membrii: {
                some: {
                    idutilizator: profil.id
                }
            }
        }
    });

    if(server) {
        return redirect(`/servers/${server.id}`)
    }

    return ( 
        <InitialModal />
     );
}
 
export default SetupPage;