import { RigidBody } from "@react-three/rapier";

import { KingBearBoss } from "@/components/game/monster/boss/KingBearBoss";
import { BOSS_TYPE, BOSSES } from "@/constants/monster/boss";

const { arenaRadius: BOSS_ARENA_RADIUS } = BOSSES.mototo.evergreen[BOSS_TYPE.KING_BEAR];

export function KingBearChamber() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[BOSS_ARENA_RADIUS, 64]} />
          <meshStandardMaterial color="#2A2A3E" />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[BOSS_ARENA_RADIUS, 0.3, 8, 64]} />
        <meshStandardMaterial color="#FF3344" emissive="#FF3344" emissiveIntensity={0.6} />
      </mesh>

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 12, 0]} intensity={1.5} color="#FF4444" distance={40} />

      <KingBearBoss />
    </>
  );
}
