"use client";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F4F4F0] flex flex-col items-center justify-center gap-10">
      {/* Logo text like design system */}
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono font-bold text-[28px] tracking-tighter flex items-center gap-1.5">
          <span className="text-[#5C5C5C]">&gt;<span className="animate-pulse">_</span></span>
          <span className="text-[#0A0A0A]">We</span>
          <span className="text-[#FF4D00]">{"{Stack}"}</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">/ escritorio virtual</span>
      </div>

      {/* Loading bar */}
      <div className="w-56 h-[2px] bg-[#5C5C5C]/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FF4D00] rounded-full"
          style={{ animation: "loading-bar 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        />
      </div>

      {/* Grid dots animation like design system */}
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
