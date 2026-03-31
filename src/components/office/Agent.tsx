"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { AgentRole, AgentStatus } from "@/types";
import { AGENTS } from "@/lib/constants";
import { useOfficeStore } from "@/store/useOfficeStore";

const STATUS_COLORS: Record<AgentStatus, string> = {
  online: "#34d399",
  busy: "#fb923c",
  meeting: "#8b5cf6",
  away: "#64748b",
};

const WALK_SPEED = 1.8;

// ─── Avatar with ref-based animation (runs in useFrame, no re-renders) ───

function AgentAvatar({
  color,
  walkPhaseRef,
}: {
  color: string;
  walkPhaseRef: React.RefObject<number>;
}) {
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const phase = walkPhaseRef.current ?? 0;
    const active = Math.abs(phase) > 0.01;
    const leg = active ? Math.sin(phase) * 0.4 : 0;
    const arm = active ? Math.sin(phase) * 0.35 : 0;
    const bob = active ? Math.abs(Math.sin(phase)) * 0.03 : 0;

    if (bodyRef.current) bodyRef.current.position.y = bob;
    if (leftArmRef.current) leftArmRef.current.rotation.x = arm;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -arm;
    if (leftLegRef.current) leftLegRef.current.rotation.x = leg;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -leg;
  });

  return (
    <group ref={bodyRef}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#e8d5c0" roughness={0.7} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.12, -0.02]}>
        <sphereGeometry args={[0.17, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.06, 1.02, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#0a0a14" />
      </mesh>
      <mesh position={[0.06, 1.02, 0.16]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#0a0a14" />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.22, 0.6, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.22, 0.6, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.08, 0.3, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.08, 0.3, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
        </mesh>
      </group>

      {/* Ground glow ring */}
      <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// ─── Agent Entity (movement + label) ────────────────

export function AgentEntity({ id }: { id: AgentRole }) {
  const groupRef = useRef<THREE.Group>(null!);
  const agent = AGENTS[id];
  const agentState = useOfficeStore((s) => s.agents[id]);
  const walkPhaseRef = useRef(0);
  const currentPos = useRef(new THREE.Vector3(...agent.homePosition));
  const targetPos = useRef(new THREE.Vector3(...agent.homePosition));
  const facingAngle = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const sp = agentState.position;
    targetPos.current.set(sp[0], sp[1], sp[2]);

    const dx = targetPos.current.x - currentPos.current.x;
    const dz = targetPos.current.z - currentPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.05) {
      // Walking
      const step = Math.min(WALK_SPEED * delta, dist);
      const nx = dx / dist;
      const nz = dz / dist;
      currentPos.current.x += nx * step;
      currentPos.current.z += nz * step;

      // Face direction
      const ta = Math.atan2(nx, nz);
      let ad = ta - facingAngle.current;
      while (ad > Math.PI) ad -= Math.PI * 2;
      while (ad < -Math.PI) ad += Math.PI * 2;
      facingAngle.current += ad * Math.min(1, 5 * delta);

      walkPhaseRef.current += delta * 10;
    } else {
      // Arrived — decay walk animation
      currentPos.current.copy(targetPos.current);
      walkPhaseRef.current *= 0.85;
    }

    groupRef.current.position.set(
      currentPos.current.x,
      currentPos.current.y,
      currentPos.current.z,
    );

    // Idle bob
    if (dist <= 0.05) {
      groupRef.current.position.y +=
        Math.sin(Date.now() * 0.002 + id.charCodeAt(0)) * 0.003;
    }

    groupRef.current.rotation.y = facingAngle.current;
  });

  return (
    <group ref={groupRef} position={agent.homePosition}>
      <AgentAvatar color={agent.color} walkPhaseRef={walkPhaseRef} />

      <Html
        position={[0, 1.55, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <div
            className="px-3 py-1 rounded-md text-white text-[10px] font-semibold tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-white/10 shadow-lg"
            style={{ backgroundColor: agent.color + "cc" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[agentState.status] }}
            />
            {agent.name}
          </div>
          <div className="text-[8px] text-gray-500 font-medium">
            {agentState.status === "meeting"
              ? "em reuniao"
              : agentState.status === "busy"
                ? "trabalhando"
                : agentState.status}
          </div>
        </div>
      </Html>
    </group>
  );
}
