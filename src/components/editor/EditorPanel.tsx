"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditorStore, DOOR_LABELS } from "@/store/useEditorStore";
import type { EditorMode } from "@/store/useEditorStore";
import { AGENTS } from "@/lib/constants";
import type { AgentRole } from "@/types";

const MODES: { id: EditorMode; label: string }[] = [
  { id: "routes", label: "Rotas" },
  { id: "furniture", label: "Moveis" },
  { id: "doors", label: "Portas" },
];

export function EditorPanel() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const exportConfig = useEditorStore((s) => s.exportConfig);
  const saveToStorage = useEditorStore((s) => s.saveToStorage);
  const loadFromStorage = useEditorStore((s) => s.loadFromStorage);
  const exportGlb = useEditorStore((s) => s.exportGlb);
  const [exported, setExported] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load saved config on mount
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  const handleExport = useCallback(() => {
    const json = exportConfig();
    navigator.clipboard.writeText(json);
    console.log("EXPORTED:", json);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [exportConfig]);

  const handleSave = useCallback(() => {
    saveToStorage();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [saveToStorage]);

  const handleExportGlb = useCallback(async () => {
    setExporting(true);
    try { await exportGlb(); } finally { setExporting(false); }
  }, [exportGlb]);

  if (mode === "off") return null;

  return (
    <div className="fixed top-14 right-[410px] z-50 w-[320px] max-h-[calc(100vh-60px)] overflow-y-auto bg-[#0c0c14] border border-[#1e1e2e] rounded-xl shadow-2xl text-[#ccc] text-xs">
      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-[#0c0c14] border-b border-[#1e1e2e] px-3 py-2 flex items-center gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-3 py-1 rounded text-[10px] font-bold transition ${mode === m.id ? "bg-indigo-600 text-white" : "bg-[#161620] text-[#555] hover:text-[#aaa]"}`}>
            {m.label}
          </button>
        ))}
        <button onClick={() => setMode("off")} className="ml-auto text-[10px] text-red-500 hover:text-red-400 px-2">X</button>
      </div>

      {/* Content */}
      <div className="p-3">
        {mode === "routes" && <RoutesTab />}
        {mode === "furniture" && <FurnitureTab />}
        {mode === "doors" && <DoorsTab />}
      </div>

      {/* Save + Export */}
      <div className="sticky bottom-0 bg-[#0c0c14] border-t border-[#1e1e2e] p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={handleSave}
            className={`flex-1 py-2 rounded text-[11px] font-bold transition ${saved ? "bg-emerald-600 text-white" : "bg-emerald-700 hover:bg-emerald-600 text-white"}`}>
            {saved ? "Salvo!" : "Salvar"}
          </button>
          <button onClick={handleExport}
            className={`flex-1 py-2 rounded text-[11px] font-bold transition ${exported ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
            {exported ? "Copiado!" : "Exportar JSON"}
          </button>
        </div>
        <button onClick={handleExportGlb} disabled={exporting}
          className={`w-full py-2 rounded text-[11px] font-bold transition ${exporting ? "bg-amber-800 text-amber-300 cursor-wait" : "bg-amber-600 hover:bg-amber-500 text-white"}`}>
          {exporting ? "Exportando..." : "Baixar GLB"}
        </button>
      </div>
    </div>
  );
}

// ═══ Routes Tab ═══

function RoutesTab() {
  const routeType = useEditorStore((s) => s.routeType);
  const setRouteType = useEditorStore((s) => s.setRouteType);
  const entryRoutes = useEditorStore((s) => s.routes);
  const meetingRoutes = useEditorStore((s) => s.meetingRoutes);
  const selectedAgent = useEditorStore((s) => s.selectedAgent);
  const selectedWpIdx = useEditorStore((s) => s.selectedWpIdx);
  const selectAgent = useEditorStore((s) => s.selectAgent);
  const selectWaypoint = useEditorStore((s) => s.selectWaypoint);
  const updateWaypoint = useEditorStore((s) => s.updateWaypoint);
  const addWaypoint = useEditorStore((s) => s.addWaypoint);
  const removeWaypoint = useEditorStore((s) => s.removeWaypoint);

  const agentIds = Object.keys(AGENTS) as AgentRole[];
  const routes = routeType === "entry" ? entryRoutes : meetingRoutes;
  const selRoute = selectedAgent ? routes[selectedAgent] : null;

  return (
    <div>
      {/* Route type toggle */}
      <div className="flex gap-1 mb-3">
        <button onClick={() => setRouteType("entry")}
          className={`flex-1 py-1.5 rounded text-[10px] font-bold transition ${routeType === "entry" ? "bg-emerald-700 text-white" : "bg-[#161620] text-[#555]"}`}>
          Rota Entrada
        </button>
        <button onClick={() => setRouteType("meeting")}
          className={`flex-1 py-1.5 rounded text-[10px] font-bold transition ${routeType === "meeting" ? "bg-purple-700 text-white" : "bg-[#161620] text-[#555]"}`}>
          Rota Reuniao
        </button>
      </div>
      <div className="text-[9px] text-[#444] uppercase tracking-wider mb-2">Selecione o agente</div>
      <div className="flex flex-wrap gap-1 mb-3">
        {agentIds.map((id) => (
          <button key={id} onClick={() => selectAgent(id)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition ${selectedAgent === id ? "text-white" : "text-[#666] hover:text-[#aaa]"}`}
            style={{ backgroundColor: selectedAgent === id ? routes[id].color : "#161620" }}>
            {AGENTS[id].name}
          </button>
        ))}
      </div>

      {selRoute && selectedAgent && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-[#444] uppercase">Waypoints ({selRoute.waypoints.length})</span>
            <button onClick={() => addWaypoint(selectedAgent)}
              className="text-[10px] px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold">+ Ponto</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selRoute.waypoints.map((wp, i) => (
              <div key={i} onClick={() => selectWaypoint(i)}
                className={`p-2 rounded border transition cursor-pointer ${selectedWpIdx === i ? "border-indigo-500 bg-indigo-600/10" : "border-transparent hover:bg-[#161620]"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono" style={{ color: selRoute.color }}>P{i}</span>
                  {i > 0 && i < selRoute.waypoints.length - 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeWaypoint(selectedAgent, i); }}
                      className="text-[9px] text-red-500 hover:text-red-400">Remover</button>
                  )}
                </div>
                {selectedWpIdx === i && (
                  <div className="space-y-1 mt-1">
                    <Sl label="X" value={wp[0]} min={-12} max={12} step={0.1}
                      onChange={(v) => updateWaypoint(selectedAgent, i, [v, wp[1], wp[2]])} />
                    <Sl label="Z" value={wp[2]} min={-3} max={11} step={0.1}
                      onChange={(v) => updateWaypoint(selectedAgent, i, [wp[0], wp[1], v])} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══ Furniture Tab ═══

function FurnitureTab() {
  const glbNodes = useEditorStore((s) => s.glbNodes);
  const selectedNode = useEditorStore((s) => s.selectedNode);
  const selectNode = useEditorStore((s) => s.selectNode);
  const overrides = useEditorStore((s) => s.furnitureOverrides);
  const updateNodePos = useEditorStore((s) => s.updateNodePos);
  const updateNodeRot = useEditorStore((s) => s.updateNodeRot);
  const toggleNodeVisible = useEditorStore((s) => s.toggleNodeVisible);
  const [filter, setFilter] = useState("");

  const furniture = glbNodes.filter((n) => n.type === "furniture");
  const filtered = filter ? furniture.filter((n) => n.name.toLowerCase().includes(filter.toLowerCase())) : furniture;
  const sel = selectedNode ? furniture.find((n) => n.name === selectedNode) : null;
  const selOverride = selectedNode ? overrides[selectedNode] : null;

  return (
    <div>
      <input type="text" placeholder="Buscar movel..." value={filter} onChange={(e) => setFilter(e.target.value)}
        className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-2 py-1.5 text-[11px] text-[#aaa] outline-none focus:border-indigo-500 mb-2" />

      <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1">{filtered.length} moveis</div>
      <div className="space-y-0.5 max-h-40 overflow-y-auto mb-3">
        {filtered.map((n) => {
          const hidden = overrides[n.name]?.visible === false;
          return (
            <div key={n.name} onClick={() => selectNode(n.name)}
              className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-[10px] transition ${selectedNode === n.name ? "bg-indigo-600/20 border border-indigo-500/40" : "hover:bg-[#161620] border border-transparent"} ${hidden ? "opacity-40" : ""}`}>
              <span className="truncate">{n.name.replace(/_\d+$/, "")}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleNodeVisible(n.name); }}
                className={`text-[9px] px-1 ${hidden ? "text-red-500" : "text-emerald-500"}`}>
                {hidden ? "OFF" : "ON"}
              </button>
            </div>
          );
        })}
      </div>

      {sel && (
        <div className="border-t border-[#1e1e2e] pt-2 space-y-1">
          <div className="text-[10px] text-indigo-400 font-bold mb-1">{sel.name.replace(/_\d+$/, "")}</div>
          <Sl label="X" value={selOverride?.position?.[0] ?? sel.position[0]} min={-12} max={12} step={0.1}
            onChange={(v) => updateNodePos(sel.name, [v, selOverride?.position?.[1] ?? sel.position[1], selOverride?.position?.[2] ?? sel.position[2]])} />
          <Sl label="Y" value={selOverride?.position?.[1] ?? sel.position[1]} min={-2} max={5} step={0.05}
            onChange={(v) => updateNodePos(sel.name, [selOverride?.position?.[0] ?? sel.position[0], v, selOverride?.position?.[2] ?? sel.position[2]])} />
          <Sl label="Z" value={selOverride?.position?.[2] ?? sel.position[2]} min={-3} max={11} step={0.1}
            onChange={(v) => updateNodePos(sel.name, [selOverride?.position?.[0] ?? sel.position[0], selOverride?.position?.[1] ?? sel.position[1], v])} />
          <Sl label="Rot" value={selOverride?.rotation ?? 0} min={-3.14} max={3.14} step={0.05}
            onChange={(v) => updateNodeRot(sel.name, v)} />
        </div>
      )}
    </div>
  );
}

