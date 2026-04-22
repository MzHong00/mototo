import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import {
  playerPositionRef,
  playerFacingRef,
  monsterPositions,
  monsterDamageFns,
  npcProximity,
} from "@/stores/worldRefs";
import * as THREE from "three";

const SLASH_RANGE = 2.8;
const BLAST_RANGE = 4.5;

function StatBar({
  value,
  max,
  colorVar,
}: {
  value: number;
  max: number;
  colorVar: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      style={{
        height: 12,
        background: "#C8DCFF",
        borderRadius: "var(--r-full)",
        border: "1px solid rgba(91,163,255,0.3)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: `var(${colorVar})`,
          transition: "width 0.15s ease",
        }}
      />
    </div>
  );
}

const SKILL_COLOR: Record<string, string> = {
  slash: "var(--accent)",
  shield: "var(--accent2)",
  heal: "var(--exp)",
  blast: "var(--danger)",
};

// 1~9, Q W E R, A S D F 순서
const SKILL_KEY_GROUPS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["Q", "W", "E", "R"],
  ["A", "S", "D", "F"],
] as const;
const ALL_HOTKEYS = SKILL_KEY_GROUPS.flat();

type SkillSlotData = {
  id: string;
  label: string;
  cooldown: number;
  lastUsed: number;
  mpCost: number;
};

function SkillSlot({
  skill,
  hotkey,
}: {
  skill: SkillSlotData;
  hotkey: string;
}) {
  const [, tick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => tick((n) => n + 1), 100);
    return () => clearInterval(iv);
  }, []);

  const elapsed = (Date.now() - skill.lastUsed) / 1000;
  const remaining = Math.max(0, skill.cooldown - elapsed);
  const pct = skill.cooldown > 0 ? Math.min(1, elapsed / skill.cooldown) : 1;
  const ready = remaining === 0;
  const color = SKILL_COLOR[skill.id] ?? "var(--accent)";

  return (
    <div
      style={{
        position: "relative",
        width: 46,
        height: 46,
        background: ready ? "var(--panel-blue)" : "#9BB8CC",
        border: `2px solid ${ready ? color : "var(--border-blue)"}`,
        borderRadius: "var(--r-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {!ready && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${(1 - pct) * 100}%`,
            background: "rgba(0,0,0,0.45)",
            transition: "height 0.1s linear",
          }}
        />
      )}
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 10,
          color: ready ? color : "#888",
          zIndex: 1,
        }}
      >
        {skill.label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 400,
          fontSize: 8,
          color: "var(--text-muted)",
          zIndex: 1,
        }}
      >
        {remaining > 0
          ? `${remaining.toFixed(1)}s`
          : skill.mpCost > 0
            ? `MP${skill.mpCost}`
            : ""}
      </span>
      <div
        style={{
          position: "absolute",
          top: 1,
          right: 3,
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 8,
          color: "var(--text-muted)",
          zIndex: 1,
        }}
      >
        {hotkey}
      </div>
    </div>
  );
}

function EmptySlot({ hotkey }: { hotkey: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: 46,
        height: 46,
        background: "rgba(200,220,255,0.3)",
        border: "1.5px dashed var(--border-blue)",
        borderRadius: "var(--r-md)",
        opacity: 0.5,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 1,
          right: 3,
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 8,
          color: "var(--text-muted)",
        }}
      >
        {hotkey}
      </div>
    </div>
  );
}

