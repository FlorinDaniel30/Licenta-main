import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  nume: string;
  tip: "canal" | "conversatie";
}

export const ChatWelcome = ({ nume, tip }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {tip === "canal" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {tip === "canal" ? "welcome to #" : ""}
        {nume}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {tip === "canal"
          ? `This is the conversation in #${nume} channel`
          : `This is the converstaion with ${nume}`}
      </p>
    </div>
  );
};
