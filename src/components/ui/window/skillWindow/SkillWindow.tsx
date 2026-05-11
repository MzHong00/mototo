import { useState } from "react";

import { useGameStore } from "@/stores/gameStore";
import { useDraggable } from "@/hooks/useDraggable";
import { SKILL_COLOR, SKILL_DESCRIPTIONS, SKILL_ICON } from "@/constants/skill";
import { CLASS_CONFIG } from "@/constants/character";
import {
  SKILL_LEVEL_MAX,
  PASSIVE_LEVEL_MAX,
  PASSIVE_CONFIG,
  PASSIVE_STATS,
  getSkillUpgradeDesc,
} from "@/constants/growth";

import type { SkillState } from "@/types/character";
import type { PassiveStat } from "@/constants/growth";

import styles from "./SkillWindow.module.scss";

interface SkillWindowProps {
  onClose: () => void;
}

type Tab = "skills" | "upgrade" | "passive";

export function SkillWindow({ onClose }: SkillWindowProps) {
  const [tab, setTab] = useState<Tab>("skills");
  const { pos, onHeaderMouseDown } = useDraggable(Math.max(0, window.innerWidth - 440), 80);

  const allSkills = useGameStore((s) => s.allSkills);
  const skills = useGameStore((s) => s.skills);
  const skillPoints = useGameStore((s) => s.skillPoints);
  const passiveUpgrades = useGameStore((s) => s.passiveUpgrades);
  const upgradeSkill = useGameStore((s) => s.upgradeSkill);
  const upgradePassive = useGameStore((s) => s.upgradePassive);
  const { level, jobClass } = useGameStore((s) => ({
    level: s.character.level,
    jobClass: s.character.jobClass,
  }));

  const equippedMap = new Map<string, number>();
  skills.forEach((sk, idx) => {
    if (sk) equippedMap.set(sk.id, idx);
  });

  const lockedSkills = jobClass
    ? CLASS_CONFIG[jobClass].skills.filter(
        (sk) => (sk.requiredLevel ?? 1) > level && !allSkills.some((as) => as.id === sk.id),
      )
    : [];

  return (
    <div className={styles.panel} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.header} onMouseDown={onHeaderMouseDown}>
        <span className={styles.title}>스킬</span>
        {skillPoints > 0 && <span className={styles.sp}>SP {skillPoints}</span>}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "skills" ? styles.active : ""}`}
          onClick={() => setTab("skills")}
        >
          스킬
        </button>
        <button
          className={`${styles.tab} ${tab === "upgrade" ? styles.active : ""}`}
          onClick={() => setTab("upgrade")}
        >
          강화
        </button>
        <button
          className={`${styles.tab} ${tab === "passive" ? styles.active : ""}`}
          onClick={() => setTab("passive")}
        >
          패시브
        </button>
      </div>

      {tab === "skills" && (
        <>
          <p className={styles.hint}>스킬 카드를 하단 스킬바의 원하는 키 슬롯에 드래그해서 배치하세요. 슬롯 우클릭 = 해제.</p>
          <div className={styles.list}>
            {allSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} equippedSlot={equippedMap.get(skill.id)} />
            ))}
            {lockedSkills.map((skill) => (
              <LockedSkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </>
      )}

      {tab === "upgrade" && (
        <div className={styles.body}>
          <div className={styles.skillList}>
            {allSkills.map((skill) => {
              const color = SKILL_COLOR[skill.id] ?? "var(--accent)";
              const maxed = skill.level >= SKILL_LEVEL_MAX;
              const canUpgrade = skillPoints > 0 && !maxed;
              return (
                <div key={skill.id} className={styles.skillRow}>
                  <div className={styles.skillIcon} style={{ background: color }}>
                    <span className={styles.cardIconEmoji}>{SKILL_ICON[skill.id] ?? "?"}</span>
                  </div>
                  <div className={styles.skillInfo}>
                    <div className={styles.skillName}>{skill.label}</div>
                    <div className={styles.skillDesc}>
                      {getSkillUpgradeDesc(skill.id, skill.level)}
                    </div>
                    {!maxed && (
                      <div className={styles.skillNext}>
                        → {getSkillUpgradeDesc(skill.id, skill.level + 1)}
                      </div>
                    )}
                  </div>
                  <div className={styles.skillRight}>
                    <div className={styles.levelStars}>
                      {Array.from({ length: SKILL_LEVEL_MAX }).map((_, i) => (
                        <span key={i} className={i < skill.level ? styles.starOn : styles.starOff}>
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      className={`${styles.upgradeBtn} ${!canUpgrade ? styles.disabled : ""}`}
                      onClick={() => canUpgrade && upgradeSkill(skill.id)}
                      disabled={!canUpgrade}
                    >
                      {maxed ? "MAX" : "강화 (1SP)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "passive" && (
        <div className={styles.body}>
          <div className={styles.passiveList}>
            {PASSIVE_STATS.map((stat) => {
              const cfg = PASSIVE_CONFIG[stat];
              const level = passiveUpgrades[stat];
              const maxed = level >= PASSIVE_LEVEL_MAX;
              const canUpgrade = skillPoints > 0 && !maxed;
              return (
                <div key={stat} className={styles.passiveRow}>
                  <span className={styles.passiveIcon}>{cfg.icon}</span>
                  <div className={styles.passiveInfo}>
                    <div className={styles.passiveName}>{cfg.label}</div>
                    <div className={styles.passiveDesc}>
                      {level > 0 ? cfg.desc(level) : "미강화"}
                      {!maxed && (
                        <span className={styles.passiveNext}> → {cfg.desc(level + 1)}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.passiveRight}>
                    <div className={styles.passiveLevel}>
                      {level} / {PASSIVE_LEVEL_MAX}
                    </div>
                    <button
                      className={`${styles.upgradeBtn} ${!canUpgrade ? styles.disabled : ""}`}
                      onClick={() => canUpgrade && upgradePassive(stat as PassiveStat)}
                      disabled={!canUpgrade}
                    >
                      {maxed ? "MAX" : "+1 (1SP)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LockedSkillCard({ skill }: { skill: SkillState }) {
  const color = SKILL_COLOR[skill.id] ?? "var(--accent)";
  return (
    <div className={`${styles.card} ${styles.locked}`}>
      <div className={styles.cardIcon} style={{ background: color, opacity: 0.3 }}>
        <span className={styles.cardIconEmoji}>{SKILL_ICON[skill.id] ?? "?"}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardNameRow}>
          <span className={styles.cardName} style={{ opacity: 0.4 }}>{skill.label}</span>
          <span className={styles.lockBadge}>🔒 Lv.{skill.requiredLevel} 해금</span>
        </div>
        <span className={styles.cardDesc} style={{ opacity: 0.4 }}>
          {SKILL_DESCRIPTIONS[skill.id] ?? ""}
        </span>
      </div>
    </div>
  );
}

function SkillCard({
  skill,
  equippedSlot,
}: {
  skill: SkillState;
  equippedSlot: number | undefined;
}) {
  const color = SKILL_COLOR[skill.id] ?? "var(--accent)";
  const isEquipped = equippedSlot !== undefined;

  return (
    <div
      className={`${styles.card} ${isEquipped ? styles.equipped : ""}`}
      style={{ "--skill-color": color } as React.CSSProperties}
      draggable
      onDragStart={(e) => {
        const ghost = document.createElement("div");
        ghost.style.cssText = `width:40px;height:40px;background:${color};border-radius:8px;position:fixed;top:-100px;opacity:0.9;box-shadow:0 2px 8px rgba(0,0,0,0.3)`;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 20, 20);
        setTimeout(() => document.body.removeChild(ghost), 0);
        e.dataTransfer.setData("text/plain", JSON.stringify({ from: "pool", skillId: skill.id }));
        e.dataTransfer.effectAllowed = "copy";
      }}
    >
      <div className={styles.cardIcon} style={{ background: color }}>
        <span className={styles.cardIconEmoji}>{SKILL_ICON[skill.id] ?? "?"}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardNameRow}>
          <span className={styles.cardName}>{skill.label}</span>
          <div className={styles.cardStars}>
            {Array.from({ length: SKILL_LEVEL_MAX }).map((_, i) => (
              <span key={i} className={i < skill.level ? styles.starOn : styles.starOff}>
                ★
              </span>
            ))}
          </div>
        </div>
        <span className={styles.cardDesc}>{SKILL_DESCRIPTIONS[skill.id] ?? ""}</span>
        <div className={styles.cardStats}>
          <span className={styles.cd}>쿨 {skill.cooldown}s</span>
          {isEquipped && <span className={styles.equippedBadge}>슬롯 {equippedSlot + 1}</span>}
        </div>
      </div>
    </div>
  );
}
