"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/componente/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DeleteServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, tip, data } = useModal();
  const isModalOpen = isOpen && tip === "stergeServer";
  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Șterge server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Ești sigur că vrei să ștergi? <br />
            <span className="font-semibold text-indigo-500">
              {server?.nume}
            </span>{" "}
            Această acțiune nu poate fi anulată!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Anulează
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirmă
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
