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
  { id: "ceo", name: "Central de Operações", type: "office", center: [-7.5, 0, -4.75], size: [9, 6.5], color: "#ffe600", agentId: "ceo" },
  { id: "ads", name: "Sala de Anúncios", type: "office", center: [0.5, 0, -4.75], size: [7, 6.5], color: "#3483fa", agentId: "ads" },
  { id: "meeting", name: "Sala de Estratégia", type: "meeting", center: [8, 0, -4.75], size: [8, 6.5], color: "#8b5cf6" },
  { id: "corridor", name: "Hub Central", type: "lounge", center: [0, 0, 0], size: [24, 3], color: "#94a3b8" },
  { id: "comercial", name: "Sala de Análise", type: "office", center: [-7.5, 0, 4.75], size: [9, 6.5], color: "#00a650", agentId: "comercial" },
  { id: "imagen", name: "Estúdio Criativo", type: "office", center: [0.5, 0, 4.75], size: [7, 6.5], color: "#e040fb", agentId: "imagen" },
];

// ═══════════════════════════════════════════════════
//  AGENTS
// ═══════════════════════════════════════════════════

export const AGENTS: Record<AgentRole, AgentConfig> = {
  ceo: {
    id: "ceo", name: "GESTOR ML", title: "Orquestrador de Operações Marketplace", color: "#ffe600",
    homePosition: [-4, 0, 9.2],
    meetingPosition: [-7.8, 0, 8.5],
    skills: ["Visão Geral da Conta", "Health Score & Reputação", "Decisão de Catálogo", "Análise de Rentabilidade", "Estratégia de Growth", "Gestão de Fulfillment", "Relatório Executivo Diário"],
  },
  ads: {
    id: "ads", name: "ANÚNCIOS", title: "Especialista em Listagens & SEO ML", color: "#3483fa",
    homePosition: [-4.11, 0, 5.4],
    meetingPosition: [-7, 0, 9],
    skills: ["Criação de Anúncios", "SEO Mercado Livre", "Otimização de Títulos", "Ficha Técnica Completa", "Catálogo Oficial", "Variações & Kits", "Análise de Concorrência", "Qualidade do Anúncio"],
  },
  comercial: {
    id: "comercial", name: "ANALISTA", title: "Analista de Produtos & Mercado", color: "#00a650",
    homePosition: [-7.45, 0, 5.2],
    meetingPosition: [-8.5, 0, 9],
    skills: ["Pesquisa de Tendências", "Análise de Concorrência", "Monitoramento Buy Box", "Precificação Dinâmica", "Margem por SKU", "Demanda por Categoria", "Produtos em Alta", "Oportunidades de Nicho"],
  },
  imagen: {
    id: "imagen", name: "CRIATIVO", title: "Criação de Imagens & Visual", color: "#e040fb",
    homePosition: [-1, 0, 2.8],
    meetingPosition: [-7, 0, 8],
    skills: ["Fotos de Produto (IA)", "Banners Promocionais", "Imagens para Anúncios", "Infográficos de Ficha Técnica", "Remoção de Fundo", "Mockups de Produto", "Vídeos Curtos", "Identidade Visual de Loja"],
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
  { position: [-7.5, 0, -1.5], rotation: 0, accentColor: "#ffe600", label: "GESTOR" },
  { position: [0.5, 0, -1.5], rotation: 0, accentColor: "#3483fa", label: "ANÚNCIOS" },
  { position: [-7.5, 0, 1.5], rotation: PI, accentColor: "#00a650", label: "ANALISTA" },
  { position: [0.5, 0, 1.5], rotation: PI, accentColor: "#e040fb", label: "CRIATIVO" },
  { position: [8, 0, 1.5], rotation: PI, accentColor: "#8b5cf6", label: "ESTRATÉGIA" },
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
  { position: [0, 0.015, -7.94], size: [24, 0.02, 0.008], color: "#ffe600" },
  { position: [0, 0.015, 7.94], size: [24, 0.02, 0.008], color: "#e040fb" },
  { position: [-11.94, 0.015, 0], size: [0.008, 0.02, 16], color: "#00a650" },
  { position: [11.94, 0.015, 0], size: [0.008, 0.02, 16], color: "#3483fa" },
];

export const INNER_NEONS: NeonConfig[] = [
  { position: [-7.5, H + 0.005, -1.5], size: [9, 0.01, 0.03], color: "#ffe600" },
  { position: [0.5, H + 0.005, -1.5], size: [7, 0.01, 0.03], color: "#3483fa" },
  { position: [8, H + 0.005, -1.5], size: [8, 0.01, 0.03], color: "#8b5cf6" },
  { position: [-7.5, H + 0.005, 1.5], size: [9, 0.01, 0.03], color: "#00a650" },
  { position: [0.5, H + 0.005, 1.5], size: [7, 0.01, 0.03], color: "#e040fb" },
  { position: [8, H + 0.005, 1.5], size: [8, 0.01, 0.03], color: "#8b5cf6" },
];

// ═══════════════════════════════════════════════════
//  ROOM FURNITURE — procedural components
//  (tipos: desk, chair, plant, bookshelf, trashBin,
//   whiteboard, meetingTable, sofa, coffeeTable, deskLamp)
// ═══════════════════════════════════════════════════

export const ROOM_FURNITURE: Record<string, FurnitureItem[]> = {
  ceo: [
    { type: "desk", position: [-9, 0, -6], props: { accentColor: "#ffe600" } },
    { type: "chair", position: [-9, 0, -4.8], props: { color: "#ffe600" } },
    { type: "deskLamp", position: [-10.2, 0, -6], props: { color: "#ffe600" } },
    { type: "bookshelf", position: [-11.5, 0, -5] },
    { type: "plant", position: [-5, 0, -7], props: { scale: 1.2 } },
    { type: "trashBin", position: [-5, 0, -2.5] },
  ],

  ads: [
    { type: "desk", position: [0.5, 0, -6], props: { accentColor: "#3483fa" } },
    { type: "chair", position: [0.5, 0, -4.8], props: { color: "#3483fa" } },
    { type: "deskLamp", position: [1.7, 0, -6], props: { color: "#3483fa" } },
    { type: "bookshelf", position: [3.5, 0, -5] },
    { type: "plant", position: [-2, 0, -7] },
    { type: "trashBin", position: [3, 0, -2.5] },
  ],

  meeting: [
    { type: "meetingTable", position: [8, 0, -4.5] },
    { type: "chair", position: [6.5, 0, -5.5], props: { color: "#ffe600" } },
    { type: "chair", position: [9.5, 0, -5.5], props: { color: "#3483fa" } },
    { type: "chair", position: [6.5, 0, -3.5], props: { color: "#00a650" } },
    { type: "chair", position: [9.5, 0, -3.5], props: { color: "#e040fb" } },
    { type: "chair", position: [8, 0, -2.8], props: { color: "#8b5cf6" } },
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
    { type: "desk", position: [-9, 0, 6], props: { accentColor: "#00a650", rotation: PI } },
    { type: "chair", position: [-9, 0, 4.8], props: { color: "#00a650" } },
    { type: "deskLamp", position: [-10.2, 0, 6], props: { color: "#00a650" } },
    { type: "bookshelf", position: [-11.5, 0, 5] },
    { type: "plant", position: [-5, 0, 7], props: { scale: 1.1 } },
    { type: "trashBin", position: [-5, 0, 2.5] },
  ],

  imagen: [
    { type: "desk", position: [0.5, 0, 6], props: { accentColor: "#e040fb", rotation: PI } },
    { type: "chair", position: [0.5, 0, 4.8], props: { color: "#e040fb" } },
    { type: "deskLamp", position: [1.7, 0, 6], props: { color: "#e040fb" } },
    { type: "bookshelf", position: [3.5, 0, 5] },
    { type: "plant", position: [-2, 0, 7], props: { scale: 1.2 } },
    { type: "trashBin", position: [3, 0, 2.5] },
  ],

};
