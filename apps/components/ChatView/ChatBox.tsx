"use client";

import React, { useEffect } from "react";
import useChatStore from "@/stores/chat";
import { Button } from "../ui/button";
import useUserStore from "@/stores/userStore";
import { Icon } from "@iconify/react";
import AvatarSettingsForm from "../form/AvatarSettingsForm";
import RegisterForm from "../form/RegisterForm";
import { ModalType, useModalStore } from "@/stores/modalStore";

const ChatBox = () => {
  const [counter, setCounter] = React.useState(0);
  const hasUserLogin = useUserStore((state) => state.hasUserLogin);
  const { chatId, hasCreatedTarget, onCreateTarget } = useChatStore();
  const { activeModal, updateActiveModal } = useModalStore();

  const handleSettingsClick = () => {
    updateActiveModal(ModalType.AVATAR);
  };

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
    <div>
      {hasCreatedTarget ? (
        <div className="flex justify-center items-center gap-x-2">
          <p className="text-center">title:{counter + chatId}</p>
          <div
            className="rounded-lg text-xl hover:bg-gray-200 p-2 hover:cursor-pointer"
            onClick={handleSettingsClick}
          >
            <Icon icon="material-symbols:settings-outline" />
          </div>
          <Button onClick={() => setCounter(counter + 1)}>+1</Button>
        </div>
      ) : (
        <Button onClick={onCreateTarget}>Create Target</Button>
      )}

      <RegisterForm
        isOpen={activeModal === ModalType.USER}
        onClose={() => updateActiveModal(null)}
      />
      <AvatarSettingsForm
        isOpen={activeModal === ModalType.AVATAR}
        onClose={() => updateActiveModal(null)}
      />
    </div>
  );
};

export default ChatBox;
