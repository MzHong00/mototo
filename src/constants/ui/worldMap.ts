export const WORLD_MAP_CELL = 92; // 노선도 격자 한 칸 (px)
export const WORLD_MAP_PAD = 70; // 노선도 가장자리 여백 (px)
export const WORLD_MAP_LINE_WIDTH = 12; // 노선 굵기 (px)
export const WORLD_MAP_UNKNOWN = "#c9c2d3"; // 아직 모르는 역·노선
export const WORLD_MAP_UNKNOWN_LABEL = "?";
export const WORLD_MAP_VILLAGE_R = 17; // 마을 역 반지름 (px)
export const WORLD_MAP_DUNGEON_R = 11; // 전투맵 역 반쪽 크기 (px)
export const WORLD_MAP_HERE_GAP = 9; // 현재 위치 고리가 역보다 큰 정도 (px)
export const WORLD_MAP_LABEL_GAP = 22; // 역 아래 이름 간격 (px)
export const WORLD_MAP_UNKNOWN_DASH = "2 18"; // 모르는 노선 점선
export const WORLD_MAP_TEXT = {
  title: "지도",
  close: "닫기 (M)",
  hintTravel: "가 본 마을을 누르면 그곳으로 이동해요",
  hintDungeon: "전투맵 안에서는 빠른 이동을 할 수 없어요",
} as const;

export const EXIT_DIALOG_TEXT = {
  askDungeon: "들어갈까요?",
  askTravel: "출발할까요?",
  okDungeon: "들어가기",
  okTravel: "출발",
  cancel: "그만두기",
} as const;
