import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function ShurikenFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef   = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;
    const age  = (Date.now() - fx.startTime) / FX_DURATION.shuriken;
    const dist = age * 11;
    groupRef.current.position.set(fx.pos[0] + dir.x * dist, fx.pos[1] + 0.9, fx.pos[2] + dir.z * dist);
    groupRef.current.rotation.y += 0.25;
    matRef.current.opacity = Math.max(0, 1 - age * 1.3);
  });

  return (
    <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.08]} />
          <meshStandardMaterial
            ref={i === 0 ? matRef : undefined}
            color="#CCCCEE"
            metalness={0.9}
            roughness={0.1}
            transparent
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#8888FF" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}
