"use client";

import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "../form/ChatInput";

const ChatDialog = () => {
  const testArray = Array.from({ length: 100 }, (_, i) => i + 1);
  const [messages, setMessages] = React.useState<string[]>(
    // testArray.map((i) => `Message ${i}`)
    []
  );

  const addMessages = (message: string) => {
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
