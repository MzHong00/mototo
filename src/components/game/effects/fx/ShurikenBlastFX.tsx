import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function ShurikenBlastFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const TRAVEL = FX_DURATION.shuriken_blast * 0.5;

  useFrame(() => {
    const elapsed = Date.now() - fx.startTime;
    if (elapsed < TRAVEL) {
      const t = elapsed / TRAVEL;
      if (groupRef.current) {
        groupRef.current.visible = true;
        groupRef.current.position.set(
          fx.pos[0] + dir.x * t * 8,
          fx.pos[1] + 0.9,
          fx.pos[2] + dir.z * t * 8,
        );
        groupRef.current.rotation.y += 0.3;
      }
    } else {
      if (groupRef.current) groupRef.current.visible = false;
      const blastAge = (elapsed - TRAVEL) / (FX_DURATION.shuriken_blast - TRAVEL);
      if (ringRef.current && ringMat.current) {
        ringRef.current.scale.setScalar(0.4 + blastAge * 4.5);
        ringMat.current.opacity = Math.max(0, 1 - blastAge * 1.1);
      }
    }
  });

  return (
    <>
      <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
        {[0, Math.PI / 2].map((rot, i) => (
          <mesh key={i} rotation={[0, rot, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.08]} />
            <meshStandardMaterial color="#CCCCEE" metalness={0.9} roughness={0.1} transparent />
          </mesh>
        ))}
      </group>
      <mesh
        ref={ringRef}
        position={[fx.pos[0] + dir.x * 8, 0.3, fx.pos[2] + dir.z * 8]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1, 0.12, 8, 32]} />
        <meshBasicMaterial ref={ringMat} color="#8888FF" transparent side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
