import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { GameLogo } from "@/components/ui/common/GameLogo/GameLogo";
import { IconPlus } from "@/components/ui/common/icons/IconPlus";
import { IconTrash } from "@/components/ui/common/icons/IconTrash";
import { CharacterPreview } from "@/components/game/character/CharacterPreview";
import { useGameStore } from "@/stores/gameStore";
import { CLASS_LABEL } from "@/constants/character/class";

import type { CharacterStats } from "@/types/character";
import type { Class } from "@/types/class";

import s from "./LobbyScreen.module.scss";

type ActiveChar = CharacterStats & { cls: Class };

export function LobbyScreen() {
  const navigate = useNavigate();

  const { characterSlots, activeSlot, activateSlot, deleteCharacter } = useGameStore((st) => ({
    characterSlots: st.characterSlots,
    activeSlot: st.activeSlot,
    activateSlot: st.activateSlot,
    deleteCharacter: st.deleteCharacter,
  }));

  const characters = useMemo(
    () =>
      characterSlots
        .map((char, i) => ({ char, slotIndex: i }))
        .filter((item): item is { char: ActiveChar; slotIndex: number } => item.char?.cls != null),
    [characterSlots],
  );

  const activeChar = useMemo(
    () => (activeSlot >= 0 ? characterSlots[activeSlot] : null),
    [activeSlot, characterSlots],
  );

  return (
    <div className={s.root}>
      <img className={s.bg} src="/images/lobby.jpeg" alt="" />

      <header className={s.header}>
        <GameLogo size="lg" />
      </header>

      {/* ── 하단 액션 바 ── */}
      <footer className={s.bottomBar}>
        <div className={s.bottomLeft} />
        <button
          className={`${s.btnStart} ${!activeChar ? s.btnStartDisabled : ""}`}
          disabled={!activeChar}
          onClick={() => navigate("/game")}
        >
          게임 시작
        </button>
        <div className={s.bottomActions}>
          <button
            className={s.iconBtn}
            onClick={() => navigate("/character/create", { state: { slot: characters.length } })}
          >
            <IconPlus />
            <span>캐릭터 생성</span>
          </button>
          <button
            className={`${s.iconBtn} ${s.iconBtnDanger} ${!activeChar ? s.iconBtnDisabled : ""}`}
            disabled={!activeChar}
            onClick={() => activeChar && deleteCharacter(activeSlot)}
          >
            <IconTrash />
            <span>캐릭터 삭제</span>
          </button>
        </div>
      </footer>

      {/* ── 캐릭터 스테이지 ── */}
      <div className={s.stageWrapper}>
        <div className={s.stageTrack}>
          {characters.map(({ char, slotIndex }) => {
            const isSelected = slotIndex === activeSlot;

            return (
              <div
                key={slotIndex}
                data-cls={char.cls}
                className={[s.charSlot, isSelected ? s.charSlotActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => activateSlot(slotIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && activateSlot(slotIndex)}
                aria-label={`${char.name} 선택`}
                aria-pressed={isSelected}
              >
                <div className={s.charPreview}>
                  <CharacterPreview cls={char.cls} rotatable={false} showWeapon />
                </div>
                <div className={s.charLabel}>
                  <span className={s.charMeta}>
                    Lv.{char.level}&nbsp;{CLASS_LABEL[char.cls]}
                  </span>
                  <span className={s.charSep}>|</span>
                  <span className={s.charName}>{char.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
