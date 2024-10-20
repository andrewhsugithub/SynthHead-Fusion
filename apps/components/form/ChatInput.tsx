"use client";

import { ModalType, useModalStore } from "@/stores/modalStore";
import { Icon } from "@iconify/react";
import React from "react";

interface ChatInputProps {
  addMessage: (message: string) => void;
}

const ChatInput = ({ addMessage }: ChatInputProps) => {
  const inputRef = React.useRef<HTMLDivElement>(null);
  const updateActiveModal = useModalStore((state) => state.updateActiveModal);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.innerHTML = "";
  };

  const getFormatMessage = () => {
    let message = inputRef.current?.innerText || "";
    return message
      .replace(/<div>|<p>/g, "\n")
      .replace(/<\/div>|<\/p>/g, "")
      .replace(/<br>/g, "\n");
  };

  const handleSettingsClick = () => {
    updateActiveModal(ModalType.AVATAR);
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message = getFormatMessage();
      if (message.trim() === "") return;
      addMessage(message);
      resetInput();
    }
  };

  const handleInputClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const message = getFormatMessage();
    if (message.trim() === "") return;
    addMessage(message);
    resetInput();
  };

  return (
    <form className="relative">
      <button
        type="button"
        className="absolute start-0 bottom-1.5 flex items-center ps-2"
      >
        <div
          className="rounded-lg text-xl p-2 z-50 hover:bg-gray-200  hover:cursor-pointer"
          onClick={handleSettingsClick}
        >
          <Icon icon="material-symbols:settings-outline" />
        </div>
      </button>
      <div
        className="flex items-center min-h-0 max-h-[100px] rounded-lg border border-input bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring py-3 ps-12 pe-12 text-gray-900 overflow-y-auto"
        contentEditable={true}
        onKeyDown={handleEnterPress}
        data-placeholder="Message SynthHead Fusion"
        ref={inputRef}
      ></div>
      <div className="absolute end-1.5 bottom-1.5 flex items-center pe-2">
        <button
          type="submit"
          className="rounded-lg text-xl p-2 z-50 hover:bg-gray-200  hover:cursor-pointer"
          onClick={handleInputClick}
        >
          <Icon icon="icon-park-solid:up-c" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
