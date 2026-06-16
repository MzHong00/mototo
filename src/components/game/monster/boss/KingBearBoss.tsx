import { Text, Billboard } from "@react-three/drei";

import { BOSS_HP_BAR_COLOR } from "@/constants/monster/boss";
import {
  useKingBearAI,
  SPAWN_POSITION,
  BOSS_MAX_HP,
  BOSS_SCALE,
  BOSS_MELEE_STORM_RADIUS,
} from "@/components/game/monster/boss/useKingBearAI";

interface KingBearBossProps {
  onBossDeath: () => void;
}

export function KingBearBoss({ onBossDeath }: KingBearBossProps) {
  const { groupRef, hp, phase, dead, hit, showWindup, damages, handleClick, phaseColor } =
    useKingBearAI({ onBossDeath });

  if (dead) {
    return (
      <group position={SPAWN_POSITION}>
        <mesh scale={[BOSS_SCALE, 0.08, BOSS_SCALE]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color={phaseColor} transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={SPAWN_POSITION}>
      {phase >= 2 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[BOSS_MELEE_STORM_RADIUS, 32]} />
          <meshBasicMaterial color="#FF2200" transparent opacity={0.18} />
        </mesh>
      )}

      {showWindup && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.5, 1.2, 32]} />
          <meshBasicMaterial color="#FFDD00" transparent opacity={0.7} />
        </mesh>
      )}

      <mesh scale={hit ? BOSS_SCALE * 1.12 : BOSS_SCALE} onClick={handleClick} castShadow>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial
          color={hit ? "#FFFFFF" : phaseColor}
          emissive={hit ? phaseColor : "#000000"}
          emissiveIntensity={hit ? 1.0 : 0}
        />
      </mesh>

      {([-0.18, 0.18] as number[]).map((x, i) => (
        <mesh key={i} position={[x * BOSS_SCALE, 0.15 * BOSS_SCALE, 0.44 * BOSS_SCALE]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
        </mesh>
      ))}

      <Billboard position={[0, BOSS_SCALE * 1.6, 0]}>
        <Text
          fontSize={0.35}
          color={phaseColor}
          outlineWidth={0.06}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {`왕 곰  Phase ${phase}`}
        </Text>
      </Billboard>

      <Billboard position={[0, BOSS_SCALE * 1.3, 0]}>
        <mesh>
          <planeGeometry args={[1.4, 0.12]} />
          <meshBasicMaterial color="#C8DCFF" />
        </mesh>
        <mesh position={[(hp / BOSS_MAX_HP - 1) * 0.7, 0, 0.001]} scale={[hp / BOSS_MAX_HP, 1, 1]}>
          <planeGeometry args={[1.4, 0.12]} />
          <meshBasicMaterial color={BOSS_HP_BAR_COLOR} />
        </mesh>
      </Billboard>

      {damages.map((d) => (
        <Billboard key={d.id} position={[0, d.y, 0]}>
          <Text
            fontSize={0.35}
            color="#FFD700"
            outlineWidth={0.06}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
            fillOpacity={d.opacity}
          >
            {d.value}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}