export function HUD() {
  const character = useGameStore(useShallow((s) => s.character));
  const skills = useGameStore((s) => s.skills);
  const gold = useGameStore((s) => s.gold);
  const isShielded = useGameStore((s) => s.isShielded);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const [npcNear, setNpcNear] = useState(false);
  const useSkill = useGameStore((s) => s.useSkill);
  const healHp = useGameStore((s) => s.healHp);
  const healMp = useGameStore((s) => s.healMp);
  const activateShield = useGameStore((s) => s.activateShield);
  const addFX = useGameStore((s) => s.addFX);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const expPct = Math.round((character.exp / character.expToNext) * 100);

  const fireSkill = useCallback(
    (id: string) => {
      const activated = useSkill(id);
      if (!activated) return;

      const ppos = playerPositionRef.current;
      const pos: [number, number, number] = [ppos.x, ppos.y, ppos.z];
      const f = playerFacingRef.current;
      const dir: [number, number, number] = [f.x, f.y, f.z];
      const atk = totalAtk();
      const cls = character.jobClass;

      if (id === "slash") {
        const fxType =
          cls === "archer"
            ? "arrow"
            : cls === "mage"
              ? "fireball"
              : cls === "rogue"
                ? "shuriken"
                : "slash";
        addFX(fxType, pos, dir);
        monsterPositions.forEach((mpos, mid) => {
          const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
          if (toMon.length() > SLASH_RANGE) return;
          if (f.dot(toMon.normalize()) < 0.5) return;
          monsterDamageFns.get(mid)?.(
            Math.floor(atk * 0.8 + Math.random() * 6),
          );
        });
      }

      if (id === "blast") {
        const fxType =
          cls === "archer"
            ? "arrow_blast"
            : cls === "mage"
              ? "meteor"
              : cls === "rogue"
                ? "shuriken_blast"
                : "blast";
        addFX(fxType, pos, dir);
        monsterPositions.forEach((mpos, mid) => {
          const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
          if (toMon.length() > BLAST_RANGE) return;
          if (f.dot(toMon.normalize()) < 0.26) return;
          monsterDamageFns.get(mid)?.(
            Math.floor(atk * 1.6 + Math.random() * 12),
          );
        });
      }

      if (id === "shield") activateShield();
      if (id === "heal") healHp(Math.floor(character.maxHp * 0.3));
    },
    [
      useSkill,
      addFX,
      activateShield,
      healHp,
      totalAtk,
      character.maxHp,
      character.jobClass,
    ],
  );

  useEffect(() => {
    // 1~9 → skills[0..8], Q W E R A S D F → skills[9..16]
    const SKILL_CODES = [
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Digit6",
      "Digit7",
      "Digit8",
      "Digit9",
      "KeyQ",
      "KeyW",
      "KeyE",
      "KeyR",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyF",
    ];
    const handler = (e: KeyboardEvent) => {
      const idx = SKILL_CODES.indexOf(e.code);
      if (idx !== -1 && skills[idx]) fireSkill(skills[idx].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fireSkill, skills]);

  // MP 자동 회복
  useEffect(() => {
    const iv = setInterval(() => healMp(2), 1000);
    return () => clearInterval(iv);
  }, [healMp]);

  // NPC 근접 감지 + F키 상점
  useEffect(() => {
    const iv = setInterval(() => setNpcNear(npcProximity.isNear), 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "KeyF" && npcProximity.isNear) setShopOpen(true);
      if (e.code === "Escape") setShopOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShopOpen]);

  return (
    <>
      {/* 캐릭터 정보 */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          width: 240,
          padding: "var(--sp-md)",
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(4px)",
          border: `2px solid ${isShielded ? "var(--accent2)" : "var(--border)"}`,
          borderRadius: "var(--r-lg)",
          boxShadow: `0 2px 12px rgba(91,163,255,0.15), 0 0 0 1px ${isShielded ? "rgba(68,136,255,0.5)" : "rgba(255,215,0,0.3)"}`,
          zIndex: 10,
          transition: "border-color 0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FF9900, #FFB300)",
              borderRadius: "var(--r-full)",
              padding: "2px 10px",
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 12,
              color: "#fff",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Lv.{character.level}
          </div>
          <span
            style={{
              fontFamily: "var(--font-title)",
              fontWeight: 600,
              fontSize: 15,
              color: "var(--text)",
            }}
          >
            {character.name}
          </span>
          {isShielded && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 900,
                fontSize: 10,
                color: "var(--accent2)",
                background: "rgba(68,136,255,0.15)",
                padding: "1px 6px",
                borderRadius: "var(--r-full)",
                border: "1px solid var(--accent2)",
              }}
            >
              방패
            </span>
          )}
        </div>

        {[
          {
            label: "HP",
            value: character.hp,
            max: character.maxHp,
            colorVar: "--hp",
          },
          {
            label: "MP",
            value: character.mp,
            max: character.maxMp,
            colorVar: "--mp",
          },
          {
            label: "EXP",
            value: character.exp,
            max: character.expToNext,
            colorVar: "--exp",
          },
        ].map(({ label, value, max, colorVar }, i) => (
          <div key={label} style={{ marginBottom: i < 2 ? 6 : 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontWeight: 900,
                fontFamily: "var(--font-ui)",
                fontVariantNumeric: "tabular-nums",
                color: `var(${colorVar})`,
                marginBottom: 3,
              }}
            >
              <span>{label}</span>
              <span>{label === "EXP" ? `${expPct}%` : `${value}/${max}`}</span>
            </div>
            <StatBar value={value} max={max} colorVar={colorVar} />
          </div>
        ))}
      </div>

      {/* 스킬바 */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(4px)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-lg)",
          boxShadow:
            "0 2px 12px rgba(91,163,255,0.15), 0 0 0 1px rgba(255,215,0,0.3)",
          zIndex: 10,
        }}
      >
        {SKILL_KEY_GROUPS.map((group, gi) => (
          <div key={gi} style={{ display: "flex", gap: 4 }}>
            {group.map((hotkey) => {
              const idx = ALL_HOTKEYS.indexOf(hotkey);
              const skill = skills[idx];
              return skill ? (
                <SkillSlot key={hotkey} skill={skill} hotkey={hotkey} />
              ) : (
                <EmptySlot key={hotkey} hotkey={hotkey} />
              );
            })}
          </div>
        ))}
      </div>

      {/* 골드 */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "6px 14px",
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(4px)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-full)",
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 14,
          color: "#FFB300",
          fontVariantNumeric: "tabular-nums",
          boxShadow: "0 2px 8px rgba(255,153,0,0.2)",
          zIndex: 10,
        }}
      >
        💰 {gold}G
      </div>

      {/* NPC 근접 프롬프트 */}
      {npcNear && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) translateY(80px)",
            padding: "8px 18px",
            background: "rgba(255,255,255,0.93)",
            border: "2px solid var(--border)",
            borderRadius: "var(--r-full)",
            fontFamily: "var(--font-ui)",
            fontWeight: 900,
            fontSize: 13,
            color: "var(--text)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          F 상점 열기
        </div>
      )}

      {/* 조작 안내 */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.85)",
          border: "2px solid var(--border-blue)",
          borderRadius: "var(--r-md)",
          fontSize: 10,
          fontFamily: "var(--font-ui)",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        스크롤 줌 · 클릭 공격 · 1~9 / QWER / ASDF 스킬 · I 인벤토리
      </div>
    </>
  );
}
