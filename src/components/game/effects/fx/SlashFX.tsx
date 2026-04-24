import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function SlashFX({ fx }: { fx: SkillFX }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.slash;
    meshRef.current.scale.setScalar(0.5 + age * 2.5);
    meshRef.current.rotation.y += 0.18;
    matRef.current.opacity = Math.max(0, 1 - age * 1.2);
  });

  return (
    <mesh ref={meshRef} position={[fx.pos[0], 0.5, fx.pos[2]]}>
      <torusGeometry args={[1, 0.08, 6, 24, Math.PI * 1.2]} />
      <meshBasicMaterial ref={matRef} color="#FF9900" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
