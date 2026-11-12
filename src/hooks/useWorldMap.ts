import { useMemo } from "react";

import { useWorldStore } from "@/stores/worldStore";
import { dungeonOf } from "@/utils/maps";
import { WORLD_LINES, WORLD_NODES } from "@/constants/maps/worldGraph";
import { DUNGEONS } from "@/constants/maps/dungeons";
import { WORLD_MAP_CELL, WORLD_MAP_PAD } from "@/constants/ui/worldMap";

import type { WorldNode } from "@/types/world";

export type NodeState = "visited" | "known" | "hidden"; // 가 봄 · 이웃이라 ?로 보임 · 숨김

/** 노선도 상태 — 가 본 역, 그 이웃(?), 지금 위치, 화면 배치(px), 빠른 이동 */
export function useWorldMap() {
  const { location, visited, travel, isMapOpen, setMapOpen } = useWorldStore((s) => ({
    location: s.location,
    visited: s.visited,
    travel: s.travel,
    isMapOpen: s.isMapOpen,
    setMapOpen: s.setMapOpen,
  }));
  const currentDungeon = dungeonOf(location.map);
  const currentId = currentDungeon?.id ?? location.map; // 전투맵 방 안이면 그 전투맵 역

  // 역 상태: 가 본 맵(전투맵은 소속 마을을 가 봤으면) · 그 노선 이웃 · 숨김
  const stateOf = useMemo(() => {
    const isVisited = (id: string) =>
      visited.includes(id) || DUNGEONS.some((d) => d.id === id && visited.includes(d.village));
    const known = new Set(
      WORLD_LINES.flatMap((line) =>
        line.stops.filter(
          (_, i) => isVisited(line.stops[i - 1] ?? "") || isVisited(line.stops[i + 1] ?? ""),
        ),
      ),
    );
    return (id: string): NodeState => {
      if (isVisited(id)) return "visited";
      return known.has(id) ? "known" : "hidden";
    };
  }, [visited]);

  // 화면 배치 — 보이는 역만 판에 꼭 맞게
  const layout = useMemo(() => {
    const shown = WORLD_NODES.filter((n) => stateOf(n.id) !== "hidden");
    const xs = shown.map((n) => n.grid[0]);
    const zs = shown.map((n) => n.grid[1]);
    const minX = Math.min(...xs);
    const minZ = Math.min(...zs);
    const toPx = (id: string): [number, number] => {
      const [gx, gz] = WORLD_NODES.find((n) => n.id === id)?.grid ?? [0, 0];
      return [
        (gx - minX) * WORLD_MAP_CELL + WORLD_MAP_PAD,
        (gz - minZ) * WORLD_MAP_CELL + WORLD_MAP_PAD,
      ];
    };
    return {
      width: (Math.max(...xs) - minX) * WORLD_MAP_CELL + WORLD_MAP_PAD * 2,
      height: (Math.max(...zs) - minZ) * WORLD_MAP_CELL + WORLD_MAP_PAD * 2,
      toPx,
    };
  }, [stateOf]);

  /** 역 고르기 — 가 본 마을이면 그 광장으로 (전투맵 안에서는 불가) */
  const selectNode = (node: WorldNode) => {
    if (!canTravelTo(node)) return;
    if (node.fastTravel) travel(node.fastTravel);
  };
  const canTravelTo = (node: WorldNode) =>
    !!node.fastTravel && !currentDungeon && stateOf(node.id) === "visited" && node.id !== currentId;

  return {
    isMapOpen,
    close: () => setMapOpen(false),
    nodes: WORLD_NODES,
    lines: WORLD_LINES,
    stateOf,
    layout,
    currentId,
    isInDungeon: !!currentDungeon,
    canTravelTo,
    selectNode,
  };
}
