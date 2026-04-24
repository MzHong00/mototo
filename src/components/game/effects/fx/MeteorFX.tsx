import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

const METEOR_COUNT = 6;
const METEOR_START_Y = 8;
const METEOR_OFFSETS = Array.from({ length: METEOR_COUNT }, (_, i) => ({
  dx: (Math.random() - 0.5) * 4,
  dz: (Math.random() - 0.5) * 4,
  delay: i * 80,
}));

export function MeteorFX({ fx }: { fx: SkillFX }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(METEOR_COUNT).fill(null));
  const matRefs  = useRef<(THREE.MeshStandardMaterial | null)[]>(Array(METEOR_COUNT).fill(null));

  useFrame(() => {
    const elapsed = Date.now() - fx.startTime;
    METEOR_OFFSETS.forEach(({ dx, dz, delay }, i) => {
      const mesh = meshRefs.current[i];
      const mat  = matRefs.current[i];
      if (!mesh || !mat) return;
      const t   = Math.max(0, elapsed - delay);
      const age = t / (FX_DURATION.meteor - delay);
      if (age <= 0) { mesh.visible = false; return; }
      mesh.visible = true;
      mesh.position.set(fx.pos[0] + dx, Math.max(0.3, fx.pos[1] + METEOR_START_Y * (1 - age)), fx.pos[2] + dz);
      mat.emissiveIntensity = 1 + age * 2;
      mat.opacity = age < 0.8 ? 1 : Math.max(0, 1 - (age - 0.8) * 5);
    });
  });

  return (
    <>
      {METEOR_OFFSETS.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          visible={false}
        >
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshStandardMaterial
            ref={(el) => { matRefs.current[i] = el; }}
            color="#FF5500"
            emissive="#FF2200"
            emissiveIntensity={1}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}
