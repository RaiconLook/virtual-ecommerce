"use client";

import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";

export type AppView = "escritorio" | "painel" | "anuncios" | "campanhas" | "reunioes" | "relatorios";

const NAV_ITEMS: { id: AppView; label: string; icon: string }[] = [
  { id: "escritorio", label: "Escritório", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "painel", label: "Painel", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "anuncios", label: "Anúncios", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { id: "campanhas", label: "Campanhas", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { id: "reunioes", label: "Reuniões", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "relatorios", label: "Relatórios", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const STATUS_COLORS: Record<string, { color: string; label: string }> = {
  online: { color: "#22c55e", label: "Trabalhando" },
  busy: { color: "#22c55e", label: "Trabalhando" },
  away: { color: "#eab308", label: "Ocioso" },
  meeting: { color: "#3b82f6", label: "Em reuniao" },
};

export function LeftSidebar({ activeView, onViewChange }: { activeView: AppView; onViewChange: (v: AppView) => void }) {
  const agents = useOfficeStore((s) => s.agents);

  return (
    <aside className="w-[220px] bg-[#F4F4F0] border-r border-[#5C5C5C]/15 flex flex-col shrink-0 z-50">
      {/* Logo - text based like design system */}
      <div className="h-16 flex items-center px-5 border-b border-[#5C5C5C]/15">
        <span className="font-mono font-bold text-[16px] tracking-tighter flex items-center gap-1">
          <span className="text-[#5C5C5C]">&gt;<span className="animate-pulse">_</span></span>
          <span className="text-[#0A0A0A]">We</span>
          <span className="text-[#FF4D00]">{"{Stack}"}</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 ${
              activeView === item.id
                ? "bg-[#FF4D00]/10 text-[#FF4D00] translate-x-1"
                : "text-[#5C5C5C] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5 hover:translate-x-0.5"
            }`}
          >
            <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Agent Status */}
      <div className="border-t border-[#5C5C5C]/15 px-4 py-4 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C] font-mono font-medium">Agentes</span>
        {(Object.keys(AGENTS) as AgentRole[]).map((id) => {
          const agent = AGENTS[id];
          const state = agents[id];
          const st = STATUS_COLORS[state?.status ?? "away"];
          return (
            <div key={id} className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-[#0A0A0A]/5 transition-all duration-300">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.color, boxShadow: `0 0 8px ${st.color}50` }} />
              <span className="text-[12px] text-[#0A0A0A] flex-1 truncate font-medium">{agent.name}</span>
              <span className="text-[9px] text-[#5C5C5C] font-mono">{st.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
