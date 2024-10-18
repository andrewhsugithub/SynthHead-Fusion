import React from "react";
import ChatCard from "./ChatCard";
import { ScrollArea } from "./ui/scroll-area";

const ChatList = () => {
  return (
    <ScrollArea className="flex-1">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i}>
          <ChatCard
            title={
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime impedit asperiores nesciunt quos! Commodi fuga animi error molestiae distinctio unde eaque accusantium neque! At eos, maiores eligendi aspernatur laborum culpa."
            }
          />

          <br />
        </div>
      ))}
    </ScrollArea>
  );
};

export default ChatList;
