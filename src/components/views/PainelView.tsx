"use client";

const METRICS = [
  { label: "Vendas Hoje", value: "47", change: "+12%", positive: true },
  { label: "Faturamento", value: "R$ 8.340", change: "+8%", positive: true },
  { label: "Visitas", value: "2.847", change: "+15%", positive: true },
  { label: "Conversão", value: "1.65%", change: "-0.2%", positive: false },
  { label: "Reputação", value: "Verde", change: "Estável", positive: true },
  { label: "Anúncios Ativos", value: "234", change: "+3 novos", positive: true },
];

const RECENT_ACTIONS = [
  { agent: "ANALISTA", color: "#00A650", action: "Auditou 12 anúncios — 3 críticos identificados", time: "2 min" },
  { agent: "ANÚNCIOS", color: "#3483FA", action: "Otimizou título: 'Fone Bluetooth TWS' → score SEO 92", time: "5 min" },
  { agent: "CRIATIVO", color: "#E040FB", action: "Gerou 5 imagens profissionais para SKU #1847", time: "8 min" },
  { agent: "GESTOR ML", color: "#FFE600", action: "Aprovou 4 anúncios — margem média 28%", time: "12 min" },
  { agent: "ADS ML", color: "#F97316", action: "Pausou campanha SKU #892 — ACoS 32% (acima do limite)", time: "15 min" },
  { agent: "ANALISTA", color: "#00A650", action: "Novo concorrente detectado: seller 'TechBR' com preço 15% menor", time: "20 min" },
];

export function PainelView() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Painel da Conta</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">Visão geral da operação no Mercado Livre — atualizado em tempo real</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono mb-1">{m.label}</p>
            <p className="font-display font-bold text-2xl tracking-tight text-[#0A0A0A]">{m.value}</p>
            <p className={`text-xs font-mono mt-1 ${m.positive ? "text-[#00A650]" : "text-red-500"}`}>{m.change}</p>
          </div>
        ))}
      </div>

      {/* Ações recentes dos agentes */}
      <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Ações dos Agentes</h2>
        <div className="space-y-3">
          {RECENT_ACTIONS.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#5C5C5C]/5 last:border-0">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
              <div className="flex-1">
                <p className="text-sm text-[#0A0A0A]">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-semibold mr-2" style={{ color: a.color }}>{a.agent}</span>
                  {a.action}
                </p>
              </div>
              <span className="text-[10px] text-[#5C5C5C] font-mono shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
