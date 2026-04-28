import { RigidBody } from "@react-three/rapier";
import { BOSS_TYPE, BOSS_STATS } from "@/constants/boss";

const { arenaRadius: BOSS_ARENA_RADIUS } = BOSS_STATS[BOSS_TYPE.RED_GUARDIAN];

export function RedGuardianArena() {
  return (
    <>
      {/* 물리 바닥 — 두께 30으로 Rapier 등록 딜레이 중 낙하해도 내부에서 멈춤 (상단면 y=0 유지) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[BOSS_ARENA_RADIUS, 64]} />
          <meshStandardMaterial color="#2A2A3E" />
        </mesh>
      </RigidBody>

      {/* 경계 링 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[BOSS_ARENA_RADIUS, 0.3, 8, 64]} />
        <meshStandardMaterial color="#FF3344" emissive="#FF3344" emissiveIntensity={0.6} />
      </mesh>

      {/* 아레나 조명 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 12, 0]} intensity={1.5} color="#FF4444" distance={40} />
    </>
  );
}
