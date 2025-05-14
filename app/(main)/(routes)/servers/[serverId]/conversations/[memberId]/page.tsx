import { ChatHeader } from "@/componente/chat/chat-header";
import { ChatInput } from "@/componente/chat/chat-input";
import { MesajeChat } from "@/componente/chat/mesaje-chat";
import { getOrCreateConv } from "@/lib/conversatii";
import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MembruIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage = async ({ params }: MembruIdPageProps) => {
  const profil = await ProfilCurent();

  if (!profil) {
    return redirectToSignIn();
  }
  const currentMember = await db.membru.findFirst({
    where: {
      serverId: params.serverId,
      idutilizator: profil.id,
    },
    include: {
      profil: true,
    },
  });
  console.log(currentMember)

  if (!currentMember) {
    console.log("nu am current member")
    return redirect("/");
  }
console.log(params)
  const conv = await getOrCreateConv(currentMember.id, params.memberId);

 console.log(conv) 

  if (!conv) {
   console.log("!convvvv")
    return redirect(`/servers/${params.serverId}`);
  }

  const { membruA, membruB } = conv;
  const otherMember = membruA.idutilizator === profil.id ? membruB : membruA;
  console.log("return")

  return (
    <div className="bg-white dark:bg-[#25262a] flex flex-col h-full">
      <ChatHeader
        imagineUrl={otherMember.profil.imagineUrl}
        nume={otherMember.profil.nume}
        serverId={params.serverId}
        tip="conversatie"
      />
      <MesajeChat
        membru={currentMember}
        nume={otherMember.profil.nume}
        chatId={conv.id}
        tip="conversatie"
        apiUrl="/api/direct-messages"
        paramKey="idconversatie"
        paramValue={conv.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          idconversatie: conv.id,
        }}
      />
      <ChatInput
        nume={otherMember.profil.nume}
        tip="conversatie"
        apiUrl="/api/socket/direct-messages"
        query={{
          idconversatie: conv.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
