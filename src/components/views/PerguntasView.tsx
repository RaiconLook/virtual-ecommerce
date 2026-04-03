"use client";

const QUESTIONS = [
  { id: "Q001", product: "Fone Bluetooth TWS Pro 5.3", question: "Esse fone é compatível com iPhone 15?", answer: "Sim! O fone TWS Pro 5.3 é compatível com todos os iPhones via Bluetooth 5.3, incluindo o iPhone 15. Conexão automática e estável.", buyer: "comprador_ml_2847", time: "3 min", status: "respondida", agent: "SAC" },
  { id: "Q002", product: "Mouse Gamer RGB 12000 DPI", question: "Qual o tamanho do mouse? Tenho mão grande", answer: "O mouse mede 12,5cm x 7cm x 4cm. É tamanho médio/grande, ideal para mãos médias a grandes. Grip ergonômico lateral.", buyer: "joao_tech99", time: "7 min", status: "respondida", agent: "SAC" },
  { id: "Q003", product: "Teclado Mecânico 60% Hot Swap", question: "Aceita switch Gateron?", answer: "Sim! O teclado é hot swap 3 e 5 pinos, compatível com Gateron, Cherry MX, Akko e todos os switches MX-style. Troca sem solda.", buyer: "mech_keys_br", time: "2 min", status: "respondida", agent: "SAC" },
  { id: "Q004", product: "Hub USB-C 7 em 1 HDMI 4K", question: "Funciona com MacBook Air M2?", answer: "", buyer: "designer_sp", time: "agora", status: "pendente", agent: "" },
  { id: "Q005", product: "Carregador Turbo 65W GaN", question: "Carrega notebook Dell Inspiron?", answer: "Sim! O carregador 65W GaN com USB-C PD é compatível com notebooks Dell Inspiron que suportam carregamento USB-C PD. Verifique se seu modelo tem porta USB-C PD.", buyer: "carlos_rj", time: "12 min", status: "respondida", agent: "SAC" },
  { id: "Q006", product: "Webcam Full HD 1080p", question: "Tem tripé incluso?", answer: "", buyer: "home_office_22", time: "5 min", status: "pendente", agent: "" },
  { id: "Q007", product: "Fone Bluetooth TWS Pro 5.3", question: "Quanto tempo dura a bateria?", answer: "O fone dura até 6h de uso contínuo. Com o case de carregamento, são 30h no total. Carregamento rápido: 10 min = 1h de uso.", buyer: "music_lover", time: "15 min", status: "respondida", agent: "SAC" },
  { id: "Q008", product: "Teclado Mecânico 60% Hot Swap", question: "Vem com keycaps PBT ou ABS?", answer: "Vem com keycaps PBT double-shot, mais duráveis e com textura melhor que ABS. Perfil Cherry. Legendas não desbotam.", buyer: "setup_gamer", time: "8 min", status: "respondida", agent: "SAC" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  respondida: { label: "Respondida", color: "#00A650", bg: "bg-green-50" },
  pendente: { label: "Pendente", color: "#CA8A04", bg: "bg-yellow-50" },
};

export function PerguntasView() {
  const respondidas = QUESTIONS.filter(q => q.status === "respondida").length;
  const pendentes = QUESTIONS.filter(q => q.status === "pendente").length;
  const tempoMedio = "6 min";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Perguntas & Respostas</h1>
          <p className="text-sm text-[#5C5C5C] mt-1">Respondidas automaticamente pelo agente SAC — em tempo real</p>
        </div>
        <div className="flex gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 bg-green-50 text-[#00A650] border border-green-200 rounded">{respondidas} Respondidas</span>
          <span className="px-3 py-1.5 bg-yellow-50 text-[#CA8A04] border border-yellow-200 rounded">{pendentes} Pendentes</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Total Hoje</p>
          <p className="font-display font-bold text-2xl text-[#0A0A0A] mt-1">{QUESTIONS.length}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Respondidas</p>
          <p className="font-display font-bold text-2xl text-[#00A650] mt-1">{respondidas}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Pendentes</p>
          <p className="font-display font-bold text-2xl text-[#CA8A04] mt-1">{pendentes}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Tempo Médio</p>
          <p className="font-display font-bold text-2xl text-[#FF4D00] mt-1">{tempoMedio}</p>
        </div>
      </div>

      {/* Lista de perguntas */}
      <div className="space-y-3">
        {QUESTIONS.map((q) => {
          const st = STATUS_MAP[q.status];
          return (
            <div key={q.id} className="bg-white border border-[#5C5C5C]/10 rounded-lg p-5 hover:border-[#FF4D00]/30 transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest ${st.bg}`} style={{ color: st.color }}>{st.label}</span>
                    <span className="font-mono text-[10px] text-[#5C5C5C]">{q.time} atrás</span>
                    {q.agent && <span className="font-mono text-[10px] text-[#3483FA]">por {q.agent}</span>}
                  </div>
                  <p className="text-xs text-[#5C5C5C] font-mono">{q.product}</p>
                </div>
                <span className="font-mono text-[10px] text-[#5C5C5C]">{q.buyer}</span>
              </div>

              {/* Pergunta */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#5C5C5C]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#5C5C5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-[#0A0A0A] font-medium">{q.question}</p>
              </div>

              {/* Resposta */}
              {q.answer ? (
                <div className="flex items-start gap-3 ml-9 pl-3 border-l-2 border-[#00A650]/30">
                  <p className="text-sm text-[#5C5C5C]">{q.answer}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-9 pl-3 border-l-2 border-[#CA8A04]/30">
                  <div className="w-2 h-2 rounded-full bg-[#CA8A04] animate-pulse" />
                  <p className="text-xs text-[#CA8A04] font-mono italic">SAC processando resposta...</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
