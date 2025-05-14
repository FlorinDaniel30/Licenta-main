import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { CanalTip, MembruRol } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-sectiune";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [CanalTip.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [CanalTip.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [CanalTip.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MembruRol.INVITAT]: null,
  [MembruRol.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MembruRol.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-red-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profil = await ProfilCurent();

  if (!profil) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      canale: {
        orderBy: {
          createdAt: "asc",
        },
      },
      membrii: {
        include: {
          profil: true,
        },
        orderBy: {
          rol: "asc",
        },
      },
    },
  });

  const textChannels = server?.canale.filter(
    (canal) => canal.tip === CanalTip.TEXT
  );
  const audioChannels = server?.canale.filter(
    (canal) => canal.tip === CanalTip.AUDIO
  );
  const videoChannels = server?.canale.filter(
    (canale) => canale.tip === CanalTip.VIDEO
  );
  const membrii = server?.membrii.filter(
    (membru) => membru.idutilizator !== profil.id
  );

  if (!server) {
    return redirect("/");
  }
  const rol = server.membrii.find(
    (membru) => membru.idutilizator === profil.id
  )?.rol;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#29103a79] bg-[#dbb788]">
      <ServerHeader server={server} role={rol} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Canal Text",
                tip: "canal",
                data: textChannels?.map((canal) => ({
                  id: canal.id,
                  nume: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Canal Vocal",
                tip: "canal",
                data: audioChannels?.map((canal) => ({
                  id: canal.id,
                  nume: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Canal Video",
                tip: "canal",
                data: videoChannels?.map((canal) => ({
                  id: canal.id,
                  nume: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Membrii",
                tip: "membru",
                data: membrii?.map((membru) => ({
                  id: membru.id,
                  nume: membru.profil.nume,
                  icon: roleIconMap[membru.rol],
                })),
              },
            ]}
          />
        </div>
       <Separator className="bg-[#ffb732] dark:bg-[#7e4bd1] rounded-md my-2" />

        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              CanalTip={CanalTip.TEXT}
              rol={rol}
              label="Canale Text"
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                canal={channel}
                rol={rol}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              CanalTip={CanalTip.AUDIO}
              rol={rol}
              label="Canale Audio"
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                canal={channel}
                rol={rol}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              CanalTip={CanalTip.VIDEO}
              rol={rol}
              label="Canale Video"
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                canal={channel}
                rol={rol}
                server={server}
              />
            ))}
          </div>
        )}
        {!!membrii?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              rol={rol}
              label="Membrii"
              server={server}
            />
            {membrii.map((membru) => (
              <ServerMember key={membru.id} membru={membru} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
