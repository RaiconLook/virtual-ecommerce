import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function msg(
  agentId: AgentRole | "user",
  text: string,
  type: "message" | "meeting" | "system" | "scope" = "message"
) {
  useOfficeStore.getState().addMessage({ agentId, text, type });
}

function status(id: AgentRole, s: "online" | "busy" | "meeting" | "away") {
  useOfficeStore.getState().setAgentStatus(id, s);
}

function moveTo(id: AgentRole, pos: [number, number, number]) {
  useOfficeStore.getState().setAgentPosition(id, pos);
}

function moveHome(id: AgentRole) {
  moveTo(id, AGENTS[id].homePosition as [number, number, number]);
}

function moveToMeeting(id: AgentRole) {
  moveTo(id, AGENTS[id].meetingPosition as [number, number, number]);
}

export async function runMeeting(topic: string) {
  const store = useOfficeStore.getState();
  store.setMeeting(true);

  let remaining = 300;
  store.setMeetingTimer(remaining);
  const timerInterval = setInterval(() => {
    remaining--;
    useOfficeStore.getState().setMeetingTimer(remaining);
    if (remaining <= 0) clearInterval(timerInterval);
  }, 1000);

  const agents: AgentRole[] = ["ceo", "ads", "comercial", "imagen"];

  // Phase 1: CEO receives briefing
  status("ceo", "busy");
  await sleep(800);
  msg("ceo", "Recebi o briefing. Vou convocar a equipe para análise cruzada. Todos para a sala de estratégia.", "system");

  await sleep(1500);

  // Phase 2: Walk to meeting
  moveToMeeting("ceo");
  status("ceo", "meeting");
  msg("ceo", "Indo para a sala de estratégia...", "system");
  await sleep(1200);

  for (const id of agents.slice(1)) {
    moveToMeeting(id);
    status(id, "meeting");
    await sleep(1500);
  }

  await sleep(3000);
  msg("ceo", "━━━  REUNIÃO INICIADA  ━━━", "meeting");
  await sleep(800);

  // Phase 3: Discussion
  const dialogue = generateDialogue(topic);

  for (const line of dialogue) {
    for (const id of agents) {
      status(id, id === line.who ? "busy" : "meeting");
    }
    await sleep(line.delay);
    msg(line.who, line.text, "meeting");
    await sleep(800);
  }

  // Phase 4: Scope
  await sleep(1000);
  msg("ceo", "━━━  ESCOPO DEFINIDO  ━━━", "meeting");
  await sleep(500);

  const scope = generateScope(topic);
  msg(
    "ceo",
    `<div class="space-y-2 mt-1">
      <h5 class="text-xs font-semibold text-yellow-400 tracking-wide mb-2">ESCOPO APROVADO NA REUNIÃO</h5>
      <ul class="space-y-2">
        ${scope.map((s) => `<li class="text-[11.5px] text-[#888] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-[6px] before:h-[6px] before:rounded-full before:border-[1.5px] before:border-yellow-500/50">${s}</li>`).join("")}
      </ul>
    </div>`,
    "scope"
  );

  await sleep(1500);
  msg("ceo", "Reunião encerrada. Escopo aprovado. Cada um volta pra estação e me entrega o diagnóstico.", "meeting");

  // Phase 5: Return
  clearInterval(timerInterval);
  useOfficeStore.getState().setMeetingTimer(0);

  await sleep(1000);
  for (const id of agents) {
    moveHome(id);
    status(id, "busy");
    await sleep(1200);
  }

  await sleep(4000);
  for (const id of agents) {
    status(id, "online");
  }

  msg("ceo", "Equipe em execução. Envie outro projeto quando precisar.", "system");
  useOfficeStore.getState().setMeeting(false);
}

