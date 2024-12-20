﻿"use client";

import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "../form/ChatInput";

const ChatDialog = () => {
  const [messages, setMessages] = React.useState<string[]>([]);

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
