import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useGameStore } from "@/stores/gameStore";
import { CharacterPreview } from "@/components/game/character/CharacterPreview";
import { GameLogo } from "@/components/ui/common/GameLogo/GameLogo";
import { CLASS, CLASS_CARDS, CLASS_LABEL, STAT_BAR_CONFIG } from "@/constants/character/class";

import type { Class } from "@/types/class";

import s from "./CharacterCreateScreen.module.scss";

const NAME_REGEX = /^[a-zA-Z0-9가-힣]{2,12}$/;
const NAME_ERROR_MSG = "2~12자, 한글·영문·숫자만 사용 가능합니다.";

export function CharacterCreateScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetSlot = (location.state as { slot?: number } | null)?.slot;
  const selectClass = useGameStore((s) => s.selectClass);

  const [selectedClass, setSelectedClass] = useState<Class>(CLASS.WARRIOR);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const selectedCard = useMemo(
    () => CLASS_CARDS.find((c) => c.id === selectedClass)!,
    [selectedClass],
  );
  const selectedName = CLASS_LABEL[selectedClass];

  const handleNameChange = (v: string) => {
    setName(v);
    setNameError(v.length > 0 && !NAME_REGEX.test(v) ? NAME_ERROR_MSG : "");
  };

  const handleConfirm = () => {
    if (!NAME_REGEX.test(name)) {
      setNameError(NAME_ERROR_MSG);
      return;
    }
    selectClass(selectedClass, name, targetSlot ?? 0);
    navigate("/", { state: { slot: targetSlot } });
  };

  return (
    <div className={s.overlay}>
      <img className={s.bg} src="/images/lobby.jpeg" alt="" />
      <div className={s.pageHeader}>
        <button className={s.btnClose} onClick={() => navigate("/")} aria-label="뒤로가기">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M7 1L3 5L7 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <GameLogo size="md" />
        <div className={s.pageHeaderSpacer} />
      </div>

      <div className={s.createBody}>
        {/* ── 좌측 3D 프리뷰 ── */}
        <div className={s.previewPane} data-cls={selectedClass}>
          <div className={s.previewChip}>{selectedName}</div>
          <CharacterPreview cls={selectedClass} rotatable showWeapon />
          <div className={s.previewGlow} />
        </div>

        {/* ── 우측 콘텐츠 ── */}
        <div className={s.rightContent}>
          <div className={s.rightTop}>
            {/* 이름 입력 */}
            <div className={s.nameArea}>
              <input
                className={`${s.nameInput} ${nameError ? s.inputError : ""}`}
                type="text"
                maxLength={12}
                placeholder="닉네임 입력 (2~12자)"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              />
              <div className={s.errorMsg}>{nameError}</div>
            </div>

            {/* 직업 카드 2×2 */}
            <div className={s.cards}>
              {CLASS_CARDS.map((cls) => {
                const selected = selectedClass === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`${s.card} ${selected ? s.cardActive : ""}`}
                    data-cls={cls.id}
                  >
                    <img src={cls.icon} alt={CLASS_LABEL[cls.id]} className={s.cardImg} />
                    <div className={s.cardOverlay} />
                    <div className={s.cardName}>{CLASS_LABEL[cls.id]}</div>
                  </div>
                );
              })}
            </div>

            {/* 직업 세부 정보 */}
            <div className={s.classDetail} data-visible="true">
              <p className={s.classDesc}>{selectedCard.desc}</p>
              <div className={s.statBars} data-cls={selectedClass}>
                {STAT_BAR_CONFIG.map((stat) => (
                  <div className={s.statRow} key={stat.key}>
                    <span className={s.statLabel}>{stat.label}</span>
                    <div className={s.barTrack}>
                      <div
                        className={s.barFill}
                        data-stat={stat.key}
                        style={
                          { "--bar-pct": `${selectedCard.stats[stat.key]}%` } as React.CSSProperties
                        }
                      />
                    </div>
                    <span className={s.statValue}>{selectedCard.stats[stat.key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 생성 버튼 */}
          <button
            className={s.btnConfirm}
            disabled={!NAME_REGEX.test(name)}
            onClick={handleConfirm}
            data-cls={selectedClass}
          >
            캐릭터 생성
            <svg width="16" height="16" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M3 1L7 5L3 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
