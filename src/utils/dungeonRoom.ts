import {
  DOOR_WIDTH,
  ROOM_ENTRY_INSET,
  ROOM_KIND_LABEL,
  ROOM_PROPS,
  ROOM_SIZE,
  ROOM_WALL,
  ROOM_WALL_LEVEL,
} from "@/constants/game/dungeon";
import { ROOM_ID_SEPARATOR } from "@/constants/maps/registry";

import type { DungeonDef, MapDef, MapExit } from "@/types/world";

const DOOR_MARKS = ["A", "B", "C"]; // 다음 방 문: 북 · 동 · 서
const BACK_MARK = "E"; // 남쪽 문 (입구방에서 나가기)

/** 전투맵 방 하나 → 맵. 돌바닥 방 + 2층 높이 벽, 문은 벽 가운데 틈 */
export function buildRoomMap(dungeon: DungeonDef, roomId: string): MapDef {
  const room = dungeon.rooms.find((r) => r.id === roomId) ?? dungeon.rooms[0];
  const size = ROOM_SIZE[room.kind];
  const mid = Math.floor(size / 2);
  const half = Math.floor(DOOR_WIDTH / 2);
  const isWall = (x: number, z: number) =>
    x < ROOM_WALL || z < ROOM_WALL || x >= size - ROOM_WALL || z >= size - ROOM_WALL;

  // 나가는 문: 다음 방들(북·동·서), 보스방은 북쪽 문으로 마을, 입구방은 남쪽 문으로 나가기
  const exits: MapExit[] = room.next.map((nextId, i) => {
    const next = dungeon.rooms.find((r) => r.id === nextId);
    return {
      mark: DOOR_MARKS[i],
      to: { map: `${dungeon.id}${ROOM_ID_SEPARATOR}${nextId}`, entry: "1" },
      mode: "walk",
      label: next ? ROOM_KIND_LABEL[next.kind] : "",
    };
  });
  if (room.kind === "boss")
    exits.push({ mark: "A", to: dungeon.returnTo, mode: "walk", label: "🏠 마을로" });
  if (room.kind === "entry")
    exits.push({ mark: BACK_MARK, to: dungeon.returnTo, mode: "walk", label: "나가기" });

  // 문 자리 (벽 틈) — 표시 글자 → 해당 칸 판별
  const doorAt = (x: number, z: number) => {
    const inGap = (v: number) => Math.abs(v - mid) <= half;
    const sides: Record<string, boolean> = {
      A: z < ROOM_WALL && inGap(x),
      B: x >= size - ROOM_WALL && inGap(z),
      C: x < ROOM_WALL && inGap(z),
      E: z >= size - ROOM_WALL && inGap(x),
    };
    return exits.find((e) => sides[e.mark])?.mark;
  };

  const rows = Array.from({ length: size }, (_, z) =>
    Array.from({ length: size }, (_, x) => [x, z]),
  );
  const props = ROOM_PROPS[room.kind].map(([type, fx, fz]) => ({
    type,
    x: Math.floor(size * fx) + 0.5,
    z: Math.floor(size * fz) + 0.5,
    rot: 0,
  }));
  return {
    id: `${dungeon.id}${ROOM_ID_SEPARATOR}${room.id}`,
    name: `${dungeon.name} · ${ROOM_KIND_LABEL[room.kind]}`,
    kind: "room",
    dungeonId: dungeon.id,
    roomKind: room.kind,
    exits,
    tiles: {
      id: `${dungeon.id}-${room.id}`,
      heights: rows.map((r) =>
        r.map(([x, z]) => (isWall(x, z) && !doorAt(x, z) ? ROOM_WALL_LEVEL : 0)).join(""),
      ),
      kinds: rows.map((r) =>
        r.map(([x, z]) => (isWall(x, z) && !doorAt(x, z) ? "x" : "r")).join(""),
      ),
      marks: rows.map((r) =>
        r
          .map(([x, z]) => {
            if (x === mid && z === size - ROOM_ENTRY_INSET) return "1";
            if (x === mid && z === mid) return "@";
            return doorAt(x, z) ?? ".";
          })
          .join(""),
      ),
      objects: props,
      colors: dungeon.colors,
    },
  };
}
