"use client";

import { useRef, useEffect, useState } from "react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole, ChatMessage } from "@/types";

const AGENT_META: Record<string, { color: string; emoji: string }> = {
  ceo: { color: "#FFE600", emoji: "👑" },
  ads: { color: "#3483FA", emoji: "📢" },
  comercial: { color: "#00A650", emoji: "🔍" },
  calls: { color: "#E040FB", emoji: "🎨" },
  imagen: { color: "#E040FB", emoji: "🎨" },
  user: { color: "#5C5C5C", emoji: "👤" },
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function MeetingBubble({ msg, index }: { msg: ChatMessage; index: number }) {
  const meta = AGENT_META[msg.agentId] ?? AGENT_META.user;
  const name = msg.agentId === "user" ? "Você" : AGENTS[msg.agentId as AgentRole]?.name ?? msg.agentId;
  const isSystem = msg.type === "system" || msg.text.includes("━━━");

  if (isSystem) {
    return (
      <div className="animate-fade-up flex justify-center my-4" style={{ animationDelay: `${index * 30}ms` }}>
        <span className="px-4 py-1.5 rounded-full bg-[#FF4D00]/10 text-[#FF4D00] text-[10px] font-mono uppercase tracking-widest font-bold">
          {msg.text.replace(/━/g, "").trim()}
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-up mb-4 group" style={{ animationDelay: `${index * 30}ms` }}>
      {/* Agent header */}
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${meta.color}20`, border: `2px solid ${meta.color}40` }}
        >
          {meta.emoji}
        </div>
        <span className="text-[12px] font-bold" style={{ color: meta.color }}>{name}</span>
        <div className="flex-1" />
        <span className="text-[9px] text-[#5C5C5C]/60 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{formatTime(msg.timestamp)}</span>
      </div>

      {/* Message bubble */}
      <div className="ml-9">
        <div
          className={`text-[12.5px] leading-relaxed p-3.5 rounded-2xl rounded-tl-sm transition-all duration-300 ${
            msg.type === "scope"
              ? "bg-gradient-to-br from-[#FF4D00]/5 to-[#FF4D00]/10 border border-[#FF4D00]/15"
              : "bg-white border border-[#e0e0dc] group-hover:border-[#FF4D00]/20 group-hover:shadow-sm"
          }`}
          dangerouslySetInnerHTML={{ __html: msg.text }}
        />
      </div>
    </div>
  );
}

export function MeetingChat() {
  const messages = useOfficeStore((s) => s.messages);
  const isMeeting = useOfficeStore((s) => s.isMeeting);
  const meetingTimer = useOfficeStore((s) => s.meetingTimer);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const prevMeeting = useRef(false);

  // Abrir quando reunião começa
  useEffect(() => {
    if (isMeeting && !prevMeeting.current) {
      setVisible(true);
      setIsClosing(false);
    }
    // Fechar quando reunião termina
    if (!isMeeting && prevMeeting.current) {
      setIsClosing(true);
      setTimeout(() => {
        setVisible(false);
        setIsClosing(false);
      }, 500);
    }
    prevMeeting.current = isMeeting;
  }, [isMeeting]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  if (!visible) return null;

  const minutes = Math.floor(meetingTimer / 60);
  const seconds = meetingTimer % 60;

  return (
    <aside
      className={`w-[380px] flex flex-col shrink-0 z-30 border-l border-[#e0e0dc] overflow-hidden transition-all duration-500 ${
        isClosing ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
      }`}
      style={{
        background: "linear-gradient(180deg, #FAFAF8 0%, #F4F4F0 100%)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#e0e0dc] bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#FF4D00]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FF4D00] animate-pulse-glow" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#0A0A0A]">Reunião ao Vivo</p>
              <p className="text-[10px] text-[#5C5C5C] font-mono">Agentes em discussão</p>
            </div>
          </div>

          {/* Timer */}
          {meetingTimer > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
              <span className="font-mono text-xs font-bold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        {/* Agent avatars */}
        <div className="flex items-center gap-1.5 mt-3">
          {Object.entries(AGENT_META).filter(([k]) => k !== "user" && k !== "imagen").map(([id, meta]) => (
            <div key={id} className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest" style={{ backgroundColor: `${meta.color}10`, color: meta.color }}>
              <span>{meta.emoji}</span>
              {AGENTS[id as AgentRole]?.name ?? id}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D00]/10 flex items-center justify-center mb-3 animate-pulse">
              <span className="text-xl">🤝</span>
            </div>
            <p className="text-[12px] text-[#5C5C5C]">Aguardando agentes...</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MeetingBubble key={msg.id} msg={msg} index={i} />
        ))}
      </div>

      {/* Footer — status indicator */}
      <div className="px-5 py-3 border-t border-[#e0e0dc] bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {Object.entries(AGENT_META).filter(([k]) => k !== "user" && k !== "imagen").map(([id, meta]) => (
              <div key={id} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px]" style={{ backgroundColor: `${meta.color}30` }}>
                {meta.emoji}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#5C5C5C]">
            {isMeeting ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
                Agentes debatendo...
              </span>
            ) : (
              "Reunião encerrada — relatório gerado"
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
