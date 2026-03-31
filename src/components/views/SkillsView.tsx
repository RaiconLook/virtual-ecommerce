"use client";

import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";

export function SkillsView() {
  return (
    <div className="flex-1 bg-white overflow-y-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">Skills</span>
        <div className="flex-1 h-px bg-[#5C5C5C]/10" />
      </div>
      <div className="space-y-4">
        {(Object.keys(AGENTS) as AgentRole[]).map((id) => {
          const agent = AGENTS[id];
          return (
            <div key={id} className="bg-[#F4F4F0] border border-[#5C5C5C]/10 rounded-xl p-6 hover:border-[#FF4D00]/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00]">
                    {agent.name[0]}
                  </div>
                  <span className="text-[14px] font-semibold text-[#0A0A0A]">{agent.name}</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-[#F4F4F0] text-[11px] font-mono font-medium uppercase tracking-[0.05em] hover:bg-[#FF4D00] transition-all duration-300">
                  + Nova Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map((s) => (
                  <div key={s} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#5C5C5C]/10 hover:border-[#FF4D00]/30 transition-all duration-300">
                    <span className="text-[11px] text-[#5C5C5C]">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
