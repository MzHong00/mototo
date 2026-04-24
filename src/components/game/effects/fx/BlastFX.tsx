import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function BlastFX({ fx }: { fx: SkillFX }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outMat   = useRef<THREE.MeshBasicMaterial>(null);
  const inMat    = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const age = (Date.now() - fx.startTime) / FX_DURATION.blast;
    if (outerRef.current && outMat.current) {
      outerRef.current.scale.setScalar(0.3 + age * 4);
      outMat.current.opacity = Math.max(0, 0.8 - age);
    }
    if (innerRef.current && inMat.current) {
      innerRef.current.scale.setScalar(0.2 + age * 2.5);
      inMat.current.opacity = Math.max(0, 0.5 - age * 0.8);
    }
  });

  return (
    <group position={[fx.pos[0], 0.3, fx.pos[2]]}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1, 0.12, 8, 32]} />
        <meshBasicMaterial ref={outMat} color="#FF3344" transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial ref={inMat} color="#FF6600" transparent />
      </mesh>
    </group>
  );
}
