import { ExitLabels } from "@/features/world/components/ExitLabels";
import { MapObjects } from "@/features/world/components/MapObjects";
import { Terrain } from "@/features/world/components/Terrain";
import { useMapExits } from "@/features/world/hooks/useMapExits";

import type { MapDef } from "@/features/world/types/world";

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
