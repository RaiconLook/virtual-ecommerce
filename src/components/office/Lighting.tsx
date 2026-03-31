"use client";

import { useRef } from "react";
import * as THREE from "three";
import { ROOMS } from "@/lib/constants";

export function Lighting() {
  const dirLight = useRef<THREE.DirectionalLight>(null!);

  return (
    <>
      {/* Bright ambient — modern office feel */}
      <ambientLight intensity={0.9} color="#f8f6ff" />

      {/* Main sun — warm white from upper-right */}
      <directionalLight
        ref={dirLight}
        position={[12, 20, 10]}
        intensity={2.5}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      {/* Secondary fill — cool from opposite side */}
      <directionalLight position={[-10, 15, -8]} intensity={0.8} color="#e0e8ff" />

      {/* Sky/ground hemisphere — natural outdoor feel */}
      <hemisphereLight args={["#b8d4f0", "#ffecd2", 0.6]} />

      {/* Corridor ceiling lights — bright white */}
      <pointLight position={[-8, 2.8, 0]} intensity={1.0} color="#fff" distance={10} decay={2} />
      <pointLight position={[0, 2.8, 0]} intensity={1.0} color="#fff" distance={10} decay={2} />
      <pointLight position={[8, 2.8, 0]} intensity={1.0} color="#fff" distance={10} decay={2} />

      {/* Subtle room accent lights */}
      {ROOMS.filter((r) => r.type !== "lounge").map((room) => (
        <pointLight
          key={room.id}
          position={[room.center[0], 2.8, room.center[2]]}
          intensity={0.4}
          color={room.color}
          distance={Math.max(room.size[0], room.size[1])}
          decay={2}
        />
      ))}
    </>
  );
}
