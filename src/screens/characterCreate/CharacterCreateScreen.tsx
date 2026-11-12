import { useState } from "react";

import { ChibiPreview } from "@/components/game/character/ChibiPreview";
import { ChibiEditor } from "@/components/ui/common/chibiEditor/ChibiEditor";
import { defaultState } from "@/engine/chibi/character";
import { useCharacterStore } from "@/stores/characterStore";
import { useUiStore } from "@/stores/uiStore";
import { isValidCharacterName } from "@/utils/character";
import { CHARACTER_NAME_ERROR_MSG, CHARACTER_NAME_MAX } from "@/constants/character/rules";

import s from "./CharacterCreateScreen.module.scss";

/** 캐릭터 만들기 / 꾸미기 — 치비 꾸미기 패널 + 닉네임 */
export function CharacterCreateScreen() {
  const { character, saveCharacter } = useCharacterStore((st) => ({
    character: st.character,
    saveCharacter: st.saveCharacter,
  }));
  const setEditing = useUiStore((st) => st.setEditing);
  const isEditMode = character !== null; // 이미 캐릭터가 있으면 꾸미기 모드

  const [appearance, setAppearance] = useState(() => character?.appearance ?? defaultState());
  const [name, setName] = useState(character?.name ?? "");
  const [nameError, setNameError] = useState("");

  const handleNameChange = (v: string) => {
    setName(v);
    setNameError(v.length > 0 && !isValidCharacterName(v) ? CHARACTER_NAME_ERROR_MSG : "");
  };

  const handleConfirm = () => {
    if (!isValidCharacterName(name)) {
      setNameError(CHARACTER_NAME_ERROR_MSG);
      return;
    }
    saveCharacter({ name, appearance });
    setEditing(false);
  };

  return (
    <div className={s.root}>
      <section className={s.stage}>
        <header className={s.brand}>
          <span className={s.logo}>✦</span>
          <div>
            <h1>{isEditMode ? "꾸미기" : "캐릭터 만들기"}</h1>
            <p>나만의 캐릭터를 만들어 보세요</p>
          </div>
        </header>
        {isEditMode && (
          <button type="button" className={s.btnBack} onClick={() => setEditing(false)}>
            돌아가기
          </button>
        )}
        <ChibiPreview appearance={appearance} isRotatable />
      </section>

      <aside className={s.panel}>
        <div className={s.nameArea}>
          <input
            className={`${s.nameInput} ${nameError ? s.inputError : ""}`}
            type="text"
            maxLength={CHARACTER_NAME_MAX}
            placeholder="닉네임 입력 (2~12자)"
            aria-label="닉네임"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
          <div className={s.errorMsg}>{nameError}</div>
        </div>
        <div className={s.editor}>
          <ChibiEditor appearance={appearance} onChange={setAppearance} />
        </div>
        <button
          type="button"
          className={s.btnConfirm}
          disabled={!isValidCharacterName(name)}
          onClick={handleConfirm}
        >
          {isEditMode ? "저장하고 돌아가기" : "모험 시작"}
        </button>
      </aside>
    </div>
  );
}
