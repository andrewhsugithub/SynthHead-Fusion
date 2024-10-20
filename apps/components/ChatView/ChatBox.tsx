"use client";

import React, { useEffect } from "react";
import useChatStore from "@/stores/chat";
import useUserStore from "@/stores/userStore";
import { ModalType, useModalStore } from "@/stores/modalStore";
import OnboardModal from "../Modals/OnboardModal";
import AvatarSettingsModal from "../Modals/AvatarSettingsModal";
import ChatDialog from "./ChatDialog";

const ChatBox = () => {
  const hasUserLogin = useUserStore((state) => state.hasUserLogin);
  const { chatId, hasCreatedTarget, onCreateTarget } = useChatStore();
  const { activeModal, updateActiveModal } = useModalStore();

  // when creating a new chat, check if user is logged in
  useEffect(() => {
    console.log("User logged in");
    if (hasUserLogin) return;
    updateActiveModal(ModalType.USER);
  }, [hasUserLogin]);

  useEffect(() => {
    if (!hasUserLogin) return; // if user is not logged in, don't show the avatar modal yet
    if (hasCreatedTarget) return;
    updateActiveModal(ModalType.AVATAR);
  }, [hasCreatedTarget, hasUserLogin]);

  return (
    <>
      <OnboardModal
        isOpen={activeModal === ModalType.USER}
        onClose={() => updateActiveModal(null)}
      />
      <AvatarSettingsModal
        isOpen={activeModal === ModalType.AVATAR}
        onClose={() => updateActiveModal(null)}
      />
      <ChatDialog />
    </>
  );
};

export default ChatBox;
