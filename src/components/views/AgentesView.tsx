"use client";

import { AGENTS } from "@/lib/constants";
import { useOfficeStore } from "@/store/useOfficeStore";
import type { AgentRole } from "@/types";

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  online: { color: "#22c55e", label: "Trabalhando" },
  busy: { color: "#22c55e", label: "Trabalhando" },
  away: { color: "#eab308", label: "Ocioso" },
  meeting: { color: "#3b82f6", label: "Em reuniao" },
};

export function AgentesView() {
  const agents = useOfficeStore((s) => s.agents);

  return (
    <div className="flex-1 bg-white overflow-y-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">Agentes</span>
        <div className="flex-1 h-px bg-[#5C5C5C]/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(Object.keys(AGENTS) as AgentRole[]).map((id) => {
          const agent = AGENTS[id];
          const state = agents[id];
          const st = STATUS_MAP[state?.status ?? "away"];
          return (
            <div key={id} className="bg-[#F4F4F0] border border-[#5C5C5C]/10 rounded-xl p-6 hover:border-[#FF4D00]/30 hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00]">
                  {agent.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[#0A0A0A]">{agent.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: st.color + "15" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                      <span className="text-[9px] font-mono font-medium" style={{ color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#5C5C5C] mt-0.5">{agent.title}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C] font-mono">Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {agent.skills.map((s) => (
                    <span key={s} className="text-[10px] px-2.5 py-1 rounded-md bg-white border border-[#5C5C5C]/10 text-[#5C5C5C] hover:border-[#FF4D00]/30 hover:text-[#FF4D00] transition-all duration-300">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
