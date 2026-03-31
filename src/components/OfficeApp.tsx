"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "./LoadingScreen";
import { LeftSidebar, type AppView } from "./ui/LeftSidebar";
import { Sidebar } from "./ui/Sidebar";
import { KanbanView } from "./views/KanbanView";
import { AgentesView } from "./views/AgentesView";
import { SkillsView } from "./views/SkillsView";
import { TarefasView } from "./views/TarefasView";

const OfficeCanvas = dynamic(
  () => import("./office/Scene").then((m) => m.OfficeCanvas),
  { ssr: false }
);

export function OfficeApp() {
  const [loaded, setLoaded] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("dashboard");

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const isFullPage = activeView === "kanban" || activeView === "agentes" || activeView === "skills" || activeView === "tarefas";

  return (
    <div className="h-screen flex bg-[#F4F4F0] overflow-hidden">
      {!loaded && <LoadingScreen />}

      <LeftSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas - always visible except full-page views */}
        {!isFullPage && (
          <div className="flex-1 relative">
            <OfficeCanvas />
          </div>
        )}

        {/* Full-page views */}
        {activeView === "kanban" && <KanbanView />}
        {activeView === "agentes" && <AgentesView />}
        {activeView === "skills" && <SkillsView />}
        {activeView === "tarefas" && <TarefasView />}

        {/* Chat panel - slides in when chat is active */}
        {activeView === "chat" && <Sidebar />}
      </div>
    </div>
  );
}
