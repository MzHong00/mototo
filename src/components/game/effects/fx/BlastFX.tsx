import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

const BLADE_N = 8;
const BLADE_ANGLES = Array.from({ length: BLADE_N }, (_, i) => (i / BLADE_N) * Math.PI * 2);

export function BlastFX({ fx }: { fx: SkillFX }) {
  const spinRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const coreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#FF8800", transparent: true }),
    []
  );
  const ring1Mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FF4400",
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );
  const ring2Mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#FFBB00",
        transparent: true,
        side: THREE.DoubleSide,
      }),
    []
  );
  const bladeMats = useMemo(
    () =>
      BLADE_ANGLES.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: "#FF6600",
            transparent: true,
            side: THREE.DoubleSide,
          })
      ),
    []
  );

  useFrame(() => {
    const age = (Date.now() - fx.startTime) / FX_DURATION.blast;
    const t = Math.min(age, 1);

    // 방사형 검기 그룹: 회전하며 바깥으로 확장
    if (spinRef.current) {
      spinRef.current.rotation.y = t * Math.PI * 2.8;
      spinRef.current.scale.setScalar(0.25 + t * 2.4);
    }
    // 지면 링 1 — 빠르게 확장
    if (ring1Ref.current) {
      ring1Ref.current.scale.setScalar(0.1 + t * 5);
      ring1Mat.opacity = Math.max(0, 0.9 - t * 1.15);
    }
    // 지면 링 2 — 살짝 느리게
    if (ring2Ref.current) {
      ring2Ref.current.scale.setScalar(0.1 + t * 3.5);
      ring2Mat.opacity = Math.max(0, 0.65 - t * 0.95);
    }
    // 중심 플래시 — 빠르게 소멸
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + t * 1.5);
      coreMat.opacity = Math.max(0, 1 - t * 3.8);
    }
    // 검기
    bladeMats.forEach((m) => {
      m.opacity = Math.max(0, 0.85 - t * 1.05);
    });
  });

  return (
    <group position={[fx.pos[0], fx.pos[1] + 0.08, fx.pos[2]]}>
      {/* 지면 링 */}
      <mesh ref={ring1Ref} rotation-x={-Math.PI / 2} material={ring1Mat}>
        <torusGeometry args={[1, 0.07, 6, 48]} />
      </mesh>
      <mesh ref={ring2Ref} rotation-x={-Math.PI / 2} material={ring2Mat}>
        <torusGeometry args={[1, 0.045, 6, 48]} />
      </mesh>

      {/* 중심 플래시 구체 */}
      <mesh ref={coreRef} material={coreMat}>
        <sphereGeometry args={[0.45, 8, 6]} />
      </mesh>

      {/* 방사형 검기 (회전 그룹) */}
      <group ref={spinRef}>
        {BLADE_ANGLES.map((angle, i) => (
          <mesh key={i} rotation-y={angle} position={[0, 0.55, 0]} material={bladeMats[i]}>
            <boxGeometry args={[0.045, 0.2, 1.9]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
