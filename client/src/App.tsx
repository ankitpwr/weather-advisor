import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CloudRain, Plus, Send, Loader2, Wind } from "lucide-react";
import ChatMessage from "./components/ChatMessage";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startNewChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const startNewChat = () => {
    setConversationId(crypto.randomUUID());
    setMessages([]);
    setInput("");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userQuery,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/ask`,
        {
          query: userQuery,
          conversationId: conversationId,
        },
      );

      const botReply =
        response.data?.reply ||
        response.data?.message ||
        "I have received your weather query.";

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: botReply,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content:
          "Sorry, I am having trouble connecting to the weather service right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200 font-googleSans overflow-hidden">
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/60 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-400/20 to-blue-600/20 text-sky-400 rounded-xl border border-sky-500/20 shadow-inner">
            <CloudRain size={22} />
          </div>
          <h1 className="font-semibold text-lg text-slate-100 tracking-wide">
            Weather Advisor
          </h1>
        </div>

        <button
          onClick={startNewChat}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-all duration-300 text-slate-200 rounded-lg shadow-sm font-medium text-sm"
        >
          <Plus
            size={16}
            className="text-sky-400 group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </nav>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-700">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full"></div>
                <Wind size={64} className="relative text-slate-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-300 mb-3 tracking-wide">
                How's the weather?
              </h2>
              <p className="max-w-md text-center text-slate-500 leading-relaxed text-[15px]">
                Ask me about current conditions, daily forecasts, or severe
                weather alerts for any location worldwide.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col w-full pb-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex w-full justify-start mb-6">
                  <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                    <Loader2 size={18} className="animate-spin text-sky-400" />
                    <span className="text-[15px] text-slate-400">
                      Checking the skies...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pt-8 pb-6 md:pb-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
          <div className="max-w-4xl mx-auto relative flex items-center group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the weather in London..."
              disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-lg disabled:opacity-50 text-[15px]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 p-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm disabled:shadow-none"
            >
              <Send
                size={18}
                className={input.trim() && !isLoading ? "translate-x-0.5" : ""}
              />
            </button>
          </div>
          <div className="text-center mt-4 text-xs text-slate-600">
            Weather data is provided for informational purposes only.
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
