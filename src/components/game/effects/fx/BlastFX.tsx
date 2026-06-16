import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill/skill";
import type { SkillFX } from "@/types/combat";

const BLADE_N = 8;
const BLADE_ANGLES = Array.from({ length: BLADE_N }, (_, i) => (i / BLADE_N) * Math.PI * 2);

export function BlastFX({ fx }: { fx: SkillFX }) {
  const spinRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const bladeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const age = (Date.now() - fx.startTime) / FX_DURATION.blast;
    const t = Math.min(age, 1);

    if (spinRef.current) {
      spinRef.current.rotation.y = t * Math.PI * 2.8;
      spinRef.current.scale.setScalar(0.25 + t * 2.4);
    }
    if (ring1Ref.current) {
      ring1Ref.current.scale.setScalar(0.1 + t * 5);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 - t * 1.15);
    }
    if (ring2Ref.current) {
      ring2Ref.current.scale.setScalar(0.1 + t * 3.5);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.65 - t * 0.95);
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + t * 1.5);
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t * 3.8);
    }
    bladeRefs.current.forEach((m) => {
      if (m) (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.85 - t * 1.05);
    });
  });

  return (
    <group position={[fx.pos[0], fx.pos[1] + 0.08, fx.pos[2]]}>
      <mesh ref={ring1Ref} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[1, 0.07, 6, 48]} />
        <meshBasicMaterial color="#FF4400" transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[1, 0.045, 6, 48]} />
        <meshBasicMaterial color="#FFBB00" transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.45, 8, 6]} />
        <meshBasicMaterial color="#FF8800" transparent />
      </mesh>
      <group ref={spinRef}>
        {BLADE_ANGLES.map((angle, i) => (
          <mesh
            key={i}
            ref={(el) => {
              bladeRefs.current[i] = el;
            }}
            rotation-y={angle}
            position={[0, 0.55, 0]}
          >
            <boxGeometry args={[0.045, 0.2, 1.9]} />
            <meshBasicMaterial color="#FF6600" transparent side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
