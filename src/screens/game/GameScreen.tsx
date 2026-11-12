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
  const { mapId, isMapOpen, setMapOpen } = useWorldStore((s) => ({
    mapId: s.location.map,
    isMapOpen: s.isMapOpen,
    setMapOpen: s.setMapOpen,
  }));
  const map = useMemo(() => getMapDef(mapId), [mapId]);

  useActionInput();

  return (
    <>
      <GameCanvas appearance={character.appearance} />
      <GameHud name={character.name} onEdit={() => setEditing(true)} />
      <Minimap map={map} onOpenMap={() => setMapOpen(true)} />
      <ExitConfirmDialog />
      {isMapOpen && <WorldMapOverlay onClose={() => setMapOpen(false)} />}
      <FadeOverlay />
    </>
  );
}
