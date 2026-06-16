import { useGameStore } from "@/stores/gameStore";
import { BOSS_TYPE_LABEL } from "@/constants/monster/boss";

import type { BossType } from "@/types/boss";

import s from "./BossEntry.module.scss";

const BOSS_EMOJI: Record<BossType, string> = {
  king_bear: "🐻",
  giant_turtle: "🐢",
  king_deer: "🦌",
};

const DEFAULT_CONFIRM_LABEL = { cleared: "재도전", uncleared: "입장하기" } as const;

interface BossEntryTexts {
  cleared: string;
  uncleared: string;
}

interface BossEntryProps {
  bossId: BossType;
  subtitle: BossEntryTexts;
  confirmLabel?: BossEntryTexts;
  onEnter: () => void;
}

export function BossEntry({
  bossId,
  subtitle,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  onEnter,
}: BossEntryProps) {
  const { clearedBosses, setBossEntryId } = useGameStore((s) => ({
    clearedBosses: s.clearedBosses,
    setBossEntryId: s.setBossEntryId,
  }));

  const isCleared = clearedBosses.includes(bossId);
  const state = isCleared ? "cleared" : "uncleared";
  const bossName = BOSS_TYPE_LABEL[bossId];

  const handleClose = () => {
    setBossEntryId(null);
  };

  const handleEnter = () => {
    onEnter();
    setBossEntryId(null);
  };

  return (
    <div className={s.overlay} onClick={handleClose}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <div className={s.bossImage} data-boss={bossId}>
          <span className={s.bossEmoji}>{BOSS_EMOJI[bossId]}</span>
          {isCleared && <span className={s.clearedBadge}>CLEARED</span>}
        </div>

        <div className={s.content}>
          <h2 className={s.bossName}>{bossName}</h2>
          <p className={s.subtitle}>{subtitle[state]}</p>

          <div className={s.actions}>
            <button className={s.enterBtn} onClick={handleEnter}>
              {confirmLabel[state]}
            </button>
            <button className={s.closeBtn} onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
