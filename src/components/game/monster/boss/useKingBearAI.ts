import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { playerPosition, setBossDamageFn, bossPosition } from "@/game/worldState";
import { useGameStore, getGameState } from "@/stores/gameStore";
import { BOSS_TYPE, BOSSES } from "@/constants/monster/boss";

import type { BossPhase } from "@/types/boss";

interface DamageNumber {
  id: number;
  value: number;
  y: number;
  opacity: number;
}

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
} = BOSSES.mototo.evergreen[BOSS_TYPE.KING_BEAR];

const SPAWN_POSITION: [number, number, number] = [0, 1.25, -8];
const MELEE_STORM_TICK_S = 1.0;
const HIT_FLASH_MS = 120;
const DEATH_DELAY_MS = 3000;

export { SPAWN_POSITION, BOSS_MAX_HP, BOSS_SCALE, BOSS_MELEE_STORM_RADIUS, BOSS_PHASE_COLORS };

export function useKingBearAI() {
  const takeDamage = useGameStore((s) => s.takeDamage);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const gainExp = useGameStore((s) => s.gainExp);
  const addGold = useGameStore((s) => s.addGold);
  const addItem = useGameStore((s) => s.addItem);
  const setBossCleared = useGameStore((s) => s.setBossCleared);
  const exitBoss = useGameStore((s) => s.exitBoss);
  const addFXBatch = useGameStore((s) => s.addFXBatch);

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
  const hpRef = useRef(BOSS_MAX_HP);
  const showWindupRef = useRef(false);
  const hasDamagesRef = useRef(false);

  const [hp, setHp] = useState(BOSS_MAX_HP);
  const [phase, setPhase] = useState<BossPhase>(1);
  const [dead, setDead] = useState(false);
  const [hit, setHit] = useState(false);
  const [showWindup, setShowWindup] = useState(false);
  const [damages, setDamages] = useState<DamageNumber[]>([]);

  useEffect(() => {
    const applyDamage = (dmg: number) => {
      if (deadRef.current || Date.now() < iframeUntil.current) return;

      setHit(true);
      setTimeout(() => setHit(false), HIT_FLASH_MS);
      hasDamagesRef.current = true;
      setDamages((prev) => [
        ...prev,
        { id: dmgId.current++, value: dmg, y: BOSS_SCALE * 1.8, opacity: 1 },
      ]);
      setHp((prev) => {
        const next = Math.max(0, prev - dmg);
        hpRef.current = next;
        if (next <= 0 && !deadRef.current) {
          deadRef.current = true;
          setDead(true);
          gainExp(BOSS_CLEAR_EXP);
          addGold(BOSS_CLEAR_GOLD);
          if (!getGameState().clearedBosses.includes(BOSS_ID)) {
            addItem({
              ...BOSSES.mototo.evergreen[BOSS_TYPE.KING_BEAR].rewardItem,
              uid: `${BOSS_ID}_reward`,
            });
            setBossCleared(BOSS_ID);
          }
          setTimeout(exitBoss, DEATH_DELAY_MS);
        }
        return next;
      });
    };

    applyDamageRef.current = applyDamage;
    setBossDamageFn(applyDamage);
    bossPosition.current = posRef.current;
    return () => {
      setBossDamageFn(null);
      bossPosition.current = null;
    };
  }, [gainExp, addGold, addItem, setBossCleared, exitBoss]);

  useFrame((_, delta) => {
    if (deadRef.current || !groupRef.current) return;

    const player = playerPosition.current;
    const dist = posRef.current.distanceTo(player);
    const now = Date.now();

    const hpPct = hpRef.current / BOSS_MAX_HP;
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

    if (prevPhase.current >= 2) {
      if (dist < BOSS_MELEE_STORM_RADIUS) {
        stormTimer.current += delta;
        if (stormTimer.current >= MELEE_STORM_TICK_S) {
          stormTimer.current = 0;
          takeDamage(BOSS_MELEE_STORM_DPS);
        }
      } else {
        stormTimer.current = 0;
      }
    }

    if (prevPhase.current >= 3) {
      const sinceLastBurst = now - lastBurstAt.current;
      const isWindingUp =
        sinceLastBurst > BOSS_PROJECTILE_INTERVAL_MS - BOSS_PROJECTILE_WINDUP_MS &&
        sinceLastBurst < BOSS_PROJECTILE_INTERVAL_MS;

      if (isWindingUp !== showWindupRef.current) {
        showWindupRef.current = isWindingUp;
        setShowWindup(isWindingUp);
      }

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
    } else if (showWindupRef.current) {
      showWindupRef.current = false;
      setShowWindup(false);
    }

    const shake = prevPhase.current === 3 ? Math.sin(now * 0.03) * 0.06 : 0;
    groupRef.current.position.set(
      posRef.current.x + shake,
      posRef.current.y + Math.sin(now * 0.002) * 0.1,
      posRef.current.z,
    );

    if (hasDamagesRef.current) {
      setDamages((prev) => {
        if (prev.length === 0) {
          hasDamagesRef.current = false;
          return prev;
        }
        const next = prev
          .map((d) => ({ ...d, y: d.y + 0.02, opacity: d.opacity - 0.018 }))
          .filter((d) => d.opacity > 0);
        if (next.length === 0) hasDamagesRef.current = false;
        return next;
      });
    }
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      if (dead || Date.now() < iframeUntil.current) return;
      applyDamageRef.current(Math.floor(totalAtk() + Math.random() * 8));
    },
    [dead, totalAtk],
  );

  return {
    groupRef,
    hp,
    phase,
    dead,
    hit,
    showWindup,
    damages,
    handleClick,
    phaseColor: BOSS_PHASE_COLORS[phase - 1],
  };
}
