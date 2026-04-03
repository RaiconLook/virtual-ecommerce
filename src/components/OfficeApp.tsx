"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "./LoadingScreen";
import { LeftSidebar, type AppView } from "./ui/LeftSidebar";
import { PainelView } from "./views/PainelView";
import { AnunciosView } from "./views/AnunciosView";
import { CampanhasView } from "./views/CampanhasView";
import { PerguntasView } from "./views/PerguntasView";
import { ReunioesView } from "./views/ReunioesView";
import { RelatoriosView } from "./views/RelatoriosView";
import { useDailyMeetingScheduler } from "@/lib/dailyMeeting";

const OfficeCanvas = dynamic(
  () => import("./office/Scene").then((m) => m.OfficeCanvas),
  { ssr: false, loading: () => null }
);

export function OfficeApp() {
  const [activeView, setActiveView] = useState<AppView>("escritorio");

  // Agenda reunião diária automática às 20h (Brasília)
  useDailyMeetingScheduler();

  const showOverlay = activeView !== "escritorio";

  return (
    <div className="h-screen flex bg-[#F4F4F0] overflow-hidden">
      <LoadingScreen />

      <LeftSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0">
          <OfficeCanvas />
        </div>

        {showOverlay && (
          <div className="absolute inset-0 z-20 glass overflow-y-auto">
            {activeView === "painel" && <PainelView />}
            {activeView === "anuncios" && <AnunciosView />}
            {activeView === "campanhas" && <CampanhasView />}
            {activeView === "perguntas" && <PerguntasView />}
            {activeView === "reunioes" && <ReunioesView />}
            {activeView === "relatorios" && <RelatoriosView />}
          </div>
        )}
      </div>
    </div>
  );
}
