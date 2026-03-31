import { create } from "zustand";
import type { Vector3Tuple, Object3D } from "three";
import type { AgentRole, RouteConfig, NodeOverride, GlbNodeInfo } from "@/types";

// Module-level scene ref for GLB export (not reactive)
let _officeScene: Object3D | null = null;

// ALL door nodes from the GLB model — room doors + cabinet doors + sliding doors
export const DOOR_NAMES = [
  // Room doors (7 groups)
  "Door_Group.009_19", "DoorFrame.009_18", "Door.009_17",
  "Door_Group.010_24", "DoorFrame.010_23", "Door.010_22",
  "Door_Group.011_29", "DoorFrame.011_28", "Door.011_27",
  "Door_Group.001_403", "DoorFrame.001_402", "Door.001_401",
  "Door_Group.002_474", "DoorFrame.002_473", "Door.002_472",
  "Door_Group_602", "DoorFrame_601", "Door_600",
  // Sliding / double doors
  "door_L_505", "door_R_506",
  // Cabinet doors (22)
  "Cabinet1_Door.001_41", "Cabinet1_Door.002_31", "Cabinet1_Door.003_51",
  "Cabinet1_Door.004_45", "Cabinet1_Door.005_67", "Cabinet1_Door.006_61",
  "Cabinet1_Door.007_57", "Cabinet1_Door.008_54", "Cabinet1_Door.009_48",
  "Cabinet1_Door.010_64", "Cabinet1_Door.011_108", "Cabinet1_Door.012_98",
  "Cabinet1_Door.013_122", "Cabinet1_Door.014_112", "Cabinet1_Door.015_115",
  "Cabinet1_Door.016_123", "Cabinet1_Door.017_139", "Cabinet1_Door.018_127",
  "Cabinet1_Door.019_130", "Cabinet1_Door.020_140",
  "Cabinet1_Door.021_533", "Cabinet1_Door.022_523",
];

// Labels for display
export const DOOR_LABELS: Record<string, string> = {
  "Door_Group.009_19": "Porta Sala 1", "DoorFrame.009_18": "Batente Sala 1", "Door.009_17": "Folha Sala 1",
  "Door_Group.010_24": "Porta Sala 2", "DoorFrame.010_23": "Batente Sala 2", "Door.010_22": "Folha Sala 2",
  "Door_Group.011_29": "Porta Sala 3", "DoorFrame.011_28": "Batente Sala 3", "Door.011_27": "Folha Sala 3",
  "Door_Group.001_403": "Porta Sala 4", "DoorFrame.001_402": "Batente Sala 4", "Door.001_401": "Folha Sala 4",
  "Door_Group.002_474": "Porta Sala 5", "DoorFrame.002_473": "Batente Sala 5", "Door.002_472": "Folha Sala 5",
  "Door_Group_602": "Porta Entrada", "DoorFrame_601": "Batente Entrada", "Door_600": "Folha Entrada",
  "door_L_505": "Porta Dupla Esq", "door_R_506": "Porta Dupla Dir",
};

// Default entry routes (definitivo — salvo pelo usuario)
const DEFAULT_ROUTES: Record<AgentRole, RouteConfig> = {
  ceo: {
    color: "#6366f1",
    waypoints: [[-2.7, 0, -0.66], [-2.74, 0, 6.5], [-4.83, 0, 6.83], [-5.05, 0, 9.33], [-3.1, 0, 9.73], [-4, 0, 9.2]],
  },
  ads: {
    color: "#f59e0b",
    waypoints: [[-2.74, 0, -0.5], [-2.74, 0, 6.5], [-4.11, 0, 6.5], [-4.11, 0, 5.4]],
  },
  comercial: {
    color: "#3b82f6",
    waypoints: [[-2.74, 0, -0.5], [-2.74, 0, 6.5], [-7.45, 0, 6.5], [-7.45, 0, 5.2]],
  },
  imagen: {
    color: "#10b981",
    waypoints: [[-2.8, 0, -0.51], [-2.7, 0, 3], [-0.5, 0, 3], [-1, 0, 2.8]],
  },
};

