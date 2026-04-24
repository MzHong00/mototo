import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function ArrowFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef   = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const yaw = Math.atan2(dir.x, dir.z);

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;
    const age  = (Date.now() - fx.startTime) / FX_DURATION.arrow;
    const dist = age * 10;
    groupRef.current.position.set(
      fx.pos[0] + dir.x * dist,
      fx.pos[1] + 0.8,
      fx.pos[2] + dir.z * dist,
    );
    matRef.current.opacity = Math.max(0, 1 - age * 1.4);
  });

  return (
    <group ref={groupRef} rotation={[0, yaw, 0]} position={[fx.pos[0], fx.pos[1] + 0.8, fx.pos[2]]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
        <meshStandardMaterial ref={matRef} color="#8B5E3C" transparent />
      </mesh>
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.22, 6]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.18, 4]} />
        <meshStandardMaterial color="#DDDDDD" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
