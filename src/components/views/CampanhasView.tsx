"use client";

const CAMPAIGNS = [
  { name: "Fone TWS Pro", budget: "R$ 50/dia", spent: "R$ 38,20", impressions: 4200, clicks: 186, ctr: "4.4%", cpc: "R$ 0,21", acos: "11%", acosNum: 11, sales: 8, status: "verde" },
  { name: "Mouse Gamer RGB", budget: "R$ 30/dia", spent: "R$ 28,50", impressions: 2800, clicks: 112, ctr: "4.0%", cpc: "R$ 0,25", acos: "18%", acosNum: 18, sales: 4, status: "amarelo" },
  { name: "Teclado Mecânico 60%", budget: "R$ 80/dia", spent: "R$ 72,00", impressions: 6100, clicks: 305, ctr: "5.0%", cpc: "R$ 0,24", acos: "9%", acosNum: 9, sales: 15, status: "verde" },
  { name: "Webcam HD 1080p", budget: "R$ 20/dia", spent: "R$ 19,80", impressions: 1500, clicks: 45, ctr: "3.0%", cpc: "R$ 0,44", acos: "32%", acosNum: 32, sales: 1, status: "vermelho" },
  { name: "Hub USB-C 7em1", budget: "R$ 40/dia", spent: "R$ 35,00", impressions: 3400, clicks: 153, ctr: "4.5%", cpc: "R$ 0,23", acos: "14%", acosNum: 14, sales: 6, status: "verde" },
  { name: "Carregador 65W GaN", budget: "R$ 60/dia", spent: "R$ 55,00", impressions: 8200, clicks: 410, ctr: "5.0%", cpc: "R$ 0,13", acos: "7%", acosNum: 7, sales: 22, status: "verde" },
];

const STATUS_MAP: Record<string, { label: string; color: string; action: string }> = {
  verde: { label: "Escalando", color: "#00A650", action: "Budget +20%" },
  amarelo: { label: "Ajustando", color: "#CA8A04", action: "Lance -10%" },
  vermelho: { label: "Pausada", color: "#DC2626", action: "ACoS acima do limite" },
};

export function CampanhasView() {
  return (
    <div className="p-8 max-w-6xl mx-auto view-enter">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A]">Campanhas ADS</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">Performance do tráfego pago — agente ADS ML</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-3 mb-6 stagger">
        {[
          { label: "Gasto Hoje", value: "R$ 248", icon: "💳", color: "#0A0A0A" },
          { label: "Vendas ADS", value: "56", icon: "🛒", color: "#00A650" },
          { label: "ACoS Médio", value: "12.3%", icon: "📉", color: "#3483FA" },
          { label: "ROAS", value: "4.8x", icon: "🚀", color: "#FF4D00" },
        ].map((s) => (
          <div key={s.label} className="animate-scale-in card-hover bg-white border border-[#5C5C5C]/8 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${s.color}30, transparent)` }} />
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">{s.label}</p>
              <span className="text-base opacity-50">{s.icon}</span>
            </div>
            <p className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Campanhas */}
      <div className="bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="px-6 py-3 bg-[#F4F4F0]/50 border-b border-[#5C5C5C]/8">
          <div className="grid grid-cols-[1fr_80px_80px_70px_60px_60px_80px_90px] gap-2 text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">
            <span>Campanha</span><span>Budget</span><span>Gasto</span><span>Cliques</span><span>CTR</span><span>CPC</span><span>ACoS</span><span>Status</span>
          </div>
        </div>
        <div className="divide-y divide-[#5C5C5C]/5 stagger">
          {CAMPAIGNS.map((c) => {
            const st = STATUS_MAP[c.status];
            return (
              <div key={c.name} className="animate-fade-up card-hover grid grid-cols-[1fr_80px_80px_70px_60px_60px_80px_90px] gap-2 px-6 py-4 items-center text-sm group">
                <div>
                  <p className="font-medium text-[#0A0A0A] group-hover:text-[#FF4D00] transition-colors">{c.name}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: st.color }}>{st.action}</p>
                </div>
                <span className="font-mono text-xs text-[#5C5C5C]">{c.budget}</span>
                <span className="font-mono text-xs text-[#0A0A0A] font-semibold">{c.spent}</span>
                <span className="font-mono text-xs text-[#5C5C5C]">{c.clicks}</span>
                <span className="font-mono text-xs text-[#0A0A0A]">{c.ctr}</span>
                <span className="font-mono text-xs text-[#0A0A0A]">{c.cpc}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#F4F4F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(c.acosNum * 3, 100)}%`, backgroundColor: st.color }} />
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: st.color }}>{c.acos}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-widest text-center" style={{ color: st.color, backgroundColor: `${st.color}10` }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
