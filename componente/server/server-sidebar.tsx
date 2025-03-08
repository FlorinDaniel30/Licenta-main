import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/db";
import { CanalTip, MembruRol } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
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
  [MembruRol.GUEST]: null,
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
    (membru) => membru.profilId !== profil.id
  );

  if (!server) {
    return redirect("/");
  }
  const rol = server.membrii.find(
    (membru) => membru.profilId === profil.id
  )?.rol;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={rol} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channel",
                tip: "canal",
                data: textChannels?.map((canal) => ({
                  id: canal.id,
                  nume: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Voice Channel",
                tip: "canal",
                data: audioChannels?.map((canal) => ({
                  id: canal.id,
                  nume: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Video Channel",
                tip: "canal",
                data: videoChannels?.map((canal) => ({
                  id: canal.id,
                  name: canal.nume,
                  icon: iconMap[canal.tip],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: membrii?.map((membru) => ({
                  id: membru.id,
                  name: membru.profil.nume,
                  icon: roleIconMap[membru.rol],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              CanalTip={CanalTip.TEXT}
              rol={rol}
              label="Text Channels"
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
              label="Audio Channels"
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
              role={role}
              label="Video Channels"
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                canal={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!membrii?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="members Channels"
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
