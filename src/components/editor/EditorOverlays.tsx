"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useEditorStore } from "@/store/useEditorStore";
import type { AgentRole } from "@/types";
import { AGENTS } from "@/lib/constants";

// ═══ Route Overlays — waypoint spheres + connecting lines ═══

function WaypointSphere({ position, color, selected, onClick, onDrag }: {
  position: [number, number, number];
  color: string;
  selected: boolean;
  onClick: () => void;
  onDrag: (pos: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const isDragging = useRef(false);
  const { camera, raycaster } = useThree();
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerDown={(e) => {
        e.stopPropagation();
        isDragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return;
        e.stopPropagation();
        const intersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane.current, intersect);
        if (intersect) {
          onDrag([Number(intersect.x.toFixed(2)), 0, Number(intersect.z.toFixed(2))]);
        }
      }}
      onPointerUp={() => { isDragging.current = false; }}
    >
      <sphereGeometry args={[selected ? 0.25 : 0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.8 : 0.3} />
    </mesh>
  );
}

function RouteOverlay({ agentId }: { agentId: AgentRole }) {
  const routeType = useEditorStore((s) => s.routeType);
  const entryRoute = useEditorStore((s) => s.routes[agentId]);
  const meetingRoute = useEditorStore((s) => s.meetingRoutes[agentId]);
  const route = routeType === "entry" ? entryRoute : meetingRoute;
  const selectedAgent = useEditorStore((s) => s.selectedAgent);
  const selectedWpIdx = useEditorStore((s) => s.selectedWpIdx);
  const selectAgent = useEditorStore((s) => s.selectAgent);
  const selectWaypoint = useEditorStore((s) => s.selectWaypoint);
  const updateWaypoint = useEditorStore((s) => s.updateWaypoint);

  if (!route) return null;
  const isActive = selectedAgent === agentId;
  const opacity = isActive ? 1 : 0.3;

  return (
    <group>
      {/* Connecting lines */}
      {route.waypoints.length > 1 && (
        <Line
          points={route.waypoints.map((wp) => [wp[0], 0.1, wp[2]] as [number, number, number])}
          color={route.color}
          lineWidth={isActive ? 3 : 1}
          opacity={opacity}
          transparent
        />
      )}

      {/* Waypoint spheres */}
      {route.waypoints.map((wp, i) => (
        <WaypointSphere
          key={`${agentId}-${i}`}
          position={[wp[0], 0.2, wp[2]]}
          color={route.color}
          selected={isActive && selectedWpIdx === i}
          onClick={() => { selectAgent(agentId); selectWaypoint(i); }}
          onDrag={(pos) => updateWaypoint(agentId, i, pos)}
        />
      ))}

      {/* Agent label at start */}
      {route.waypoints.length > 0 && (
        <mesh position={[route.waypoints[0][0], 0.5, route.waypoints[0][2]]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={route.color} />
        </mesh>
      )}
    </group>
  );
}

// ═══ Selection highlight for furniture ═══

function FurnitureHighlight() {
  const selectedNode = useEditorStore((s) => s.selectedNode);
  const boxRef = useRef<THREE.Mesh>(null!);
  const { scene } = useThree();

  useFrame(() => {
    if (!boxRef.current || !selectedNode) {
      if (boxRef.current) boxRef.current.visible = false;
      return;
    }
    // Find the node in the scene
    let target: THREE.Object3D | null = null;
    scene.traverse((n) => {
      if (n.name === selectedNode) target = n;
    });
    if (!target) { boxRef.current.visible = false; return; }

    const box = new THREE.Box3().setFromObject(target);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    boxRef.current.position.copy(center);
    boxRef.current.scale.set(size.x + 0.1, size.y + 0.1, size.z + 0.1);
    boxRef.current.visible = true;
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.6} />
    </mesh>
  );
}

// ═══ Main Overlay Component ═══

export function EditorOverlays() {
  const mode = useEditorStore((s) => s.mode);
  const agentIds = Object.keys(AGENTS) as AgentRole[];

  if (mode === "off") return null;

  return (
    <group>
      {mode === "routes" && agentIds.map((id) => (
        <RouteOverlay key={id} agentId={id} />
      ))}
      {mode === "furniture" && <FurnitureHighlight />}
    </group>
  );
}
