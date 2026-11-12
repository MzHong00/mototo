import { useRef } from "react";

import { useMinimap } from "@/hooks/useMinimap";
import { MINIMAP_SIZE } from "@/constants/ui/minimap";

import type { MapDef } from "@/types/world";

import s from "./Minimap.module.scss";

interface MinimapProps {
  map: MapDef;
  /** 전체 지도 열기 */
  onOpenMap: () => void;
}

/** 화면 오른쪽 위 둥근 미니맵 + 지금 맵 이름. 누르면 전체 지도 */
export function Minimap({ map, onOpenMap }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useMinimap(canvasRef, map);

  return (
    <button type="button" className={s.minimap} onClick={onOpenMap} aria-label="전체 지도 열기">
      <canvas ref={canvasRef} width={MINIMAP_SIZE} height={MINIMAP_SIZE} className={s.canvas} />
      <span className={s.name}>{map.name}</span>
    </button>
  );
}
