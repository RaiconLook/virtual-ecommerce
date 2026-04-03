"use client";

const LISTINGS = [
  { id: "MLB2847391", title: "Fone Bluetooth TWS Pro 5.3 com Case", price: "R$ 89,90", status: "saudavel", seo: 92, visits: 1240, sales: 47, quality: "Ouro" },
  { id: "MLB2847392", title: "Mouse Gamer RGB 12000 DPI 7 Botões", price: "R$ 129,90", status: "otimizavel", seo: 68, visits: 890, sales: 23, quality: "Prata" },
  { id: "MLB2847393", title: "Teclado Mecânico 60% Hot Swap RGB", price: "R$ 219,90", status: "saudavel", seo: 88, visits: 2100, sales: 85, quality: "Ouro" },
  { id: "MLB2847394", title: "Webcam Full HD 1080p com Microfone", price: "R$ 149,90", status: "critico", seo: 42, visits: 320, sales: 5, quality: "Bronze" },
  { id: "MLB2847395", title: "Hub USB-C 7 em 1 HDMI 4K Ethernet", price: "R$ 179,90", status: "otimizavel", seo: 71, visits: 650, sales: 18, quality: "Prata" },
  { id: "MLB2847396", title: "Carregador Turbo 65W GaN USB-C PD", price: "R$ 99,90", status: "saudavel", seo: 95, visits: 3200, sales: 142, quality: "Ouro" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  saudavel: { label: "Saudável", color: "#00A650", bg: "bg-[#00A650]/8" },
  otimizavel: { label: "Otimizável", color: "#CA8A04", bg: "bg-[#CA8A04]/8" },
  critico: { label: "Crítico", color: "#DC2626", bg: "bg-[#DC2626]/8" },
};

export function AnunciosView() {
  const respondidas = { saudavel: 3, otimizavel: 2, critico: 1 };

  return (
    <div className="p-8 max-w-6xl mx-auto view-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A]">Anúncios</h1>
          <p className="text-sm text-[#5C5C5C] mt-1">Auditoria e otimização — Analista + Anúncios</p>
        </div>
        <div className="flex gap-2 stagger">
          {Object.entries(respondidas).map(([key, val]) => {
            const st = STATUS_MAP[key];
            return (
              <span key={key} className={`animate-scale-in flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono ${st.bg}`} style={{ color: st.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                {val} {st.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Lista de anúncios */}
      <div className="space-y-2 stagger">
        {LISTINGS.map((item) => {
          const st = STATUS_MAP[item.status];
          return (
            <div key={item.id} className="animate-fade-up card-hover bg-white border border-[#5C5C5C]/8 rounded-xl p-5 flex items-center gap-5 group">
              {/* Status indicator */}
              <div className="relative">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${st.color}10` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#0A0A0A] truncate group-hover:text-[#FF4D00] transition-colors">{item.title}</p>
                <p className="font-mono text-[10px] text-[#5C5C5C] mt-0.5">{item.id}</p>
              </div>

              {/* Preço */}
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-lg text-[#0A0A0A]">{item.price}</p>
              </div>

              {/* SEO Score com barra */}
              <div className="shrink-0 w-20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">SEO</p>
                  <p className={`font-mono text-xs font-bold ${item.seo >= 80 ? "text-[#00A650]" : item.seo >= 60 ? "text-[#CA8A04]" : "text-[#DC2626]"}`}>{item.seo}</p>
                </div>
                <div className="w-full h-1 bg-[#F4F4F0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.seo}%`, backgroundColor: item.seo >= 80 ? "#00A650" : item.seo >= 60 ? "#CA8A04" : "#DC2626" }} />
                </div>
              </div>

              {/* Qualidade */}
              <div className="text-center shrink-0 w-14">
                <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mb-0.5">Tipo</p>
                <p className={`font-mono text-xs font-bold ${item.quality === "Ouro" ? "text-[#CA8A04]" : item.quality === "Prata" ? "text-[#5C5C5C]" : "text-[#DC2626]"}`}>{item.quality}</p>
              </div>

              {/* Visitas */}
              <div className="text-center shrink-0 w-16">
                <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mb-0.5">Visitas</p>
                <p className="font-mono text-xs font-semibold text-[#0A0A0A]">{item.visits.toLocaleString()}</p>
              </div>

              {/* Vendas */}
              <div className="text-center shrink-0 w-14">
                <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mb-0.5">Vendas</p>
                <p className="font-mono text-xs font-semibold text-[#0A0A0A]">{item.sales}</p>
              </div>

              {/* Status badge */}
              <span className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest ${st.bg}`} style={{ color: st.color }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
