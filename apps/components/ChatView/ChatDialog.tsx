"use client";

import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "../form/ChatInput";

const ChatDialog = () => {
  const [messages, setMessages] = React.useState<string[]>(
    Array.from({ length: 100 }).map((i) => `\nMessage ${i}`)
  );

  const addMessages = (message: string) => {
    console.log("message", message);
    setMessages((prev) => [...prev, message]);
  };

  return (
    <>
      <ChatMessages messages={messages} />
      <ChatInput addMessage={addMessages} />
    </>
  );
};

export default ChatDialog;
