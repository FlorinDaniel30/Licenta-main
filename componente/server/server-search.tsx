"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput,
  CommandItem,
  CommandList
} from "@/componente/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    tip: "canal" | "membru",
    data: {
      icon: React.ReactNode;
      nume: string;
      id: string;
    }[] | undefined
  }[]
}

export const ServerSearch = ({
  data
}: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down)
  }, []);

  const onClick = ({ id, tip }: { id: string, tip: "canal" | "membru"}) => {
    setOpen(false);

    if (tip === "membru") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }

    if (tip === "canal") {
      return router.push(`/servers/${params?.serverId}/canale/${id}`)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
        >
          Search
        </p>
        <kbd
          className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>
            No Results found
          </CommandEmpty>
          {data.map(({ label, tip, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                  {data?.map(({ id, icon, nume }) => {
                    return (
                      <CommandItem key={id} onSelect={() => onClick({ id, tip })}>
                        {icon}
                        <span>{nume}</span>
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}