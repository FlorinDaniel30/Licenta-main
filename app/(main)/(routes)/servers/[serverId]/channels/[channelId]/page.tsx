import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CanalTip } from "@prisma/client";

import { ProfilCurent } from "@/lib/profil-curent";
import { ChatHeader } from "@/componente/chat/chat-header";
import { ChatInput } from "@/componente/chat/chat-input";
import { MesajeChat } from "@/componente/chat/mesaje-chat";
import { MediaRoom } from "@/componente/media-room";
import { db } from "@/lib/db";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    canalId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profil = await ProfilCurent();

  if (!profil) {
    return redirectToSignIn();
  }

  const canal = await db.canal.findUnique({
    where: {
      id: params.canalId,
    },
  });

  const membru = await db.membru.findFirst({
    where: {
      serverId: params.serverId,
      idutilizator: profil.id,
    },
  });

  if (!canal || !membru) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        nume={canal.nume}
        serverId={canal.serverId}
        tip="canal"
      />
      {canal.tip === CanalTip.TEXT && (
        <>
          <MesajeChat
            membru={membru}
            nume={canal.nume}
            chatId={canal.id}
            tip="canal"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: canal.id,
              serverId: canal.serverId,
            }}
            paramKey="canalId"
            paramValue={canal.id}
          />
          <ChatInput
            nume={canal.nume}
            tip="canal"
            apiUrl="/api/socket/messages"
            query={{
              channelId: canal.id,
              serverId: canal.serverId,
            }}
          />
        </>
      )}
      {canal.tip === CanalTip.AUDIO && (
        <MediaRoom chatId={canal.id} video={false} audio={true} />
      )}
      {canal.tip === CanalTip.VIDEO && (
        <MediaRoom chatId={canal.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
