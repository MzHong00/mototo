import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { playerPositionRef, registerBossDamageFn, bossPositionRef } from "@/stores/worldRefs";
import { useGameStore } from "@/stores/gameStore";
import { BOSS_TYPE, BOSS_STATS } from "@/constants/boss";

import type { BossPhase } from "@/types/boss";

const {
  id: BOSS_ID,
  maxHp: BOSS_MAX_HP,
  speed: BOSS_SPEED,
  scale: BOSS_SCALE,
  attackDamage: BOSS_ATTACK_DAMAGE,
  attackCd: BOSS_ATTACK_CD,
  attackRange: BOSS_ATTACK_RANGE,
  phase2HpPct: BOSS_PHASE2_HP_PCT,
  phase3HpPct: BOSS_PHASE3_HP_PCT,
  phaseIframesMs: BOSS_PHASE_IFRAMES_MS,
  phaseColors: BOSS_PHASE_COLORS,
  meleeStormRadius: BOSS_MELEE_STORM_RADIUS,
  meleeStormDps: BOSS_MELEE_STORM_DPS,
  projectileIntervalMs: BOSS_PROJECTILE_INTERVAL_MS,
  projectileWindupMs: BOSS_PROJECTILE_WINDUP_MS,
  clearExp: BOSS_CLEAR_EXP,
  clearGold: BOSS_CLEAR_GOLD,
} = BOSS_STATS[BOSS_TYPE.KING_BEAR];

interface DamageNumber {
  id: number;
  value: number;
  y: number;
  opacity: number;
}

interface KingBearBossProps {
  onBossDeath: () => void;
}

const SPAWN_POSITION: [number, number, number] = [0, 1.25, -8];

