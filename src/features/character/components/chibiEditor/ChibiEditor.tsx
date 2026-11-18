import { FACE_CATALOG, GENDERS, PART_CATALOG, partFits } from "@/lib/chibi/character";
import { EDITOR_SECTIONS } from "@/features/character/constants/chibiPalette";
import { CHIBI_ASSET_BASE } from "@/lib/chibi/assets";
import { useEditorSections } from "@/features/character/hooks/useEditorSections";
import { usePartDefaultColors } from "@/features/character/hooks/usePartDefaultColors";
import {
  currentColor,
  isPartKey,
  withColor,
  withGender,
  withPart,
} from "@/features/character/utils/chibi";
import { ChoiceCard } from "./ChoiceCard";
import { ColorSwatches } from "./ColorSwatches";
import { GenderIcon } from "./GenderIcon";

import type { ReactNode } from "react";
import type { ChibiState, PartCategory } from "@/lib/chibi/character";
import type { ColorKey, EditorSectionId } from "@/features/character/constants/chibiPalette";

import s from "./ChibiEditor.module.scss";

const thumbOf = (id: string) => `${CHIBI_ASSET_BASE}thumbs/${id}.png`;

interface ChibiEditorProps {
  appearance: ChibiState;
  /** 외형 변경 */
  onChange: (next: ChibiState) => void;
}

/** 치비 꾸미기 — 왼쪽 부위 메뉴(지금 고른 것 미리보기) + 부위마다 고르기·색이 이어진 한 목록 */
export function ChibiEditor({ appearance, onChange }: ChibiEditorProps) {
  const { scrollRef, register, activeId, scrollTo } = useEditorSections();
  const originals = usePartDefaultColors(appearance.parts);
  // 옷·머리를 원래 색으로 두면 그 원래 색을 보여줌
  const shownColor = (key: ColorKey) =>
    currentColor(appearance, key) ?? (isPartKey(key) ? (originals[key] ?? null) : null);

  const face = FACE_CATALOG.find((f) => f.id === appearance.face) ?? FACE_CATALOG[0];
  const gender = GENDERS.find((g) => g.id === appearance.gender) ?? GENDERS[0];
  // 부위마다 지금 고른 것 썸네일 (메뉴)
  const pickedThumb = (id: EditorSectionId): string | null => {
    if (id === "face") return `${CHIBI_ASSET_BASE}${face.thumb}`;
    if (id === "gender" || id === "skin") return null;
    const thumbId = appearance.parts[id];
    return thumbId ? thumbOf(thumbId) : null;
  };

  // 썸네일이 없는 부위의 메뉴 그림 — 성별 기호, 피부색 동그라미
  const railIcon = (id: EditorSectionId) => {
    if (id === "gender") return <GenderIcon gender={gender.id} />;
    if (id === "skin")
      return (
        <i className={s.skinChip} style={{ "--dot": appearance.skin } as React.CSSProperties} />
      );
    return undefined;
  };

  return (
    <div className={s.panel}>
      <nav className={s.rail} aria-label="꾸밀 부위">
        {EDITOR_SECTIONS.map(({ id, label, color }) => (
          <RailButton
            key={id}
            label={label}
            thumb={pickedThumb(id)}
            icon={railIcon(id)}
            color={color && id !== "skin" ? shownColor(color) : undefined}
            isActive={activeId === id}
            onSelect={() => scrollTo(id)}
          />
        ))}
      </nav>

      <div className={s.scroll} ref={scrollRef}>
        {EDITOR_SECTIONS.map(({ id, label, color }) => (
          <section key={id} ref={register(id)} data-section={id} className={s.sec}>
            <h2 className={s.head}>{label}</h2>

            {id !== "skin" && (
              <div className={s.cards}>
                {id === "gender" &&
                  GENDERS.map((g) => (
                    <ChoiceCard
                      key={g.id}
                      label={g.label}
                      thumb={null}
                      icon={<GenderIcon gender={g.id} />}
                      isLabelHidden
                      isActive={appearance.gender === g.id}
                      onSelect={() => onChange(withGender(appearance, g.id))}
                    />
                  ))}
                {id === "face" &&
                  FACE_CATALOG.map((f) => (
                    <ChoiceCard
                      key={f.id}
                      label={f.label}
                      thumb={`${CHIBI_ASSET_BASE}${f.thumb}`}
                      isActive={appearance.face === f.id}
                      onSelect={() => onChange({ ...appearance, face: f.id })}
                    />
                  ))}
                {isPartKey(id) && <PartCards id={id} appearance={appearance} onChange={onChange} />}
              </div>
            )}

            {color && (
              <div className={s.colorRow}>
                <ColorSwatches
                  colorKey={color}
                  value={currentColor(appearance, color)}
                  originalHex={isPartKey(color) ? originals[color] : undefined}
                  onSelect={(hex) => onChange(withColor(appearance, color, hex))}
                />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

interface RailButtonProps {
  label: string;
  thumb: string | null;
  icon?: ReactNode;
  color?: string | null; // 지금 색 점 (undefined: 점 없음, null: 기본색)
  isActive: boolean;
  /** 그 부위로 이동 */
  onSelect: () => void;
}

function RailButton({ label, thumb, icon, color, isActive, onSelect }: RailButtonProps) {
  return (
    <button
      type="button"
      className={`${s.railItem} ${isActive ? s.railOn : ""}`}
      aria-current={isActive}
      onClick={onSelect}
    >
      <span className={s.railThumb}>
        {thumb && <img src={thumb} alt="" />}
        {!thumb && (icon ?? <b>✕</b>)}
        {color !== undefined && (
          <i
            className={`${s.dot} ${color ? "" : s.dotDefault}`}
            // 고른 색 자체가 데이터라 CSS 변수로 주입
            style={color ? ({ "--dot": color } as React.CSSProperties) : undefined}
          />
        )}
      </span>
      <span className={s.railLabel}>{label}</span>
    </button>
  );
}

interface PartCardsProps {
  id: PartCategory;
  appearance: ChibiState;
  /** 외형 변경 */
  onChange: (next: ChibiState) => void;
}

function PartCards({ id, appearance, onChange }: PartCardsProps) {
  return (
    <>
      {PART_CATALOG[id]
        .filter((p) => partFits(p, appearance.gender))
        .map((p) => (
          <ChoiceCard
            key={p.id}
            label={p.label}
            thumb={thumbOf(p.id)}
            isActive={appearance.parts[id] === p.id}
            onSelect={() => onChange(withPart(appearance, id, p.id))}
          />
        ))}
    </>
  );
}
