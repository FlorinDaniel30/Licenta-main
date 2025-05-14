"use client";

import { CreazaServerModal } from "../modals/creaza-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "../modals/invitatie-modal";
import { EditServerModal } from "../modals/editeaza-server-modal";
import { MembersModal } from "../modals/membru-modal";
import { CreazaCanalModal } from "../modals/creaza-canal-modal";
import { LeaveServerModal } from "../modals/paraseste-server-modal";
import { DeleteServerModal } from "../modals/sterge-server-modal";
import { DeleteChannelModal } from "../modals/sterge-canal-modal";
import { EditChannelModal } from "../modals/editeaza-canal-modal";
import { MessageFileModal } from "../modals/mesaje-file-modal";
import { DeleteMessageModal } from "../modals/sterge-mesaj-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreazaServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreazaCanalModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};
