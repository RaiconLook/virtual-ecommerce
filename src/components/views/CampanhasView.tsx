"use client";

const CAMPAIGNS = [
  { name: "Fone TWS Pro", budget: "R$ 50/dia", spent: "R$ 38,20", impressions: 4200, clicks: 186, ctr: "4.4%", cpc: "R$ 0,21", acos: "11%", sales: 8, status: "verde" },
  { name: "Mouse Gamer RGB", budget: "R$ 30/dia", spent: "R$ 28,50", impressions: 2800, clicks: 112, ctr: "4.0%", cpc: "R$ 0,25", acos: "18%", sales: 4, status: "amarelo" },
  { name: "Teclado Mecânico 60%", budget: "R$ 80/dia", spent: "R$ 72,00", impressions: 6100, clicks: 305, ctr: "5.0%", cpc: "R$ 0,24", acos: "9%", sales: 15, status: "verde" },
  { name: "Webcam HD 1080p", budget: "R$ 20/dia", spent: "R$ 19,80", impressions: 1500, clicks: 45, ctr: "3.0%", cpc: "R$ 0,44", acos: "32%", sales: 1, status: "vermelho" },
  { name: "Hub USB-C 7em1", budget: "R$ 40/dia", spent: "R$ 35,00", impressions: 3400, clicks: 153, ctr: "4.5%", cpc: "R$ 0,23", acos: "14%", sales: 6, status: "verde" },
  { name: "Carregador 65W GaN", budget: "R$ 60/dia", spent: "R$ 55,00", impressions: 8200, clicks: 410, ctr: "5.0%", cpc: "R$ 0,13", acos: "7%", sales: 22, status: "verde" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; action: string }> = {
  verde: { label: "Escalando", color: "#00A650", bg: "bg-green-50", action: "ADS aumentou budget +20%" },
  amarelo: { label: "Ajustando", color: "#CA8A04", bg: "bg-yellow-50", action: "ADS reduziu lance em 10%" },
  vermelho: { label: "Pausada", color: "#DC2626", bg: "bg-red-50", action: "ADS pausou — ACoS acima do limite" },
};

export function CampanhasView() {
  const totalSpent = "R$ 248,50";
  const totalSales = 56;
  const avgAcos = "12.3%";
  const roas = "4.8x";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Campanhas ADS</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">Performance do tráfego pago — gerenciado pelo agente ADS ML</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Gasto Hoje</p>
          <p className="font-display font-bold text-2xl text-[#0A0A0A] mt-1">{totalSpent}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Vendas via ADS</p>
          <p className="font-display font-bold text-2xl text-[#00A650] mt-1">{totalSales}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">ACoS Médio</p>
          <p className="font-display font-bold text-2xl text-[#0A0A0A] mt-1">{avgAcos}</p>
        </div>
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">ROAS</p>
          <p className="font-display font-bold text-2xl text-[#FF4D00] mt-1">{roas}</p>
        </div>
      </div>

      {/* Tabela de campanhas */}
      <div className="bg-white border border-[#5C5C5C]/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_90px_80px_70px_70px_70px_70px_100px] gap-2 px-5 py-3 bg-[#F4F4F0] text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono border-b border-[#5C5C5C]/10">
          <span>Campanha</span><span>Budget</span><span>Gasto</span><span>Impr.</span><span>Cliques</span><span>CTR</span><span>CPC</span><span>ACoS</span><span>Status</span>
        </div>
        {CAMPAIGNS.map((c) => {
          const st = STATUS_MAP[c.status];
          return (
            <div key={c.name} className="grid grid-cols-[1fr_90px_90px_80px_70px_70px_70px_70px_100px] gap-2 px-5 py-3 border-b border-[#5C5C5C]/5 items-center text-sm hover:bg-[#F4F4F0]/50 transition-colors">
              <div>
                <p className="font-medium text-[#0A0A0A]">{c.name}</p>
                <p className="text-[10px] text-[#5C5C5C] font-mono mt-0.5">{st.action}</p>
              </div>
              <span className="font-mono text-xs text-[#5C5C5C]">{c.budget}</span>
              <span className="font-mono text-xs text-[#0A0A0A]">{c.spent}</span>
              <span className="font-mono text-xs text-[#5C5C5C]">{c.impressions.toLocaleString()}</span>
              <span className="font-mono text-xs text-[#0A0A0A]">{c.clicks}</span>
              <span className="font-mono text-xs text-[#0A0A0A]">{c.ctr}</span>
              <span className="font-mono text-xs text-[#0A0A0A]">{c.cpc}</span>
              <span className={`font-mono text-xs font-semibold ${c.status === "verde" ? "text-[#00A650]" : c.status === "amarelo" ? "text-[#CA8A04]" : "text-[#DC2626]"}`}>{c.acos}</span>
              <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest ${st.bg}`} style={{ color: st.color }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
