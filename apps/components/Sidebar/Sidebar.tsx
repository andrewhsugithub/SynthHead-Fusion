import React from "react";
import { Icon } from "@iconify/react";
import { GLOBAL_TITLE } from "@/constants";
import ChatList from "../ChatList";
import ChatCard from "../ChatCard";

const Sidebar = () => {
  return (
    <main className="p-2 bg-slate-50 w-[260px] h-screen flex flex-col">
      <div className="px-2 flex flex-row justify-between items-center">
        <div className="rounded-lg text-xl hover:bg-gray-200 p-2 hover:cursor-pointer">
          <Icon icon="akar-icons:panel-left" />
        </div>
        <div className="rounded-lg text-xl hover:bg-gray-200 p-2 hover:cursor-pointer">
          <Icon icon="jam:write" />
        </div>
      </div>
      <h1 className="text-center capitalize">{GLOBAL_TITLE}</h1>
      <ChatCard title={"Daniel"} />
      <ChatList />
    </main>
  );
};

export default Sidebar;