const DEFAULT_MEETING_ROUTES: Record<AgentRole, RouteConfig> = {
  ceo: {
    color: "#6366f1",
    waypoints: [[-3.8, 0, 9], [-2.7, 0, 9.6], [-5, 0, 9.64], [-5, 0, 6.41], [-5.9, 0, 6.41], [-6.2, 0, 8.6]],
  },
  ads: {
    color: "#f59e0b",
    waypoints: [[-4.02, 0, 5.49], [-4.11, 0, 6.5], [-5.75, 0, 6.35], [-5.86, 0, 7.64], [-5.7, 0, 9.4], [-6.7, 0, 9.2]],
  },
  comercial: {
    color: "#3b82f6",
    waypoints: [[-7.45, 0, 5.53], [-5.9, 0, 6.1], [-6, 0, 7.3], [-7.4, 0, 7.2], [-7.5, 0, 7.6]],
  },
  imagen: {
    color: "#10b981",
    waypoints: [[-1.26, 0, 2.7], [-3.07, 0, 3.1], [-2.7, 0, 6.5], [-5.7, 0, 6.47], [-5.91, 0, 7.57], [-6.7, 0, 7.8]],
  },
};

export type EditorMode = "off" | "routes" | "furniture" | "doors";

interface EditorState {
  mode: EditorMode;
  setMode: (m: EditorMode) => void;

  // ── Routes ──
  routeType: "entry" | "meeting";
  routes: Record<AgentRole, RouteConfig>;
  meetingRoutes: Record<AgentRole, RouteConfig>;
  selectedAgent: AgentRole | null;
  selectedWpIdx: number | null;
  setRouteType: (t: "entry" | "meeting") => void;
  selectAgent: (id: AgentRole | null) => void;
  selectWaypoint: (idx: number | null) => void;
  updateWaypoint: (agent: AgentRole, idx: number, pos: Vector3Tuple) => void;
  addWaypoint: (agent: AgentRole) => void;
  removeWaypoint: (agent: AgentRole, idx: number) => void;

  // ── Furniture ──
  glbNodes: GlbNodeInfo[];
  setGlbNodes: (nodes: GlbNodeInfo[]) => void;
  furnitureOverrides: Record<string, NodeOverride>;
  selectedNode: string | null;
  selectNode: (name: string | null) => void;
  updateNodePos: (name: string, pos: Vector3Tuple) => void;
  updateNodeRot: (name: string, rot: number) => void;
  toggleNodeVisible: (name: string) => void;

  // ── Doors ──
  doorStates: Record<string, boolean>; // name → visible
  toggleDoor: (name: string) => void;
  showAllDoors: () => void;
  hideAllDoors: () => void;

  // ── Save / Load / Export ──
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportConfig: () => string;

  // ── GLB scene export ──
  setGlbScene: (scene: Object3D) => void;
  exportGlb: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: "off",
  setMode: (m) => set({ mode: m, selectedAgent: null, selectedNode: null, selectedWpIdx: null }),

  // Routes
  routeType: "entry",
  routes: { ...DEFAULT_ROUTES },
  meetingRoutes: { ...DEFAULT_MEETING_ROUTES },
  selectedAgent: null,
  selectedWpIdx: null,
  setRouteType: (t) => set({ routeType: t, selectedWpIdx: null }),
  selectAgent: (id) => set({ selectedAgent: id, selectedWpIdx: null }),
  selectWaypoint: (idx) => set({ selectedWpIdx: idx }),
  updateWaypoint: (agent, idx, pos) =>
    set((s) => {
      const key = s.routeType === "entry" ? "routes" : "meetingRoutes";
      const r = { ...s[key] };
      const wps = [...r[agent].waypoints];
      wps[idx] = pos;
      r[agent] = { ...r[agent], waypoints: wps };
      return { [key]: r };
    }),
  addWaypoint: (agent) =>
    set((s) => {
      const key = s.routeType === "entry" ? "routes" : "meetingRoutes";
      const r = { ...s[key] };
      const wps = [...r[agent].waypoints];
      const last = wps[wps.length - 1] || [0, 0, 0];
      wps.push([last[0] + 1, 0, last[2]]);
      r[agent] = { ...r[agent], waypoints: wps };
      return { [key]: r };
    }),
  removeWaypoint: (agent, idx) =>
    set((s) => {
      const key = s.routeType === "entry" ? "routes" : "meetingRoutes";
      const r = { ...s[key] };
      const wps = [...r[agent].waypoints];
      if (wps.length > 2) wps.splice(idx, 1);
      r[agent] = { ...r[agent], waypoints: wps };
      return { [key]: r };
    }),

