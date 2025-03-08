"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { CanalTip, MembruRol } from "@prisma/client";
import { GitGraph, Plus, Settings } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  rol?: MembruRol;
  sectionType: "channels" | "members";
  CanalTip?: CanalTip;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  rol,
  sectionType,
  CanalTip,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs upppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {rol !== MembruRol.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { CanalTip })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {rol === MembruRol.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
