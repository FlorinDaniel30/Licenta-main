"use client";

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-600 text-white border-none"
      >
        🟠 Soluție de rezervă: Interogare la fiecare 1 secundă
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-white border-none bg-orange-400 dark:bg-violet-400"
    >
      🟢 Live: Actualizări în timp real
    </Badge>
  );
};