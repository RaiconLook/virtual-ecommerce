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
  msg("ceo", "Recebi o briefing. Vou convocar a equipe para analise cruzada. Todos para a sala de reuniao.", "system");

  await sleep(1500);

  // Phase 2: Walk to meeting
  moveToMeeting("ceo");
  status("ceo", "meeting");
  msg("ceo", "Indo para a sala de reuniao...", "system");
  await sleep(1200);

  for (const id of agents.slice(1)) {
    moveToMeeting(id);
    status(id, "meeting");
    await sleep(1500);
  }

  await sleep(3000);
  msg("ceo", "━━━  REUNIAO INICIADA  ━━━", "meeting");
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
      <h5 class="text-xs font-semibold text-indigo-400 tracking-wide mb-2">ESCOPO APROVADO NA REUNIAO</h5>
      <ul class="space-y-2">
        ${scope.map((s) => `<li class="text-[11.5px] text-[#888] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-[6px] before:h-[6px] before:rounded-full before:border-[1.5px] before:border-indigo-500/50">${s}</li>`).join("")}
      </ul>
    </div>`,
    "scope"
  );

  await sleep(1500);
  msg("ceo", "Reuniao encerrada. Escopo aprovado. Cada um volta pra estacao e me entrega o diagnostico. Decisao vem de dados, nao de achismo.", "meeting");

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

  msg("ceo", "Equipe em execucao. Envie outro projeto quando precisar.", "system");
  useOfficeStore.getState().setMeeting(false);
}

// ── Dialogue Generator ──
function generateDialogue(topic: string) {
  return [
    {
      who: "ceo" as AgentRole,
      text: `Equipe, novo projeto: <strong>"${topic}"</strong>. Preciso de analise cruzada. Ads, me traga o diagnostico de aquisicao. Comercial, cruza com pipeline. Imagen, prepara os assets visuais e testa criativos.`,
      delay: 3000,
    },
    {
      who: "ceo" as AgentRole,
      text: "Lembrem: CPL baixo nao significa campanha boa. Quero saber o que <strong>gera receita real</strong>, nao o que gera volume vazio.",
      delay: 4000,
    },
    {
      who: "ads" as AgentRole,
      text: "Vou consolidar <strong>Meta Ads e Google Ads</strong> num diagnostico unico. Analiso CPL, CPA, CTR, CPC e CAC por campanha. Identifico criativos com melhor performance, publicos mais qualificados e onde estamos desperdicando budget.",
      delay: 5000,
    },
    {
      who: "ads" as AgentRole,
      text: "Importante: vou cruzar <strong>origem do lead com resultado comercial</strong>. Campanha barata que gera lead fraco nao serve. Campanha cara que fecha mais e melhor investimento. Entrego ranking de campanhas por eficiencia real.",
      delay: 5500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Do lado comercial, vou cruzar os dados de <strong>CRM e pipeline</strong> com as origens de campanha. Analiso taxa de agendamento, comparecimento, avanço de estagio, proposta e fechamento por origem.",
      delay: 5500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Entrego <strong>custo por oportunidade real e custo por venda</strong> por campanha. Vou mostrar onde esta o gargalo: se e marketing mandando lead fraco ou se e comercial perdendo oportunidade boa. Dados, nao achismo.",
      delay: 5500,
    },
    {
      who: "imagen" as AgentRole,
      text: "Vou gerar e analisar os <strong>assets visuais e criativos</strong> do projeto. Preparo variacoes de imagens para ads, posts e banners. Avalio composicao, contraste, CTA visual e aderencia ao branding.",
      delay: 5000,
    },
    {
      who: "imagen" as AgentRole,
      text: "Monto <strong>A/B de criativos por campanha</strong>. Identifico: quais visuais geram mais clique, quais convertem melhor, quais cansaram. Tambem entrego <strong>thumbnails e banners otimizados</strong> com variantes para teste continuo.",
      delay: 5500,
    },
    {
      who: "ceo" as AgentRole,
      text: "Perfeito. Quero ver o cruzamento: <strong>Ads mostra eficiencia de aquisicao, Comercial mostra conversao real, Imagen mostra performance visual dos criativos</strong>. Onde os tres apontam pra mesma direcao, a gente decide.",
      delay: 4500,
    },
    {
      who: "ads" as AgentRole,
      text: "Primeira entrega em <strong>24h</strong>: diagnostico completo por canal e campanha com ranking de eficiencia. Semanal: alertas de desperdicio e sugestoes de otimizacao.",
      delay: 4500,
    },
    {
      who: "comercial" as AgentRole,
      text: "Pipeline report em <strong>24h</strong>: conversao por estagio e custo comercial real por origem. Semanal: evolucao do funil e alinhamento marketing-vendas.",
      delay: 4500,
    },
    {
      who: "imagen" as AgentRole,
      text: "Pack de criativos em <strong>24h</strong>: variacoes de imagens, banners e thumbnails por campanha. Semanal: A/B report visual, criativos novos e refresh de identidade.",
      delay: 4500,
    },
    {
      who: "ceo" as AgentRole,
      text: "Dependencias claras: <strong>Ads diagnostica → Comercial cruza com pipeline → Imagen produz e testa criativos → CEO consolida e decide</strong>. Ninguem trabalha isolado. Vamos fechar o escopo.",
      delay: 4000,
    },
  ];
}

function generateScope(topic: string) {
  return [
    `<strong>CEO / Orquestrador:</strong> Consolida outputs dos 3 analistas, cruza performance de midia + pipeline + criativos, prioriza decisoes de escalar/cortar/otimizar, entrega recomendacao executiva`,
    `<strong>Analista Ads:</strong> Diagnostico unificado Meta + Google, ranking de campanhas por eficiencia real, CPL/CPA/CAC por origem, alertas de desperdicio, criativos e publicos top`,
    `<strong>Analista Comercial:</strong> Pipeline por origem, custo por oportunidade e custo por venda, taxas de conversao por estagio, gargalos marketing→vendas, revenue real por campanha`,
    `<strong>Analista de Imagem:</strong> Geracao de criativos e variacoes visuais, A/B de imagens por campanha, thumbnails e banners otimizados, refresh de identidade visual, report de performance criativa`,
    `<strong>Timeline:</strong> 24h diagnostico inicial Ads + Comercial + Pack de Criativos | Semanal: report cruzado + A/B visual + decisoes CEO`,
    `<strong>Regra de Ouro:</strong> Dados cruzados, nao metricas isoladas. CPL baixo sem conversao nao serve. Criativo bonito sem clique nao escala. Decisao vem do cruzamento dos 3 analistas.`,
  ];
}
