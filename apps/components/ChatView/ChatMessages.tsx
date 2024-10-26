import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import UserQuestions from "./UserQuestions";
import RespondMessages from "./RespondMessages";

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
        {messages.map((message, index) =>
          index % 2 ? (
            <RespondMessages message={message} key={index + message} />
          ) : (
            <UserQuestions message={message} key={index + message} />
          )
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
