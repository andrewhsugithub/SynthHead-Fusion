"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModalType, useModalStore } from "@/stores/modalStore";
import OnboardModal from "../Modals/OnboardModal";

const AvatarButton = () => {
  const { activeModal, updateActiveModal } = useModalStore();
  const handleClick = () => updateActiveModal(ModalType.USER);

  return (
    <>
      <Avatar className="hover:cursor-pointer" onClick={handleClick}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <OnboardModal
        isOpen={activeModal === ModalType.USER}
        onClose={() => updateActiveModal(null)}
      />
    </>
  );
};

export default AvatarButton;
