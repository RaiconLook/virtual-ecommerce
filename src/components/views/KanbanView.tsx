"use client";

import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";
import { useState } from "react";

const COLUMNS = ["A Fazer", "Em Progresso", "Revisao", "Concluido"];

export function KanbanView() {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | "all">("all");
  const agentIds = Object.keys(AGENTS) as AgentRole[];

  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-[#5C5C5C]/10">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">Kanban</span>
        <div className="w-px h-4 bg-[#5C5C5C]/20" />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedAgent("all")}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-300 ${selectedAgent === "all" ? "bg-[#FF4D00]/10 text-[#FF4D00]" : "text-[#5C5C5C] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5"}`}
          >
            Todos
          </button>
          {agentIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedAgent(id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-300 ${selectedAgent === id ? "text-[#FF4D00] bg-[#FF4D00]/10" : "text-[#5C5C5C] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5"}`}
            >
              {AGENTS[id].name}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex gap-5 p-6 overflow-x-auto">
        {COLUMNS.map((col, ci) => (
          <div key={col} className="w-72 shrink-0 flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#5C5C5C", "#FF4D00", "#f59e0b", "#22c55e"][ci] }} />
              <span className="text-[12px] font-semibold text-[#0A0A0A]">{col}</span>
              <span className="text-[10px] text-[#5C5C5C] bg-[#F4F4F0] px-2 py-0.5 rounded-full font-mono">0</span>
            </div>
            <div className="flex-1 bg-[#F4F4F0] rounded-xl border border-[#5C5C5C]/10 p-3 space-y-2 transition-all duration-300 hover:border-[#FF4D00]/20">
              <div className="flex items-center justify-center h-24 border border-dashed border-[#5C5C5C]/15 rounded-lg">
                <span className="text-[11px] text-[#5C5C5C]">Arraste tarefas aqui</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
