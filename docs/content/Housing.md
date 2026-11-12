# 집짓기 (하우싱)

> 내 집과 마을을 **같은 배치 도구**로 꾸민다. 칸 단위로 놓고, 돌리고, 철거하고, 다시 짓는다.

## 확정 사항

- **1인 게임**. 마을은 내가 꾸민다 ([Village.md](Village.md)).
- 처음엔 기본 구조물이 있다. **NPC 빼고 전부 철거** 가능. 건축으로 재건.
- 건물은 **건축 기술**, 가구는 **목공 기술**로 해금 ([Skills.md](Skills.md)).
- 동물도 마을에 배치 ([Animals.md](Animals.md)).
- 성능 최우선: 같은 물건은 인스턴싱.

## 규칙과 수치

### 두 공간

| 공간 | 격자 | 놓을 수 있는 것 | 크기 |
| --- | --- | --- | --- |
| 마을 외부 | 지형과 같은 1m 칸 | 건물, 야외 가구, 울타리, 길 장식, 동물 집 | 마을 지도 중 `b` 칸 ([Terrain.md](Terrain.md) marks) |
| 집 내부 | 0.5m 칸 | 가구, 벽걸이, 바닥재, 벽지 | 시작 6×6m → 확장. 내 집은 에버그린 1채만 ([Village.md](Village.md)) |

- 집 내부는 **별도 작은 씬**. 문으로 들어간다(로딩 짧게).
- 집 확장: 6×6 → 8×8 → 10×10 → 2층. 비용은 [Economy.md](Economy.md).

### 배치 규칙

- 칸 단위 스냅. 회전은 **90°씩** (0/90/180/270).
- 물체마다 차지 칸 `footprint` (예: 의자 1×1, 침대 2×4(내부칸), 내 집 8×8).
- 놓을 수 없는 곳: 물, 경사로, 절벽 경계, 다른 물체와 겹침, NPC 경로 핵심 칸(`reserved`).
- 높이 다른 층에 걸치면 불가. 한 물체는 한 층 위에만.
- 가구 위에 소품 올리기: `surface: true`인 가구(탁자) 위 1칸에 소품 1개. MVP 제외.
- 벽걸이는 내부 벽 칸에만.
- 외부 최대 배치 수 1500개, 내부 300개 (성능 상한).

### 철거와 재건

| 동작 | 결과 |
| --- | --- |
| 가구 집어넣기 | 즉시, 가방으로 돌아옴 |
| 건물 철거 | 확인창 → 3초 연출 → 재료 50% 반환, 건물 아이템은 사라짐 |
| 기본 구조물 철거 | 같음. **원래 설계도**가 남아 재료 100%로 재건 가능 |
| 건물 옮기기 | 철거 없이 이동. 비용 = 건축비의 10% |
| 주민 집·상점 | **철거 가능**. 주민은 광장 텐트, 상점 주인은 노점으로 기능 유지 ([Village.md](Village.md)) |

- 통일: 사용자 확정 "NPC 빼고 전부 철거 가능"에 맞춰 주민 집·상점도 철거 허용 (Village 규칙이 기준).

- 건물 안에 가구가 있으면 철거 전에 창고로 자동 이동.

### 건물 짓기

1. 건축 기술 레벨로 설계도 해금 (또는 상점·보상).
2. 배치 모드에서 자리 지정 → 재료 + 골드 차감.
3. **공사 중 표시** → 실제 시간 10초~하루 초기화 후 완성 (건물 크기별).
4. 완성 시 건축 경험치.

| 건축 Lv | 해금 예 |
| --- | --- |
| 1 | 울타리, 표지판, 작은 화단 |
| 10 | 작은 창고, 닭장 |
| 20 | 외양간, 다리 |
| 40 | 2층 집, 분수 |
| 60+ | 탑, 특수 장식 |

### 편집 모드 조작

| 입력 | 기능 |
| --- | --- |
| 편집 모드 진입 | `build` 기능 (기본 `B`, [Controls.md](Controls.md)) |
| 마우스 이동 | 유령(반투명) 미리보기가 칸에 붙음 |
| 좌클릭 | 놓기 / 이미 놓인 물체 집기 |
| `rotate` (기본 `R`) / 휠 | 90° 회전 |
| `remove` (기본 `Delete`) | 집어넣기·철거 |
| `Esc` (고정) | 취소, 모드 종료 |
| 색 | 놓인 가구 선택 → 색 바꾸기 (염색약 사용) |

