"use client";

import { Suspense, useMemo, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { AGENTS } from "@/lib/constants";
import { useOfficeStore } from "@/store/useOfficeStore";
import type { AgentRole, AgentStatus } from "@/types";

// ═══ Office — reads door/furniture visibility from editor store ═══

import { useEditorStore, DOOR_NAMES } from "@/store/useEditorStore";
import { EditorOverlays } from "@/components/editor/EditorOverlays";

function OfficeModel() {
  const { scene } = useGLTF("/office.glb");
  const doorStates = useEditorStore((s) => s.doorStates);
  const furnitureOverrides = useEditorStore((s) => s.furnitureOverrides);
  const editorMode = useEditorStore((s) => s.mode);
  const selectNode = useEditorStore((s) => s.selectNode);
  const setGlbNodes = useEditorStore((s) => s.setGlbNodes);
  const setGlbScene = useEditorStore((s) => s.setGlbScene);

  // Store scene ref for GLB export + build catalog
  useEffect(() => { setGlbScene(scene); }, [scene, setGlbScene]);

  useEffect(() => {
    const furniturePatterns = /desk|chair|table|shelf|cabinet|plant|sofa|lamp|monitor|printer|rack|whiteboard|picture|clock|couch|armchair|book|phone|cup|keyboard|screen/i;
    const nodes: { name: string; type: "furniture" | "door" | "other"; position: [number, number, number] }[] = [];
    scene.traverse((n) => {
      if (!n.name || n.name === "RootNode") return;
      const isDoor = DOOR_NAMES.includes(n.name);
      const isFurniture = furniturePatterns.test(n.name);
      if (isDoor || isFurniture) {
        const wp = new THREE.Vector3();
        n.getWorldPosition(wp);
        nodes.push({ name: n.name, type: isDoor ? "door" : "furniture", position: [wp.x, wp.y, wp.z] });
      }
    });
    setGlbNodes(nodes);
  }, [scene, setGlbNodes]);

  const office = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      // Apply door visibility from store
      if (node.name && DOOR_NAMES.includes(node.name)) {
        node.visible = doorStates[node.name] ?? false;
      }
      // Apply furniture overrides
      const ov = furnitureOverrides[node.name];
      if (ov) {
        if (ov.visible === false) node.visible = false;
        if (ov.position) node.position.set(ov.position[0], ov.position[1], ov.position[2]);
        if (ov.rotation !== undefined) node.rotation.y = ov.rotation;
      }
    });
    return clone;
  }, [scene, doorStates, furnitureOverrides]);

  // Click to select furniture in editor mode
  const handleClick = useCallback((e: { stopPropagation: () => void; object: THREE.Object3D }) => {
    if (editorMode !== "furniture") return;
    e.stopPropagation();
    let obj = e.object;
    // Walk up to find a named node
    while (obj && (!obj.name || obj.name === "RootNode")) obj = obj.parent!;
    if (obj?.name) selectNode(obj.name);
  }, [editorMode, selectNode]);

  return <primitive object={office} onClick={handleClick} />;
}

// ═══ Character config ═══

// Per-agent: original model (has texture) + animation path (has Mixamo skeleton)
const AGENT_CHARS: Record<AgentRole, {
  appearance: string;
  animPath: string;
}> = {
  ceo:       { appearance: "/characters/char17.glb", animPath: "/animations/char17" },
  ads:       { appearance: "/characters/char18.glb", animPath: "/animations/char18" },
  comercial: { appearance: "/characters/char10.glb", animPath: "/animations/char10" },
  imagen:     { appearance: "/characters/char15.glb", animPath: "/animations/char15" },
};

const STATUS_COLORS: Record<AgentStatus, string> = {
  online: "#22c55e", busy: "#22c55e", meeting: "#3b82f6", away: "#eab308",
};

// Facing when at desk (toward PC/monitor)
const DESK_FACING: Record<AgentRole, number> = {
  ceo: 2.82,
  ads: -2.91,
  comercial: 2.90,
  imagen: 2.82,
};

