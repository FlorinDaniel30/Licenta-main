import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profil = await ProfilCurent();
  if (!profil) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      membrii: {
        some: {
          idutilizator: profil.id,
        },
      },
    },
    include: {
      canale: {
        where: {
          nume: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initial = server?.canale[0];

  if (initial?.nume !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initial?.id}`);
};

export default ServerIdPage;
