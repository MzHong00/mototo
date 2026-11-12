import { Html } from "@react-three/drei";

import { markCenter, tileToWorldOnGround } from "@/utils/maps";
import { EXIT_LABEL_HEIGHT } from "@/constants/game/mapObjects";

import type { MapDef } from "@/types/world";

import s from "./ExitLabels.module.scss";

interface ExitLabelsProps {
  map: MapDef;
}

/** 출구·문 위 이름표 — 어디로 가는지(전투맵 방은 다음 방 종류) 미리 보여줌 */
export function ExitLabels({ map }: ExitLabelsProps) {
  return (
    <>
      {map.exits.map((exit) => {
        const cell = markCenter(map.tiles, exit.mark);
        if (!cell) return null;
        const pos = tileToWorldOnGround(map.tiles, cell.x, cell.z);
        return (
          <Html
            key={exit.mark}
            position={[pos.x, pos.y + EXIT_LABEL_HEIGHT, pos.z]}
            center
            zIndexRange={[10, 0]}
          >
            <div className={s.label}>{exit.label}</div>
          </Html>
        );
      })}
    </>
  );
}
