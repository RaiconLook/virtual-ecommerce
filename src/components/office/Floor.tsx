"use client";

import { useMemo } from "react";
import * as THREE from "three";

function useLightWoodFloor() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Warm light wood base
    ctx.fillStyle = "#d4c4a8";
    ctx.fillRect(0, 0, 512, 512);

    // Wood plank pattern
    const plankH = 64;
    for (let y = 0; y < 512; y += plankH) {
      const offset = (Math.floor(y / plankH) % 2) * 128;
      for (let x = -128 + offset; x < 640; x += 256) {
        const r = 195 + Math.random() * 20;
        const g = 180 + Math.random() * 15;
        const b = 150 + Math.random() * 15;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x + 1, y + 1, 254, plankH - 2);

        // Wood grain lines
        for (let i = 0; i < 8; i++) {
          const gy = y + Math.random() * plankH;
          ctx.strokeStyle = `rgba(160,140,110,${0.08 + Math.random() * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(x + 64, gy + (Math.random() - 0.5) * 3, x + 192, gy + (Math.random() - 0.5) * 3, x + 256, gy);
          ctx.stroke();
        }
      }
      // Plank seam
      ctx.fillStyle = "rgba(140,120,90,0.15)";
      ctx.fillRect(0, y, 512, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export function Floor() {
  const tex = useLightWoodFloor();

  return (
    <group>
      {/* Main office floor — light wood */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 22]} />
        <meshStandardMaterial map={tex} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Subtle grid overlay */}
      <gridHelper args={[30, 60, "#d0c8b8", "#d8d0c0"]} position={[0, 0.001, 0]} />

      {/* Outer ground — soft gray */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#c8ccd0" roughness={1} />
      </mesh>
    </group>
  );
}
