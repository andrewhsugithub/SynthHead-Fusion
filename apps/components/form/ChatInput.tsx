﻿"use client";

import { ModalType, useModalStore } from "@/stores/modalStore";
import { protectedAxios } from "@/utils/protectedAxios";
import { Icon } from "@iconify/react";
import { AxiosProgressEvent } from "axios";
import React from "react";
import { Progress } from "../ui/progress";
import { set } from "zod";

interface ChatInputProps {
  addMessage: (message: string) => void;
}

const ChatInput = ({ addMessage }: ChatInputProps) => {
  const inputRef = React.useRef<HTMLDivElement>(null);
  const [loadingPercentage, setLoadingPercentage] = React.useState(0);
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

  const handleSubmitMessage = async () => {
    const message = getFormatMessage();
    if (message.trim() === "") return;
    let respond;
    try {
      addMessage(message);
      respond = await protectedAxios
        .post(
          "/add_message",
          { question: message },
          {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              setLoadingPercentage(
                Math.round((progressEvent.loaded / progressEvent.total!) * 100)
              );
            },
          }
        )
        .catch((e) => {
          console.error(e);
          setLoadingPercentage(0);
          addMessage("Error sending message");
        });
      console.log("respond: ", respond?.data);
      console.log("respond to string: ", JSON.stringify(respond?.data));
      addMessage(`${JSON.stringify(respond?.data)}`);
      setLoadingPercentage(0);
      resetInput();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnterPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmitMessage();
    }
  };

  const handleInputClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await handleSubmitMessage();
  };

  return (
    <form className="relative">
      <button
        type="button"
        className="absolute start-0 bottom-1.5 flex items-center ps-2"
      >
        <div
          className={`rounded-lg text-xl p-2 z-50 hover:bg-gray-200  hover:cursor-pointer ${
            loadingPercentage > 0
              ? "disabled:opacity-50 pointer-events-none"
              : ""
          }`}
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
      <Progress className="-my-1" value={loadingPercentage} />
      <div className="absolute end-1.5 bottom-1.5 flex items-center pe-2">
        <button
          type="submit"
          className="rounded-lg text-xl p-2 z-50 hover:bg-gray-200  hover:cursor-pointer disabled:opacity-50"
          onClick={handleInputClick}
          disabled={loadingPercentage > 0}
        >
          <Icon icon="icon-park-solid:up-c" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
