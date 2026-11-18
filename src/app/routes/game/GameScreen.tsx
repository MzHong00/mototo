import { useMemo } from "react";

import { GameCanvas } from "@/features/world/components/GameCanvas";
import { AreaMapOverlay } from "@/features/world/components/areaMap/AreaMapOverlay";
import { ExitConfirmDialog } from "@/features/world/components/ExitConfirmDialog";
import { FadeOverlay } from "@/features/world/components/FadeOverlay";
import { GameHud } from "@/features/hud/components/GameHud";
import { Minimap } from "@/features/world/components/Minimap";
import { useActionInput } from "@/features/world/hooks/useActionInput";
import { useUiStore } from "@/stores/uiStore";
import { useWorldStore } from "@/features/world/stores/worldStore";
import { getMapDef } from "@/features/world/utils/maps";

import type { SavedCharacter } from "@/types/character";

interface GameScreenProps {
  character: SavedCharacter;
}

/** 게임 화면 — 3D 월드 + HUD(미니맵·맵 전체 보기·이동 확인·화면 전환) */
export function GameScreen({ character }: GameScreenProps) {
  const setEditing = useUiStore((s) => s.setEditing);
  const mapId = useWorldStore((s) => s.location.map); // 맵 전체 보기 열림은 그 컴포넌트만 구독 (3D 다시 그리기 방지)
  const map = useMemo(() => getMapDef(mapId), [mapId]);

  useActionInput();

  return (
    <>
      <GameCanvas appearance={character.appearance} />
      <GameHud name={character.name} onEdit={() => setEditing(true)} />
      <Minimap map={map} />
      <ExitConfirmDialog />
      <AreaMapOverlay />
      <FadeOverlay />
    </>
  );
}
