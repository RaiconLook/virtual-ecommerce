"use client";

/**
 * .glb model components with calibrated scales.
 *
 * Model measurements (native bounding box):
 *   office_table:   2.38 x 2.37 x 2.00  (Y: -0.42 → 1.96)
 *   office_chair:   0.70 x 1.18 x 0.70  (already meters)
 *   conference_chair:0.78 x 1.08 x 0.59 (already meters)
 *   monitor:        0.25 x 0.55 x 0.72  (screen along Z)
 *   keyboard:       0.17 x 0.02 x 0.46  (already meters)
 *   pc_mouse:       0.10 x 0.03 x 0.08  (already meters)
 *   mouse_pad:      0.20 x 0.00 x 0.20  (already meters)
 *   cactus:         0.13 x 0.13 x 0.13  (tiny — scale up)
 *   whiteboard:     2.00 x 2.49 x 2.52  (Y: -1.0 → 1.49, wall-mount)
 *   storage_shelf:  0.40 x 2.00 x 1.60  (already meters)
 *   filing_cabinet: 1.84 x 1.22 x 1.82  (Y: -0.22, oversized)
 *   trashcan:       0.42 x 0.46 x 0.42  (already meters)
 *   desk_lamp:      0.11 x 0.52 x 0.31  (already meters)
 *   rack:           0.50 x 1.02 x 0.80  (half-height, scale up)
 *   round_table:    1.80 x 0.77 x 3.60  (large conference)
 *   clock:          2.00 x 2.00 x 2.00  (oversized, scale down)
 *   projector:      0.15 x 0.04 x 0.15  (tiny, scale up)
 *   projector_screen:0.11 x 1.65 x 2.26 (ok at ~0.8)
 *   speaker:        0.15 x 0.30 x 0.15  (small, scale up)
 *   picture:        0.05 x 1.00 x 0.75  (ok at ~0.5)
 *   sign_exit:      0.12 x 0.03 x 0.36  (tiny, scale up)
 */

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ═══ CALIBRATED SCALES ═══
const S = {
  officeTable: 0.5,
  officeChair: 0.85,
  conferenceChair: 0.85,
  monitor: 0.85,
  keyboard: 1.0,
  pcMouse: 1.0,
  mousePad: 1.3,
  cactus: 3.5,
  whiteboard: 0.3,
  storageShelf: 0.9,
  filingCabinet: 0.4,
  trashcan: 0.7,
  deskLamp: 1.0,
  rack: 1.8,
  roundTable: 0.85,
  clock: 0.12,
  projector: 2.5,
  projectorScreen: 0.7,
  speaker: 1.5,
  picture: 0.5,
  signExit: 2.0,
};

// ═══ PATHS ═══
const P = {
  officeTable: "/models/office_table/office_table.glb",
  officeChair: "/models/office_chair/office_chair.glb",
  conferenceChair: "/models/conference_chair/conference_chair.glb",
  monitor: "/models/monitor/monitor.glb",
  keyboard: "/models/keyboard/keyboard.glb",
  pcMouse: "/models/pc_mouse/pc_mouse.glb",
  mousePad: "/models/mouse_pad/mouse_pad.glb",
  cactus: "/models/cactus_in_pot/cactus_in_pot.glb",
  whiteboard: "/models/whiteboard/whiteboard.glb",
  storageShelf: "/models/storage_shelf/storage_shelf.glb",
  trashcan: "/models/trashcan/trashcan.glb",
  rack: "/models/rack/rack.glb",
  roundTable: "/models/round_table/round_table.glb",
  clock: "/models/clock/clock.glb",
  projector: "/models/projector/projector.glb",
  projectorScreen: "/models/projector_screen/projector_screen.glb",
  speaker: "/models/speaker/speaker.glb",
  picture: "/models/picture/picture.glb",
  signExit: "/models/sign_exit/sign_exit.glb",
  deskLampBlack: "/models/desk_lamp/black_desk_lamp/black_desk_lamp.glb",
  deskLampGreen: "/models/desk_lamp/green_desk_lamp/green_desk_lamp.glb",
  deskLampRed: "/models/desk_lamp/red_desk_lamp/red_desk_lamp.glb",
  filingCabinetWhite: "/models/filing_cabinet/white_filing_cabinet/white_filing_cabinet.glb",
  filingCabinetBlue: "/models/filing_cabinet/blue_filing_cabinet/blue_filing_cabinet.glb",
  filingCabinetGreen: "/models/filing_cabinet/green_filing_cabinet/green_filing_cabinet.glb",
  filingCabinetRed: "/models/filing_cabinet/red_filing_cabinet/red_filing_cabinet.glb",
};

