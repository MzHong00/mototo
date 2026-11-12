import { useMemo } from "react";

import { GameCanvas } from "@/components/game/world/GameCanvas";
import { ExitConfirmDialog } from "@/components/ui/hud/ExitConfirmDialog";
import { FadeOverlay } from "@/components/ui/hud/FadeOverlay";
import { GameHud } from "@/components/ui/hud/GameHud";
import { Minimap } from "@/components/ui/hud/Minimap";
import { WorldMapOverlay } from "@/components/ui/worldMap/WorldMapOverlay";
import { useActionInput } from "@/hooks/useActionInput";
import { useUiStore } from "@/stores/uiStore";
import { useWorldStore } from "@/stores/worldStore";
import { getMapDef } from "@/utils/maps";

import type { SavedCharacter } from "@/types/character";

interface GameScreenProps {
  character: SavedCharacter;
}

/** 게임 화면 — 3D 월드 + HUD(미니맵·지도·이동 확인·화면 전환) */
export function GameScreen({ character }: GameScreenProps) {
  const setEditing = useUiStore((s) => s.setEditing);
  const { mapId, setMapOpen } = useWorldStore((s) => ({
    mapId: s.location.map,
    setMapOpen: s.setMapOpen,
  })); // 지도 열림은 지도 컴포넌트만 구독 (3D 다시 그리기 방지)
  const map = useMemo(() => getMapDef(mapId), [mapId]);

  useActionInput();

  return (
    <>
      <GameCanvas appearance={character.appearance} />
      <GameHud name={character.name} onEdit={() => setEditing(true)} />
      <Minimap map={map} onOpenMap={() => setMapOpen(true)} />
      <ExitConfirmDialog />
      <WorldMapOverlay />
      <FadeOverlay />
    </>
  );
}
