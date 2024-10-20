import React from "react";
import { ScrollArea } from "../ui/scroll-area";

interface ChatMessagesProps {
  messages: string[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView(false);
  };

  React.useEffect(() => {
    scrollToBottom();
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-5">
      <div className="flex flex-col gap-y-3" ref={scrollRef}>
        {messages.map((message, index) => (
          <p
            className={`max-w-[80%] flex rounded-lg p-2 text-sm ${
              index % 2 ? "bg-slate-200" : "self-end bg-blue-200"
            }`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
            dignissimos autem atque numquam praesentium qui? Excepturi deleniti
            odio quos molestiae soluta reiciendis eaque quam ipsum aut corporis!
            Asperiores, repudiandae quibusdam. {message}
          </p>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
