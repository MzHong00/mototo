/** 칸 종류 — g 풀 · p 흙길 · s 모래 · w 물 · r 돌바닥 · x 막힘(벽 윗면) · ^ v < > 경사로(화살표 쪽으로 올라감) */
export type TileKind = "g" | "p" | "s" | "w" | "r" | "x" | "^" | "v" | "<" | ">";

/** 칸 위 물체 (나무·바위·표식) — 같은 종류는 인스턴싱으로 한 번에 그림 */
export interface ObjectPlacement {
  type: string; // 물체 종류 id (MAP_OBJECTS 키)
  x: number; // 칸 좌표 (칸 가운데 = 정수 + 0.5)
  z: number;
  rot: number; // y축 회전 (라디안)
}

/** 칸 지도 — 한 글자가 한 칸 (행=z, 열=x) */
export interface TileMapData {
  id: string; // 지도 식별자
  heights: string[]; // 칸 층수(0~9). 경사로는 아래층 값
  kinds: string[]; // 칸 종류 (TileKind 글자)
  marks: string[]; // 표시 글자 — '.' 없음 · A~H 출구 · 1~9 도착점 · @ 광장 · D 전투맵 입구
  objects: ObjectPlacement[]; // 물체 배치
  colors?: Partial<Record<TileKind | "cliff", string>>; // 맵별 바닥·절벽 색 바꾸기
}

/** 화면용 지형 메시 한 조각 */
export interface TerrainChunkBuffers {
  positions: Float32Array; // 꼭짓점
  normals: Float32Array; // 법선 (면마다 평평하게)
  colors: Float32Array; // 꼭짓점 색
  indices: Uint32Array; // 삼각형
}

/** 지형 메시·충돌체 원본 데이터 */
export interface TerrainBuffers {
  chunks: TerrainChunkBuffers[]; // 화면용 조각들 (화면 밖 조각은 그리기 생략)
  colliderPositions: Float32Array; // 충돌용 꼭짓점 (물가 투명벽 포함)
  colliderIndices: Uint32Array; // 충돌용 삼각형
}
