/** 칸 종류 — g 풀 · p 흙길 · s 모래 · w 물 · ^ v < > 경사로(화살표 쪽으로 올라감) */
export type TileKind = "g" | "p" | "s" | "w" | "^" | "v" | "<" | ">";

/** 칸 지도 — 한 글자가 한 칸 (행=z, 열=x) */
export interface TileMapData {
  id: string; // 지도 식별자
  heights: string[]; // 칸 층수(0~9). 경사로는 아래층 값
  kinds: string[]; // 칸 종류 (TileKind 글자)
}

/** 지형 메시·충돌체 원본 데이터 */
export interface TerrainBuffers {
  positions: Float32Array; // 화면용 꼭짓점
  normals: Float32Array; // 화면용 법선 (면마다 평평하게)
  colors: Float32Array; // 화면용 꼭짓점 색
  indices: Uint32Array; // 화면용 삼각형
  colliderPositions: Float32Array; // 충돌용 꼭짓점 (물가 투명벽 포함)
  colliderIndices: Uint32Array; // 충돌용 삼각형
}