// ═══ Base Props ═══
interface BaseProps {
  position?: [number, number, number];
  rotation?: number;
  scale?: number;
  [key: string]: unknown;
}

// ═══ Generic Model Loader ═══
function Model({
  url,
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}: {
  url: string;
  position?: [number, number, number];
  rotation?: number;
  scale?: number;
}) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group position={position} rotation-y={rotation}>
      <primitive object={clone} scale={scale} />
    </group>
  );
}

// ═══ Individual desk items (each movable in editor) ═══

// Y offset to compensate model negative Y min
export function GltfOfficeTable({ position, rotation }: BaseProps) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  return <Model url={P.officeTable} position={[p[0], p[1] + 0.13, p[2]]} rotation={rotation as number} scale={S.officeTable} />;
}

export function GltfMonitor({ position, rotation }: BaseProps) {
  return <Model url={P.monitor} position={position as [number, number, number]} rotation={rotation as number} scale={S.monitor} />;
}

export function GltfKeyboard({ position, rotation }: BaseProps) {
  return <Model url={P.keyboard} position={position as [number, number, number]} rotation={rotation as number} scale={S.keyboard} />;
}

export function GltfPcMouse({ position, rotation }: BaseProps) {
  return <Model url={P.pcMouse} position={position as [number, number, number]} rotation={rotation as number} scale={S.pcMouse} />;
}

export function GltfMousePad({ position, rotation }: BaseProps) {
  return <Model url={P.mousePad} position={position as [number, number, number]} rotation={rotation as number} scale={S.mousePad} />;
}

