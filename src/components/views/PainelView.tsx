"use client";

const METRICS = [
  { label: "Vendas Hoje", value: "47", change: "+12%", positive: true, icon: "📦" },
  { label: "Faturamento", value: "R$ 8.340", change: "+8%", positive: true, icon: "💰" },
  { label: "Visitas", value: "2.847", change: "+15%", positive: true, icon: "👁" },
  { label: "Conversão", value: "1.65%", change: "-0.2%", positive: false, icon: "📊" },
  { label: "Reputação", value: "Verde", change: "Estável", positive: true, icon: "⭐" },
  { label: "Anúncios Ativos", value: "234", change: "+3 novos", positive: true, icon: "📋" },
];

const RECENT_ACTIONS = [
  { agent: "ANALISTA", color: "#00A650", action: "Auditou 12 anúncios — 3 críticos identificados", time: "2 min" },
  { agent: "ANÚNCIOS", color: "#3483FA", action: "Otimizou título: 'Fone Bluetooth TWS' → score SEO 92", time: "5 min" },
  { agent: "CRIATIVO", color: "#E040FB", action: "Gerou 5 imagens profissionais para SKU #1847", time: "8 min" },
  { agent: "GESTOR ML", color: "#FFE600", action: "Aprovou 4 anúncios — margem média 28%", time: "12 min" },
  { agent: "ADS ML", color: "#F97316", action: "Pausou campanha SKU #892 — ACoS 32% (acima do limite)", time: "15 min" },
  { agent: "ANALISTA", color: "#00A650", action: "Novo concorrente detectado: seller 'TechBR' com preço 15% menor", time: "20 min" },
];

const QUICK_STATS = [
  { label: "SEO Médio", value: "86", suffix: "/100", color: "#FF4D00" },
  { label: "Buy Box", value: "78", suffix: "%", color: "#00A650" },
  { label: "ACoS", value: "12", suffix: "%", color: "#3483FA" },
  { label: "Margem", value: "28", suffix: "%", color: "#E040FB" },
];

export function PainelView() {
  return (
    <div className="p-8 max-w-6xl mx-auto view-enter">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse-glow" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D00]">Tempo real</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A]">Painel da Conta</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">Visão geral da operação no Mercado Livre</p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 stagger">
        {METRICS.map((m) => (
          <div key={m.label} className="animate-scale-in card-hover bg-white border border-[#5C5C5C]/8 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF4D00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">{m.label}</p>
              <span className="text-base opacity-60">{m.icon}</span>
            </div>
            <p className="font-display font-bold text-2xl tracking-tight text-[#0A0A0A]">{m.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <svg className={`w-3 h-3 ${m.positive ? "text-[#00A650]" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d={m.positive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
              <p className={`text-xs font-mono ${m.positive ? "text-[#00A650]" : "text-red-500"}`}>{m.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats — barras visuais */}
      <div className="grid grid-cols-4 gap-3 mb-6 stagger">
        {QUICK_STATS.map((s) => (
          <div key={s.label} className="animate-fade-up card-hover bg-white border border-[#5C5C5C]/8 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">{s.label}</p>
              <p className="font-display font-bold text-lg" style={{ color: s.color }}>{s.value}<span className="text-xs text-[#5C5C5C] font-normal">{s.suffix}</span></p>
            </div>
            <div className="w-full h-1.5 bg-[#F4F4F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${s.value}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ações recentes dos agentes */}
      <div className="animate-fade-up bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden" style={{ animationDelay: "200ms" }}>
        <div className="px-6 py-4 border-b border-[#5C5C5C]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00A650] animate-pulse" />
            <h2 className="font-display font-semibold text-sm">Ações dos Agentes</h2>
          </div>
          <span className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest">Últimos 30 min</span>
        </div>
        <div className="divide-y divide-[#5C5C5C]/5">
          {RECENT_ACTIONS.map((a, i) => (
            <div
              key={i}
              className="animate-slide-left flex items-center gap-4 px-6 py-3.5 hover:bg-[#F4F4F0]/50 transition-colors duration-200 group"
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${a.color}15` }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0A0A0A]">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold mr-2 inline-block px-1.5 py-0.5 rounded" style={{ color: a.color, backgroundColor: `${a.color}10` }}>{a.agent}</span>
                  <span className="text-[#5C5C5C]">{a.action}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-1 h-1 rounded-full bg-[#5C5C5C]/30" />
                <span className="text-[10px] text-[#5C5C5C] font-mono">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
