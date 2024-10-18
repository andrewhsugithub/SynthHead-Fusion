import ChatView from "@/components/ChatView/ChatView";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";

export default function Home() {
  return (
    <main className="flex">
      <Sidebar />
      <ChatView />
    </main>
  );
}
