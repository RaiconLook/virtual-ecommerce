"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "./LoadingScreen";
import { LeftSidebar, type AppView } from "./ui/LeftSidebar";
import { PainelView } from "./views/PainelView";
import { AnunciosView } from "./views/AnunciosView";
import { CampanhasView } from "./views/CampanhasView";
import { RelatoriosView } from "./views/RelatoriosView";

const OfficeCanvas = dynamic(
  () => import("./office/Scene").then((m) => m.OfficeCanvas),
  { ssr: false }
);

export function OfficeApp() {
  const [loaded, setLoaded] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("escritorio");

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const showOverlay = activeView !== "escritorio";

  return (
    <div className="h-screen flex bg-[#F4F4F0] overflow-hidden">
      {!loaded && <LoadingScreen />}

      <LeftSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 3D Canvas — SEMPRE montado, nunca desmonta */}
        <div className="absolute inset-0">
          <OfficeCanvas />
        </div>

        {/* Overlay das views — fica por cima do 3D */}
        {showOverlay && (
          <div className="absolute inset-0 z-10 bg-[#F4F4F0]/95 backdrop-blur-sm overflow-y-auto">
            {activeView === "painel" && <PainelView />}
            {activeView === "anuncios" && <AnunciosView />}
            {activeView === "campanhas" && <CampanhasView />}
            {activeView === "relatorios" && <RelatoriosView />}
          </div>
        )}
      </div>
    </div>
  );
}
