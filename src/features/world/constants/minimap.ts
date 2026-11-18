export const MINIMAP_SIZE = 168; // 미니맵 지름 (px)
export const MINIMAP_TILE_PX = 3; // 바탕 그림 한 칸 크기 (px)
export const MINIMAP_LEVEL_DARKEN = 0.08; // 층마다 어두워지는 비율 (높이 구분)
export const MINIMAP_CLIFF = "rgba(70, 50, 40, 0.55)"; // 절벽 경계선
export const MINIMAP_PLAYER = "#ff7aa8"; // 내 위치 화살표
export const MINIMAP_EXIT = "#4f9fd6"; // 출구 아이콘
export const MINIMAP_OUTLINE = "#ffffff"; // 화살표 테두리
export const MINIMAP_ICON_R = 5; // 출구 아이콘 반지름 (px)
export const MINIMAP_ARROW: [number, number][] = [
  [8, 0],
  [-6, 6],
  [-3, 0],
  [-6, -6],
]; // 내 위치 화살표 꼭짓점 (오른쪽 = 바라보는 방향)
export const MINIMAP_ZOOMS = [0.5, 1, 2]; // 미니맵 확대 배율 (작을수록 넓게) — 1배 = 반경 약 28칸
export const MINIMAP_DEFAULT_ZOOM = 1; // 처음 확대 단계 (MINIMAP_ZOOMS 순번)
export const AREA_MAP_SIZE = 720; // 맵 전체 보기 캔버스 한 변 (px, 화면에 맞춰 CSS로 줄어듦)
export const AREA_MAP_PADDING = 24; // 맵 전체 보기 가장자리 여백 (px)
export const AREA_MAP_LABEL_FONT = "bold 22px sans-serif"; // 출구 이름 글씨
export const AREA_MAP_LABEL_GAP = 12; // 출구 아이콘과 이름 사이 (px)
export const AREA_MAP_ICON_R = 9; // 맵 전체 보기 출구 아이콘 반지름 (px)
export const MINIMAP_TEXT = {
  zoomIn: "미니맵 확대",
  zoomOut: "미니맵 축소",
  openArea: "맵 전체 보기",
  areaTitle: "맵 전체 보기",
  close: "닫기 (N)",
};
export const MINIMAP_LABEL = "#3b2f4a"; // 출구 이름 글씨 색
export const AREA_MAP_ARROW_SCALE = 1.8; // 맵 전체 보기에선 내 위치 화살표를 크게
