"use client";

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmijoPickerProps {
  onChange: (value: string) => void;
}
export const EmojiPicker = ({ onChange }: EmijoPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-orange-700 dark:text-violet-400 hover:text-orange-400 dark:hover:text-violet-200 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
