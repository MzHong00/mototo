import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { CharacterPreview } from "@/components/game/character/CharacterPreview";
import { useGameStore, CHARACTER_SLOT_COUNT } from "@/stores/gameStore";
import { JOB_CLASS_LABEL } from "@/constants/character";

import s from "./LobbyScreen.module.scss";

const CLASS_COLOR: Record<string, string> = {
  warrior: "#FF6633",
  archer: "#33BB55",
  mage: "#5BA3FF",
  rogue: "#AA44FF",
};

const SLOT_OFFSETS = [
  { y: 0, scale: 1.0 },
  { y: 0, scale: 1.0 },
  { y: 0, scale: 1.0 },
  { y: 0, scale: 1.0 },
  { y: 0, scale: 1.0 },
] as const;

export function LobbyScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { characterSlots, activeSlot, activateSlot } = useGameStore((s) => ({
    characterSlots: s.characterSlots,
    activeSlot: s.activeSlot,
    activateSlot: s.activateSlot,
  }));

  const returnSlot = (location.state as { slot?: number } | null)?.slot;
  const initialSelected = returnSlot ?? (activeSlot >= 0 ? activeSlot : -1);
  const [selectedSlot, setSelectedSlot] = useState(initialSelected);

  const activeChar = selectedSlot >= 0 ? characterSlots[selectedSlot] : null;

  const handleSlotClick = (i: number) => {
    if (characterSlots[i]) {
      setSelectedSlot(i);
      activateSlot(i);
    } else {
      navigate("/character/create", { state: { slot: i } });
    }
  };

  return (
    <div className={s.root}>
      <div className={s.bg} />

      <header className={s.header}>
        <div className={s.gameTitle}>MOTOTO</div>
      </header>

      {/* 캐릭터 로우 */}
      <div className={s.characterRow}>
        {Array.from({ length: CHARACTER_SLOT_COUNT }).map((_, i) => {
          const slotChar = characterSlots[i];
          const isFilled = slotChar !== null;
          const isSelected = selectedSlot === i && isFilled;
          const offset = SLOT_OFFSETS[i];
          const slotAccent = slotChar?.jobClass ? CLASS_COLOR[slotChar.jobClass] : "var(--accent)";

          return (
            <div
              key={i}
              className={`${s.characterSlot} ${isSelected ? s.selectedSlot : ""}`}
              style={
                {
                  transform: `translateY(${offset.y}px) scale(${isSelected ? offset.scale * 1.06 : offset.scale})`,
                  "--cls-color": slotAccent,
                } as React.CSSProperties
              }
              onClick={() => handleSlotClick(i)}
            >
              {/* 3D 뷰 or 빈 슬롯 */}
              <div className={s.slotStage}>
                {isFilled ? (
                  <CharacterPreview
                    jobClass={slotChar!.jobClass!}
                    onDragStart={() => handleSlotClick(i)}
                  />
                ) : (
                  <div className={s.slotEmpty}>
                    <span className={s.slotPlus}>+</span>
                  </div>
                )}
                {isSelected && (
                  <div
                    className={s.selectedGlow}
                    style={{
                      background: `radial-gradient(ellipse 120px 30px at 50% 100%, ${slotAccent}40, transparent)`,
                    }}
                  />
                )}
              </div>

              {/* 캐릭터 정보 */}
              <div className={`${s.slotInfo} ${isSelected ? s.slotInfoActive : ""}`}>
                {isFilled ? (
                  <>
                    <div className={s.slotMeta} style={{ color: slotAccent }}>
                      Lv. {slotChar!.level} {JOB_CLASS_LABEL[slotChar!.jobClass!]}
                    </div>
                    <div className={s.slotDivider} />
                    <div className={s.slotName}>{slotChar!.name}</div>
                  </>
                ) : (
                  <div className={s.slotNewLabel}>새 캐릭터</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 버튼 */}
      <footer className={s.footer}>
        <button
          className={`${s.btnStart} ${!activeChar ? s.btnStartDisabled : ""}`}
          disabled={!activeChar}
          onClick={() => navigate("/game")}
        >
          게임 시작
        </button>
      </footer>
    </div>
  );
}
