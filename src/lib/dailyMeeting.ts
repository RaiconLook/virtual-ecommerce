"use client";

import { useEffect, useRef } from "react";
import { useOfficeStore } from "@/store/useOfficeStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function msg(agentId: AgentRole | "user", text: string, type: "message" | "meeting" | "system" | "scope" = "message") {
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

// ═══ Store de reuniões diárias ═══

export interface DailyMeetingReport {
  id: string;
  date: string;
  time: string;
  type: "automatica" | "alinhamento";
  messages: { agent: string; color: string; text: string }[];
  insights: string[];
  metrics: { label: string; value: string; change: string; positive: boolean }[];
}

// Armazena relatórios no localStorage
export function saveMeetingReport(report: DailyMeetingReport) {
  const reports = getMeetingReports();
  reports.unshift(report);
  // Mantém últimos 30 relatórios
  if (reports.length > 30) reports.length = 30;
  localStorage.setItem("ml-daily-meetings", JSON.stringify(reports));
}

export function getMeetingReports(): DailyMeetingReport[] {
  try {
    const raw = localStorage.getItem("ml-daily-meetings");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ═══ Envio de e-mail via Resend API (ou endpoint próprio) ═══

export async function sendReportEmail(report: DailyMeetingReport) {
  const recipients = ["look.zimmermann@gmail.com", "welkerdigital@gmail.com"];

  const htmlBody = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #F4F4F0; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-weight: bold; font-size: 18px;">
          <span style="color: #5C5C5C;">&gt;_</span>
          <span style="color: #0A0A0A;">We</span><span style="color: #FF4D00;">{Stack}</span>
        </span>
        <p style="font-size: 11px; color: #5C5C5C; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">Reunião Diária — ${report.date}</p>
      </div>
      <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
        <h2 style="font-size: 16px; margin: 0 0 16px 0; color: #0A0A0A;">Métricas do Dia</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${report.metrics.map(m => `
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 8px 0; color: #5C5C5C; font-size: 13px;">${m.label}</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 14px; color: #0A0A0A;">${m.value}</td>
              <td style="padding: 8px 0; text-align: right; font-size: 12px; color: ${m.positive ? '#00A650' : '#DC2626'};">${m.change}</td>
            </tr>
          `).join("")}
        </table>
      </div>
      <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
        <h2 style="font-size: 16px; margin: 0 0 16px 0; color: #0A0A0A;">Insights</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${report.insights.map(i => `<li style="font-size: 13px; color: #5C5C5C; margin-bottom: 8px;">${i}</li>`).join("")}
        </ul>
      </div>
      <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px;">
        <h2 style="font-size: 16px; margin: 0 0 16px 0; color: #0A0A0A;">Diálogo da Reunião</h2>
        ${report.messages.map(m => `
          <div style="margin-bottom: 10px; padding-left: 12px; border-left: 3px solid ${m.color};">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold; color: ${m.color};">${m.agent}</span>
            <p style="font-size: 13px; color: #5C5C5C; margin: 2px 0 0 0;">${m.text}</p>
          </div>
        `).join("")}
      </div>
      <p style="font-size: 10px; color: #999; text-align: center; margin-top: 24px;">WeStack — Escritório Virtual ML</p>
    </div>
  `;

  // Envia e-mail via Resend
  try {
    await fetch("/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipients,
        subject: `Reunião Diária ML — ${report.date}`,
        html: htmlBody,
      }),
    });
  } catch (e) {
    console.error("Erro enviando e-mail:", e);
  }
}

// ═══ Envio via WhatsApp (grupo WeStack Leads) ═══

export async function sendReportWhatsApp(report: DailyMeetingReport) {
  const metricsText = report.metrics.map(m => `${m.label}: ${m.value} (${m.change})`).join("\n");
  const insightsText = report.insights.map(i => `• ${i}`).join("\n");
  const dialogText = report.messages.slice(0, 5).map(m => `[${m.agent}] ${m.text.replace(/<[^>]*>/g, "")}`).join("\n");

  const message = `*🤖 Reunião ${report.type === "automatica" ? "Diária" : "de Alinhamento"} — ${report.date}*\n\n` +
    `*📊 Métricas do Dia*\n${metricsText || "Sem métricas"}\n\n` +
    `*💡 Insights*\n${insightsText}\n\n` +
    `*💬 Destaques da Reunião*\n${dialogText}\n\n` +
    `_WeStack — Escritório Virtual ML_`;

  try {
    await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch (e) {
    console.error("Erro enviando WhatsApp:", e);
  }
}

// ═══ Reunião Diária (20h Brasília) ═══

export async function runDailyMeeting() {
  const store = useOfficeStore.getState();
  store.setMeeting(true);

  const agents: AgentRole[] = ["ceo", "ads", "comercial", "calls"];
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

  const reportMessages: { agent: string; color: string; text: string }[] = [];
  const addMsg = (id: AgentRole, text: string) => {
    msg(id, text, "meeting");
    reportMessages.push({ agent: AGENTS[id].name, color: AGENTS[id].color, text });
  };

  let remaining = 180;
  store.setMeetingTimer(remaining);
  const timerInterval = setInterval(() => {
    remaining--;
    useOfficeStore.getState().setMeetingTimer(remaining);
    if (remaining <= 0) clearInterval(timerInterval);
  }, 1000);

  // Fase 1: Gestor convoca (~10s)
  status("ceo", "busy");
  await sleep(1500);
  msg("ceo", "━━━ REUNIÃO DIÁRIA — 20h ━━━", "meeting");
  await sleep(1000);
  addMsg("ceo", `Boa noite, equipe. Vamos consolidar os números do dia ${dateStr}. Cada um me traz o balanço da sua área.`);

  // Move todos para reunião (~8s)
  for (const id of agents) {
    moveToMeeting(id);
    status(id, "meeting");
    await sleep(2000);
  }
  await sleep(2000);

  // Fase 2: Cada agente reporta (~40s)
  await sleep(3000);
  addMsg("ads", "Hoje auditei <strong>18 anúncios ativos</strong>. 12 estão saudáveis, 4 otimizáveis e 2 críticos. Reescrevi 3 títulos — score SEO médio subiu de 72 para 86.");
  await sleep(3000);
  addMsg("ads", "Criei 2 anúncios novos para SKUs que o Analista identificou. Fichas técnicas completas e palavras-chave de alta busca.");

  await sleep(3500);
  addMsg("comercial", "Monitorei <strong>24 concorrentes diretos</strong> hoje. 3 baixaram preço — já recalculei margens e passei pro Anúncios ajustar.");
  await sleep(3000);
  addMsg("comercial", "Identifiquei 2 produtos em alta na categoria que não temos ainda. Buy Box: mantivemos em <strong>78%</strong> dos SKUs.");

  await sleep(3500);
  addMsg("calls", "Gerei <strong>15 imagens profissionais</strong> via Nano Banana Pro. 10 para anúncios novos e 5 substituições de fotos ruins.");
  await sleep(3000);
  addMsg("calls", "Todos no padrão 1200x1200 com fundo branco. Kit de infográficos pronto para os 3 top sellers.");

  await sleep(3500);
  addMsg("ceo", "Do meu lado: aprovei <strong>7 anúncios</strong> hoje, reprovei 1 por margem abaixo de 15%. Margem média do dia: <strong>28%</strong>.");
  await sleep(3000);
  addMsg("ceo", "Health score da conta: verde. ADS: 5 campanhas ativas com ACoS médio de 12%. Pausei 1 campanha com ACoS de 31%.");

  // Fase 3: Insights
  await sleep(2000);
  msg("ceo", "━━━ INSIGHTS DO DIA ━━━", "meeting");
  await sleep(500);

  const insights = [
    "Concorrente 'TechBR' está agressivo em fones bluetooth — monitorar de perto e ajustar preço se necessário",
    "Categoria 'cabos e adaptadores' cresceu 23% em buscas esta semana — oportunidade de expandir catálogo",
    "Tempo médio de resposta nas perguntas: 12 minutos — excelente, mantém reputação verde",
    "SKU #1847 (Carregador 65W) é o top performer: 142 vendas, ACoS 7%, margem 34% — escalar budget",
    "2 anúncios em bronze precisam de atenção urgente: ficha técnica incompleta + poucas fotos",
  ];

  for (const insight of insights) {
    addMsg("ceo", `• ${insight}`);
    await sleep(1000);
  }

  // Fase 4: Métricas consolidadas
  const metrics = [
    { label: "Vendas do Dia", value: "47", change: "+12%", positive: true },
    { label: "Faturamento", value: "R$ 8.340", change: "+8%", positive: true },
    { label: "Anúncios Otimizados", value: "7", change: "+3 vs ontem", positive: true },
    { label: "Score SEO Médio", value: "86", change: "+14 pontos", positive: true },
    { label: "Buy Box", value: "78%", change: "-2%", positive: false },
    { label: "ACoS Médio", value: "12%", change: "-3%", positive: true },
    { label: "Margem Média", value: "28%", change: "+1%", positive: true },
    { label: "Tempo Resposta Perguntas", value: "12 min", change: "-5 min", positive: true },
  ];

  await sleep(1500);
  addMsg("ceo", "Reunião encerrada. Números consolidados salvos no relatório. Amanhã continuamos. Boa noite, equipe.");

  // Salva relatório
  const report: DailyMeetingReport = {
    id: Date.now().toString(),
    date: dateStr,
    time: timeStr,
    type: "automatica",
    messages: reportMessages,
    insights,
    metrics,
  };

  saveMeetingReport(report);

  // Envia por e-mail + WhatsApp
  await sendReportEmail(report);
  await sendReportWhatsApp(report);

  // Volta todos pra casa
  clearInterval(timerInterval);
  useOfficeStore.getState().setMeetingTimer(0);

  await sleep(1500);
  for (const id of agents) {
    moveHome(id);
    status(id, "online");
    await sleep(1000);
  }

  store.setMeeting(false);
  return report;
}

// ═══ Reunião de Alinhamento (manual) ═══

export async function runAlignmentMeeting(topic: string) {
  const store = useOfficeStore.getState();
  store.setMeeting(true);

  const agents: AgentRole[] = ["ceo", "ads", "comercial", "calls"];
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

  const reportMessages: { agent: string; color: string; text: string }[] = [];
  const addMsg = (id: AgentRole, text: string) => {
    msg(id, text, "meeting");
    reportMessages.push({ agent: AGENTS[id].name, color: AGENTS[id].color, text });
  };

  let remaining = 180;
  store.setMeetingTimer(remaining);
  const timerInterval = setInterval(() => {
    remaining--;
    useOfficeStore.getState().setMeetingTimer(remaining);
    if (remaining <= 0) clearInterval(timerInterval);
  }, 1000);

  // Move todos
  for (const id of agents) {
    moveToMeeting(id);
    status(id, "meeting");
    await sleep(800);
  }
  await sleep(1500);

  msg("ceo", "━━━ REUNIÃO DE ALINHAMENTO ━━━", "meeting");
  await sleep(500);
  addMsg("ceo", `Equipe, reunião de alinhamento sobre: <strong>"${topic}"</strong>. Cada um traga sua perspectiva.`);

  await sleep(2000);
  addMsg("ads", `Sobre "${topic}" — do lado de anúncios, vou verificar como isso impacta os títulos, fichas e posicionamento dos nossos SKUs. Se precisar reotimizar, já faço na sequência.`);

  await sleep(2000);
  addMsg("comercial", `Vou cruzar "${topic}" com os dados de concorrência. Verifico se algum movimento de mercado está relacionado e trago as oportunidades ou riscos.`);

  await sleep(2000);
  addMsg("calls", `Se precisar de material visual novo relacionado a "${topic}", já preparo. Infográficos, banners ou fotos atualizadas — é só o Anúncios pedir.`);

  await sleep(2000);
  addMsg("ceo", `Perfeito. Vou consolidar as ações e garantir que tudo esteja dentro das regras de margem. Cada um executa sua parte e me reporta quando concluir.`);

  const insights = [
    `Alinhamento realizado sobre: "${topic}"`,
    "Todos os agentes cientes e com ações definidas",
    "Gestor ML vai monitorar a execução e consolidar resultado",
  ];

  const report: DailyMeetingReport = {
    id: Date.now().toString(),
    date: dateStr,
    time: timeStr,
    type: "alinhamento",
    messages: reportMessages,
    insights,
    metrics: [],
  };

  saveMeetingReport(report);
  await sendReportEmail(report);
  await sendReportWhatsApp(report);

  clearInterval(timerInterval);
  useOfficeStore.getState().setMeetingTimer(0);

  await sleep(1500);
  for (const id of agents) {
    moveHome(id);
    status(id, "online");
    await sleep(1000);
  }

  store.setMeeting(false);
  return report;
}

// ═══ Scheduler: Verifica hora de Brasília a cada minuto ═══

export function useDailyMeetingScheduler() {
  const hasRunToday = useRef(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      // Hora de Brasília (UTC-3)
      const brasiliaHour = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const h = brasiliaHour.getHours();
      const m = brasiliaHour.getMinutes();

      // 20:00 Brasília — roda uma vez por dia
      if (h === 20 && m === 0 && !hasRunToday.current) {
        hasRunToday.current = true;
        runDailyMeeting();
      }

      // Reset à meia-noite
      if (h === 0 && m === 0) {
        hasRunToday.current = false;
      }
    };

    check();
    const interval = setInterval(check, 60000); // verifica a cada 1 minuto
    return () => clearInterval(interval);
  }, []);
}
