import { Canal, CanalTip, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  canal?: Canal;
  CanalTip?: CanalTip;
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
