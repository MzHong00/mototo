import { GameCanvas } from "@/components/game/world/GameCanvas";
import { GameHud } from "@/components/ui/hud/GameHud";
import { useActionInput } from "@/hooks/useActionInput";
import { useUiStore } from "@/stores/uiStore";

import type { SavedCharacter } from "@/types/character";

interface GameScreenProps {
  character: SavedCharacter;
}

/** 게임 화면 — 3D 월드 + HUD */
export function GameScreen({ character }: GameScreenProps) {
  const setEditing = useUiStore((s) => s.setEditing);

  useActionInput();

  return (
    <>
      <GameCanvas appearance={character.appearance} />
      <GameHud name={character.name} onEdit={() => setEditing(true)} />
    </>
  );
}
