"use client";

import { useProgress } from "@react-three/drei";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const pct = Math.round(progress);

  // Esconde quando carregou 100% ou não está mais ativo
  if (!active && progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F4F4F0] flex flex-col items-center justify-center gap-8 transition-opacity duration-500"
      style={{ opacity: pct >= 100 ? 0 : 1, pointerEvents: pct >= 100 ? "none" : "auto" }}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono font-bold text-[28px] tracking-tighter flex items-center gap-1.5">
          <span className="text-[#5C5C5C]">&gt;<span className="animate-pulse">_</span></span>
          <span className="text-[#0A0A0A]">We</span>
          <span className="text-[#FF4D00]">{"{Stack}"}</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">/ escritório virtual ML</span>
      </div>

      {/* Progress bar real */}
      <div className="w-56 flex flex-col items-center gap-2">
        <div className="w-full h-[2px] bg-[#5C5C5C]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#FF4D00] rounded-full transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[10px] text-[#5C5C5C]">{pct}%</span>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, rgba(92,92,92,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(92,92,92,0.08) 1px, transparent 1px)",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 70%)",
        }}
      />
    </div>
  );
}
