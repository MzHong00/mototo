import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function ArrowBlastFX({ fx }: { fx: SkillFX }) {
  const arrowRef  = useRef<THREE.Group>(null);
  const ringRef   = useRef<THREE.Mesh>(null);
  const ringMat   = useRef<THREE.MeshBasicMaterial>(null);
  const arrowMat  = useRef<THREE.MeshStandardMaterial>(null);
  const dir  = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const yaw  = Math.atan2(dir.x, dir.z);
  const TRAVEL = FX_DURATION.arrow_blast * 0.55;

  useFrame(() => {
    const elapsed = Date.now() - fx.startTime;
    if (elapsed < TRAVEL) {
      const t    = elapsed / TRAVEL;
      const dist = t * 7;
      if (arrowRef.current) {
        arrowRef.current.visible = true;
        arrowRef.current.position.set(fx.pos[0] + dir.x * dist, fx.pos[1] + 0.8, fx.pos[2] + dir.z * dist);
      }
      if (arrowMat.current) arrowMat.current.opacity = 1;
      if (ringMat.current) ringMat.current.opacity = 0;
    } else {
      if (arrowRef.current) arrowRef.current.visible = false;
      const blastAge = (elapsed - TRAVEL) / (FX_DURATION.arrow_blast - TRAVEL);
      if (ringRef.current && ringMat.current) {
        ringRef.current.scale.setScalar(0.5 + blastAge * 5);
        ringMat.current.opacity = Math.max(0, 1 - blastAge * 1.1);
      }
    }
  });

  return (
    <>
      <group ref={arrowRef} rotation={[0, yaw, 0]} position={[fx.pos[0], fx.pos[1] + 0.8, fx.pos[2]]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
          <meshStandardMaterial ref={arrowMat} color="#8B5E3C" transparent />
        </mesh>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.22, 6]} />
          <meshStandardMaterial color="#FF6600" emissive="#FF3300" emissiveIntensity={1} />
        </mesh>
      </group>
      <mesh
        ref={ringRef}
        position={[fx.pos[0] + dir.x * 7, 0.3, fx.pos[2] + dir.z * 7]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1, 0.15, 8, 32]} />
        <meshBasicMaterial ref={ringMat} color="#FF6600" transparent side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
