import { create } from "zustand";
import type { AgentRole, AgentStatus, ChatMessage } from "@/types";
import type { Vector3Tuple } from "three";
import { AGENTS } from "@/lib/constants";

interface AgentState {
  position: Vector3Tuple;
  status: AgentStatus;
  targetPosition: Vector3Tuple | null;
}

interface OfficeState {
  agents: Record<AgentRole, AgentState>;
  messages: ChatMessage[];
  activeRoom: string | null;
  isMeeting: boolean;
  meetingTimer: number;
  entrySignalCount: number; // how many agents passed their 2nd waypoint

  setAgentPosition: (id: AgentRole, pos: Vector3Tuple) => void;
  setAgentTarget: (id: AgentRole, pos: Vector3Tuple | null) => void;
  setAgentStatus: (id: AgentRole, status: AgentStatus) => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActiveRoom: (roomId: string | null) => void;
  setMeeting: (active: boolean) => void;
  setMeetingTimer: (seconds: number) => void;
  signalNextEntry: () => void;
}

function initAgentState(id: AgentRole): AgentState {
  const agent = AGENTS[id];
  return {
    position: [...agent.homePosition] as Vector3Tuple,
    status: "online",
    targetPosition: null,
  };
}

export const useOfficeStore = create<OfficeState>((set) => ({
  agents: {
    ceo: initAgentState("ceo"),
    ads: initAgentState("ads"),
    comercial: initAgentState("comercial"),
    imagen: initAgentState("imagen"),
  },
  messages: [],
  activeRoom: null,
  isMeeting: false,
  meetingTimer: 0,
  entrySignalCount: 0,

  setAgentPosition: (id, pos) =>
    set((s) => ({
      agents: { ...s.agents, [id]: { ...s.agents[id], position: pos } },
    })),

  setAgentTarget: (id, pos) =>
    set((s) => ({
      agents: { ...s.agents, [id]: { ...s.agents[id], targetPosition: pos } },
    })),

  setAgentStatus: (id, status) =>
    set((s) => ({
      agents: { ...s.agents, [id]: { ...s.agents[id], status } },
    })),

  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  setMeeting: (active) => set({ isMeeting: active }),
  setMeetingTimer: (seconds) => set({ meetingTimer: seconds }),
  signalNextEntry: () => set((s) => ({ entrySignalCount: s.entrySignalCount + 1 })),
}));
