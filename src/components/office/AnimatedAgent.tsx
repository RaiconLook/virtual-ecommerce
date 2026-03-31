"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import * as THREE from "three";
import type { AgentRole, AgentStatus } from "@/types";
import { AGENTS } from "@/lib/constants";
import { useOfficeStore } from "@/store/useOfficeStore";

// Each agent gets a different character
const CHARACTER_MODELS: Record<AgentRole, string> = {
  ceo: "/characters/char17.glb",
  ads: "/characters/char18.glb",
  comercial: "/characters/char10.glb",
  imagen: "/characters/char15.glb",
};

// Mixamo animations (separate GLB files)
const ANIM_URLS = {
  walk: "/animations/Walking_walk.glb",
  typing: "/animations/typing.glb",
  sitting: "/animations/sitting.glb",
};

const WALK_SPEED = 1.8;
const CHAR_SCALE = 1;

const STATUS_COLORS: Record<AgentStatus, string> = {
  online: "#34d399",
  busy: "#fb923c",
  meeting: "#8b5cf6",
  away: "#64748b",
};

// Load animation clips from separate GLB files
function useExternalAnimations() {
  const walkData = useGLTF(ANIM_URLS.walk);
  const typingData = useGLTF(ANIM_URLS.typing);
  const sittingData = useGLTF(ANIM_URLS.sitting);

  return useMemo(() => {
    const clips: THREE.AnimationClip[] = [];

    walkData.animations.forEach((clip) => {
      const c = clip.clone();
      c.name = "walk";
      clips.push(c);
    });
    typingData.animations.forEach((clip) => {
      const c = clip.clone();
      c.name = "typing";
      clips.push(c);
    });
    sittingData.animations.forEach((clip) => {
      const c = clip.clone();
      c.name = "sitting";
      clips.push(c);
    });

    return clips;
  }, [walkData.animations, typingData.animations, sittingData.animations]);
}

export function AnimatedAgent({ id }: { id: AgentRole }) {
  const groupRef = useRef<THREE.Group>(null!);
  const agent = AGENTS[id];
  const agentState = useOfficeStore((s) => s.agents[id]);

  // Movement refs
  const currentPos = useRef(new THREE.Vector3(...agent.homePosition));
  const targetPos = useRef(new THREE.Vector3(...agent.homePosition));
  const facingAngle = useRef(0);
  const currentAnimName = useRef("");

  // Load character
  const { scene } = useGLTF(CHARACTER_MODELS[id]);

  // Enable shadows
  useEffect(() => {
    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  // Load external animation clips
  const animClips = useExternalAnimations();

  // Bind animations to character
  const { actions } = useAnimations(animClips, groupRef);

  // Smooth animation transition
  const playAnim = useCallback(
    (name: string) => {
      if (currentAnimName.current === name) return;
      const prev = actions[currentAnimName.current];
      const next = actions[name];
      if (prev) prev.fadeOut(0.4);
      if (next) next.reset().fadeIn(0.4).play();
      currentAnimName.current = name;
    },
    [actions],
  );

  // Start with typing animation
  useEffect(() => {
    if (actions["typing"]) {
      actions["typing"].play();
      currentAnimName.current = "typing";
    } else if (actions["sitting"]) {
      actions["sitting"].play();
      currentAnimName.current = "sitting";
    }
  }, [actions]);

  // Movement + animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const sp = agentState.position;
    targetPos.current.set(sp[0], sp[1], sp[2]);

    const dx = targetPos.current.x - currentPos.current.x;
    const dz = targetPos.current.z - currentPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.05) {
      // Walking
      playAnim("walk");
      const step = Math.min(WALK_SPEED * delta, dist);
      const nx = dx / dist;
      const nz = dz / dist;
      currentPos.current.x += nx * step;
      currentPos.current.z += nz * step;

      const ta = Math.atan2(nx, nz);
      let ad = ta - facingAngle.current;
      while (ad > Math.PI) ad -= Math.PI * 2;
      while (ad < -Math.PI) ad += Math.PI * 2;
      facingAngle.current += ad * Math.min(1, 5 * delta);
    } else {
      // At destination
      currentPos.current.copy(targetPos.current);
      if (agentState.status === "meeting") {
        playAnim("sitting");
      } else {
        playAnim("typing");
      }
    }

    groupRef.current.position.set(
      currentPos.current.x,
      currentPos.current.y,
      currentPos.current.z,
    );
    groupRef.current.rotation.y = facingAngle.current;
  });

  return (
    <group ref={groupRef} position={agent.homePosition}>
      <primitive object={scene} scale={CHAR_SCALE} />

      <Html
        position={[0, 2.2, 0]}
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

// Preload everything
Object.values(CHARACTER_MODELS).forEach((url) => useGLTF.preload(url));
Object.values(ANIM_URLS).forEach((url) => useGLTF.preload(url));
