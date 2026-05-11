import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

import { playerPositionRef, monsterPositions, monsterDamageFns } from "@/stores/worldRefs";
import { useGameStore } from "@/stores/gameStore";
import {
  MONSTER_STATS,
  AGGRO_RANGE,
  DEAGGRO_RANGE,
  ATTACK_RANGE,
  ATTACK_CD,
} from "@/constants/monster";

import type { ThreeEvent } from "@react-three/fiber";
import type { MonsterConfig } from "@/types/monster";

// Three.js는 CSS 변수 미지원 — 파일 내 상수로 추출
const COLOR_DMG = "#FFD700";
const COLOR_DMG_OUTLINE = "#000000";
const COLOR_HP_BAR_BG = "#C8DCFF";
const COLOR_EYE_AGGRO = "#FF2200";
const COLOR_EYE_DEFAULT = "#111111";
const HIT_SCALE_MULT = 1.18;
const FLOAT_FREQUENCY = 0.002;
const FLOAT_AMPLITUDE = 0.08;

function getHpBarColor(pct: number): string {
  if (pct > 0.5) return "#33BB55";
  if (pct > 0.25) return "#FFAA00";
  return "#FF3333";
}

interface DamageNumber {
  id: number;
  value: number;
  y: number;
  opacity: number;
}

interface MonsterProps extends MonsterConfig {
  onDeath: (id: number, exp: number) => void;
}

export function Monster({ id, type, position, onDeath }: MonsterProps) {
  const stats = MONSTER_STATS[type];
  const takeDamage = useGameStore((s) => s.takeDamage);
  const totalAtk = useGameStore((s) => s.totalAtk);

  const [hp, setHp] = useState(stats.maxHp);
  const [dead, setDead] = useState(false);
  const [hit, setHit] = useState(false);
  const [damages, setDamages] = useState<DamageNumber[]>([]);

  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(new THREE.Vector3(...position));
  const aggroRef = useRef(false);
  const atkTimer = useRef(0);
  const dmgId = useRef(0);
  const _dir = useRef(new THREE.Vector3());
  const deadRef = useRef(false);
  const eyeMat0Ref = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMat1Ref = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    monsterPositions.set(id, posRef.current);

    const applyDamage = (dmg: number) => {
      if (deadRef.current) return;
      setHit(true);
      setTimeout(() => setHit(false), 120);
      setDamages((prev) => [
        ...prev,
        { id: dmgId.current++, value: dmg, y: stats.scale * 1.8, opacity: 1 },
      ]);
      setHp((prev) => {
        const next = Math.max(0, prev - dmg);
        if (next <= 0 && !deadRef.current) {
          deadRef.current = true;
          setDead(true);
          setTimeout(() => onDeath(id, stats.exp), 1000);
        }
        return next;
      });
    };

    monsterDamageFns.set(id, applyDamage);
    return () => {
      monsterPositions.delete(id);
      monsterDamageFns.delete(id);
    };
  }, [id, onDeath, stats.exp, stats.scale]);

  useFrame((_, delta) => {
    // 데미지 숫자 페이드는 dead 여부와 무관하게 항상 업데이트
    setDamages((prev) =>
      prev.length === 0
        ? prev
        : prev
            .map((d) => ({ ...d, y: d.y + 0.02, opacity: d.opacity - 0.022 }))
            .filter((d) => d.opacity > 0),
    );

    if (dead || !groupRef.current) return;

    const player = playerPositionRef.current;
    const dist = posRef.current.distanceTo(player);

    if (dist < AGGRO_RANGE) aggroRef.current = true;
    if (dist > DEAGGRO_RANGE) aggroRef.current = false;

    if (aggroRef.current) {
      if (dist > ATTACK_RANGE) {
        _dir.current.subVectors(player, posRef.current).normalize();
        posRef.current.addScaledVector(_dir.current, stats.speed * delta);
        groupRef.current.rotation.y = Math.atan2(_dir.current.x, _dir.current.z);
      } else {
        atkTimer.current += delta;
        if (atkTimer.current >= ATTACK_CD) {
          atkTimer.current = 0;
          takeDamage(stats.damage);
        }
      }
    }

    groupRef.current.position.set(
      posRef.current.x,
      posRef.current.y + Math.sin(Date.now() * FLOAT_FREQUENCY + id) * FLOAT_AMPLITUDE,
      posRef.current.z,
    );

    const eyeColor = aggroRef.current ? COLOR_EYE_AGGRO : COLOR_EYE_DEFAULT;
    eyeMat0Ref.current?.color.set(eyeColor);
    eyeMat1Ref.current?.color.set(eyeColor);
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (dead) return;
      monsterDamageFns.get(id)?.(Math.floor(totalAtk() + Math.random() * 8));
    },
    [dead, id, totalAtk],
  );

  if (dead) {
    return (
      <group position={position}>
        <mesh scale={[stats.scale, 0.08, stats.scale]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color={stats.color} transparent opacity={0.3} />
        </mesh>
        {damages.map((d) => (
          <Billboard key={d.id} position={[0, d.y, 0]}>
            <Text
              fontSize={0.3}
              color={COLOR_DMG}
              outlineWidth={0.05}
              outlineColor={COLOR_DMG_OUTLINE}
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

  const hpPct = hp / stats.maxHp;

  return (
    <group ref={groupRef} position={position}>
      <mesh scale={hit ? stats.scale * HIT_SCALE_MULT : stats.scale} onClick={handleClick} castShadow>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial
          color={hit ? "#FFFFFF" : stats.color}
          emissive={hit ? stats.color : "#000000"}
          emissiveIntensity={hit ? 0.9 : 0}
        />
      </mesh>
      {([-0.15, 0.15] as number[]).map((x, i) => (
        <mesh key={i} position={[x * stats.scale, 0.12 * stats.scale, 0.42 * stats.scale]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial ref={i === 0 ? eyeMat0Ref : eyeMat1Ref} color={COLOR_EYE_DEFAULT} />
        </mesh>
      ))}

      <Billboard position={[0, stats.scale * 1.35, 0]}>
        <mesh>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color={COLOR_HP_BAR_BG} />
        </mesh>
        <mesh position={[(hpPct - 1) * 0.4, 0, 0.001]} scale={[hpPct, 1, 1]}>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color={getHpBarColor(hpPct)} />
        </mesh>
      </Billboard>

      {damages.map((d) => (
        <Billboard key={d.id} position={[0, d.y, 0]}>
          <Text
            fontSize={0.3}
            color={COLOR_DMG}
            outlineWidth={0.05}
            outlineColor={COLOR_DMG_OUTLINE}
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
