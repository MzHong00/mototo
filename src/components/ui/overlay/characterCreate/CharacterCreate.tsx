import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useGameStore } from "@/stores/gameStore";
import { CharacterPreview } from "@/components/game/character/CharacterPreview";

import type { JobClass } from "@/types/job";

import s from "./CharacterCreate.module.scss";

interface ClassConfig {
  id: JobClass;
  name: string;
  icon: string;
  desc: string;
  stats: string;
  color: string;
}

const CLASSES: ClassConfig[] = [
  {
    id: "warrior",
    name: "전사",
    icon: "⚔️",
    desc: "두꺼운 갑옷과 강인한 체력으로 최전선을 지킨다.",
    stats: "HP ★★★  ATK ★★  DEF ★★★",
    color: "#FF6633",
  },
  {
    id: "archer",
    name: "궁수",
    icon: "🏹",
    desc: "빠른 발놀림과 정확한 조준으로 적을 압도한다.",
    stats: "HP ★★  ATK ★★★  DEF ★",
    color: "#33BB55",
  },
  {
    id: "mage",
    name: "마법사",
    icon: "🔮",
    desc: "광대한 마나로 강력한 마법을 구사한다.",
    stats: "HP ★  ATK ★★★★  DEF ☆",
    color: "#5BA3FF",
  },
  {
    id: "rogue",
    name: "도적",
    icon: "🗡️",
    desc: "날랜 몸놀림과 표창으로 적의 빈틈을 노린다.",
    stats: "HP ★★  ATK ★★★  DEF ★",
    color: "#AA44FF",
  },
];

const NAME_REGEX = /^[a-zA-Z0-9가-힣]{2,12}$/;
const NAME_ERROR_MSG = "2~12자, 한글·영문·숫자만 사용 가능합니다.";

export function CharacterCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const targetSlot = (location.state as { slot?: number } | null)?.slot;
  const selectClass = useGameStore((s) => s.selectClass);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClass, setSelectedClass] = useState<JobClass | null>(null);
  const [hovered, setHovered] = useState<JobClass | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleClassSelect = (cls: JobClass) => {
    setSelectedClass(cls);
    setStep(2);
  };

  const handleNameChange = (v: string) => {
    setName(v);
    setNameError(v.length > 0 && !NAME_REGEX.test(v) ? NAME_ERROR_MSG : "");
  };

  const handleConfirm = () => {
    if (!selectedClass) return;
    if (!NAME_REGEX.test(name)) {
      setNameError(NAME_ERROR_MSG);
      return;
    }
    selectClass(selectedClass, name, targetSlot ?? 0);
    navigate("/", { state: { slot: targetSlot } });
  };

  const selectedClassConfig = CLASSES.find((c) => c.id === selectedClass) ?? null;
  // 프리뷰에 표시할 직업: hover > 선택됨 > 첫 번째 직업
  const previewClass: JobClass = hovered ?? selectedClass ?? "warrior";
  const previewColor = CLASSES.find((c) => c.id === previewClass)?.color ?? "var(--accent)";

  return (
    <div className={s.overlay}>
      <button className={s.btnClose} onClick={() => navigate("/")} aria-label="닫기">
        ✕
      </button>

      <div className={s.subtitle}>Browser RPG — Mototo</div>
      <h1 className={s.title}>캐릭터 만들기</h1>

      <div className={s.steps}>
        <div className={`${s.step} ${step >= 1 ? s.active : ""}`}>
          <span className={s.stepNum}>1</span>
          <span className={s.stepLabel}>직업 선택</span>
        </div>
        <div className={s.stepLine} />
        <div className={`${s.step} ${step >= 2 ? s.active : ""}`}>
          <span className={s.stepNum}>2</span>
          <span className={s.stepLabel}>닉네임</span>
        </div>
      </div>

      <div className={s.createBody}>
        {/* ── 좌측 3D 프리뷰 ── */}
        <div
          className={s.previewPane}
          style={{ "--cls-color": previewColor } as React.CSSProperties}
        >
          <CharacterPreview jobClass={previewClass} rotatable showWeapon />
          <div className={s.previewGlow} />
          <div className={s.previewLabel}>{CLASSES.find((c) => c.id === previewClass)?.name}</div>
        </div>

        {/* ── 우측 콘텐츠 ── */}
        <div className={s.rightContent}>
          {step === 1 && (
            <div className={s.cards}>
              {CLASSES.map((cls) => {
                const active = hovered === cls.id || selectedClass === cls.id;
                return (
                  <div
                    key={cls.id}
                    onMouseEnter={() => setHovered(cls.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClassSelect(cls.id)}
                    className={`${s.card} ${active ? s.cardActive : ""}`}
                    style={{ "--cls-color": cls.color } as React.CSSProperties}
                  >
                    <div className={s.cardIcon}>{cls.icon}</div>
                    <div className={s.cardName}>{cls.name}</div>
                    <div className={s.cardDesc}>{cls.desc}</div>
                    <div className={s.cardStats}>{cls.stats}</div>
                    {active && <div className={s.selectBtn}>선택</div>}
                  </div>
                );
              })}
            </div>
          )}

          {step === 2 && selectedClassConfig && (
            <div className={s.nameStep}>
              <div
                className={s.selectedClass}
                style={{ "--cls-color": selectedClassConfig.color } as React.CSSProperties}
              >
                <span className={s.selectedIcon}>{selectedClassConfig.icon}</span>
                <span className={s.selectedName}>{selectedClassConfig.name}</span>
              </div>

              <label className={s.nameLabel}>닉네임을 입력하세요</label>
              <input
                className={`${s.nameInput} ${nameError ? s.inputError : ""}`}
                type="text"
                maxLength={12}
                placeholder="2~12자 (한글·영문·숫자)"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                autoFocus
              />
              {nameError && <div className={s.errorMsg}>{nameError}</div>}

              <div className={s.nameActions}>
                <button className={s.btnBack} onClick={() => setStep(1)}>
                  ← 이전
                </button>
                <button
                  className={s.btnConfirm}
                  disabled={!NAME_REGEX.test(name)}
                  onClick={handleConfirm}
                >
                  캐릭터 생성
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
