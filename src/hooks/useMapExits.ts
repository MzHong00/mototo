import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { playerPosition } from "@/engine/runtime/frameState";
import { getWorldState } from "@/stores/worldStore";
import { worldToTile } from "@/utils/maps";

import type { MapDef } from "@/types/world";

/** 출구 칸 밟기 감시 — 걸어서 가는 출구는 바로 이동, 배·전투맵 입구는 확인창. 같은 칸에 서 있는 동안은 다시 묻지 않음 */
export function useMapExits(map: MapDef) {
  const lastMarkRef = useRef(""); // 지난 프레임에 밟은 표시 글자

  useFrame(() => {
    const world = getWorldState();
    if (world.fade !== "none") return;
    const p = playerPosition.current;
    const cell = worldToTile(map.tiles, p.x, p.z);
    const mark = map.tiles.marks[cell.z]?.[cell.x] ?? ".";
    if (mark === lastMarkRef.current) return;
    lastMarkRef.current = mark;
    const exit = map.exits.find((e) => e.mark === mark);
    if (!exit) {
      if (world.pendingExit) world.askExit(null); // 확인창 띄운 채 벗어나면 닫기
      return;
    }
    if (exit.mode === "walk") world.travel(exit.to);
    else world.askExit(exit);
  });
}
