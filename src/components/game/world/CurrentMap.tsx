import { ExitLabels } from "@/components/game/world/ExitLabels";
import { MapObjects } from "@/components/game/world/MapObjects";
import { Terrain } from "@/components/game/world/Terrain";
import { useMapExits } from "@/hooks/useMapExits";

import type { MapDef } from "@/types/world";

interface CurrentMapProps {
  map: MapDef;
}

/** 지금 있는 맵 — 지형 + 물체 + 출구 이름표 + 출구 밟기 감시 */
export function CurrentMap({ map }: CurrentMapProps) {
  useMapExits(map);

  return (
    <>
      <Terrain map={map.tiles} />
      <MapObjects tiles={map.tiles} />
      <ExitLabels map={map} />
    </>
  );
}
