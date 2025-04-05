import { Canal, CanalTip, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "creazaServer"
  | "invita"
  | "editeazaServer"
  | "membrii"
  | "creazaCanal"
  | "parasesteServer"
  | "stergeServer"
  | "stergeCanal"
  | "editeazaCanal"
  | "mesajeFila"
  | "stergeMesaj";

interface ModalData {
  server?: Server;
  canal?: Canal;
  canalTip?: CanalTip;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  tip: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (tip: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  tip: null,
  data: {},
  isOpen: false,
  onOpen: (tip, data = {}) => set({ isOpen: true, tip, data }),
  onClose: () => set({ tip: null, isOpen: false }),
}));
