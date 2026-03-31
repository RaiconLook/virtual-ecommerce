/**
 * Multiplayer presence layer — prepared for Socket.IO or Supabase Realtime.
 *
 * Architecture:
 * - Each client sends its agent positions + status every 50ms (throttled)
 * - Server broadcasts state to all other clients
 * - On receive, update remote agents in Zustand store
 *
 * To activate:
 * 1. Install socket.io-client (already in deps)
 * 2. Set NEXT_PUBLIC_WS_URL in .env.local
 * 3. Call connectMultiplayer() on mount
 */

import type { AgentRole, AgentStatus } from "@/types";
import type { Vector3Tuple } from "three";

export interface PresencePayload {
  peerId: string;
  agents: Record<
    AgentRole,
    { position: Vector3Tuple; status: AgentStatus }
  >;
  timestamp: number;
}

// Placeholder — replace with real Socket.IO or Supabase connection
export function connectMultiplayer(
  _onPresence: (payload: PresencePayload) => void
) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (!wsUrl) {
    console.info(
      "[multiplayer] No WS_URL configured — running in single-player mode"
    );
    return { disconnect: () => {}, send: (_p: PresencePayload) => {} };
  }

  // Example Socket.IO integration:
  // const socket = io(wsUrl);
  // socket.on("presence", onPresence);
  // return {
  //   disconnect: () => socket.disconnect(),
  //   send: (p: PresencePayload) => socket.emit("presence", p),
  // };

  return { disconnect: () => {}, send: (_p: PresencePayload) => {} };
}
