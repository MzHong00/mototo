import { useEffect, useMemo } from "react";
import { Color } from "three";

import { playerFacing, playerPosition } from "@/lib/runtime/frameState";
import { markCenter, mapSize } from "@/features/world/utils/maps";
import { RAMP_UP } from "@/features/world/utils/terrain";
import { TERRAIN_COLORS, TILE_SIZE } from "@/features/world/constants/terrain";
import {
  MINIMAP_CLIFF,
  MINIMAP_ARROW,
  MINIMAP_EXIT,
  MINIMAP_ICON_R,
  MINIMAP_LEVEL_DARKEN,
  MINIMAP_OUTLINE,
  MINIMAP_PLAYER,
  MINIMAP_LABEL,
  MINIMAP_TILE_PX,
  AREA_MAP_ARROW_SCALE,
  AREA_MAP_ICON_R,
  AREA_MAP_LABEL_FONT,
  AREA_MAP_LABEL_GAP,
  AREA_MAP_PADDING,
} from "@/features/world/constants/minimap";

import type { RefObject } from "react";
import type { MapDef } from "@/features/world/types/world";

interface MapViewOptions {
  size: number; // 캔버스 한 변 (px)
  zoom?: number; // 확대 배율 (내 위치 중심) — 없으면 맵 전체를 맞춰 보여줌
}

/**
 * 미니맵·맵 전체 보기 — 맵에 들어올 때 칸 지도를 화면 밖 캔버스에 한 번만 그리고,
 * 매 프레임은 그 그림을 배율·위치에 맞춰 찍고 화살표·출구만 덧그린다 (북쪽 위 고정)
 */
export function useMinimap(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  map: MapDef,
  { size, zoom }: MapViewOptions,
) {
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

  // 출구 아이콘 자리 (칸 좌표) + 이름
  const icons = useMemo(
    () =>
      map.exits.flatMap((e) => {
        const c = markCenter(map.tiles, e.mark);
        return c ? [{ ...c, label: e.label }] : [];
      }),
    [map],
  );

  // 매 프레임 그리기 — 확대 배율이 있으면 내 위치 중심, 없으면 맵 전체를 맞춰 넣고 출구 이름까지
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { width, depth } = mapSize(map.tiles);
    const isFit = zoom === undefined;
    const k = // 화면에서 한 칸 크기 (px)
      MINIMAP_TILE_PX *
      (zoom ?? (size - AREA_MAP_PADDING * 2) / (Math.max(width, depth) * MINIMAP_TILE_PX));
    const half = size / 2;
    const iconR = isFit ? AREA_MAP_ICON_R : MINIMAP_ICON_R * Math.min(zoom ?? 1, 1); // 축소하면 아이콘도 작게
    const palette = { ...TERRAIN_COLORS, ...map.tiles.colors };
    ctx.imageSmoothingEnabled = false; // 확대해도 칸이 또렷하게
    ctx.font = AREA_MAP_LABEL_FONT;
    ctx.textAlign = "center";
    let frame = 0;
    const draw = () => {
      const p = playerPosition.current;
      const px = p.x / TILE_SIZE + width / 2; // 내 위치 (칸 좌표)
      const pz = p.z / TILE_SIZE + depth / 2;
      const ox = isFit ? (size - width * k) / 2 : half - px * k; // 지도 그림 왼쪽 위 (화면 px)
      const oz = isFit ? (size - depth * k) / 2 : half - pz * k;
      ctx.fillStyle = palette.g; // 지도 밖도 땅
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(base, ox, oz, width * k, depth * k);
      icons.forEach((icon) => {
        const ix = ox + icon.x * k;
        const iz = oz + icon.z * k;
        ctx.fillStyle = MINIMAP_EXIT;
        ctx.beginPath();
        ctx.arc(ix, iz, iconR, 0, Math.PI * 2);
        ctx.fill();
        if (!isFit) return;
        // 맵 전체 보기에선 출구 이름 (캔버스 밖으로 안 나가게)
        const w = ctx.measureText(icon.label).width / 2 + AREA_MAP_PADDING / 4;
        const lx = Math.min(Math.max(ix, w), size - w);
        const lz = iz < half ? iz + AREA_MAP_LABEL_GAP * 2 : iz - AREA_MAP_LABEL_GAP;
        ctx.lineWidth = 4;
        ctx.strokeStyle = MINIMAP_OUTLINE;
        ctx.strokeText(icon.label, lx, lz);
        ctx.fillStyle = MINIMAP_LABEL;
        ctx.fillText(icon.label, lx, lz);
      });
      const f = playerFacing.current;
      ctx.save();
      ctx.translate(ox + px * k, oz + pz * k);
      ctx.rotate(Math.atan2(f.z, f.x));
      if (isFit) ctx.scale(AREA_MAP_ARROW_SCALE, AREA_MAP_ARROW_SCALE);
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
  }, [canvasRef, base, icons, map, size, zoom]);
}