// ═══ Doors Tab ═══

function DoorsTab() {
  const doorStates = useEditorStore((s) => s.doorStates);
  const toggleDoor = useEditorStore((s) => s.toggleDoor);
  const showAll = useEditorStore((s) => s.showAllDoors);
  const hideAll = useEditorStore((s) => s.hideAllDoors);

  // Group: room doors, cabinet doors, sliding doors
  const roomDoors = Object.keys(doorStates).filter((n) => n.startsWith("Door") && !n.startsWith("DoorFrame") && !n.includes("Cabinet"));
  const frames = Object.keys(doorStates).filter((n) => n.startsWith("DoorFrame"));
  const cabinets = Object.keys(doorStates).filter((n) => n.includes("Cabinet"));
  const sliding = Object.keys(doorStates).filter((n) => n.startsWith("door_"));

  const label = (name: string) => DOOR_LABELS[name] || name.replace(/_\d+$/, "");

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button onClick={showAll} className="flex-1 py-1 rounded text-[10px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold">Mostrar todas</button>
        <button onClick={hideAll} className="flex-1 py-1 rounded text-[10px] bg-red-700 hover:bg-red-600 text-white font-bold">Esconder todas</button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        <DoorGroup title="Portas de Sala" names={roomDoors} states={doorStates} toggle={toggleDoor} label={label} />
        <DoorGroup title="Batentes" names={frames} states={doorStates} toggle={toggleDoor} label={label} />
        <DoorGroup title="Portas Duplas" names={sliding} states={doorStates} toggle={toggleDoor} label={label} />
        <DoorGroup title="Portas de Armario" names={cabinets} states={doorStates} toggle={toggleDoor} label={label} />
      </div>
    </div>
  );
}

