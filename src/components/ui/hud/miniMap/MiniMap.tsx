import { useEffect, useRef } from "react";

import { useGameStore } from "@/stores/gameStore";
import { playerPosition, playerFacing, monsterPositions, bossPosition } from "@/game/worldState";
import { MAPS, MAP_MARKERS } from "@/constants/map/maps";
import type { MapMarker } from "@/types/map";

import s from "./MiniMap.module.scss";

const HALF = 20; // 맵 반경 (-20 ~ +20)
const SIZE = 120; // canvas px

const MAP_BG: Record<string, string> = {
  evergreenVillage: "#0d2206",
  evergreenMeadow: "#0a1f04",
  evergreenForest: "#071a03",
  evergreenSwamp: "#0e1a0a",
  evergreenRuins: "#1c1c18",
  twilightWasteland: "#1e1006",
  kingBearChamber: "#140800",
};

function w2c(x: number, z: number): [number, number] {
  return [((x + HALF) / (HALF * 2)) * SIZE, ((z + HALF) / (HALF * 2)) * SIZE];
}

export function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentMapId = useGameStore((s) => s.currentMapId);
  const mapConfig = MAPS[currentMapId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    function draw() {
      if (!ctx) return;

      // 배경
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = MAP_BG[currentMapId] ?? "#111827";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // 격자
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.5;
      const step = SIZE / 8;
      for (let i = step; i < SIZE; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(SIZE, i);
        ctx.stroke();
      }

      // 맵 경계
      ctx.strokeStyle = "rgba(116, 185, 232, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1);

      // 정적 마커 (NPC · 포탈)
      const markers: MapMarker[] = MAP_MARKERS[currentMapId] ?? [];
      markers.forEach(({ x, z, type }) => {
        const [cx, cy] = w2c(x, z);
        if (type === "npc") {
          // NPC — 연두색 원
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#a3e635";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // 포탈 — 다이아몬드, 하늘색 통일
          const r = 5;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.rect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
          ctx.fillStyle = "#38bdf8";
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.7)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      });

      // 몬스터
      monsterPositions.forEach((mpos) => {
        const [cx, cy] = w2c(mpos.x, mpos.z);
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
      });

      // 보스
      if (bossPosition.current) {
        const [cx, cy] = w2c(bossPosition.current.x, bossPosition.current.z);
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,107,53,0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 플레이어 방향선
      const pp = playerPosition.current;
      const [px, py] = w2c(pp.x, pp.z);
      const f = playerFacing.current;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + f.x * 9, py + f.z * 9);
      ctx.strokeStyle = "rgba(250,204,21,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 플레이어 점
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [currentMapId]);

  return (
    <div className={s.panel}>
      <div className={s.header}>
        <span className={s.mapName}>{mapConfig.label}</span>
      </div>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className={s.canvas} />
    </div>
  );
}
