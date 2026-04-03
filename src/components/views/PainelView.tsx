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

      {/* ═══ Análise de Títulos Top Concorrentes ═══ */}
      <div className="animate-fade-up bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden mb-6" style={{ animationDelay: "150ms" }}>
        <div className="px-6 py-4 border-b border-[#5C5C5C]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3483FA]" />
            <h2 className="font-display font-bold text-base text-[#0A0A0A]">Títulos que Mais Vendem (Concorrentes)</h2>
          </div>
          <span className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest">Top 5 por categoria</span>
        </div>
        <div className="divide-y divide-[#5C5C5C]/5">
          {[
            { rank: 1, title: "Fone Bluetooth TWS i12 Original Sem Fio Pronta Entrega", seller: "TechBR_oficial", sales7d: 842, price: "R$ 29,90", category: "Fones" },
            { rank: 2, title: "Mouse Gamer 7 Botões LED RGB 3200DPI USB Com Fio Preto", seller: "gamestore_br", sales7d: 631, price: "R$ 34,90", category: "Mouse" },
            { rank: 3, title: "Carregador Turbo USB C 20W Fast Charge iPhone Android", seller: "acessorios_top", sales7d: 578, price: "R$ 19,90", category: "Carregadores" },
            { rank: 4, title: "Teclado Mecânico Gamer RGB Switch Blue Compacto 60%", seller: "mech_kingdom", sales7d: 423, price: "R$ 159,90", category: "Teclados" },
            { rank: 5, title: "Hub Adaptador USB C 6 em 1 HDMI 4K USB 3.0 MacBook", seller: "hub_express", sales7d: 389, price: "R$ 89,90", category: "Hubs" },
          ].map((item) => (
            <div key={item.rank} className="flex items-center gap-4 px-6 py-3 hover:bg-[#F4F4F0]/50 transition-colors group">
              <span className="w-7 h-7 rounded-lg bg-[#3483FA]/10 flex items-center justify-center font-display font-bold text-sm text-[#3483FA]">{item.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0A0A0A] font-medium truncate group-hover:text-[#FF4D00] transition-colors">{item.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono text-[10px] text-[#5C5C5C]">{item.seller}</span>
                  <span className="font-mono text-[10px] text-[#5C5C5C]">·</span>
                  <span className="font-mono text-[10px] text-[#5C5C5C]">{item.category}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-sm text-[#0A0A0A]">{item.sales7d}</p>
                <p className="font-mono text-[9px] text-[#5C5C5C]">vendas/7d</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-xs text-[#00A650] font-semibold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-[#3483FA]/5 border-t border-[#5C5C5C]/5">
          <p className="text-[11px] text-[#3483FA]">💡 <strong>Insight do Analista:</strong> Títulos com "Pronta Entrega", "Original" e especificações técnicas no início vendem até 3x mais.</p>
        </div>
      </div>

      {/* ═══ Tempo de Resposta de Comentários ═══ */}
      <div className="animate-fade-up bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden mb-6" style={{ animationDelay: "180ms" }}>
        <div className="px-6 py-4 border-b border-[#5C5C5C]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00A650] animate-pulse" />
            <h2 className="font-display font-bold text-base text-[#0A0A0A]">Tempo de Resposta — Perguntas</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00A650]/10 text-[#00A650]">Meta: &lt;10 min</span>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-[#00A650]">6</p>
              <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mt-1">Min. Médio</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-[#0A0A0A]">94%</p>
              <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mt-1">&lt;10 min</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-[#0A0A0A]">32</p>
              <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mt-1">Respondidas Hoje</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-3xl text-[#CA8A04]">2</p>
              <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono mt-1">Pendentes</p>
            </div>
          </div>
          {/* Barra visual das últimas 12h */}
          <p className="text-[10px] uppercase tracking-widest text-[#5C5C5C] font-mono mb-2">Últimas 12 horas</p>
          <div className="flex items-end gap-1 h-12">
            {[3,5,8,2,4,7,6,9,4,3,5,2,6,8,3,5,4,7,2,6,4,3,5,8].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(v / 10) * 100}%`,
                  backgroundColor: v <= 10 ? "#00A650" : "#DC2626",
                  opacity: 0.3 + (v / 10) * 0.7,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-[#5C5C5C]">00h</span>
            <span className="font-mono text-[8px] text-[#5C5C5C]">06h</span>
            <span className="font-mono text-[8px] text-[#5C5C5C]">12h</span>
          </div>
        </div>
        <div className="px-6 py-3 bg-[#00A650]/5 border-t border-[#5C5C5C]/5">
          <p className="text-[11px] text-[#00A650]">✅ <strong>SAC:</strong> 94% das perguntas respondidas em menos de 10 minutos. Reputação protegida.</p>
        </div>
      </div>

      {/* ═══ Probabilidade de Escala ═══ */}
      <div className="animate-fade-up bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden mb-6" style={{ animationDelay: "200ms" }}>
        <div className="px-6 py-4 border-b border-[#5C5C5C]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
            <h2 className="font-display font-bold text-base text-[#0A0A0A]">Probabilidade de Escala</h2>
          </div>
          <span className="font-mono text-[10px] text-[#5C5C5C] uppercase tracking-widest">Base: vendas concorrentes 7d</span>
        </div>
        <div className="divide-y divide-[#5C5C5C]/5">
          {[
            { product: "Carregador 65W GaN USB-C", ourSales: 142, topSales: 578, probability: 92, trend: "+34%", signal: "Escalar agora" },
            { product: "Fone Bluetooth TWS Pro 5.3", ourSales: 47, topSales: 842, probability: 78, trend: "+18%", signal: "Escalar com ajuste" },
            { product: "Teclado Mecânico 60% Hot Swap", ourSales: 85, topSales: 423, probability: 71, trend: "+12%", signal: "Escalar moderado" },
            { product: "Hub USB-C 7 em 1 HDMI 4K", ourSales: 18, topSales: 389, probability: 65, trend: "+8%", signal: "Otimizar antes" },
            { product: "Mouse Gamer RGB 12000 DPI", ourSales: 23, topSales: 631, probability: 54, trend: "+5%", signal: "Otimizar antes" },
            { product: "Webcam Full HD 1080p", ourSales: 5, topSales: 156, probability: 22, trend: "-3%", signal: "Pausar ou pivotar" },
          ].map((item) => (
            <div key={item.product} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#F4F4F0]/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0A0A0A] font-medium truncate group-hover:text-[#FF4D00] transition-colors">{item.product}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono text-[10px] text-[#5C5C5C]">Nós: {item.ourSales}/7d</span>
                  <span className="font-mono text-[10px] text-[#5C5C5C]">·</span>
                  <span className="font-mono text-[10px] text-[#5C5C5C]">Top: {item.topSales}/7d</span>
                  <span className={`font-mono text-[10px] font-semibold ${item.trend.startsWith("+") ? "text-[#00A650]" : "text-[#DC2626]"}`}>{item.trend}</span>
                </div>
              </div>
              {/* Probability bar */}
              <div className="w-32 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] text-[#5C5C5C]">Escala</span>
                  <span className={`font-display font-bold text-sm ${item.probability >= 70 ? "text-[#00A650]" : item.probability >= 50 ? "text-[#CA8A04]" : "text-[#DC2626]"}`}>{item.probability}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#F4F4F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.probability}%`,
                      backgroundColor: item.probability >= 70 ? "#00A650" : item.probability >= 50 ? "#CA8A04" : "#DC2626",
                    }}
                  />
                </div>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-widest ${
                item.probability >= 70 ? "bg-[#00A650]/8 text-[#00A650]" : item.probability >= 50 ? "bg-[#CA8A04]/8 text-[#CA8A04]" : "bg-[#DC2626]/8 text-[#DC2626]"
              }`}>{item.signal}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-[#FF4D00]/5 border-t border-[#5C5C5C]/5">
          <p className="text-[11px] text-[#FF4D00]">🚀 <strong>Gestor ML:</strong> Carregador 65W e Fone TWS têm gap de mercado grande — priorizar budget de ADS nesses 2 SKUs.</p>
        </div>
      </div>

      {/* Ações recentes dos agentes */}
      <div className="animate-fade-up bg-white border border-[#5C5C5C]/8 rounded-xl overflow-hidden" style={{ animationDelay: "200ms" }}>
        <div className="px-6 py-4 border-b border-[#5C5C5C]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00A650] animate-pulse" />
            <h2 className="font-display font-bold text-base text-[#0A0A0A]">Ações dos Agentes</h2>
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