- 미리보기 색: 초록 = 가능, 빨강 = 불가(이유 툴팁).
- 편집 모드에선 카메라가 위에서 내려다보는 각도로 바뀌고 확대·이동 가능.
- 되돌리기 Ctrl+Z(편집 모드 안 고정) 20단계. 철거도 재료 그대로 복구. 모드를 나가면 기록 삭제.
- 편집 모드 키(`rotate`·`remove`)는 키 설정의 '편집' 분류. 편집 모드 안에서만 동작해 일반 키와 겹쳐도 된다.

### 성능

- 같은 `defId`는 `InstancedMesh` 하나로. 색은 인스턴스 색 속성(틴트).
- 충돌체: 상자 근사(cuboid) 1개씩. 건물은 정적 강체, 묶어서 1개 컴파운드도 검토.
- 칸 점유는 `Map<"x,z", uid>` 해시로 O(1) 판정.
- 배치 도구는 개발용 맵 에디터로도 재사용.

## 데이터 모델

```ts
export type Rot = 0 | 1 | 2 | 3;          // ×90°

export interface FootprintDef { w: number; d: number }  // 칸 수

export interface FurnitureDef {
  id: string;
  itemId: string;                // ItemDef 연결 ([Items.md])
  model: string;                 // glb 경로
  footprint: FootprintDef;
  space: "indoor" | "outdoor" | "both";
  mount: "floor" | "wall" | "surface";
  surface?: boolean;             // 위에 소품 가능
  tintable: boolean;
  interact?: "sit" | "sleep" | "storage" | "craft" | "light";
}

export interface BuildingDef {
  id: string;
  model: string;
  footprint: FootprintDef;
  door?: { x: number; z: number };     // 로컬 칸
  interiorSize?: { w: number; d: number };
  cost: { gold: number; items: { itemId: string; count: number }[] };
  buildSec: number;
  unlock: { skill: "building"; level: number };
  role?: "home" | "shop" | "npcHome" | "barn" | "coop" | "deco";
  npcSlots?: { role: "home" | "work" | "rest"; offset: [number, number] }[]; // Village.md
  removable: boolean;                  // 텐트·노점만 false
}

export interface PlacedObject {
  uid: string;
  defId: string;                       // FurnitureDef | BuildingDef id
  kind: "furniture" | "building" | "animalHome";
  space: string;                       // "village:evergreen" | "interior:home"
  x: number; z: number; floor: number; // 칸 좌표 + 층
  rot: Rot;
  color?: string;
  state?: "building" | "done";
  doneAt?: number;                     // 공사 완료 시각
  original?: boolean;                  // 기본 구조물 여부
}

export interface SpaceLayout { spaceId: string; objects: PlacedObject[] }
```

## 단계 (MVP → 이후)

1. **MVP**: 집 내부 6×6, 가구 5종, 배치·회전·집어넣기, 저장.
   - 수용 기준: 겹치면 빨간 미리보기. 회전하면 footprint가 바뀜(2×1→1×2). 같은 의자 50개도 드로우콜 1개.
2. 마을 외부 배치, 기본 구조물 철거·설계도, 건물 짓기(공사 시간).
3. 가구 색, 집 확장, 되돌리기, 옮기기.
4. 소품 올리기, 벽지·바닥재, 2층.

## 참고한 게임

- Animal Crossing: 섬 꾸미기를 별도 앱(모드)으로 분리. 건물 이전에 비용을 매겨 신중하게 배치. 땅 먼저, 장식 나중. https://www.digitaltrends.com/gaming/animal-crossing-new-horizons-terraforming-guide/
- Palia: 격자 배치/자유 배치 전환, 구역(플롯) 단위 확장, 한 구역 배치 상한(3500개). https://palia.wiki.gg/wiki/Guide:Decorating_the_Housing_Plot
- Stardew Valley: 건물을 지으면 하루 뒤 완성 → 기다림이 다음 접속 동기. https://stardewvalleywiki.com/Carpenter%27s_Shop

## 열린 질문

- 지형 바꾸기(테라포밍: 층 올리기·물 파기)를 넣나? → 제안 기본값: 3단계 이후, 바닥 글자(풀↔길)만 먼저.
- 집터를 마을마다 둘지 → 정리됨: **에버그린 1채만**. 다른 마을 별장은 나중 (더 단순한 쪽).
- 자유 배치(칸 무시) → 제안 기본값: 없음. 내부만 0.5m 칸으로 정밀도 확보.
- 공사 시간이 실제 시간인지 → 제안 기본값: 작은 건 즉시, 큰 건 다음 하루 초기화.
