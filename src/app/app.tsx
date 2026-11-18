import { CharacterCreateScreen } from "@/app/routes/characterCreate/CharacterCreateScreen";
import { GameScreen } from "@/app/routes/game/GameScreen";
import { useCharacterStore } from "@/features/character/stores/characterStore";
import { useUiStore } from "@/stores/uiStore";

/** 캐릭터가 없거나 꾸미는 중이면 꾸미기 화면, 아니면 게임 */
export function App() {
  const character = useCharacterStore((s) => s.character);
  const isEditing = useUiStore((s) => s.isEditing);

  return character && !isEditing ? <GameScreen character={character} /> : <CharacterCreateScreen />;
}
