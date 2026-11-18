import { NEUTRAL_THEME } from "@/features/world/constants/maps/themes";

import type { MapSpec } from "@/features/world/types/world";

const SIZE = 64; // 한 변 (칸)
const CENTER = SIZE / 2;
const ROAD_WIDTH = 5; // 십자 길 폭 (칸)

/** 임시 동네 64×64 — OSM 역 맵이 오기 전까지 쓰는 평평한 풀밭. 가운데 십자 길, 출구 없음 */
export const TEMP_TOWN: MapSpec = {
  id: "temp-town",
  name: "임시 동네",
  exits: [],
  theme: NEUTRAL_THEME,
  blueprint: {
    id: "temp-town",
    width: SIZE,
    depth: SIZE,
    seed: 7,
    paints: [],
    paths: [
      {
        points: [
          [CENTER, 0],
          [CENTER, SIZE - 1],
        ],
        width: ROAD_WIDTH,
      },
      {
        points: [
          [0, CENTER],
          [SIZE - 1, CENTER],
        ],
        width: ROAD_WIDTH,
      },
    ],
    marks: [{ area: { rect: [CENTER, CENTER, 1, 1] }, mark: "@" }],
    forests: [],
    props: [],
  },
};