  // Furniture
  glbNodes: [],
  setGlbNodes: (nodes) => set({ glbNodes: nodes }),
  furnitureOverrides: {
    "simple_desk000_586": { position: [-3.7, -0.1, 8.5] },
    "Desk002_257": { position: [-4.267918586730957, 0.4, 4.63565731048584] },
    "OfficeChair_Modern005_274": { visible: false },
    "OfficeChair_Modern006_283": { visible: false },
    "OfficeChair_Modern009_310": { visible: false },
  } as Record<string, NodeOverride>,
  selectedNode: null,
  selectNode: (name) => set({ selectedNode: name }),
  updateNodePos: (name, pos) =>
    set((s) => ({
      furnitureOverrides: { ...s.furnitureOverrides, [name]: { ...s.furnitureOverrides[name], position: pos } },
    })),
  updateNodeRot: (name, rot) =>
    set((s) => ({
      furnitureOverrides: { ...s.furnitureOverrides, [name]: { ...s.furnitureOverrides[name], rotation: rot } },
    })),
  toggleNodeVisible: (name) =>
    set((s) => {
      const cur = s.furnitureOverrides[name];
      const visible = cur?.visible !== undefined ? !cur.visible : false;
      return { furnitureOverrides: { ...s.furnitureOverrides, [name]: { ...cur, visible } } };
    }),

  // Doors
  doorStates: Object.fromEntries(DOOR_NAMES.map((n) => [n, true])), // all visible (user config)
  toggleDoor: (name) => set((s) => ({ doorStates: { ...s.doorStates, [name]: !s.doorStates[name] } })),
  showAllDoors: () => set((s) => ({ doorStates: Object.fromEntries(Object.keys(s.doorStates).map((n) => [n, true])) })),
  hideAllDoors: () => set((s) => ({ doorStates: Object.fromEntries(Object.keys(s.doorStates).map((n) => [n, false])) })),

  // Save to localStorage
  saveToStorage: () => {
    const { routes, meetingRoutes, furnitureOverrides, doorStates } = get();
    const data = { routes, meetingRoutes, furnitureOverrides, doorStates };
    try {
      localStorage.setItem("office-editor-config", JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save:", e);
    }
  },

  // Load from localStorage
  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem("office-editor-config");
      if (!raw) return;
      const data = JSON.parse(raw);
      set({
        ...(data.routes ? { routes: data.routes } : {}),
        ...(data.meetingRoutes ? { meetingRoutes: data.meetingRoutes } : {}),
        ...(data.furnitureOverrides ? { furnitureOverrides: data.furnitureOverrides } : {}),
        ...(data.doorStates ? { doorStates: data.doorStates } : {}),
      });
    } catch (e) {
      console.error("Failed to load:", e);
    }
  },

  // Export to clipboard
  exportConfig: () => {
    const { routes, meetingRoutes, furnitureOverrides, doorStates } = get();
    const config = { routes, meetingRoutes, furnitureOverrides, doorStates };
    return JSON.stringify(config, null, 2);
  },

  // GLB scene export
  setGlbScene: (scene) => { _officeScene = scene; },
  exportGlb: async () => {
    if (!_officeScene) { console.error("Scene not loaded"); return; }
    const { GLTFExporter } = await import("three/addons/exporters/GLTFExporter.js");
    const { doorStates, furnitureOverrides } = get();

    const clone = _officeScene.clone(true);
    clone.traverse((node) => {
      if (DOOR_NAMES.includes(node.name)) {
        node.visible = doorStates[node.name] ?? false;
      }
      const ov = furnitureOverrides[node.name];
      if (ov) {
        if (ov.visible === false) node.visible = false;
        if (ov.position) node.position.set(ov.position[0], ov.position[1], ov.position[2]);
        if (ov.rotation !== undefined) node.rotation.y = ov.rotation;
      }
    });

    const exporter = new GLTFExporter();
    const result = await exporter.parseAsync(clone, { binary: true });
    const blob = new Blob([result as ArrayBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "escritorio-virtual.glb";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
