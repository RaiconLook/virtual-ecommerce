import type { Vector3Tuple } from "three";

export type AgentRole = "ceo" | "ads" | "comercial" | "imagen";
export type AgentStatus = "online" | "busy" | "meeting" | "away";
export type RoomType = "office" | "meeting" | "lounge" | "lab";

export interface AgentConfig {
  id: AgentRole;
  name: string;
  title: string;
  color: string;
  homePosition: Vector3Tuple;
  meetingPosition: Vector3Tuple;
  skills: string[];
}

export interface RoomConfig {
  id: string;
  name: string;
  type: RoomType;
  center: Vector3Tuple;
  size: [number, number]; // [width X, depth Z]
  color: string;
  agentId?: AgentRole;
}

export interface WallSegment {
  position: Vector3Tuple;
  size: [number, number, number];
}

export interface DoorConfig {
  position: Vector3Tuple;
  rotation: number;
  accentColor: string;
  label?: string;
}

export interface WindowConfig {
  position: Vector3Tuple;
  rotation: number;
}

export interface NeonConfig {
  position: Vector3Tuple;
  size: [number, number, number];
  color: string;
}

export interface FurnitureItem {
  type: string;
  position: Vector3Tuple;
  props?: Record<string, unknown>;
}

// ═══ Editor types ═══

export interface RouteConfig {
  waypoints: Vector3Tuple[];
  color: string;
}

export interface NodeOverride {
  visible?: boolean;
  position?: Vector3Tuple;
  rotation?: number;
}

export interface GlbNodeInfo {
  name: string;
  type: "furniture" | "door" | "other";
  position: Vector3Tuple;
}

export interface ChatMessage {
  id: string;
  agentId: AgentRole | "user";
  text: string;
  timestamp: number;
  type: "message" | "meeting" | "system" | "scope";
}
