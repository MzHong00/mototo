import { useRef } from "react";

import { useMinimap } from "@/features/world/hooks/useMinimap";
import { useMinimapControls } from "@/features/world/hooks/useMinimapControls";
import { MINIMAP_SIZE, MINIMAP_TEXT } from "@/features/world/constants/minimap";

import type { MapDef } from "@/features/world/types/world";

import s from "./Minimap.module.scss";

interface MinimapProps {
  map: MapDef;
}

/** 화면 오른쪽 위 둥근 미니맵 + 확대·축소 + 지금 맵 이름. 누르면 맵 전체 보기 */
export function Minimap({ map }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { zoom, isMaxZoom, isMinZoom, zoomIn, zoomOut, onWheel, openAreaMap } =
    useMinimapControls();
  useMinimap(canvasRef, map, { size: MINIMAP_SIZE, zoom });

  return (
    <div className={s.minimap}>
      <button
        type="button"
        className={s.face}
        onClick={openAreaMap}
        onWheel={onWheel}
        aria-label={MINIMAP_TEXT.openArea}
      >
        <canvas ref={canvasRef} width={MINIMAP_SIZE} height={MINIMAP_SIZE} className={s.canvas} />
      </button>
      <div className={s.zoom}>
        <button
          type="button"
          className={s.zoomButton}
          onClick={zoomIn}
          disabled={isMaxZoom}
          aria-label={MINIMAP_TEXT.zoomIn}
        >
          +
        </button>
        <button
          type="button"
          className={s.zoomButton}
          onClick={zoomOut}
          disabled={isMinZoom}
          aria-label={MINIMAP_TEXT.zoomOut}
        >
          −
        </button>
      </div>
      <span className={s.name}>{map.name}</span>
    </div>
  );
}
