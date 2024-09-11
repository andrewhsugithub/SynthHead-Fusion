"use client";
import React from "react";

interface ChatCardProps {
  title: string;
}

const ChatCard = ({ title }: ChatCardProps) => {
  const handleClick = () => console.log("clicked", title);

  return (
    <div
      className="w-[230px] p-2 text-ellipsis whitespace-nowrap overflow-x-hidden hover:bg-gray-200 hover:rounded-lg hover:cursor-pointer"
      onClick={handleClick}
    >
      {title}
    </div>
  );
};

export default ChatCard;
