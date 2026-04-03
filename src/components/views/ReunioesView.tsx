"use client";

import { useState, useEffect } from "react";
import { getMeetingReports, runDailyMeeting, runAlignmentMeeting, sendReportEmail, type DailyMeetingReport } from "@/lib/dailyMeeting";

export function ReunioesView() {
  const [reports, setReports] = useState<DailyMeetingReport[]>([]);
  const [alignmentTopic, setAlignmentTopic] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyMeetingReport | null>(null);
  const [emailSent, setEmailSent] = useState<string | null>(null);

  useEffect(() => {
    setReports(getMeetingReports());
  }, []);

  const handleDailyMeeting = async () => {
    setIsRunning(true);
    await runDailyMeeting();
    setReports(getMeetingReports());
    setIsRunning(false);
  };

  const handleAlignmentMeeting = async () => {
    if (!alignmentTopic.trim()) return;
    setIsRunning(true);
    await runAlignmentMeeting(alignmentTopic);
    setAlignmentTopic("");
    setReports(getMeetingReports());
    setIsRunning(false);
  };

  const handleSendEmail = async (report: DailyMeetingReport) => {
    await sendReportEmail(report);
    setEmailSent(report.id);
    setTimeout(() => setEmailSent(null), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A]">Reuniões Diárias</h1>
        <p className="text-sm text-[#5C5C5C] mt-1">Todo dia às 20h os agentes se reúnem automaticamente. Você também pode convocar um alinhamento a qualquer momento.</p>
      </div>

      {/* Ações */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Reunião diária manual */}
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-5">
          <h3 className="font-display font-semibold mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
            Reunião Diária
          </h3>
          <p className="text-xs text-[#5C5C5C] mb-4">Roda automaticamente às 20h (Brasília). Clique para executar manualmente agora.</p>
          <button
            onClick={handleDailyMeeting}
            disabled={isRunning}
            className="w-full px-4 py-2.5 bg-[#FF4D00] text-white font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#E04400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? "Reunião em andamento..." : "Iniciar Reunião Diária"}
          </button>
        </div>

        {/* Reunião de alinhamento */}
        <div className="bg-white border border-[#5C5C5C]/10 rounded-lg p-5">
          <h3 className="font-display font-semibold mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3483FA]" />
            Reunião de Alinhamento
          </h3>
          <p className="text-xs text-[#5C5C5C] mb-3">Convoque uma reunião sobre qualquer tema.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={alignmentTopic}
              onChange={(e) => setAlignmentTopic(e.target.value)}
              placeholder="Ex: Ajustar preço dos fones bluetooth"
              className="flex-1 px-3 py-2 border border-[#5C5C5C]/15 rounded-lg text-sm focus:outline-none focus:border-[#FF4D00]/50"
              onKeyDown={(e) => e.key === "Enter" && handleAlignmentMeeting()}
            />
            <button
              onClick={handleAlignmentMeeting}
              disabled={isRunning || !alignmentTopic.trim()}
              className="px-4 py-2 bg-[#0A0A0A] text-white font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Convocar
            </button>
          </div>
        </div>
      </div>

      {/* Info: próxima reunião automática */}
      <div className="bg-[#0A0A0A] text-white rounded-lg p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF4D00]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#FF4D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D00]">Próxima reunião automática</p>
            <p className="text-sm font-semibold">Hoje às 20:00 (Brasília)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#5C5C5C]">E-mail:</span>
          <span className="font-mono text-[10px] text-[#FF4D00]">look.zimmermann@gmail.com · welkerdigital@gmail.com</span>
        </div>
      </div>

      {/* Histórico de reuniões */}
      <h2 className="font-display font-semibold text-lg mb-4">Histórico</h2>

      {reports.length === 0 ? (
        <div className="text-center py-16 text-[#5C5C5C]">
          <p className="font-mono text-xs uppercase tracking-widest">Nenhuma reunião ainda</p>
          <p className="text-sm mt-2">A primeira reunião será hoje às 20h ou clique para iniciar manualmente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border border-[#5C5C5C]/10 rounded-lg overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F4F4F0]/50 transition-colors"
                onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${report.type === "automatica" ? "bg-[#FF4D00]" : "bg-[#3483FA]"}`} />
                  <div>
                    <p className="font-medium text-sm text-[#0A0A0A]">
                      {report.type === "automatica" ? "Reunião Diária" : "Alinhamento"}
                      <span className="text-[#5C5C5C] font-normal ml-2">— {report.date}</span>
                    </p>
                    <p className="font-mono text-[10px] text-[#5C5C5C]">{report.time} · {report.messages.length} mensagens · {report.insights.length} insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSendEmail(report); }}
                    className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-[#5C5C5C]/15 rounded hover:border-[#FF4D00]/40 hover:text-[#FF4D00] transition-colors"
                  >
                    {emailSent === report.id ? "Enviado!" : "Enviar e-mail"}
                  </button>
                  <svg className={`w-4 h-4 text-[#5C5C5C] transition-transform ${selectedReport?.id === report.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Conteúdo expandido */}
              {selectedReport?.id === report.id && (
                <div className="border-t border-[#5C5C5C]/10 px-5 py-4 space-y-4">
                  {/* Métricas */}
                  {report.metrics.length > 0 && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D00] mb-2">Métricas</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {report.metrics.map((m, i) => (
                          <div key={i} className="bg-[#F4F4F0] rounded p-2 text-center">
                            <p className="text-[9px] uppercase tracking-widest text-[#5C5C5C] font-mono">{m.label}</p>
                            <p className="font-display font-bold text-lg text-[#0A0A0A]">{m.value}</p>
                            <p className={`text-[10px] font-mono ${m.positive ? "text-[#00A650]" : "text-[#DC2626]"}`}>{m.change}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D00] mb-2">Insights</p>
                    <ul className="space-y-1">
                      {report.insights.map((ins, i) => (
                        <li key={i} className="text-sm text-[#5C5C5C] flex items-start gap-2">
                          <span className="text-[#FF4D00] mt-1">•</span> {ins}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diálogo */}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#FF4D00] mb-2">Diálogo</p>
                    <div className="space-y-2">
                      {report.messages.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-widest font-semibold" style={{ color: m.color }}>{m.agent}</span>
                            <p className="text-xs text-[#5C5C5C]" dangerouslySetInnerHTML={{ __html: m.text }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
