"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole, ChatMessage } from "@/types";
import { runMeeting } from "@/lib/meeting";

const AGENT_META: Record<string, { color: string }> = {
  ceo: { color: "#6366f1" },
  ads: { color: "#f59e0b" },
  comercial: { color: "#3b82f6" },
  imagen: { color: "#10b981" },
  user: { color: "#5C5C5C" },
};

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const m = AGENT_META[msg.agentId] ?? AGENT_META.user;
  const name = msg.agentId === "user" ? "Voce" : AGENTS[msg.agentId as AgentRole]?.name ?? msg.agentId;

  return (
    <div className="mb-4 animate-in">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: m.color }}>
          {name[0]}
        </div>
        <span className="text-[12px] font-semibold text-[#0A0A0A]">{name}</span>
        <span className="text-[10px] text-[#5C5C5C] font-mono ml-auto">{formatTime(msg.timestamp)}</span>
      </div>
      <div
        className={`ml-8 text-[13px] leading-relaxed p-3 rounded-xl ${
          msg.type === "meeting"
            ? "bg-[#FF4D00]/5 text-[#0A0A0A] border border-[#FF4D00]/15"
            : msg.type === "scope"
            ? "bg-[#3b82f6]/5 text-[#0A0A0A] border border-[#3b82f6]/15"
            : "bg-white text-[#0A0A0A] border border-[#e0e0dc]"
        }`}
        dangerouslySetInnerHTML={{ __html: msg.text }}
      />
    </div>
  );
}

export function Sidebar() {
  const [input, setInput] = useState("");
  const messages = useOfficeStore((s) => s.messages);
  const isMeeting = useOfficeStore((s) => s.isMeeting);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isMeeting) return;
    setInput("");
    useOfficeStore.getState().addMessage({ agentId: "user", text, type: "message" });
    runMeeting(text);
  }, [input, isMeeting]);

  return (
    <aside className="w-[400px] bg-[#F4F4F0] border-l border-[#e0e0dc] flex flex-col shrink-0">
      {/* Header */}
      <div className="h-14 flex items-center px-5 border-b border-[#e0e0dc] gap-3">
        <svg className="w-5 h-5 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-[14px] font-semibold text-[#0A0A0A]">Chat da Equipe</span>
        {isMeeting && (
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4D00]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
            <span className="text-[10px] text-[#FF4D00] font-semibold">Reuniao</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FF4D00]/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#0A0A0A] mb-1">Inicie uma conversa</p>
            <p className="text-[12px] text-[#5C5C5C]">Descreva um projeto e os agentes vao analisar em reuniao</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#e0e0dc] bg-white shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Descreva o projeto para a equipe..."
            disabled={isMeeting}
            className="flex-1 bg-[#F4F4F0] border border-[#e0e0dc] rounded-xl px-4 py-2.5 text-[13px] text-[#0A0A0A] placeholder-[#5C5C5C] outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/10 transition disabled:opacity-30 font-[inherit]"
          />
          <button
            onClick={handleSend}
            disabled={isMeeting || !input.trim()}
            className="bg-[#FF4D00] hover:bg-[#E04400] disabled:opacity-20 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:-translate-y-px active:translate-y-0"
          >
            Enviar
          </button>
        </div>
      </div>
    </aside>
  );
}
