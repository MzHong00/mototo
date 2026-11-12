import { useEffect, useMemo } from "react";
import { Color } from "three";

import { playerFacing, playerPosition } from "@/engine/runtime/frameState";
import { markCenter, mapSize } from "@/utils/maps";
import { RAMP_UP } from "@/utils/terrain";
import { TERRAIN_COLORS, TILE_SIZE } from "@/constants/game/terrain";
import {
  MINIMAP_CLIFF,
  MINIMAP_DUNGEON,
  MINIMAP_ARROW,
  MINIMAP_EXIT,
  MINIMAP_ICON_R,
  MINIMAP_LEVEL_DARKEN,
  MINIMAP_OUTLINE,
  MINIMAP_PLAYER,
  MINIMAP_SIZE,
  MINIMAP_TILE_PX,
} from "@/constants/ui/minimap";

import type { RefObject } from "react";
import type { MapDef } from "@/types/world";

/**
 * 미니맵 — 맵에 들어올 때 칸 지도를 화면 밖 캔버스에 한 번만 그리고,
 * 매 프레임은 그 그림을 내 위치만큼 옮겨 찍고 화살표·출구만 덧그린다 (북쪽 위 고정)
 */
export function useMinimap(canvasRef: RefObject<HTMLCanvasElement | null>, map: MapDef) {
  // 칸 지도 그림 (맵마다 1회)
  const base = useMemo(() => {
    const { tiles } = map;
    const { width, depth } = mapSize(tiles);
    const px = MINIMAP_TILE_PX;
    const canvas = document.createElement("canvas");
    canvas.width = width * px;
    canvas.height = depth * px;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    const palette: Record<string, string> = { ...TERRAIN_COLORS, ...tiles.colors };
    const color = new Color();
    const levelAt = (x: number, z: number) => Number(tiles.heights[z]?.[x] ?? 0);
    tiles.kinds.forEach((row, z) =>
      [...row].forEach((kind, x) => {
        const hex = RAMP_UP[kind] ? palette.ramp : kind === "w" ? palette.water : palette[kind];
        const level = kind === "w" ? 0 : levelAt(x, z);
        color.set(hex).multiplyScalar(1 - level * MINIMAP_LEVEL_DARKEN + MINIMAP_LEVEL_DARKEN);
        ctx.fillStyle = `#${color.getHexString()}`;
        ctx.fillRect(x * px, z * px, px, px);
        // 아래 칸·오른쪽 칸과 층이 다르면 경계선 (경사로는 제외)
        ctx.fillStyle = MINIMAP_CLIFF;
        if (!RAMP_UP[kind] && kind !== "w") {
          if (
            z + 1 < depth &&
            levelAt(x, z + 1) !== level &&
            !RAMP_UP[row[x]] &&
            !RAMP_UP[tiles.kinds[z + 1][x]]
          )
            ctx.fillRect(x * px, (z + 1) * px - 1, px, 1);
          if (x + 1 < width && levelAt(x + 1, z) !== level && !RAMP_UP[row[x + 1]])
            ctx.fillRect((x + 1) * px - 1, z * px, 1, px);
        }
      }),
    );
    return canvas;
  }, [map]);

  // 출구 아이콘 자리 (칸 좌표)
  const icons = useMemo(
    () =>
      map.exits.flatMap((e) => {
        const c = markCenter(map.tiles, e.mark);
        return c ? [{ ...c, isDungeon: e.mode === "dungeon" || map.kind === "room" }] : [];
      }),
    [map],
  );

  // 매 프레임 그리기
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { width, depth } = mapSize(map.tiles);
    const px = MINIMAP_TILE_PX;
    const half = MINIMAP_SIZE / 2;
    let frame = 0;
    const draw = () => {
      const p = playerPosition.current;
      const cx = (p.x / TILE_SIZE + width / 2) * px; // 내 위치 (그림 좌표)
      const cz = (p.z / TILE_SIZE + depth / 2) * px;
      ctx.fillStyle = TERRAIN_COLORS.water;
      ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
      ctx.drawImage(base, half - cx, half - cz);
      icons.forEach((icon) => {
        ctx.fillStyle = icon.isDungeon ? MINIMAP_DUNGEON : MINIMAP_EXIT;
        ctx.beginPath();
        ctx.arc(half - cx + icon.x * px, half - cz + icon.z * px, MINIMAP_ICON_R, 0, Math.PI * 2);
        ctx.fill();
      });
      const f = playerFacing.current;
      ctx.save();
      ctx.translate(half, half);
      ctx.rotate(Math.atan2(f.z, f.x));
      ctx.fillStyle = MINIMAP_PLAYER;
      ctx.strokeStyle = MINIMAP_OUTLINE;
      ctx.lineWidth = 2;
      ctx.beginPath();
      MINIMAP_ARROW.forEach(([ax, ay], i) => (i === 0 ? ctx.moveTo(ax, ay) : ctx.lineTo(ax, ay)));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [canvasRef, base, icons, map]);
}
