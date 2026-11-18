import { useMemo } from "react";

import { useWorldStore } from "@/features/world/stores/worldStore";
import { getMapDef } from "@/features/world/utils/maps";
import { MINIMAP_ZOOMS } from "@/features/world/constants/minimap";

import type { WheelEvent } from "react";

/** 미니맵 조작 — 확대·축소(버튼·휠), 누르면 맵 전체 보기 */
export function useMinimapControls() {
  const { zoomStep, stepZoom, setAreaMapOpen } = useWorldStore((s) => ({
    zoomStep: s.minimapZoom,
    stepZoom: s.stepMinimapZoom,
    setAreaMapOpen: s.setAreaMapOpen,
  }));

  return {
    zoom: MINIMAP_ZOOMS[zoomStep] ?? 1, // 지금 배율
    isMaxZoom: zoomStep >= MINIMAP_ZOOMS.length - 1,
    isMinZoom: zoomStep <= 0,
    zoomIn: () => stepZoom(1),
    zoomOut: () => stepZoom(-1),
    /** 휠 위로 = 확대, 아래로 = 축소 */
    onWheel: (e: WheelEvent) => stepZoom(e.deltaY < 0 ? 1 : -1),
    openAreaMap: () => setAreaMapOpen(true),
  };
}

/** 맵 전체 보기 창 — 지금 맵, 닫기 */
export function useAreaMap() {
  const { isOpen, mapId, setAreaMapOpen } = useWorldStore((s) => ({
    isOpen: s.isAreaMapOpen,
    mapId: s.location.map,
    setAreaMapOpen: s.setAreaMapOpen,
  }));
  const map = useMemo(() => getMapDef(mapId), [mapId]);

  return {
    isOpen,
    map,
    close: () => setAreaMapOpen(false),
  };
}
