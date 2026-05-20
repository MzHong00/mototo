import { useState } from "react";

import { useGameStore } from "@/stores/gameStore";
import { useDraggable } from "@/hooks/useDraggable";
import { SKILL_COLOR, SKILL_DESCRIPTIONS, SKILL_ICON } from "@/constants/skill";
import { CLASS_CONFIG } from "@/constants/character";
import { SKILL_LEVEL_MAX, getSkillUpgradeDesc } from "@/constants/growth";
import { getSkillTree, ARCHETYPE_COLORS } from "@/constants/skillTree";

import type { SkillNodeChoice, SkillTreeDef } from "@/types/skillTree";
import type { SkillState } from "@/types/character";

import styles from "./SkillWindow.module.scss";

interface SkillWindowProps {
  onClose: () => void;
}

export function SkillWindow({ onClose }: SkillWindowProps) {
  const { pos, onHeaderMouseDown } = useDraggable(Math.max(0, window.innerWidth - 820), 80);

  const allSkills = useGameStore((s) => s.allSkills);
  const skills = useGameStore((s) => s.skills);
  const skillPoints = useGameStore((s) => s.skillPoints);
  const upgradeSkill = useGameStore((s) => s.upgradeSkill);
  const downgradeSkill = useGameStore((s) => s.downgradeSkill);
  const selectSkillNode = useGameStore((s) => s.selectSkillNode);
  const { jobClass } = useGameStore((s) => ({ jobClass: s.character.jobClass }));

  const classSkills = jobClass ? CLASS_CONFIG[jobClass].skills.filter((s) => s.id !== "dash") : [];
  const [selectedSkillId, setSelectedSkillId] = useState<string>(classSkills[0]?.id ?? "");

  const equippedMap = new Map<string, number>();
  skills.forEach((sk, idx) => {
    if (sk) equippedMap.set(sk.id, idx);
  });

  const selectedSkill = allSkills.find((s) => s.id === selectedSkillId);
  const selectedTree =
    jobClass && selectedSkillId ? getSkillTree(jobClass, selectedSkillId) : undefined;

  const canUpgrade = skillPoints > 0 && !!selectedSkill && selectedSkill.level < SKILL_LEVEL_MAX;
  const canDowngrade = !!selectedSkill && selectedSkill.level > 1;

  return (
    <div className={styles.panel} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.header} onMouseDown={onHeaderMouseDown}>
        <span className={styles.title}>스킬</span>
        {skillPoints > 0 && <span className={styles.sp}>SP {skillPoints}</span>}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        {/* ── 왼쪽 사이드바 ── */}
        <nav className={styles.sidebar}>
          <p className={styles.sideHint}>아이콘 드래그 → 스킬바 장착</p>
          {classSkills.map((sk) => {
            const learned = allSkills.some((a) => a.id === sk.id);
            const isLocked = !learned;
            const color = SKILL_COLOR[sk.id] ?? "var(--accent)";
            const slotNo = equippedMap.get(sk.id);
            const learnedSkill = allSkills.find((a) => a.id === sk.id);
            return (
              <div
                key={sk.id}
                className={`${styles.sideSkill} ${selectedSkillId === sk.id ? styles.sideActive : ""} ${isLocked ? styles.sideLocked : ""}`}
                onClick={() => !isLocked && setSelectedSkillId(sk.id)}
                draggable={!isLocked}
                onDragStart={(e) => {
                  if (isLocked) return;
                  const ghost = document.createElement("div");
                  ghost.style.cssText = `width:36px;height:36px;background:${color};border-radius:8px;position:fixed;top:-100px;opacity:0.9;display:flex;align-items:center;justify-content:center;font-size:18px`;
                  ghost.textContent = SKILL_ICON[sk.id] ?? "?";
                  document.body.appendChild(ghost);
                  e.dataTransfer.setDragImage(ghost, 18, 18);
                  setTimeout(() => document.body.removeChild(ghost), 0);
                  e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({ from: "pool", skillId: sk.id }),
                  );
                  e.dataTransfer.effectAllowed = "copy";
                }}
              >
                <span
                  className={styles.sideIcon}
                  style={{ background: color, cursor: isLocked ? "not-allowed" : "grab" }}
                >
                  {SKILL_ICON[sk.id] ?? "?"}
                </span>
                <div className={styles.sideMeta}>
                  <span className={styles.sideName}>{sk.label}</span>
                  {isLocked ? (
                    <span className={styles.sideLock}>🔒 Lv.{sk.requiredLevel}</span>
                  ) : slotNo !== undefined ? (
                    <span className={styles.sideSlot}>슬롯 {slotNo + 1}</span>
                  ) : (
                    learnedSkill && (
                      <span className={styles.sideLevel}>Lv.{learnedSkill.level}</span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── 중앙 트라이포드 트리 ── */}
        <div className={styles.treePane}>
          {selectedSkill && selectedTree ? (
            <TripodTree skill={selectedSkill} tree={selectedTree} onSelect={selectSkillNode} />
          ) : (
            <div className={styles.treeEmpty}>
              {classSkills.length === 0 ? "클래스를 선택하세요." : "왼쪽에서 스킬을 선택하세요."}
            </div>
          )}
        </div>

        {/* ── 오른쪽 강화 패널 ── */}
        <aside className={styles.rightPanel}>
          <div className={styles.rightHeader}>
            <span className={styles.rightTitle}>강화</span>
            {skillPoints > 0 && <span className={styles.spBadge}>SP {skillPoints}</span>}
          </div>

          {selectedSkill ? (
            <div className={styles.rightContent}>
              {/* 레벨 별 */}
              <div className={styles.levelStars}>
                {Array.from({ length: SKILL_LEVEL_MAX }).map((_, i) => (
                  <span
                    key={i}
                    className={i < selectedSkill.level ? styles.starOn : styles.starOff}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.levelLabel}>
                Lv.{selectedSkill.level} / {SKILL_LEVEL_MAX}
              </div>

              {/* 현재 레벨 효과 */}
              <div className={styles.descSection}>
                <span className={styles.descCur}>현재</span>
                <p className={styles.descText}>
                  {getSkillUpgradeDesc(selectedSkill.id, selectedSkill.level)}
                </p>
              </div>

              {/* 다음 레벨 효과 */}
              {selectedSkill.level < SKILL_LEVEL_MAX ? (
                <div className={`${styles.descSection} ${styles.descNextSection}`}>
                  <span className={styles.descNext}>▶ Lv.{selectedSkill.level + 1}</span>
                  <p className={styles.descText}>
                    {getSkillUpgradeDesc(selectedSkill.id, selectedSkill.level + 1)}
                  </p>
                </div>
              ) : (
                <div className={styles.maxBadge}>MAX</div>
              )}

              {/* 버튼 */}
              <div className={styles.upgradeActions}>
                <button
                  className={`${styles.upgradeBtn} ${!canUpgrade ? styles.btnOff : ""}`}
                  onClick={() => canUpgrade && upgradeSkill(selectedSkill.id)}
                  disabled={!canUpgrade}
                >
                  강화 (1 SP)
                </button>
                <button
                  className={`${styles.downgradeBtn} ${!canDowngrade ? styles.btnOff : ""}`}
                  onClick={() => canDowngrade && downgradeSkill(selectedSkill.id)}
                  disabled={!canDowngrade}
                >
                  되돌리기 +1SP
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.rightEmpty}>
              스킬을 선택하면
              <br />
              강화 정보가 표시됩니다
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ── 트라이포드 트리 시각화 ─────────────────────────────────────────

interface TripodTreeProps {
  skill: SkillState;
  tree: SkillTreeDef;
  onSelect: (skillId: string, tier: number, nodeId: string) => void;
}

// Canvas 기준 좌표 (고정 460×270px)
const POSITIONS = {
  root: { x: 230, y: 28 },
  t1a: { x: 115, y: 130 },
  t1b: { x: 345, y: 130 },
  t2a: { x: 115, y: 225 },
  t2b: { x: 345, y: 225 },
} as const;

const ROOT_HALF = 24;
const NODE_HALF = 18;
// diamond tip distance from center: size * √2 / 2
const ROOT_TIP = 34; // 48 * 1.414 / 2
const NODE_TIP = 25; // 36 * 1.414 / 2

function TripodTree({ skill, tree, onSelect }: TripodTreeProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const t1 = tree.tiers[0];
  const t2 = tree.tiers[1];
  const t1sel = skill.selectedNodes?.[1];
  const t2sel = skill.selectedNodes?.[2];

  const allChoices = [...t1.choices, ...t2.choices];
  const hoveredChoice = allChoices.find((c) => c.id === hoveredId) ?? null;
  const lastSelected =
    (t2sel ? t2.choices.find((c) => c.id === t2sel) : null) ??
    (t1sel ? t1.choices.find((c) => c.id === t1sel) : null);
  const infoChoice = hoveredChoice ?? lastSelected ?? null;

  const lineColor = (choice: SkillNodeChoice, selected: string | undefined) =>
    selected === choice.id
      ? (ARCHETYPE_COLORS[choice.archetype] ?? "var(--accent)")
      : "rgba(116,185,232,0.18)";

  const lc_t1a = lineColor(t1.choices[0], t1sel);
  const lc_t1b = lineColor(t1.choices[1], t1sel);
  const lc_t2a = lineColor(t2.choices[0], t2sel);
  const lc_t2b = lineColor(t2.choices[1], t2sel);

  const color = SKILL_COLOR[skill.id] ?? "var(--accent)";

  return (
    <>
      {/* 스킬 헤더 */}
      <div className={styles.treeHeader}>
        <span className={styles.treeSkillIconBox} style={{ background: color }}>
          {SKILL_ICON[skill.id] ?? "?"}
        </span>
        <div className={styles.treeSkillInfo}>
          <span className={styles.treeSkillName}>{skill.label}</span>
          <span className={styles.treeSkillMeta}>
            쿨 {skill.cooldown}s · Lv.{skill.level}
          </span>
          <span className={styles.treeSkillDesc}>{SKILL_DESCRIPTIONS[skill.id]}</span>
        </div>
      </div>

      {/* 트리 캔버스 (460×270 고정) */}
      <div className={styles.treeCanvas}>
        <svg className={styles.treeSvg} viewBox="0 0 460 270" preserveAspectRatio="xMidYMid meet">
          <circle
            cx="230"
            cy="130"
            r="108"
            fill="none"
            stroke="rgba(116,185,232,0.04)"
            strokeWidth="1"
          />
          <circle
            cx="230"
            cy="130"
            r="80"
            fill="none"
            stroke="rgba(116,185,232,0.03)"
            strokeWidth="1"
          />

          {/* Root → T1 */}
          <line
            x1={POSITIONS.root.x}
            y1={POSITIONS.root.y + ROOT_TIP}
            x2={POSITIONS.t1a.x}
            y2={POSITIONS.t1a.y - NODE_TIP}
            stroke={lc_t1a}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1={POSITIONS.root.x}
            y1={POSITIONS.root.y + ROOT_TIP}
            x2={POSITIONS.t1b.x}
            y2={POSITIONS.t1b.y - NODE_TIP}
            stroke={lc_t1b}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* T1 → T2 */}
          <line
            x1={POSITIONS.t1a.x}
            y1={POSITIONS.t1a.y + NODE_TIP}
            x2={POSITIONS.t2a.x}
            y2={POSITIONS.t2a.y - NODE_TIP}
            stroke={lc_t2a}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1={POSITIONS.t1b.x}
            y1={POSITIONS.t1b.y + NODE_TIP}
            x2={POSITIONS.t2b.x}
            y2={POSITIONS.t2b.y - NODE_TIP}
            stroke={lc_t2b}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <text
            x="230"
            y="96"
            textAnchor="middle"
            fill="rgba(116,185,232,0.35)"
            fontSize="8.5"
            fontFamily="'M PLUS Rounded 1c',sans-serif"
            letterSpacing="1"
          >
            TIER 1 · Lv.{t1.requiredLevel}
          </text>
          <text
            x="230"
            y="192"
            textAnchor="middle"
            fill="rgba(116,185,232,0.35)"
            fontSize="8.5"
            fontFamily="'M PLUS Rounded 1c',sans-serif"
            letterSpacing="1"
          >
            TIER 2 · Lv.{t2.requiredLevel}
          </text>
        </svg>

        {/* 루트 노드 */}
        <div
          className={styles.rootDiamond}
          style={{
            left: POSITIONS.root.x - ROOT_HALF,
            top: POSITIONS.root.y - ROOT_HALF,
            background: color,
          }}
        >
          <div className={styles.diamondInner}>
            <span style={{ fontSize: 22 }}>{SKILL_ICON[skill.id] ?? "?"}</span>
          </div>
        </div>

        {/* T1 노드 */}
        <DiamondNode
          choice={t1.choices[0]}
          isSelected={t1sel === t1.choices[0].id}
          isLocked={skill.level < t1.requiredLevel}
          left={POSITIONS.t1a.x - NODE_HALF}
          top={POSITIONS.t1a.y - NODE_HALF}
          onSelect={() => onSelect(skill.id, 1, t1.choices[0].id)}
          onHover={setHoveredId}
        />
        <DiamondNode
          choice={t1.choices[1]}
          isSelected={t1sel === t1.choices[1].id}
          isLocked={skill.level < t1.requiredLevel}
          left={POSITIONS.t1b.x - NODE_HALF}
          top={POSITIONS.t1b.y - NODE_HALF}
          onSelect={() => onSelect(skill.id, 1, t1.choices[1].id)}
          onHover={setHoveredId}
        />

        {/* T2 노드 */}
        <DiamondNode
          choice={t2.choices[0]}
          isSelected={t2sel === t2.choices[0].id}
          isLocked={skill.level < t2.requiredLevel}
          left={POSITIONS.t2a.x - NODE_HALF}
          top={POSITIONS.t2a.y - NODE_HALF}
          onSelect={() => onSelect(skill.id, 2, t2.choices[0].id)}
          onHover={setHoveredId}
        />
        <DiamondNode
          choice={t2.choices[1]}
          isSelected={t2sel === t2.choices[1].id}
          isLocked={skill.level < t2.requiredLevel}
          left={POSITIONS.t2b.x - NODE_HALF}
          top={POSITIONS.t2b.y - NODE_HALF}
          onSelect={() => onSelect(skill.id, 2, t2.choices[1].id)}
          onHover={setHoveredId}
        />
      </div>

      {/* 노드 정보 패널 */}
      <div className={styles.nodeInfoPanel}>
        {infoChoice ? (
          <>
            <div className={styles.infoRow}>
              <span
                className={styles.infoArchetype}
                style={{ color: ARCHETYPE_COLORS[infoChoice.archetype] ?? "var(--accent)" }}
              >
                {infoChoice.archetype}
              </span>
              <span className={styles.infoName}>{infoChoice.label}</span>
              {infoChoice.disabled && <span className={styles.infoDisabled}>준비 중</span>}
            </div>
            <p className={styles.infoDesc}>{infoChoice.description}</p>
          </>
        ) : (
          <span className={styles.infoEmpty}>노드를 선택하면 특성 설명이 표시됩니다</span>
        )}
      </div>
    </>
  );
}

// ── 다이아몬드 노드 ────────────────────────────────────────────────

interface DiamondNodeProps {
  choice: SkillNodeChoice;
  isSelected: boolean;
  isLocked: boolean;
  left: number;
  top: number;
  onSelect: () => void;
  onHover: (id: string | null) => void;
}

function DiamondNode({
  choice,
  isSelected,
  isLocked,
  left,
  top,
  onSelect,
  onHover,
}: DiamondNodeProps) {
  const color = ARCHETYPE_COLORS[choice.archetype] ?? "var(--accent)";
  const disabled = choice.disabled || isLocked;

  return (
    <div
      className={`${styles.diamondNode} ${isSelected ? styles.nodeSelected : ""} ${disabled ? styles.nodeLocked : ""}`}
      style={{ left, top, "--node-color": color } as React.CSSProperties}
      onClick={() => !disabled && onSelect()}
      onMouseEnter={() => !disabled && onHover(choice.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={styles.diamondInner}>
        <span className={styles.nodeLabel}>
          {choice.label.length <= 2 ? choice.label : choice.label.slice(0, 2)}
        </span>
      </div>
    </div>
  );
}
