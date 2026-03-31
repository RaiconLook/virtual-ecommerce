"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ── Dark wood texture for desks ── */
function useDeskTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    // Dark walnut base
    ctx.fillStyle = "#1c1820";
    ctx.fillRect(0, 0, 256, 128);

    // Wood grain
    for (let y = 0; y < 128; y++) {
      const brightness = 24 + Math.sin(y * 0.3) * 3 + Math.random() * 4;
      ctx.strokeStyle = `rgb(${brightness + 2}, ${brightness}, ${brightness + 6})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(64, y + (Math.random() - 0.5) * 2, 192, y + (Math.random() - 0.5) * 2, 256, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, []);
}

/* ── Desk ── */
export function Desk({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  accentColor = "#6366f1",
}) {
  const deskTex = useDeskTexture();
  return (
    <group position={position} rotation-y={rotation}>
      {/* Desktop surface with wood texture */}
      <RoundedBox args={[1.6, 0.06, 0.8]} position={[0, 0.72, 0]} radius={0.02} castShadow receiveShadow>
        <meshStandardMaterial map={deskTex} roughness={0.6} metalness={0.1} />
      </RoundedBox>
      {/* Desk edge accent strip */}
      <mesh position={[0, 0.72, 0.4]}>
        <boxGeometry args={[1.6, 0.02, 0.005]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
      </mesh>
      {/* Legs */}
      {[[-0.7, 0.35, -0.3], [-0.7, 0.35, 0.3], [0.7, 0.35, -0.3], [0.7, 0.35, 0.3]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#2a2a36" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* Monitor */}
      <group position={[0, 1.05, -0.2]}>
        <RoundedBox args={[0.55, 0.35, 0.025]} radius={0.01} castShadow>
          <meshStandardMaterial color="#0a0a12" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.48, 0.28]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.25, 0.05]}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
          <meshStandardMaterial color="#2a2a36" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.32, 0.08]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#2a2a36" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
      {/* Keyboard */}
      <RoundedBox args={[0.35, 0.015, 0.12]} position={[0, 0.76, 0.15]} radius={0.005}>
        <meshStandardMaterial color="#0e0e16" roughness={0.8} />
      </RoundedBox>
      {/* Mouse */}
      <mesh position={[0.32, 0.76, 0.15]}>
        <boxGeometry args={[0.05, 0.012, 0.08]} />
        <meshStandardMaterial color="#0e0e16" roughness={0.8} />
      </mesh>
      {/* Under-desk drawer */}
      <RoundedBox args={[0.45, 0.25, 0.55]} position={[0.48, 0.5, 0]} radius={0.01} castShadow>
        <meshStandardMaterial color="#14141c" roughness={0.7} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0.48, 0.55, 0.28]}>
        <boxGeometry args={[0.1, 0.015, 0.015]} />
        <meshStandardMaterial color="#3a3a48" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Office Chair ── */
export function Chair({
  position = [0, 0, 0] as [number, number, number],
  color = "#6366f1",
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.7} />
      </mesh>
      <RoundedBox args={[0.38, 0.35, 0.05]} position={[0, 0.62, -0.18]} radius={0.02} castShadow>
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.4} />
      </mesh>
      {[0, 1.26, 2.51, 3.77, 5.03].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.15, 0.03, Math.sin(a) * 0.15]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.015, 0.15, 4, 8]} />
          <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {[0, 1.26, 2.51, 3.77, 5.03].map((a, i) => (
        <mesh key={`w${i}`} position={[Math.cos(a) * 0.22, 0.02, Math.sin(a) * 0.22]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Plant ── */
export function Plant({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.22, 12]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.02, 12]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#1a5a2e" roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.62, 0.05]} castShadow>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#2a7a3e" roughness={0.8} />
      </mesh>
      <mesh position={[0.06, 0.58, -0.06]} castShadow>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#1e6e32" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ── Sofa ── */
export function Sofa({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  color = "#1e1e28",
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[1.4, 0.35, 0.6]} position={[0, 0.2, 0]} radius={0.06} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[1.4, 0.35, 0.12]} position={[0, 0.45, -0.25]} radius={0.04} castShadow>
        <meshStandardMaterial color={color} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.25, 0.5]} position={[-0.66, 0.35, 0.02]} radius={0.04} castShadow>
        <meshStandardMaterial color={color} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.25, 0.5]} position={[0.66, 0.35, 0.02]} radius={0.04} castShadow>
        <meshStandardMaterial color={color} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.08, 0.4]} position={[-0.3, 0.42, 0.05]} radius={0.03}>
        <meshStandardMaterial color="#252530" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.08, 0.4]} position={[0.3, 0.42, 0.05]} radius={0.03}>
        <meshStandardMaterial color="#252530" roughness={0.8} />
      </RoundedBox>
    </group>
  );
}

/* ── Meeting Table ── */
export function MeetingTable({
  position = [0, 0, 0] as [number, number, number],
}) {
  const deskTex = useDeskTexture();
  return (
    <group position={position}>
      <RoundedBox args={[2.8, 0.06, 1.6]} position={[0, 0.72, 0]} radius={0.4} castShadow receiveShadow>
        <meshStandardMaterial map={deskTex} roughness={0.5} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <capsuleGeometry args={[0.3, 0.8, 6, 12]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Whiteboard ── */
export function Whiteboard({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[1.6, 1.1, 0.04]} position={[0, 1.4, 0]} radius={0.02} castShadow>
        <meshStandardMaterial color="#2a2a36" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 1.4, 0.025]}>
        <planeGeometry args={[1.5, 1.0]} />
        <meshStandardMaterial color="#f0f0f4" roughness={0.4} metalness={0.05} />
      </mesh>
      <RoundedBox args={[0.8, 0.03, 0.06]} position={[0, 0.88, 0.04]} radius={0.01}>
        <meshStandardMaterial color="#2a2a36" roughness={0.6} />
      </RoundedBox>
      {/* Markers */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0.04]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.006, 0.006, 0.08, 6]} />
          <meshStandardMaterial color={["#ef4444", "#3b82f6", "#10b981"][i]} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Bookshelf ── */
export function Bookshelf({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}) {
  const bookColors = ["#6366f1", "#f472b6", "#fb923c", "#34d399", "#8b5cf6", "#ef4444"];
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[0.8, 1.6, 0.3]} position={[0, 0.8, 0]} radius={0.02} castShadow>
        <meshStandardMaterial color="#1a1a22" roughness={0.7} />
      </RoundedBox>
      {[0.35, 0.75, 1.15].map((sy, si) => (
        <group key={si}>
          <mesh position={[0, sy, 0]}>
            <boxGeometry args={[0.76, 0.02, 0.28]} />
            <meshStandardMaterial color="#222230" roughness={0.7} />
          </mesh>
          {[-0.25, -0.12, 0.0, 0.12, 0.25].map((bx, bi) => (
            <RoundedBox
              key={bi}
              args={[0.06, 0.22 + (bi % 3) * 0.04, 0.2]}
              position={[bx, sy + 0.14, 0]}
              radius={0.005}
            >
              <meshStandardMaterial
                color={bookColors[(si * 5 + bi) % bookColors.length]}
                roughness={0.8}
              />
            </RoundedBox>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Glass Divider ── */
export function GlassDivider({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  width = 3,
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[width, 2.6, 0.04]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[width - 0.1, 2.2, 0.02]} />
        <meshStandardMaterial color="#4a4a60" transparent opacity={0.12} roughness={0.1} metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ── Coffee Table ── */
export function CoffeeTable({
  position = [0, 0, 0] as [number, number, number],
}) {
  const deskTex = useDeskTexture();
  return (
    <group position={position}>
      <RoundedBox args={[0.7, 0.04, 0.7]} position={[0, 0.38, 0]} radius={0.08} castShadow receiveShadow>
        <meshStandardMaterial map={deskTex} roughness={0.6} metalness={0.15} />
      </RoundedBox>
      {[[-0.25, 0.19, -0.25], [0.25, 0.19, -0.25], [-0.25, 0.19, 0.25], [0.25, 0.19, 0.25]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />
          <meshStandardMaterial color="#2a2a36" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Server Rack (for Analytics room) ── */
export function ServerRack({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}) {
  return (
    <group position={position} rotation-y={rotation}>
      {/* Rack body */}
      <RoundedBox args={[0.5, 1.8, 0.4]} position={[0, 0.9, 0]} radius={0.02} castShadow>
        <meshStandardMaterial color="#111118" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      {/* Server slots */}
      {[0.35, 0.55, 0.75, 0.95, 1.15, 1.35].map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0.21]}>
            <boxGeometry args={[0.42, 0.12, 0.01]} />
            <meshStandardMaterial color="#0a0a12" roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Blinking LEDs */}
          <mesh position={[-0.15, y, 0.22]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#10b981" : "#3b82f6"}
              emissive={i % 2 === 0 ? "#10b981" : "#3b82f6"}
              emissiveIntensity={2}
            />
          </mesh>
          <mesh position={[-0.12, y, 0.22]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Monitor Wall (triple screens for Analytics) ── */
export function MonitorWall({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  accentColor = "#10b981",
}) {
  return (
    <group position={position} rotation-y={rotation}>
      {/* 3 monitors side by side */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <group key={i} position={[x, 1.3, 0]}>
          <RoundedBox args={[0.5, 0.35, 0.02]} radius={0.01} castShadow>
            <meshStandardMaterial color="#0a0a12" roughness={0.3} metalness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.44, 0.28]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.25}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
      {/* Mounting bar */}
      <mesh position={[0, 1.05, -0.02]}>
        <boxGeometry args={[1.8, 0.03, 0.03]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Printer ── */
export function Printer({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}) {
  return (
    <group position={position} rotation-y={rotation}>
      {/* Stand */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.35]} />
        <meshStandardMaterial color="#14141c" roughness={0.7} />
      </mesh>
      {/* Printer body */}
      <RoundedBox args={[0.5, 0.18, 0.35]} position={[0, 0.8, 0]} radius={0.02} castShadow>
        <meshStandardMaterial color="#1e1e28" roughness={0.4} metalness={0.15} />
      </RoundedBox>
      {/* LED */}
      <mesh position={[0.18, 0.9, 0.16]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ── Water Cooler ── */
export function WaterCooler({
  position = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.3, 12]} />
        <meshStandardMaterial color="#3a6a8a" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <sphereGeometry args={[0.09, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3a6a8a" transparent opacity={0.4} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ── Trash Bin ── */
export function TrashBin({
  position = [0, 0, 0] as [number, number, number],
}) {
  return (
    <mesh position={[position[0], position[1] + 0.15, position[2]]} castShadow>
      <cylinderGeometry args={[0.1, 0.08, 0.3, 10]} />
      <meshStandardMaterial color="#1a1a24" roughness={0.7} metalness={0.15} />
    </mesh>
  );
}

/* ── Filing Cabinet ── */
export function FilingCabinet({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}) {
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[0.45, 1.1, 0.4]} position={[0, 0.55, 0]} radius={0.02} castShadow>
        <meshStandardMaterial color="#16161e" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      {/* Drawer handles */}
      {[0.3, 0.6, 0.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0.21]}>
          <boxGeometry args={[0.12, 0.015, 0.015]} />
          <meshStandardMaterial color="#3a3a48" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Desk Lamp ── */
export function DeskLamp({
  position = [0, 0, 0] as [number, number, number],
  color = "#6366f1",
}) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.02, 12]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Arm */}
      <mesh position={[0, 0.9, 0]} rotation-z={0.3}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Shade */}
      <mesh position={[0.05, 1.05, 0]}>
        <coneGeometry args={[0.06, 0.06, 8, 1, true]} />
        <meshStandardMaterial color="#2a2a36" metalness={0.3} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Light glow */}
      <pointLight position={[0.05, 1.0, 0]} intensity={0.15} color={color} distance={2} decay={2} />
    </group>
  );
}
