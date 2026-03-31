import type {
  AgentConfig,
  AgentRole,
  DoorConfig,
  FurnitureItem,
  NeonConfig,
  RoomConfig,
  WallSegment,
  WindowConfig,
} from "@/types";

// ═══════════════════════════════════════════════════
//  BUILDING — 24m × 16m modern office
// ═══════════════════════════════════════════════════

export const WALL_H = 3.0;
export const WALL_T = 0.12;
export const WALL_TI = 0.08;

const H = WALL_H;
const YC = H / 2;
const PI = Math.PI;

// ═══════════════════════════════════════════════════
//  ROOMS
// ═══════════════════════════════════════════════════

export const ROOMS: RoomConfig[] = [
  { id: "ceo", name: "Diretoria CEO", type: "office", center: [-7.5, 0, -4.75], size: [9, 6.5], color: "#6366f1", agentId: "ceo" },
  { id: "ads", name: "Sala Ads", type: "office", center: [0.5, 0, -4.75], size: [7, 6.5], color: "#f59e0b", agentId: "ads" },
  { id: "meeting", name: "Sala de Reuniao", type: "meeting", center: [8, 0, -4.75], size: [8, 6.5], color: "#8b5cf6" },
  { id: "corridor", name: "Corredor", type: "lounge", center: [0, 0, 0], size: [24, 3], color: "#94a3b8" },
  { id: "comercial", name: "Sala Comercial", type: "office", center: [-7.5, 0, 4.75], size: [9, 6.5], color: "#3b82f6", agentId: "comercial" },
  { id: "imagen", name: "Sala de Imagen", type: "office", center: [0.5, 0, 4.75], size: [7, 6.5], color: "#10b981", agentId: "imagen" },
];

// ═══════════════════════════════════════════════════
//  AGENTS
// ═══════════════════════════════════════════════════

export const AGENTS: Record<AgentRole, AgentConfig> = {
  ceo: {
    id: "ceo", name: "CEO", title: "Orquestrador Estrategico", color: "#6366f1",
    homePosition: [-4, 0, 9.2],
    meetingPosition: [-7.8, 0, 8.5],
    skills: ["Consolidacao Executiva", "Decisao Cross-Funil", "Priorizacao de Receita", "Analise Cruzada", "Direcionamento Estrategico", "Growth Leadership", "Review Semanal"],
  },
  ads: {
    id: "ads", name: "ADS", title: "Analista de Midia Paga", color: "#f59e0b",
    homePosition: [-4.11, 0, 5.4],
    meetingPosition: [-7, 0, 9],
    skills: ["Meta Ads", "Google Ads", "CPL / CPA / CAC", "Ranking de Campanhas", "Analise de Criativos", "Eficiencia por Canal", "Alertas de Desperdicio", "Otimizacao de Budget"],
  },
  comercial: {
    id: "comercial", name: "COMERCIAL", title: "Analista de Pipeline & CRM", color: "#3b82f6",
    homePosition: [-7.45, 0, 5.2],
    meetingPosition: [-8.5, 0, 9],
    skills: ["Pipeline Analysis", "CRM / Funil Comercial", "Taxa de Conversao", "Custo por Oportunidade", "Custo por Venda", "Gargalos Mkt→Vendas", "Revenue por Origem", "Alinhamento Comercial"],
  },
  imagen: {
    id: "imagen", name: "IMAGEN", title: "Analista de Imagem & Criativos", color: "#10b981",
    homePosition: [-1, 0, 2.8],
    meetingPosition: [-7, 0, 8],
    skills: ["Geracao de Imagens", "Criativos para Ads", "Branding Visual", "Design de Posts", "Thumbnails", "Banners & CTAs", "Identidade Visual", "A/B de Criativos"],
  },
};

// ═══════════════════════════════════════════════════
//  OUTER WALLS — 4 continuous
// ═══════════════════════════════════════════════════

export const OUTER_WALLS: WallSegment[] = [
  { position: [0, YC, -8], size: [24.24, H, WALL_T] },
  { position: [0, YC, 8], size: [24.24, H, WALL_T] },
  { position: [-12, YC, 0], size: [WALL_T, H, 16.24] },
  { position: [12, YC, 0], size: [WALL_T, H, 16.24] },
];

// ═══════════════════════════════════════════════════
//  INTERIOR WALLS
// ═══════════════════════════════════════════════════

