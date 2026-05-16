import React from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Message } from "@/app/messages/types";
import Link from "next/link";

interface ChatThreadProps {
  recipient: string;
  chatMessages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: (e?: React.FormEvent) => void;
  onBack: () => void;
}

export function ChatThread({
  recipient,
  chatMessages,
  inputValue,
  setInputValue,
  handleSend,
  onBack
}: ChatThreadProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#09090b] text-zinc-100 flex flex-col font-sans relative">
      <div className="flex-1 flex flex-col h-full w-full max-w-2xl mx-auto border-x border-zinc-800/50">
        <header className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] font-bold shrink-0">
                {recipient.charAt(0)}
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">{recipient}</h1>
                <p className="text-xs text-emerald-500 font-medium">Online</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col min-h-0 bg-[#09090b] no-scrollbar">
          <div className="flex justify-center my-4">
            <span className="text-[10px] font-medium text-zinc-500 bg-[#18181b] px-3 py-1 rounded-full border border-zinc-800/50">
              Today
            </span>
          </div>
          
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
              <div className={`${
                msg.isUser 
                  ? "bg-[#8b5cf6] text-white rounded-2xl rounded-br-sm" 
                  : "bg-[#18181b] text-zinc-100 rounded-2xl rounded-bl-sm border border-zinc-800/50"
                } p-3 px-4 max-w-[80%] text-sm leading-relaxed shadow-sm`}
              >
                {msg.text}
                {msg.link && (
                  <div className="mt-2">
                    <Link 
                      href={msg.link} 
                      className="inline-flex items-center gap-1.5 bg-[#8b5cf6] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#7c3aed] transition-colors"
                    >
                      Go to Wallet
                    </Link>
                  </div>
                )}
                <div className={`text-[10px] ${msg.isUser ? "text-white/70" : "text-zinc-500"} text-right mt-1`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#09090b] border-t border-zinc-800/50">
          <form onSubmit={handleSend} className="bg-[#18181b] rounded-full p-1.5 flex items-center gap-2 border border-zinc-800/50 focus-within:border-[#8b5cf6]/50 transition-colors">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..." 
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-white placeholder:text-zinc-500" 
            />
            <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 bg-[#8b5cf6] disabled:bg-[#8b5cf6]/50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#7c3aed] transition-colors shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
