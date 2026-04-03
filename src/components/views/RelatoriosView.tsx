"use client";

const DAILY_REPORT = {
  date: "03 de Abril, 2026",
  summary: {
    created: 3,
    optimized: 7,
    approved: 8,
    rejected: 2,
    avgMargin: "27%",
    adsActive: 6,
    adsPaused: 1,
  },
};

const DECISIONS = [
  { time: "09:12", agent: "GESTOR ML", color: "#FFE600", action: "Aprovou", detail: "Fone TWS Pro — margem 31% ✅ SEO 92 ✅ 5 imagens ✅", status: "verde" },
  { time: "09:28", agent: "GESTOR ML", color: "#FFE600", action: "Reprovou", detail: "Webcam HD 1080p — margem 8% ❌ abaixo do piso de 15%", status: "vermelho" },
  { time: "10:05", agent: "ANÚNCIOS", color: "#3483FA", action: "Otimizou", detail: "Mouse Gamer RGB — título reescrito, score SEO: 68 → 85", status: "azul" },
  { time: "10:32", agent: "CRIATIVO", color: "#E040FB", action: "Gerou", detail: "5 imagens profissionais para Hub USB-C 7em1 via Nano Banana", status: "roxo" },
  { time: "11:15", agent: "ADS ML", color: "#F97316", action: "Pausou", detail: "Campanha Webcam HD — ACoS 32% acima do limite de 25%", status: "vermelho" },
  { time: "11:40", agent: "ANALISTA", color: "#00A650", action: "Alertou", detail: "Concorrente 'TechBR' baixou Carregador 65W para R$ 79,90 (-20%)", status: "amarelo" },
  { time: "12:00", agent: "GESTOR ML", color: "#FFE600", action: "Aprovou", detail: "Teclado Mecânico 60% — margem 34% ✅ SEO 88 ✅ Ouro ✅", status: "verde" },
  { time: "13:30", agent: "ADS ML", color: "#F97316", action: "Escalou", detail: "Budget Carregador 65W: R$60 → R$80/dia — ROAS 6.2x", status: "verde" },
  { time: "14:15", agent: "ANÚNCIOS", color: "#3483FA", action: "Criou", detail: "Novo anúncio: Cabo USB-C para Lightning 2m — título SEO score 91", status: "azul" },
  { time: "15:00", agent: "GESTOR ML", color: "#FFE600", action: "Aprovou", detail: "3 anúncios otimizados no lote — margem média 28%", status: "verde" },
];

const STATUS_BG: Record<string, string> = {
  verde: "bg-green-50 text-[#00A650]",
  vermelho: "bg-red-50 text-[#DC2626]",
  amarelo: "bg-yellow-50 text-[#CA8A04]",
  azul: "bg-blue-50 text-[#3483FA]",
  roxo: "bg-purple-50 text-[#E040FB]",
};

export function RelatoriosView() {
  const r = DAILY_REPORT.summary;
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Relatório do Dia</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">{DAILY_REPORT.date} — consolidado pelo Gestor ML</p>
      </div>

      {/* Resumo do dia */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">Criados</p>
          <p className="font-display font-bold text-xl text-[#3483FA]">{r.created}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">Otimizados</p>
          <p className="font-display font-bold text-xl text-[#00A650]">{r.optimized}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">Aprovados</p>
          <p className="font-display font-bold text-xl text-[#00A650]">{r.approved}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">Reprovados</p>
          <p className="font-display font-bold text-xl text-[#DC2626]">{r.rejected}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">Margem Média</p>
          <p className="font-display font-bold text-xl text-[#0A0A0A]">{r.avgMargin}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">ADS Ativos</p>
          <p className="font-display font-bold text-xl text-[#F97316]">{r.adsActive}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-3 text-center">
          <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">ADS Pausados</p>
          <p className="font-display font-bold text-xl text-[#DC2626]">{r.adsPaused}</p>
        </div>
      </div>

      {/* Timeline de decisões */}
      <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Timeline de Decisões</h2>
        <div className="space-y-0">
          {DECISIONS.map((d, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-[#5C5C5C]/5 last:border-0">
              <span className="font-mono text-xs text-[#5C5C5C] w-12 shrink-0 pt-0.5">{d.time}</span>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: d.color }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: d.color }}>{d.agent}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest ${STATUS_BG[d.status]}`}>{d.action}</span>
                </div>
                <p className="text-sm text-[#5C5C5C]">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
