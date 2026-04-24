import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

export function FireballFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();

  useFrame(() => {
    if (!groupRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.fireball;
    const dist = age * 9;
    groupRef.current.position.set(
      fx.pos[0] + dir.x * dist,
      fx.pos[1] + 1.0,
      fx.pos[2] + dir.z * dist,
    );
    groupRef.current.rotation.y += 0.12;
    if (coreMat.current) {
      coreMat.current.emissiveIntensity = 1.5 - age;
      coreMat.current.opacity = Math.max(0, 1 - age * 1.3);
    }
    if (glowMat.current) glowMat.current.opacity = Math.max(0, 0.4 - age * 0.5);
  });

  return (
    <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 1.0, fx.pos[2]]}>
      <mesh>
        <sphereGeometry args={[0.22, 12, 8]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#FF4400"
          emissive="#FF2200"
          emissiveIntensity={1.5}
          transparent
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.45, 8, 6]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#FF8800"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
