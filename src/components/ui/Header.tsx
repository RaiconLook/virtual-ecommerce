"use client";

import { useOfficeStore } from "@/store/useOfficeStore";

export function Header() {
  const isMeeting = useOfficeStore((s) => s.isMeeting);
  const timer = useOfficeStore((s) => s.meetingTimer);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <header className="h-12 bg-[#0a0a10] border-b border-[#1a1a1a] flex items-center px-6 gap-5 shrink-0 z-50">
      <div className="flex items-center gap-2 text-xs text-[#5C5C5C]">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
        4 agentes online
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-[10px] px-2.5 py-1 rounded-md border border-[#1a1a1a] text-[#5C5C5C]">
          Escritorio Virtual IA
        </span>
        {isMeeting && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FF4D00]/10 border border-[#FF4D00]/20">
            <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
            <span className="text-xs text-[#FF4D00] font-medium">Reuniao</span>
            <span className="text-xs text-[#FF6A1A] font-mono font-bold">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