export const INTERIOR_WALLS: WallSegment[] = [
  // z=-1.5 gaps: CEO[-8,-7], Google[0,1], Meeting[7.5,8.5]
  { position: [-10.5, YC, -1.5], size: [3, H, WALL_TI] },
  { position: [-5, YC, -1.5], size: [4, H, WALL_TI] },
  { position: [-1.25, YC, -1.5], size: [3.5, H, WALL_TI] },
  { position: [2.5, YC, -1.5], size: [3, H, WALL_TI] },
  { position: [5.75, YC, -1.5], size: [3.5, H, WALL_TI] },
  { position: [10.25, YC, -1.5], size: [3.5, H, WALL_TI] },
  // z=1.5 gaps: Meta[-8,-7], Copy[0,1], Analytics[7.5,8.5]
  { position: [-10.5, YC, 1.5], size: [3, H, WALL_TI] },
  { position: [-5, YC, 1.5], size: [4, H, WALL_TI] },
  { position: [-1.25, YC, 1.5], size: [3.5, H, WALL_TI] },
  { position: [2.5, YC, 1.5], size: [3, H, WALL_TI] },
  { position: [5.75, YC, 1.5], size: [3.5, H, WALL_TI] },
  { position: [10.25, YC, 1.5], size: [3.5, H, WALL_TI] },
  // Vertical dividers
  { position: [-3, YC, -4.75], size: [WALL_TI, H, 6.5] },
  { position: [-3, YC, 4.75], size: [WALL_TI, H, 6.5] },
  { position: [4, YC, -4.75], size: [WALL_TI, H, 6.5] },
  { position: [4, YC, 4.75], size: [WALL_TI, H, 6.5] },
];

// ═══════════════════════════════════════════════════
//  DOORS — 5 escritorios
// ═══════════════════════════════════════════════════

export const DOORS: DoorConfig[] = [
  { position: [-7.5, 0, -1.5], rotation: 0, accentColor: "#6366f1", label: "CEO" },
  { position: [0.5, 0, -1.5], rotation: 0, accentColor: "#f59e0b", label: "GOOGLE" },
  { position: [-7.5, 0, 1.5], rotation: PI, accentColor: "#3b82f6", label: "META" },
  { position: [0.5, 0, 1.5], rotation: PI, accentColor: "#f472b6", label: "COPY" },
  { position: [8, 0, 1.5], rotation: PI, accentColor: "#10b981", label: "ANALYTICS" },
];

// ═══════════════════════════════════════════════════
//  WINDOWS
// ═══════════════════════════════════════════════════

export const WINDOWS: WindowConfig[] = [
  { position: [-7.5, 1.6, -7.9], rotation: 0 },
  { position: [0.5, 1.6, -7.9], rotation: 0 },
  { position: [8, 1.6, -7.9], rotation: 0 },
  { position: [-7.5, 1.6, 7.9], rotation: PI },
  { position: [0.5, 1.6, 7.9], rotation: PI },
  { position: [8, 1.6, 7.9], rotation: PI },
  { position: [-11.9, 1.6, -4.75], rotation: PI / 2 },
  { position: [-11.9, 1.6, 4.75], rotation: PI / 2 },
  { position: [11.9, 1.6, -4.75], rotation: -PI / 2 },
  { position: [11.9, 1.6, 4.75], rotation: -PI / 2 },
];

// ═══════════════════════════════════════════════════
//  NEON ACCENTS (subtle for modern look)
// ═══════════════════════════════════════════════════

export const OUTER_NEONS: NeonConfig[] = [
  { position: [0, 0.015, -7.94], size: [24, 0.02, 0.008], color: "#6366f1" },
  { position: [0, 0.015, 7.94], size: [24, 0.02, 0.008], color: "#3b82f6" },
  { position: [-11.94, 0.015, 0], size: [0.008, 0.02, 16], color: "#10b981" },
  { position: [11.94, 0.015, 0], size: [0.008, 0.02, 16], color: "#8b5cf6" },
];