export function KingBearBoss({ onBossDeath }: KingBearBossProps) {
  const takeDamage = useGameStore((s) => s.takeDamage);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const gainExp = useGameStore((s) => s.gainExp);
  const addGold = useGameStore((s) => s.addGold);
  const addItem = useGameStore((s) => s.addItem);
  const clearedBosses = useGameStore((s) => s.clearedBosses);
  const setBossCleared = useGameStore((s) => s.setBossCleared);
  const addFXBatch = useGameStore((s) => s.addFXBatch);

  const [hp, setHp] = useState(BOSS_MAX_HP);
  const [phase, setPhase] = useState<BossPhase>(1);
  const [dead, setDead] = useState(false);
  const [hit, setHit] = useState(false);
  const [showWindup, setShowWindup] = useState(false);
  const [damages, setDamages] = useState<DamageNumber[]>([]);

  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(new THREE.Vector3(...SPAWN_POSITION));
  const deadRef = useRef(false);
  const applyDamageRef = useRef<(dmg: number) => void>(() => {});
  const atkTimer = useRef(0);
  const stormTimer = useRef(0);
  const lastBurstAt = useRef(0);
  const iframeUntil = useRef(0);
  const prevPhase = useRef<BossPhase>(1);
  const dmgId = useRef(0);
  const _dir = useRef(new THREE.Vector3());

  useEffect(() => {
    const applyDamage = (dmg: number) => {
      if (deadRef.current) return;
      if (Date.now() < iframeUntil.current) return;

      setHit(true);
      setTimeout(() => setHit(false), 120);
      setDamages((prev) => [
        ...prev,
        { id: dmgId.current++, value: dmg, y: BOSS_SCALE * 1.8, opacity: 1 },
      ]);
      setHp((prev) => {
        const next = Math.max(0, prev - dmg);
        if (next <= 0 && !deadRef.current) {
          deadRef.current = true;
          setDead(true);
          gainExp(BOSS_CLEAR_EXP);
          addGold(BOSS_CLEAR_GOLD);
          if (!clearedBosses.includes(BOSS_ID)) {
            addItem({ ...BOSS_STATS[BOSS_TYPE.KING_BEAR].rewardItem, uid: `${BOSS_ID}_reward` });
            setBossCleared(BOSS_ID);
          }
          setTimeout(onBossDeath, 3000);
        }
        return next;
      });
    };

    applyDamageRef.current = applyDamage;
    registerBossDamageFn(applyDamage);
    bossPositionRef.current = posRef.current;
    return () => {
      registerBossDamageFn(null);
      bossPositionRef.current = null;
    };
  }, [gainExp, addGold, addItem, clearedBosses, setBossCleared, onBossDeath]);

  useFrame((_, delta) => {
    if (deadRef.current || !groupRef.current) return;

    const player = playerPositionRef.current;
    const dist = posRef.current.distanceTo(player);
    const now = Date.now();

    const hpPct = hp / BOSS_MAX_HP;
    const nextPhase: BossPhase =
      hpPct > BOSS_PHASE2_HP_PCT ? 1 : hpPct > BOSS_PHASE3_HP_PCT ? 2 : 3;
    if (nextPhase !== prevPhase.current) {
      prevPhase.current = nextPhase;
      setPhase(nextPhase);
      iframeUntil.current = now + BOSS_PHASE_IFRAMES_MS;
    }

    if (dist > BOSS_ATTACK_RANGE) {
      _dir.current.subVectors(player, posRef.current).normalize();
      posRef.current.addScaledVector(_dir.current, BOSS_SPEED * delta);
      groupRef.current.rotation.y = Math.atan2(_dir.current.x, _dir.current.z);
    }

    if (dist <= BOSS_ATTACK_RANGE) {
      atkTimer.current += delta;
      if (atkTimer.current >= BOSS_ATTACK_CD) {
        atkTimer.current = 0;
        takeDamage(BOSS_ATTACK_DAMAGE);
      }
    }

    if (phase >= 2) {
      if (dist < BOSS_MELEE_STORM_RADIUS) {
        stormTimer.current += delta;
        if (stormTimer.current >= 1.0) {
          stormTimer.current = 0;
          takeDamage(BOSS_MELEE_STORM_DPS);
        }
      } else {
        stormTimer.current = 0;
      }
    }

    if (phase >= 3) {
      const sinceLastBurst = now - lastBurstAt.current;
      const isWindingUp =
        sinceLastBurst > BOSS_PROJECTILE_INTERVAL_MS - BOSS_PROJECTILE_WINDUP_MS &&
        sinceLastBurst < BOSS_PROJECTILE_INTERVAL_MS;

      setShowWindup(isWindingUp);

      if (sinceLastBurst >= BOSS_PROJECTILE_INTERVAL_MS) {
        lastBurstAt.current = now;
        const bossPos = posRef.current;
        addFXBatch(
          Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return {
              type: "fireball" as const,
              pos: [bossPos.x, bossPos.y + 0.5, bossPos.z] as [number, number, number],
              dir: [Math.cos(angle), 0, Math.sin(angle)] as [number, number, number],
            };
          }),
        );
      }
    } else {
      setShowWindup(false);
    }

    const shake = phase === 3 && !dead ? Math.sin(now * 0.03) * 0.06 : 0;
    groupRef.current.position.set(
      posRef.current.x + shake,
      posRef.current.y + Math.sin(now * 0.002) * 0.1,
      posRef.current.z,
    );

    setDamages((prev) =>
      prev.length === 0
        ? prev
        : prev
            .map((d) => ({ ...d, y: d.y + 0.02, opacity: d.opacity - 0.018 }))
            .filter((d) => d.opacity > 0),
    );
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (dead || Date.now() < iframeUntil.current) return;
      applyDamageRef.current(Math.floor(totalAtk() + Math.random() * 8));
    },
    [dead, totalAtk],
  );

  const phaseColor = BOSS_PHASE_COLORS[phase - 1];

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

  const hpPct = hp / BOSS_MAX_HP;

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
        <mesh position={[(hpPct - 1) * 0.7, 0, 0.001]} scale={[hpPct, 1, 1]}>
          <planeGeometry args={[1.4, 0.12]} />
          <meshBasicMaterial
            color={hpPct > 0.6 ? "#33BB55" : hpPct > 0.3 ? "#FFAA00" : "#FF3333"}
          />
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
