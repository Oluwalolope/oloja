"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatThread } from "@/components/messages/ChatThread";
import { ChatList } from "@/components/messages/ChatList";
import { Chat, Message } from "./types";
import { MenuDrawer } from "@/components/dashboard/MenuDrawer";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#09090b]"></div>}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const recipient = searchParams.get("recipient");
  const job = searchParams.get("job");
  const date = searchParams.get("date");

  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [allChats, setAllChats] = useState<Chat[]>([]);

  // Load all chats for list view
  useEffect(() => {
    if (!recipient) {
      const savedChatsStr = localStorage.getItem("oloja_chats");
      if (savedChatsStr) {
        try {
          const parsed = JSON.parse(savedChatsStr) as Chat[];
          parsed.sort((a, b) => b.lastUpdated - a.lastUpdated);
          setAllChats(parsed);
        } catch (e) {
          console.error("Failed to parse chats", e);
        }
      }
    }
  }, [recipient]);

  // Load or initialize specific chat thread
  useEffect(() => {
    if (recipient) {
      const savedChatsStr = localStorage.getItem("oloja_chats");
      let savedChats: Chat[] = [];
      try {
        if (savedChatsStr) savedChats = JSON.parse(savedChatsStr);
      } catch (e) {}

      const existingChat = savedChats.find(c => c.id === recipient);

      if (existingChat) {
        if (existingChat.unread) {
          existingChat.unread = false;
          localStorage.setItem("oloja_chats", JSON.stringify(savedChats));
        }
        setChatMessages(existingChat.messages);
      } else {
        const newMessages = [{
          text: `Hi, I am interested in the ${job || 'job'} you posted on ${date || 'recent date'}.`,
          time: "Just now",
          isUser: true
        }];
        setChatMessages(newMessages);

        const newChat: Chat = {
          id: recipient,
          recipientName: recipient,
          jobTitle: job || 'Job',
          messages: newMessages,
          unread: false,
          lastUpdated: Date.now()
        };
        savedChats.push(newChat);
        localStorage.setItem("oloja_chats", JSON.stringify(savedChats));

        // Auto-reply after 1.5s
        setTimeout(() => {
          setChatMessages(prev => {
            const updatedMsgs = [
              ...prev,
              {
                text: "[Automated Message] Thanks for your interest! We have received your message and will review your profile. We will get back to you shortly.",
                time: "Just now",
                isUser: false
              },
              {
                text: "Great news! We have reviewed your profile and agreed to hire you for this job.",
                time: "Just now",
                isUser: false
              },
              {
                text: "Please proceed to secure the payment and link it to your wallet.",
                time: "Just now",
                isUser: false,
                link: "/wallet"
              }
            ];
            
            const currentChatsStr = localStorage.getItem("oloja_chats");
            if (currentChatsStr) {
              const currentChats: Chat[] = JSON.parse(currentChatsStr);
              const chatIdx = currentChats.findIndex(c => c.id === recipient);
              if (chatIdx >= 0) {
                currentChats[chatIdx].messages = updatedMsgs;
                currentChats[chatIdx].unread = true;
                currentChats[chatIdx].lastUpdated = Date.now();
                localStorage.setItem("oloja_chats", JSON.stringify(currentChats));
              }
            }
            return updatedMsgs;
          });
        }, 1500);
      }
    }
  }, [recipient, job, date]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !recipient) return;
    
    const newMessage = { text: inputValue.trim(), time: "Just now", isUser: true };
    setChatMessages(prev => {
      const updated = [...prev, newMessage];
      
      const chatsStr = localStorage.getItem("oloja_chats");
      if (chatsStr) {
        const chats: Chat[] = JSON.parse(chatsStr);
        const chatIdx = chats.findIndex(c => c.id === recipient);
        if (chatIdx >= 0) {
          chats[chatIdx].messages = updated;
          chats[chatIdx].lastUpdated = Date.now();
          localStorage.setItem("oloja_chats", JSON.stringify(chats));
        }
      }
      return updated;
    });
    setInputValue("");
  };

  const handleMarkAllRead = () => {
    const updated = allChats.map(c => ({ ...c, unread: false }));
    setAllChats(updated);
    localStorage.setItem("oloja_chats", JSON.stringify(updated));
  };

  if (recipient) {
    return (
      <ChatThread 
        recipient={recipient}
        chatMessages={chatMessages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        onBack={() => router.push('/messages')}
      />
    );
  }

  return (
    <>
      <ChatList 
        allChats={allChats}
        filter={filter}
        setFilter={setFilter}
        handleMarkAllRead={handleMarkAllRead}
        onOpenMenu={() => setIsMenuOpen(true)}
        onChatClick={(id, title) => router.push(`/messages?recipient=${encodeURIComponent(id)}&job=${encodeURIComponent(title)}`)}
      />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}