export const INNER_NEONS: NeonConfig[] = [
  { position: [-7.5, H + 0.005, -1.5], size: [9, 0.01, 0.03], color: "#6366f1" },
  { position: [0.5, H + 0.005, -1.5], size: [7, 0.01, 0.03], color: "#f59e0b" },
  { position: [8, H + 0.005, -1.5], size: [8, 0.01, 0.03], color: "#8b5cf6" },
  { position: [-7.5, H + 0.005, 1.5], size: [9, 0.01, 0.03], color: "#3b82f6" },
  { position: [0.5, H + 0.005, 1.5], size: [7, 0.01, 0.03], color: "#f472b6" },
  { position: [8, H + 0.005, 1.5], size: [8, 0.01, 0.03], color: "#10b981" },
];

// ═══════════════════════════════════════════════════
//  ROOM FURNITURE — procedural components
//  (tipos: desk, chair, plant, bookshelf, trashBin,
//   whiteboard, meetingTable, sofa, coffeeTable, deskLamp)
// ═══════════════════════════════════════════════════

export const ROOM_FURNITURE: Record<string, FurnitureItem[]> = {
  ceo: [
    { type: "desk", position: [-9, 0, -6], props: { accentColor: "#6366f1" } },
    { type: "chair", position: [-9, 0, -4.8], props: { color: "#6366f1" } },
    { type: "deskLamp", position: [-10.2, 0, -6], props: { color: "#6366f1" } },
    { type: "bookshelf", position: [-11.5, 0, -5] },
    { type: "plant", position: [-5, 0, -7], props: { scale: 1.2 } },
    { type: "trashBin", position: [-5, 0, -2.5] },
  ],

  ads: [
    { type: "desk", position: [0.5, 0, -6], props: { accentColor: "#f59e0b" } },
    { type: "chair", position: [0.5, 0, -4.8], props: { color: "#f59e0b" } },
    { type: "deskLamp", position: [1.7, 0, -6], props: { color: "#f59e0b" } },
    { type: "bookshelf", position: [3.5, 0, -5] },
    { type: "plant", position: [-2, 0, -7] },
    { type: "trashBin", position: [3, 0, -2.5] },
  ],

  meeting: [
    { type: "meetingTable", position: [8, 0, -4.5] },
    { type: "chair", position: [6.5, 0, -5.5], props: { color: "#6366f1" } },
    { type: "chair", position: [9.5, 0, -5.5], props: { color: "#3b82f6" } },
    { type: "chair", position: [6.5, 0, -3.5], props: { color: "#f59e0b" } },
    { type: "chair", position: [9.5, 0, -3.5], props: { color: "#f472b6" } },
    { type: "chair", position: [8, 0, -2.8], props: { color: "#10b981" } },
    { type: "whiteboard", position: [8, 0, -7.6] },
    { type: "plant", position: [5, 0, -7], props: { scale: 1.3 } },
    { type: "plant", position: [11, 0, -7], props: { scale: 1.1 } },
  ],

  corridor: [
    { type: "sofa", position: [-9, 0, -0.3], props: { rotation: PI / 2 } },
    { type: "coffeeTable", position: [-8, 0, 0] },
    { type: "plant", position: [-6.3, 0, -1.1] },
    { type: "plant", position: [1.7, 0, -1.1] },
    { type: "plant", position: [-6.3, 0, 1.1] },
    { type: "plant", position: [1.7, 0, 1.1] },
    { type: "plant", position: [9.2, 0, 1.1] },
  ],

  comercial: [
    { type: "desk", position: [-9, 0, 6], props: { accentColor: "#3b82f6", rotation: PI } },
    { type: "chair", position: [-9, 0, 4.8], props: { color: "#3b82f6" } },
    { type: "deskLamp", position: [-10.2, 0, 6], props: { color: "#3b82f6" } },
    { type: "bookshelf", position: [-11.5, 0, 5] },
    { type: "plant", position: [-5, 0, 7], props: { scale: 1.1 } },
    { type: "trashBin", position: [-5, 0, 2.5] },
  ],

  imagen: [
    { type: "desk", position: [0.5, 0, 6], props: { accentColor: "#f472b6", rotation: PI } },
    { type: "chair", position: [0.5, 0, 4.8], props: { color: "#f472b6" } },
    { type: "deskLamp", position: [1.7, 0, 6], props: { color: "#f472b6" } },
    { type: "bookshelf", position: [3.5, 0, 5] },
    { type: "plant", position: [-2, 0, 7], props: { scale: 1.2 } },
    { type: "trashBin", position: [3, 0, 2.5] },
  ],

};
