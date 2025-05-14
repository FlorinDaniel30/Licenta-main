import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  nume: string;
  tip: "canal" | "conversatie";
  imagineUrl?: string;
}

export const ChatHeader = ({
  serverId,
  nume,
  tip,
  imagineUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-b-2 border-transparent bg-gradient-to-r from-[#f4e2d8] via-[#f1d3c2] to-[#eec6af] dark:from-[#2b1b46] dark:via-[#210247] dark:to-[#220e3a] text-white shadow">
      <MobileToggle serverId={serverId} />

      {tip === "canal" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}

      {tip === "conversatie" && (
        <UserAvatar src={imagineUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}

      <p className="font-semibold text-md dark:text-white">{nume}</p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};
