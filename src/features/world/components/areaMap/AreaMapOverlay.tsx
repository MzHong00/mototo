import { useRef } from "react";

import { useMinimap } from "@/features/world/hooks/useMinimap";
import { useAreaMap } from "@/features/world/hooks/useMinimapControls";
import { AREA_MAP_SIZE, MINIMAP_TEXT } from "@/features/world/constants/minimap";

import type { MapDef } from "@/features/world/types/world";

import s from "./AreaMapOverlay.module.scss";

/** 맵 전체 보기 — 지금 맵 전체 + 내 위치 + 출구 이름. N키·미니맵 클릭으로 열림 */
export function AreaMapOverlay() {
  const { isOpen, map, close } = useAreaMap();
  if (!isOpen) return null;

  return (
    <div className={s.backdrop} onClick={close} role="dialog" aria-label={MINIMAP_TEXT.areaTitle}>
      <div className={s.panel} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>{map.name}</h2>
        <AreaMapCanvas map={map} />
        <div className={s.actions}>
          <button type="button" className={s.button} onClick={close}>
            {MINIMAP_TEXT.close}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AreaMapCanvasProps {
  map: MapDef;
}

/** 맵 전체 그림 (열려 있을 때만 매 프레임 그림) */
function AreaMapCanvas({ map }: AreaMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useMinimap(canvasRef, map, { size: AREA_MAP_SIZE });

  return (
    <canvas ref={canvasRef} width={AREA_MAP_SIZE} height={AREA_MAP_SIZE} className={s.canvas} />
  );
}
