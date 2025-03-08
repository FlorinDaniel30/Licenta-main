import { ServerSidebar } from "@/componente/server/server-sidebar";
import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string }; 
}) => {
    const profil = await ProfilCurent();
    if(!profil) {
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            membrii: {
                some:{
                    idutilizator: profil.id
                }
            }
        }
    });

    if(!server) {
        return redirect("/");
    }

    return(
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar  serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}  
            </main>
        </div>
    )
}

export default ServerIdLayout;