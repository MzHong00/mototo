import { useRef, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { playerPositionRef } from "@/stores/worldRefs";
import { Character } from "./Character";
import { Map } from "./Map";
import { Monsters } from "./Monsters";
import { SkillEffects } from "./SkillEffects";
import { Portal } from "./Portal";
import { NpcMesh } from "./Npc";

const CAM_MIN = 6;
const CAM_MAX = 28;
const CAM_YAW = 0; // 고정 방위각 (정면)
const CAM_PITCH = 0.75; // 고정 앙각 (~43°)

function FollowCamera() {
  const { camera, gl } = useThree();
  const dist = useRef(14);

  useEffect(() => {
    const canvas = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? 200 : 1;
      dist.current = Math.max(
        CAM_MIN,
        Math.min(CAM_MAX, dist.current + e.deltaY * scale * 0.01),
      );
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [gl]);

  useFrame(() => {
    const { x, y, z } = playerPositionRef.current;
    const d = dist.current;
    const cosP = Math.cos(CAM_PITCH);
    camera.position.set(
      x + Math.sin(CAM_YAW) * cosP * d,
      y + Math.sin(CAM_PITCH) * d,
      z + Math.cos(CAM_YAW) * cosP * d,
    );
    camera.lookAt(x, y + 1, z);
  }, -1);

  return null;
}

interface SceneProps {
  zone: number;
  onPortalEnter: () => void;
}

export function Scene({ zone, onPortalEnter }: SceneProps) {
  const skyColor =
    zone === 2
      ? ([80, 15, 10] as [number, number, number])
      : ([100, 20, 100] as [number, number, number]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 12], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <FollowCamera />
      <ambientLight intensity={zone === 2 ? 0.4 : 0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={zone === 2 ? 0.9 : 1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
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
    </Canvas>
  );
}
