import React from "react";
import { GLOBAL_TITLE } from "@/constants";
import ChatBox from "./ChatBox";
import AvatarButton from "./AvatarButton";

const ChatView = () => {
  return (
    <main className="p-2 w-full h-dvh flex flex-col">
      <div className="py-5 flex flex-row justify-between items-center">
        <h1>{GLOBAL_TITLE}</h1>
        <AvatarButton />
      </div>
      <ChatBox />
    </main>
  );
};

export default ChatView;
