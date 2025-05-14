import { ProfilCurent } from "@/lib/profil-curent";
import { db } from "@/lib/database";
import { redirect } from "next/navigation";
import { NavigationAction } from "@/componente/navigation/navigation-action";
import { Separator } from "@/componente/ui/separator";
import { ScrollArea } from "@/componente/ui/scroll-area";
import { NavigationItem } from "@/componente/navigation/navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profil = await ProfilCurent();

  if (!profil) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      membrii: {
        some: {
          idutilizator: profil.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1f0d30] bg-[#b17c1b] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-orange-700 dark:bg-violet-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              nume={server.nume}
              imagineUrl={server.imagineUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
