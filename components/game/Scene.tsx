"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Character } from "./Character";
import { Map } from "./Map";
import { Monsters } from "./Monsters";
import { SkillEffects } from "./SkillEffects";
import { Portal } from "./Portal";
import { NpcMesh } from "./Npc";

interface SceneProps {
  zone: number;
  onPortalEnter: () => void;
}

export function Scene({ zone, onPortalEnter }: SceneProps) {
  const skyColor = zone === 2 ? [80, 15, 10] as [number,number,number] : [100, 20, 100] as [number,number,number];

  return (
    <Canvas shadows camera={{ position: [0, 8, 12], fov: 60 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={zone === 2 ? 0.4 : 0.6} />
      <directionalLight position={[10, 20, 10]} intensity={zone === 2 ? 0.9 : 1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={skyColor} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Map zone={zone} />
          <Character />
        </Physics>
        <Monsters zone={zone} />
        <SkillEffects />
        <Portal zone={zone} onEnter={onPortalEnter} />
        {zone === 1 && <NpcMesh />}
      </Suspense>

      <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={20} />
    </Canvas>
  );
}
