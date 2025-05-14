"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Membru, MembruRol, Profil } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "@/componente/user-avatar";
import { ActionTooltip } from "@/componente/action-tooltip";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/componente/ui/form";
import { Input } from "@/componente/ui/input";
import { Button } from "@/componente/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  continut: string;
  membru: Membru & {
    profil: Profil;
  };
  timestamp: string;
  filaUrl: string | null;
  deleted: boolean;
  currentMember: Membru;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  INVITAT: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  continut: z.string().min(1),
});

export const ChatItem = ({
  id,
  continut,
  membru,
  timestamp,
  filaUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (membru.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${membru.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      continut: continut,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({ continut });
  }, [continut]);

  const fileType = filaUrl?.split(".").pop();
  const isAdmin = currentMember.rol === MembruRol.ADMIN;
  const isModerator = currentMember.rol === MembruRol.MODERATOR;
  const isOwner = currentMember.id === membru.id;

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !filaUrl;

  const isPDF = fileType === "pdf" && filaUrl;
  const isImage = !isPDF && filaUrl;
  const isContentImage =
    !filaUrl && continut.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isContentPDF = !filaUrl && continut.match(/\.pdf$/i);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={membru.profil.imagineUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {membru.profil.nume}
              </p>
              <ActionTooltip label={membru.rol}>
                {roleIconMap[membru.rol]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {/* Imagine din filaUrl */}
          {isImage && (
            <a
              href={filaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={filaUrl}
                alt={continut}
                fill
                className="object-cover"
              />
            </a>
          )}

          {/* Imagine din continut */}
          {isContentImage && (
            <a
              href={continut}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={continut}
                alt="imagine trimisă"
                fill
                className="object-cover"
              />
            </a>
          )}

          {/* PDF din filaUrl */}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={filaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {/* PDF din continut */}
          {isContentPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={continut}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {/* Text simplu */}
          {!filaUrl && !isContentImage && !isContentPDF && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-neutral-100",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {continut}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-gray-500">
                  (editat)
                </span>
              )}
            </p>
          )}

          {/* Form editare */}
          {!filaUrl && !isContentImage && !isContentPDF && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="continut"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Salvează
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Apasă Escape pentru a anula, Enter pentru a salva
              </span>
            </Form>
          )}
        </div>
      </div>

      {/* Acțiuni editare/ștergere */}
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Editează">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Șterge">
            <Trash
              onClick={() =>
                onOpen("stergeMesaj", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
