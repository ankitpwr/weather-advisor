import React from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6 group`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] gap-4 rounded-2xl p-4 transition-all duration-300 ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm shadow-md shadow-sky-900/20"
            : "bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-200 rounded-bl-sm shadow-sm"
        }`}
      >
        {!isUser && (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-sky-400 shadow-inner">
            <Bot size={16} />
          </div>
        )}

        <div className="flex flex-col justify-center overflow-hidden">
          <p className="leading-relaxed whitespace-pre-wrap break-words text-[15px] tracking-wide">
            {content}
          </p>
        </div>

        {isUser && (
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-800 border border-sky-500 text-sky-100 shadow-inner">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
