"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { MembruRol } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MembruRol
}

export const ServerHeader = ({
    server, role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const isAdmin = role === MembruRol.ADMIN;
    const isModerator = isAdmin || role === MembruRol.MODERATOR;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none" asChild
            >
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-orange-300 dark:border-violet-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition
                text-orange-600 dark:text-purple-100">
  {        server.nume}
            <ChevronDown className="h-5 w-5 ml-auto" />
        </button>

            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-300 space-y-[2px]"
            >
                {isModerator && (
                    <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                                      onClick={() => onOpen("invita", { server })}
                    >
                        Invită Persoane
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("editeazaServer", {server})}>
                        Setări Server
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("membrii", { server })}
                        className="px-3 py-2 text-sm cursor-pointer">
                        Administrare Membri
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("creazaCanal")}
                        className="px-3 py-2 text-sm cursor-pointer">
                        Crează Canal
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("stergeServer", { server } )}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Șterge Server
                        <Trash className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("parasesteServer", { server } )}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Părăsește Server
                        <LogOut className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};