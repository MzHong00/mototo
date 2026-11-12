import { useState } from "react";

import {
  CATEGORIES,
  CATEGORY_LABEL,
  FACE_CATALOG,
  GENDERS,
  DEFAULT_HAIR,
  NONE_LABEL,
  PART_CATALOG,
  partFits,
} from "@/engine/chibi/character";
import {
  COLOR_KEYS,
  COLOR_KEY_LABEL,
  EDITOR_TAB,
  EDITOR_TAB_LABEL,
} from "@/constants/character/chibiPalette";
import { CHIBI_ASSET_BASE } from "@/constants/assets/chibi";
import { currentColor, withColor, withGender, withPart } from "@/utils/chibi";
import { ChoiceCard } from "./ChoiceCard";
import { ColorSwatches } from "./ColorSwatches";

import type { ChibiState } from "@/engine/chibi/character";
import type { EditorTab } from "@/constants/character/chibiPalette";

import s from "./ChibiEditor.module.scss";

const thumbOf = (id: string) => `${CHIBI_ASSET_BASE}thumbs/${id}.png`;

interface ChibiEditorProps {
  appearance: ChibiState;
  /** 외형 변경 */
  onChange: (next: ChibiState) => void;
}

/** 치비 꾸미기 패널 — 외형(성별·얼굴) / 파츠 / 색상 탭 */
export function ChibiEditor({ appearance, onChange }: ChibiEditorProps) {
  const [tab, setTab] = useState<EditorTab>(EDITOR_TAB.PARTS);

  return (
    <div className={s.panel}>
      <div className={s.tabs} role="tablist">
        {Object.values(EDITOR_TAB).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`${s.tab} ${tab === t ? s.tabOn : ""}`}
            onClick={() => setTab(t)}
          >
            {EDITOR_TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className={s.scroll}>
        {tab === EDITOR_TAB.LOOKS && (
          <>
            <section className={s.sec}>
              <h2>성별</h2>
              <div className={s.cards}>
                {GENDERS.map((g) => (
                  <ChoiceCard
                    key={g.id}
                    label={g.label}
                    thumb={thumbOf(DEFAULT_HAIR[g.id])}
                    isActive={appearance.gender === g.id}
                    onSelect={() => onChange(withGender(appearance, g.id))}
                  />
                ))}
              </div>
            </section>
            <section className={s.sec}>
              <h2>얼굴</h2>
              <div className={s.cards}>
                {FACE_CATALOG.map((f) => (
                  <ChoiceCard
                    key={f.id}
                    label={f.label}
                    thumb={`${CHIBI_ASSET_BASE}${f.thumb}`}
                    isActive={appearance.face === f.id}
                    onSelect={() => onChange({ ...appearance, face: f.id })}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {tab === EDITOR_TAB.PARTS &&
          CATEGORIES.map((cat) => (
            <section key={cat} className={s.sec}>
              <h2>{CATEGORY_LABEL[cat]}</h2>
              <div className={s.cards}>
                {PART_CATALOG[cat]
                  .filter((p) => partFits(p, appearance.gender))
                  .map((p) => (
                    <ChoiceCard
                      key={p.id}
                      label={p.label}
                      thumb={thumbOf(p.id)}
                      isActive={appearance.parts[cat] === p.id}
                      onSelect={() => onChange(withPart(appearance, cat, p.id))}
                    />
                  ))}
                <ChoiceCard
                  label={NONE_LABEL[cat]}
                  thumb={null}
                  isActive={appearance.parts[cat] === null}
                  onSelect={() => onChange(withPart(appearance, cat, null))}
                />
              </div>
            </section>
          ))}

        {tab === EDITOR_TAB.COLORS &&
          COLOR_KEYS.map((k) => (
            <section key={k} className={s.sec}>
              <h2>{COLOR_KEY_LABEL[k]}</h2>
              <ColorSwatches
                colorKey={k}
                value={currentColor(appearance, k)}
                onSelect={(hex) => onChange(withColor(appearance, k, hex))}
              />
            </section>
          ))}
      </div>
    </div>
  );
}
