import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";

// 초승달 호 각도 ~216°
const ARC = Math.PI * 1.2;

export function SlashFX({ fx }: { fx: SkillFX }) {
  const travelRef = useRef<THREE.Group>(null);
  const xRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const bloomRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glowRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);

  const dir = useMemo(
    () => new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const yaw = Math.atan2(dir.x, dir.z);

  useFrame(() => {
    const age = (Date.now() - fx.startTime) / FX_DURATION.slash;
    const t = Math.min(age, 1);

    // 전방으로 빠르게 이동 (world 좌표)
    if (travelRef.current) {
      travelRef.current.position.set(
        fx.pos[0] + dir.x * t * 8,
        fx.pos[1] + 0.9,
        fx.pos[2] + dir.z * t * 8,
      );
      // 발사 순간 0.12초 안에 팽창
      travelRef.current.scale.setScalar(t < 0.12 ? t / 0.12 : 1);
    }

    // X 형태가 전진 방향(Z)으로 반 바퀴 자전 → 날아가는 느낌
    if (xRef.current) {
      xRef.current.rotation.z = t * Math.PI;
    }

    // 약간 딜레이 후 페이드 아웃
    const fade = Math.max(0, 1 - Math.max(0, t - 0.08) * 1.25);
    coreRefs.current.forEach((m) => {
      if (m) (m.material as THREE.MeshBasicMaterial).opacity = fade;
    });
    glowRefs.current.forEach((m) => {
      if (m) (m.material as THREE.MeshBasicMaterial).opacity = fade * 0.6;
    });
    bloomRefs.current.forEach((m) => {
      if (m) (m.material as THREE.MeshBasicMaterial).opacity = fade * 0.22;
    });

    // 발사 플래시 — 빠르게 팽창·소멸
    if (flashRef.current) {
      flashRef.current.scale.setScalar(1 + t * 3.5);
      (flashRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.95 - t * 10);
    }
  });

  return (
    <>
      {/* 발사 위치 플래시 — 이동하지 않음 */}
      <group position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
        <mesh ref={flashRef}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshBasicMaterial color="#FFFFFF" transparent />
        </mesh>
      </group>

      {/* 날아가는 X자 초승달 */}
      <group ref={travelRef} rotation-y={yaw} position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
        <group ref={xRef}>
          {/* \ 방향 초승달 */}
          <group rotation-z={Math.PI / 4}>
            <mesh
              ref={(el) => {
                bloomRefs.current[0] = el;
              }}
            >
              <torusGeometry args={[0.92, 0.06, 6, 64, ARC]} />
              <meshBasicMaterial color="#4488BB" transparent side={THREE.DoubleSide} />
            </mesh>
            <mesh
              ref={(el) => {
                glowRefs.current[0] = el;
              }}
            >
              <torusGeometry args={[0.76, 0.1, 6, 64, ARC]} />
              <meshBasicMaterial color="#AADDFF" transparent side={THREE.DoubleSide} />
            </mesh>
            <mesh
              ref={(el) => {
                coreRefs.current[0] = el;
              }}
            >
              <torusGeometry args={[0.63, 0.13, 6, 64, ARC]} />
              <meshBasicMaterial color="#FFFFFF" transparent side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* / 방향 초승달 */}
          <group rotation-z={-Math.PI / 4}>
            <mesh
              ref={(el) => {
                bloomRefs.current[1] = el;
              }}
            >
              <torusGeometry args={[0.92, 0.06, 6, 64, ARC]} />
              <meshBasicMaterial color="#4488BB" transparent side={THREE.DoubleSide} />
            </mesh>
            <mesh
              ref={(el) => {
                glowRefs.current[1] = el;
              }}
            >
              <torusGeometry args={[0.76, 0.1, 6, 64, ARC]} />
              <meshBasicMaterial color="#AADDFF" transparent side={THREE.DoubleSide} />
            </mesh>
            <mesh
              ref={(el) => {
                coreRefs.current[1] = el;
              }}
            >
              <torusGeometry args={[0.63, 0.13, 6, 64, ARC]} />
              <meshBasicMaterial color="#FFFFFF" transparent side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