// ═══ Compound: Triple Monitor Wall ═══
export function MonitorTriple({ position = [0, 0, 0] as [number, number, number], rotation = 0 }: BaseProps) {
  return (
    <group position={position} rotation-y={rotation as number}>
      <Model url={P.monitor} position={[-0.75, 1.1, 0]} scale={S.monitor} />
      <Model url={P.monitor} position={[0, 1.1, 0]} scale={S.monitor} />
      <Model url={P.monitor} position={[0.75, 1.1, 0]} scale={S.monitor} />
      {/* Mounting bar */}
      <mesh position={[0, 0.9, -0.02]}>
        <boxGeometry args={[2.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ═══ Individual Models ═══

export function GltfOfficeChair({ position, rotation }: BaseProps) {
  return <Model url={P.officeChair} position={position as [number, number, number]} rotation={rotation as number} scale={S.officeChair} />;
}

export function GltfConferenceChair({ position, rotation }: BaseProps) {
  return <Model url={P.conferenceChair} position={position as [number, number, number]} rotation={rotation as number} scale={S.conferenceChair} />;
}

export function GltfCactus({ position, rotation, scale: userScale }: BaseProps) {
  return <Model url={P.cactus} position={position as [number, number, number]} rotation={rotation as number} scale={((userScale as number) ?? 1) * S.cactus} />;
}

// Wall-mounted: Y offset +1.2 so it hangs at proper height (model Y min = -1.0)
export function GltfWhiteboard({ position, rotation }: BaseProps) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  return <Model url={P.whiteboard} position={[p[0], p[1] + 1.2, p[2]]} rotation={rotation as number} scale={S.whiteboard} />;
}

export function GltfStorageShelf({ position, rotation }: BaseProps) {
  return <Model url={P.storageShelf} position={position as [number, number, number]} rotation={rotation as number} scale={S.storageShelf} />;
}

// Y offset +0.1 to compensate model's negative Y min (-0.221 * 0.45)
export function GltfFilingCabinet({ position, rotation, variant }: BaseProps & { variant?: string }) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  const v = (variant as string) ?? "white";
  const key = `filingCabinet${v.charAt(0).toUpperCase() + v.slice(1)}` as keyof typeof P;
  return <Model url={P[key] ?? P.filingCabinetWhite} position={[p[0], p[1] + 0.1, p[2]]} rotation={rotation as number} scale={S.filingCabinet} />;
}

export function GltfTrashcan({ position, rotation }: BaseProps) {
  return <Model url={P.trashcan} position={position as [number, number, number]} rotation={rotation as number} scale={S.trashcan} />;
}

export function GltfDeskLamp({ position, rotation, color }: BaseProps) {
  const pos = (position ?? [0, 0, 0]) as [number, number, number];
  return (
    <group position={pos} rotation-y={(rotation as number) ?? 0}>
      <Model url={P.deskLampBlack} scale={S.deskLamp} />
      {typeof color === "string" && (
        <pointLight position={[0, 0.5, 0]} intensity={0.15} color={color} distance={2} decay={2} />
      )}
    </group>
  );
}

export function GltfRack({ position, rotation }: BaseProps) {
  return <Model url={P.rack} position={position as [number, number, number]} rotation={rotation as number} scale={S.rack} />;
}

export function GltfRoundTable({ position, rotation }: BaseProps) {
  return <Model url={P.roundTable} position={position as [number, number, number]} rotation={rotation as number} scale={S.roundTable} />;
}

// Wall-mounted: Y offset from model center (Y min = -0.975)
export function GltfClock({ position, rotation }: BaseProps) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  return <Model url={P.clock} position={[p[0], p[1] + 0.12, p[2]]} rotation={rotation as number} scale={S.clock} />;
}

export function GltfProjector({ position, rotation }: BaseProps) {
  return <Model url={P.projector} position={position as [number, number, number]} rotation={rotation as number} scale={S.projector} />;
}

export function GltfProjectorScreen({ position, rotation }: BaseProps) {
  return <Model url={P.projectorScreen} position={position as [number, number, number]} rotation={rotation as number} scale={S.projectorScreen} />;
}

export function GltfSpeaker({ position, rotation }: BaseProps) {
  return <Model url={P.speaker} position={position as [number, number, number]} rotation={rotation as number} scale={S.speaker} />;
}

// Wall-mounted picture
export function GltfPicture({ position, rotation }: BaseProps) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  return <Model url={P.picture} position={[p[0], p[1] + 1.5, p[2]]} rotation={rotation as number} scale={S.picture} />;
}

export function GltfSignExit({ position, rotation }: BaseProps) {
  const p = (position ?? [0, 0, 0]) as [number, number, number];
  return <Model url={P.signExit} position={[p[0], p[1] + 2.4, p[2]]} rotation={rotation as number} scale={S.signExit} />;
}

// ═══ Preload ═══
useGLTF.preload(P.officeTable);
useGLTF.preload(P.officeChair);
useGLTF.preload(P.conferenceChair);
useGLTF.preload(P.monitor);
useGLTF.preload(P.keyboard);
useGLTF.preload(P.pcMouse);
useGLTF.preload(P.mousePad);
useGLTF.preload(P.cactus);
useGLTF.preload(P.whiteboard);
useGLTF.preload(P.storageShelf);
useGLTF.preload(P.trashcan);
useGLTF.preload(P.rack);
useGLTF.preload(P.roundTable);
useGLTF.preload(P.clock);
useGLTF.preload(P.projector);
useGLTF.preload(P.projectorScreen);
useGLTF.preload(P.speaker);
useGLTF.preload(P.picture);
useGLTF.preload(P.signExit);
useGLTF.preload(P.deskLampBlack);
useGLTF.preload(P.filingCabinetWhite);
useGLTF.preload(P.filingCabinetBlue);
useGLTF.preload(P.filingCabinetGreen);
useGLTF.preload(P.filingCabinetRed);