// ── Dialogue Generator — Mercado Livre ──
function generateDialogue(topic: string) {
  return [
    {
      who: "ceo" as AgentRole,
      text: `Equipe, novo projeto: <strong>"${topic}"</strong>. Preciso de análise cruzada. Anúncios, diagnóstico das listagens. Analista, pesquisa de mercado e concorrência. Criativo, prepara o material visual.`,
      delay: 3000,
    },
    {
      who: "ceo" as AgentRole,
      text: "Lembrem: no Mercado Livre, <strong>imagem vende antes do preço</strong>. E sem análise de produto certa, a gente anuncia o que não gira. Quero o cruzamento dos três.",
      delay: 4000,
    },
    {
      who: "ads" as AgentRole,
      text: "Vou auditar todos os <strong>anúncios ativos</strong>: títulos com palavras-chave certas, fichas técnicas completas, variações configuradas, posição no catálogo oficial. Identifico os que estão perdendo visibilidade.",
      delay: 5000,
    },
    {
      who: "ads" as AgentRole,
      text: "Também verifico <strong>qualidade do anúncio</strong> no painel do ML: se está como ouro, prata ou bronze. Anúncio bronze não aparece. Entrego plano de otimização com prioridade por impacto em vendas.",
      delay: 5500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Do lado de análise, vou mapear <strong>tendências de busca</strong> no Mercado Livre: quais produtos estão em alta, quais categorias crescendo, e onde tem demanda sem oferta suficiente.",
      delay: 5500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Cruzo com <strong>dados de concorrência</strong>: preços praticados, volume de vendas dos top sellers, margem estimada e posição de Buy Box. Entrego mapa de oportunidades com SKUs pra escalar e produtos novos pra testar.",
      delay: 5500,
    },
    {
      who: "imagen" as AgentRole,
      text: "Vou preparar o <strong>material visual</strong> de cada produto: foto principal com fundo branco profissional, infográficos de ficha técnica, banners de promoção e mockups de uso do produto.",
      delay: 5000,
    },
    {
      who: "imagen" as AgentRole,
      text: "Também gero <strong>imagens por IA</strong> para produtos que não têm foto boa. Remoção de fundo, ambientação, comparativos visuais. O ML prioriza anúncios com imagens de alta qualidade no ranking.",
      delay: 5500,
    },
    {
      who: "ceo" as AgentRole,
      text: "Perfeito. Quero ver: <strong>Anúncios mostra visibilidade, Analista mostra oportunidade, Criativo entrega o visual</strong>. Os três juntos definem quais SKUs lançar e quais otimizar.",
      delay: 4500,
    },
    {
      who: "ads" as AgentRole,
      text: "Primeira entrega em <strong>24h</strong>: auditoria completa dos anúncios com score de qualidade e plano de otimização de títulos + fichas técnicas.",
      delay: 4500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Relatório de mercado em <strong>24h</strong>: tendências de busca, mapa de concorrência, oportunidades de nicho e recomendação de novos SKUs.",
      delay: 4500,
    },
    {
      who: "imagen" as AgentRole,
      text: "Kit visual em <strong>48h</strong>: fotos otimizadas, infográficos de ficha técnica e banners para os top 10 produtos prioritários.",
      delay: 4500,
    },
    {
      who: "ceo" as AgentRole,
      text: "Dependências: <strong>Analista identifica oportunidade → Anúncios cria/otimiza listagem → Criativo entrega visual → Gestor aprova e publica</strong>. Vamos fechar o escopo.",
      delay: 4000,
    },
  ];
}

function generateScope(topic: string) {
  return [
    `<strong>Gestor ML / Orquestrador:</strong> Consolida outputs dos 3 especialistas, cruza visibilidade + análise + visual, prioriza SKUs pra escalar/pausar/lançar, entrega decisão executiva`,
    `<strong>Anúncios / SEO:</strong> Auditoria de listagens, otimização de títulos e fichas técnicas, catálogo oficial, qualidade do anúncio (ouro/prata/bronze), variações e kits`,
    `<strong>Analista de Produtos:</strong> Pesquisa de tendências, análise de concorrência, monitoramento de Buy Box, mapa de oportunidades, recomendação de novos SKUs e precificação`,
    `<strong>Criação de Imagens:</strong> Fotos profissionais por IA, infográficos de ficha técnica, banners promocionais, mockups de produto, remoção de fundo, identidade visual da loja`,
    `<strong>Timeline:</strong> 24h diagnóstico inicial (Anúncios + Analista) | 48h kit visual (Criativo) | Semanal: report cruzado + decisões do Gestor`,
    `<strong>Regra de Ouro:</strong> Produto certo + anúncio otimizado + visual profissional = vendas. Sem análise de mercado, anuncia errado. Sem visual bom, não converte. Decisão vem do cruzamento dos 3.`,
  ];
}