const MEETING_FACING: Record<AgentRole, number> = {
  ceo: -1.74,
  ads: -3.00,
  comercial: 0.66,
  imagen: -0.14,
};

const ENTRY: [number, number, number] = [-2.74, 0, -0.5];
const WALK_SPEED = 1.8;
const CHAR_SCALE = 100;
const COLLISION_RADIUS = 0.4; // character collision radius
const PUSH_STRENGTH = 2.0;   // how hard to push away from obstacles

type AnimState = "hidden" | "walking" | "sitdown" | "typing" | "standup" | "sitting";

function Character({ id, order }: { id: AgentRole; order: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const agent = AGENTS[id];
  const agentState = useOfficeStore((s) => s.agents[id]);
  const entrySignalCount = useOfficeStore((s) => s.entrySignalCount);
  const signalNextEntry = useOfficeStore((s) => s.signalNextEntry);
  const meetingFacing = MEETING_FACING[id];

  // Routes from editor store (moved up for desk facing computation)
  const entryRoute = useEditorStore((s) => s.routes[id]);
  const meetingRoute = useEditorStore((s) => s.meetingRoutes[id]);
  const glbNodes = useEditorStore((s) => s.glbNodes);
  const furnitureOvr = useEditorStore((s) => s.furnitureOverrides);

  // Auto-compute desk facing: face nearest desk/monitor/screen node
  const deskFacing = useMemo(() => {
    const lastWp = entryRoute.waypoints[entryRoute.waypoints.length - 1];
    if (!lastWp || glbNodes.length === 0) return DESK_FACING[id];
    const sx = lastWp[0], sz = lastWp[2];
    let bestDist = Infinity, bestAngle = DESK_FACING[id];
    for (const node of glbNodes) {
      if (node.type !== "furniture") continue;
      if (!/desk|monitor|screen/i.test(node.name) || /chair/i.test(node.name)) continue;
      const ov = furnitureOvr[node.name];
      const nx = ov?.position?.[0] ?? node.position[0];
      const nz = ov?.position?.[2] ?? node.position[2];
      const d = Math.hypot(nx - sx, nz - sz);
      if (d < bestDist && d < 3) { bestDist = d; bestAngle = Math.atan2(nx - sx, nz - sz); }
    }
    return bestAngle;
  }, [entryRoute, glbNodes, furnitureOvr, id]);


  const currentPos = useRef(new THREE.Vector3(...ENTRY));
  const facing = useRef(0);
  const animState = useRef<AnimState>("hidden");
  const waypoints = useRef<THREE.Vector3[]>([]);
  const wpIdx = useRef(0);
  const timer = useRef(0);
  const targetType = useRef<"desk" | "meeting">("desk");
  const hasSignaled = useRef(false);

  // Load character: Mixamo mesh+skeleton for animations, original GLB for appearance
  const charConfig = AGENT_CHARS[id];
  const anim = charConfig.animPath;
  const { scene: charScene, animations: walkAnims } = useGLTF(`${anim}/walk.glb?v=${id}`);
  const { scene: appearanceScene } = useGLTF(charConfig.appearance);
  const typingGlb = useGLTF(`${anim}/typing.glb`);
  const sittingGlb = useGLTF(`${anim}/sitting.glb`);
  const sitdownGlb = useGLTF(`${anim}/sitdown.glb`);
  const standupGlb = useGLTF(`${anim}/standup.glb`);

  // Apply material/texture from original character GLB to Mixamo mesh
  useEffect(() => {
    // Extract material from original character
    let charMat: THREE.Material | null = null;
    appearanceScene.traverse((n) => {
      if ((n as THREE.Mesh).isMesh && !charMat) {
        const mat = (n as THREE.Mesh).material;
        if (mat && (mat as THREE.MeshStandardMaterial).map) charMat = mat as THREE.Material;
        else if (mat) charMat = mat as THREE.Material;
      }
    });

    // Apply to Mixamo mesh
    charScene.traverse((n) => {
      if ((n as THREE.Mesh).isMesh) {
        const mesh = n as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (charMat) mesh.material = charMat.clone();
      }
    });
  }, [charScene, appearanceScene]);

  // All clips
  const clips = useMemo(() => {
    const c: THREE.AnimationClip[] = [];
    walkAnims.forEach((a) => { const cl = a.clone(); cl.name = "idle"; c.push(cl); }); // idle = walk pose fallback
    walkAnims.forEach((a) => { const cl = a.clone(); cl.name = "walk"; c.push(cl); });
    typingGlb.animations.forEach((a) => { const cl = a.clone(); cl.name = "typing"; c.push(cl); });
    sittingGlb.animations.forEach((a) => { const cl = a.clone(); cl.name = "sitting"; c.push(cl); });
    sitdownGlb.animations.forEach((a) => { const cl = a.clone(); cl.name = "sitdown"; c.push(cl); });
    standupGlb.animations.forEach((a) => { const cl = a.clone(); cl.name = "standup"; c.push(cl); });
    return c;
  }, [walkAnims, typingGlb.animations, sittingGlb.animations, sitdownGlb.animations, standupGlb.animations]);

  const { actions, mixer } = useAnimations(clips, groupRef);

  const play = useCallback((name: string, loop = true, onDone?: () => void) => {
    Object.values(actions).forEach((a) => a?.fadeOut(0.3));
    const action = actions[name];
    if (!action) return;
    action.reset().fadeIn(0.3);
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    action.clampWhenFinished = !loop;
    action.play();
    if (onDone) {
      const handler = () => { mixer.removeEventListener("finished", handler); onDone(); };
      mixer.addEventListener("finished", handler);
    }
  }, [actions, mixer]);

  // Detect meeting position change
  const prevPosKey = useRef(agentState.position.join(","));
  useEffect(() => {
    const key = agentState.position.join(",");
    if (key === prevPosKey.current) return;
    prevPosKey.current = key;

    const home = new THREE.Vector3(...agent.homePosition);
    const target = new THREE.Vector3(...agentState.position);

    if (animState.current === "typing" && target.distanceTo(home) > 0.5) {
      // Go to meeting — use meeting route from store
      targetType.current = "meeting";
      animState.current = "standup";
      play("standup", false, () => {
        animState.current = "walking";
        play("walk");
        waypoints.current = meetingRoute.waypoints.map((wp) => new THREE.Vector3(...wp));
        wpIdx.current = 0;
      });
    } else if (animState.current === "sitting" && target.distanceTo(home) < 0.5) {
      // Return to desk — reverse meeting route
      targetType.current = "desk";
      animState.current = "standup";
      play("standup", false, () => {
        animState.current = "walking";
        play("walk");
        waypoints.current = [...meetingRoute.waypoints].reverse().map((wp) => new THREE.Vector3(...wp));
        wpIdx.current = 0;
      });
    }
  }, [agentState.position, agent.homePosition, meetingRoute, play]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    // Sequential entry: wait for previous agent to pass 2nd waypoint
    if (animState.current === "hidden") {
      if (entrySignalCount < order) return;
      timer.current += dt;
      if (timer.current < 0.3) return;
      animState.current = "walking";
      targetType.current = "desk";
      play("walk");
      waypoints.current = entryRoute.waypoints.map((wp) => new THREE.Vector3(...wp));
      wpIdx.current = 0;
      hasSignaled.current = false;
    }

    // Walking
    if (animState.current === "walking") {
      const target = waypoints.current[wpIdx.current];
      if (!target) {
        // Arrived — snap to chair + offset to avoid clipping through chair back
        facing.current = targetType.current === "desk" ? deskFacing : meetingFacing;
        animState.current = "sitdown";
        play("sitdown", false, () => {
          if (targetType.current === "desk") {
            animState.current = "typing";
            play("typing");
          } else {
            animState.current = "sitting";
            play("sitting");
          }
        });
      } else {
        const dx = target.x - currentPos.current.x;
        const dz = target.z - currentPos.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 0.1) {
          const step = Math.min(WALK_SPEED * dt, dist);
          currentPos.current.x += (dx / dist) * step;
          currentPos.current.z += (dz / dist) * step;
          const ta = Math.atan2(dx / dist, dz / dist);
          let ad = ta - facing.current;
          while (ad > Math.PI) ad -= Math.PI * 2;
          while (ad < -Math.PI) ad += Math.PI * 2;
          facing.current += ad * Math.min(1, 8 * dt);
        } else {
          currentPos.current.set(target.x, 0, target.z);
          wpIdx.current++;
          // Signal next agent when reaching 2nd waypoint
          if (wpIdx.current >= 2 && !hasSignaled.current && targetType.current === "desk") {
            hasSignaled.current = true;
            signalNextEntry();
          }
        }
      }
    }

    // Simple collision: push character away from nearby furniture during walking
    if (animState.current === "walking" && glbNodes.length > 0) {
      const cx = currentPos.current.x, cz = currentPos.current.z;
      for (const node of glbNodes) {
        if (node.type !== "furniture") continue;
        if (/chair/i.test(node.name)) continue; // skip chairs
        const ov = furnitureOvr[node.name];
        if (ov?.visible === false) continue;
        const nx = ov?.position?.[0] ?? node.position[0];
        const nz = ov?.position?.[2] ?? node.position[2];
        const dx = cx - nx, dz = cz - nz;
        const dist = Math.hypot(dx, dz);
        if (dist < COLLISION_RADIUS && dist > 0.01) {
          const push = (COLLISION_RADIUS - dist) * PUSH_STRENGTH;
          currentPos.current.x += (dx / dist) * push * dt;
          currentPos.current.z += (dz / dist) * push * dt;
        }
      }
    }

    groupRef.current.position.copy(currentPos.current);
    groupRef.current.rotation.y = facing.current;
  });

  return (
    <group ref={groupRef} position={ENTRY}>
      <group scale={CHAR_SCALE}>
        <primitive object={charScene} />
      </group>
      <Html position={[0, 2, 0]} center distanceFactor={10} zIndexRange={[1, 0]} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center gap-0.5">
          <div className="px-2.5 py-0.5 rounded-md text-[9px] font-semibold tracking-wide flex items-center gap-1.5 backdrop-blur-md border shadow-lg"
            style={{ backgroundColor: "#0A0A0Add", borderColor: "#FF4D0040", color: "#F4F4F0" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[agentState.status], boxShadow: `0 0 6px ${STATUS_COLORS[agentState.status]}80` }} />
            {agent.name}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ═══ Main ═══

function OfficeScene() {
  const agentIds = Object.keys(AGENTS) as AgentRole[];
  return (
    <>
      {/* Iluminação otimizada — menos luzes, sem shadow map pesado */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#fff8f0" castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
        shadow-bias={-0.0005} />
      <directionalLight position={[-8, 10, -6]} intensity={0.5} color="#e0e8ff" />

      <Suspense fallback={null}>
        <OfficeModel />
        {agentIds.map((id, i) => (
          <Character key={id} id={id} order={i} />
        ))}
      </Suspense>

      <EditorOverlays />

      <OrbitControls
        makeDefault target={[-5, 1, 4]}
        minDistance={3} maxDistance={35}
        zoomSpeed={0.4}
        enableDamping dampingFactor={0.06} rotateSpeed={0.5}
        enablePan mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
      />
    </>
  );
}

export function OfficeCanvas() {
  return (
    <Canvas
      camera={{ position: [6, 8, 14], fov: 45, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: 4,
        toneMappingExposure: 1.3,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      shadows="soft"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ background: "#e2e6ea" }}>
      <OfficeScene />
    </Canvas>
  );
}

useGLTF.preload("/office.glb");
Object.values(AGENT_CHARS).forEach((c) => {
  useGLTF.preload(c.appearance);
  const a = c.animPath;
  useGLTF.preload(`${a}/walk.glb`);
  useGLTF.preload(`${a}/typing.glb`);
  useGLTF.preload(`${a}/sitting.glb`);
  useGLTF.preload(`${a}/sitdown.glb`);
  useGLTF.preload(`${a}/standup.glb`);
});
