import { useWorldMap } from "@/hooks/useWorldMap";
import {
  WORLD_MAP_DUNGEON_R,
  WORLD_MAP_HERE_GAP,
  WORLD_MAP_LABEL_GAP,
  WORLD_MAP_LINE_WIDTH,
  WORLD_MAP_TEXT,
  WORLD_MAP_UNKNOWN,
  WORLD_MAP_UNKNOWN_DASH,
  WORLD_MAP_UNKNOWN_LABEL,
  WORLD_MAP_VILLAGE_R,
} from "@/constants/ui/worldMap";

import s from "./WorldMapOverlay.module.scss";

/** 전체 지도 — 지하철 노선도처럼 역(맵)과 노선(길). 살짝 눕힌 판으로 3D 느낌. 가 본 마을을 누르면 빠른 이동 */
export function WorldMapOverlay() {
  const {
    isMapOpen,
    close,
    nodes,
    lines,
    stateOf,
    layout,
    currentId,
    isInDungeon,
    canTravelTo,
    selectNode,
  } = useWorldMap();
  if (!isMapOpen) return null;

  return (
    <div className={s.backdrop} onClick={close} role="dialog" aria-label={WORLD_MAP_TEXT.title}>
      <div className={s.stage} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>{WORLD_MAP_TEXT.title}</h2>
        <div className={s.plate}>
          <svg
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
          >
            {lines.map((line) =>
              line.stops.slice(1).map((id, i) => {
                const from = line.stops[i];
                if (stateOf(from) === "hidden" || stateOf(id) === "hidden") return null;
                const isKnown = stateOf(from) === "visited" && stateOf(id) === "visited";
                const [x1, y1] = layout.toPx(from);
                const [x2, y2] = layout.toPx(id);
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
                    strokeDasharray={isKnown ? undefined : WORLD_MAP_UNKNOWN_DASH}
                  />
                );
              }),
            )}
            {nodes.map((node) => {
              const state = stateOf(node.id);
              if (state === "hidden") return null;
              const [x, y] = layout.toPx(node.id);
              const isVisited = state === "visited";
              const isDungeon = node.kind === "dungeon";
              const r = isDungeon ? WORLD_MAP_DUNGEON_R : WORLD_MAP_VILLAGE_R;
              return (
                <g
                  key={node.id}
                  className={canTravelTo(node) ? s.station : undefined}
                  onClick={() => selectNode(node)}
                  transform={`translate(${x} ${y})`}
                >
                  {isDungeon ? (
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
                  {node.id === currentId && (
                    <circle r={r + WORLD_MAP_HERE_GAP} className={s.here} />
                  )}
                  <text y={r + WORLD_MAP_LABEL_GAP} className={s.label}>
                    {isVisited ? node.label : WORLD_MAP_UNKNOWN_LABEL}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className={s.hint}>
          {isInDungeon ? WORLD_MAP_TEXT.hintDungeon : WORLD_MAP_TEXT.hintTravel}
        </p>
        <button type="button" className={s.close} onClick={close}>
          {WORLD_MAP_TEXT.close}
        </button>
      </div>
    </div>
  );
}
