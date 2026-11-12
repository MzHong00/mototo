import { useWorldMap } from "@/hooks/useWorldMap";
import {
  WORLD_MAP_CELL,
  WORLD_MAP_LINE_WIDTH,
  WORLD_MAP_PAD,
  WORLD_MAP_UNKNOWN,
  WORLD_MAP_UNKNOWN_LABEL,
} from "@/constants/ui/worldMap";

import s from "./WorldMapOverlay.module.scss";

interface WorldMapOverlayProps {
  /** 지도 닫기 */
  onClose: () => void;
}

/** 전체 지도 — 지하철 노선도처럼 역(맵)과 노선(길). 살짝 눕힌 판으로 3D 느낌. 가 본 마을을 누르면 빠른 이동 */
export function WorldMapOverlay({ onClose }: WorldMapOverlayProps) {
  const { nodes, lines, stateOf, currentId, isInDungeon, selectNode } = useWorldMap();
  const shown = nodes.filter((n) => stateOf(n.id) !== "hidden"); // 판 크기는 보이는 역에만 맞춤
  const xs = shown.map((n) => n.grid[0]);
  const zs = shown.map((n) => n.grid[1]);
  const minX = Math.min(...xs);
  const minZ = Math.min(...zs);
  const width = (Math.max(...xs) - minX) * WORLD_MAP_CELL + WORLD_MAP_PAD * 2;
  const height = (Math.max(...zs) - minZ) * WORLD_MAP_CELL + WORLD_MAP_PAD * 2;
  const pos = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    const [gx, gz] = node?.grid ?? [0, 0];
    return [
      (gx - minX) * WORLD_MAP_CELL + WORLD_MAP_PAD,
      (gz - minZ) * WORLD_MAP_CELL + WORLD_MAP_PAD,
    ];
  };

  return (
    <div className={s.backdrop} onClick={onClose} role="dialog" aria-label="전체 지도">
      <div className={s.stage} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>지도</h2>
        <div className={s.plate}>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {lines.map((line) =>
              line.stops.slice(1).map((id, i) => {
                const from = line.stops[i];
                const isKnown = stateOf(from) === "visited" && stateOf(id) === "visited";
                const isShown = stateOf(from) !== "hidden" && stateOf(id) !== "hidden";
                if (!isShown) return null;
                const [x1, y1] = pos(from);
                const [x2, y2] = pos(id);
                return (
                  <line
                    key={`${line.id}-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isKnown ? line.color : WORLD_MAP_UNKNOWN}
                    strokeWidth={WORLD_MAP_LINE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={isKnown ? undefined : "2 18"}
                  />
                );
              }),
            )}
            {nodes.map((node) => {
              const state = stateOf(node.id);
              if (state === "hidden") return null;
              const [x, y] = pos(node.id);
              const isVisited = state === "visited";
              const isCurrent = node.id === currentId;
              const canTravel = isVisited && !!node.fastTravel && !isInDungeon && !isCurrent;
              const r = node.kind === "dungeon" ? 11 : 17;
              return (
                <g
                  key={node.id}
                  className={canTravel ? s.station : undefined}
                  onClick={() => selectNode(node)}
                  transform={`translate(${x} ${y})`}
                >
                  {node.kind === "dungeon" ? (
                    <rect
                      x={-r}
                      y={-r}
                      width={r * 2}
                      height={r * 2}
                      transform="rotate(45)"
                      className={isVisited ? s.dungeon : s.unknown}
                    />
                  ) : (
                    <circle r={r} className={isVisited ? s.village : s.unknown} />
                  )}
                  {isCurrent && <circle r={r + 9} className={s.here} />}
                  <text y={r + 22} className={s.label}>
                    {isVisited ? node.label : WORLD_MAP_UNKNOWN_LABEL}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className={s.hint}>
          {isInDungeon
            ? "전투맵 안에서는 빠른 이동을 할 수 없어요"
            : "가 본 마을을 누르면 그곳으로 이동해요"}
        </p>
        <button type="button" className={s.close} onClick={onClose}>
          닫기 (M)
        </button>
      </div>
    </div>
  );
}
