"use client";

export function TarefasView() {
  return (
    <div className="flex-1 bg-white overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C5C5C]">Tarefas Agendadas</span>
          <div className="flex-1 h-px bg-[#5C5C5C]/10" />
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-[#F4F4F0] text-[11px] font-mono font-medium uppercase tracking-[0.05em] hover:bg-[#FF4D00] transition-all duration-300">
          + Agendar Tarefa
        </button>
      </div>
      <div className="bg-[#F4F4F0] border border-[#5C5C5C]/10 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[#FF4D00]/10 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-[15px] text-[#0A0A0A] font-semibold mb-1">Nenhuma tarefa agendada</p>
        <p className="text-[12px] text-[#5C5C5C]">Agende tarefas recorrentes para seus agentes</p>
      </div>
    </div>
  );
}
