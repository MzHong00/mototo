import type { RoomKind } from "@/types/world";

export const ROOM_SIZE: Record<RoomKind, number> = {
  entry: 16,
  combat: 24,
  elite: 28,
  treasure: 16,
  gather: 20,
  rest: 16,
  boss: 36,
}; // 방 한 변 (칸)
export const ROOM_WALL = 2; // 벽 두께 (칸)
export const ROOM_WALL_LEVEL = 2; // 벽 높이 (층)
export const DOOR_WIDTH = 3; // 문 폭 (칸)
export const ROOM_ENTRY_INSET = 4; // 도착점이 남쪽 벽에서 떨어진 거리 (칸)

export const ROOM_KIND_LABEL: Record<RoomKind, string> = {
  entry: "입구",
  combat: "⚔ 전투",
  elite: "💀 엘리트",
  treasure: "🎁 보물",
  gather: "⛏ 채집",
  rest: "🔥 휴식",
  boss: "👑 보스",
};

export const ROOM_RETURN_LABEL = "🏠 마을로"; // 보스방 북쪽 문
export const ROOM_LEAVE_LABEL = "나가기"; // 입구방 남쪽 문

/** 방 종류별 표식 물체 — [종류, 방 가로 비율, 방 세로 비율] (전투가 생기기 전 자리 표시) */
export const ROOM_PROPS: Record<RoomKind, [string, number, number][]> = {
  entry: [],
  combat: [
    ["slime", 0.3, 0.35],
    ["slime", 0.7, 0.4],
    ["slime", 0.5, 0.6],
  ],
  elite: [["elite", 0.5, 0.45]],
  treasure: [["chest", 0.5, 0.45]],
  gather: [
    ["ore", 0.3, 0.3],
    ["ore", 0.7, 0.3],
    ["ore", 0.3, 0.65],
    ["ore", 0.7, 0.65],
  ],
  rest: [["campfire", 0.5, 0.5]],
  boss: [["boss", 0.5, 0.35]],
};

/** 모든 전투맵이 함께 쓰는 방 그래프 (MVP 고정) — 입구 → 세 갈래 → 엘리트 → 휴식 → 보스 */
export const ROOM_GRAPH: { id: string; kind: RoomKind; next: string[] }[] = [
  { id: "r0", kind: "entry", next: ["r1", "r2", "r3"] },
  { id: "r1", kind: "combat", next: ["r4"] },
  { id: "r2", kind: "combat", next: ["r5"] },
  { id: "r3", kind: "combat", next: ["r6"] },
  { id: "r4", kind: "treasure", next: ["r7"] },
  { id: "r5", kind: "gather", next: ["r7"] },
  { id: "r6", kind: "combat", next: ["r7"] },
  { id: "r7", kind: "elite", next: ["r8"] },
  { id: "r8", kind: "rest", next: ["r9"] },
  { id: "r9", kind: "boss", next: [] },
];