function DoorGroup({ title, names, states, toggle, label }: {
  title: string; names: string[]; states: Record<string, boolean>; toggle: (n: string) => void; label: (n: string) => string;
}) {
  if (names.length === 0) return null;
  const allOn = names.every((n) => states[n]);
  const toggleAll = () => names.forEach((n) => { if (states[n] !== !allOn) toggle(n); });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-[#444] uppercase tracking-wider">{title} ({names.length})</span>
        <button onClick={toggleAll}
          className={`text-[9px] px-2 py-0.5 rounded font-bold ${allOn ? "bg-red-700 text-white" : "bg-emerald-700 text-white"}`}>
          {allOn ? "Esconder" : "Mostrar"}
        </button>
      </div>
      {names.map((name) => (
        <div key={name} className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#161620]">
          <span className="text-[10px] truncate">{label(name)}</span>
          <button onClick={() => toggle(name)}
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${states[name] ? "bg-emerald-700 text-white" : "bg-[#1e1e2e] text-[#555]"}`}>
            {states[name] ? "ON" : "OFF"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ═══ Slider ═══

function Sl({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#555] w-5 font-mono">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 accent-indigo-500 bg-[#1a1a24] rounded cursor-pointer" />
      <input type="number" value={Number(value.toFixed(2))} step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-14 bg-[#111118] border border-[#1e1e2e] rounded px-1 py-0.5 text-[10px] text-center font-mono text-[#aaa] outline-none focus:border-indigo-500" />
    </div>
  );
}
