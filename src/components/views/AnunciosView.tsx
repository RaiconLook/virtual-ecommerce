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
  saudavel: { label: "Saudável", color: "#00A650", bg: "bg-green-50" },
  otimizavel: { label: "Otimizável", color: "#CA8A04", bg: "bg-yellow-50" },
  critico: { label: "Crítico", color: "#DC2626", bg: "bg-red-50" },
};

export function AnunciosView() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Anúncios</h1>
          <p className="text-sm text-[#5C5C5C] mt-1">Auditoria e otimização dos anúncios ativos — Analista + Anúncios</p>
        </div>
        <div className="flex gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 bg-green-50 text-[#00A650] border border-green-200 rounded">3 Saudáveis</span>
          <span className="px-3 py-1.5 bg-yellow-50 text-[#CA8A04] border border-yellow-200 rounded">2 Otimizáveis</span>
          <span className="px-3 py-1.5 bg-red-50 text-[#DC2626] border border-red-200 rounded">1 Crítico</span>
        </div>
      </div>

      <div className="space-y-3">
        {LISTINGS.map((item) => {
          const st = STATUS_MAP[item.status];
          return (
            <div key={item.id} className="bg-white border border-[#5C5C5C]/10 rounded-lg p-5 flex items-center gap-6 hover:border-[#FF4D00]/30 transition-all">
              {/* Status dot */}
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: st.color }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#0A0A0A] truncate">{item.title}</p>
                <p className="font-mono text-[10px] text-[#5C5C5C] mt-0.5">{item.id}</p>
              </div>

              {/* Preço */}
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-lg text-[#0A0A0A]">{item.price}</p>
              </div>

              {/* SEO Score */}
              <div className="text-center shrink-0 w-16">
                <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">SEO</p>
                <p className={`font-display font-bold text-lg ${item.seo >= 80 ? "text-[#00A650]" : item.seo >= 60 ? "text-[#CA8A04]" : "text-[#DC2626]"}`}>{item.seo}</p>
              </div>

              {/* Qualidade ML */}
              <div className="text-center shrink-0 w-16">
                <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Tipo</p>
                <p className={`font-mono text-xs font-semibold ${item.quality === "Ouro" ? "text-[#CA8A04]" : item.quality === "Prata" ? "text-[#5C5C5C]" : "text-[#DC2626]"}`}>{item.quality}</p>
              </div>

              {/* Métricas */}
              <div className="text-center shrink-0 w-20">
                <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Visitas</p>
                <p className="font-mono text-sm font-semibold text-[#0A0A0A]">{item.visits.toLocaleString()}</p>
              </div>

              <div className="text-center shrink-0 w-16">
                <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono">Vendas</p>
                <p className="font-mono text-sm font-semibold text-[#0A0A0A]">{item.sales}</p>
              </div>

              {/* Status badge */}
              <span className={`shrink-0 px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest ${st.bg}`} style={{ color: st.color }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
