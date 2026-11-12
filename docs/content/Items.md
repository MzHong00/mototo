# 아이템

> 게임 안의 모든 물건을 한 가지 정의(`ItemDef`)로 다룬다. 가방에 담고, 창고에 맡기고, 도감에 기록한다.

## 확정 사항

- 외형 전용 아이템은 없다. 옷·모자·신발은 모두 **능력치가 있는 장비**다 ([Character.md](Character.md)).
- 외형 파츠는 처음부터 다 주지 않는다. 모험·외형 기술로 해금한다 ([Skills.md](Skills.md)).
- 무기 에셋이 있다 (몽둥이 등).
- 1인 게임. 플레이어 간 거래는 없다.

## 규칙과 수치

### 분류

| 분류 `kind` | 예시 | 얻는 곳 | 겹치기 |
| --- | --- | --- | --- |
| `material` 재료 | 나무, 돌, 광석, 꽃, 물고기 | 채집·채광·낚시 | 99 |
| `loot` 전리품 | 가죽, 뿔, 깃털, 슬라임 젤 | 전투 | 99 |
| `weapon` 무기 | 몽둥이, 검 | 제작, 전리품, 상점 | 1 |
| `gear` 장비 | 모자, 상의, 하의, 한벌, 신발, 장신구, 망토 | 외형 기술 제작, 보상 | 1 |
| `furniture` 가구 | 의자, 침대, 램프 | 목공, 상점 | 9 |
| `building` 건물 | 집, 울타리, 다리 | 건축 기술 | 1 (설계도) |
| `consumable` 소비 | 회복 음식, 미끼 | 요리, 상점 | 99 |
| `dye` 염색약 | 노을빛 염색약 | 염색 기술, 나날빛 | 99 |
| `animal` 동물 관련 | 사료, 우유, 알, 털, 동물 입양권 | 사육, 상점 | 99 (입양권 1) |
| `key` 중요 | 열쇠, 직업 증표, 레시피 쪽지 | 의뢰, 숨겨진 조건 | 1 |

- 장비·무기는 **개체마다 다르다**(색, 강화). 그래서 겹치지 않는다.
- `key` 아이템은 팔기·버리기 불가. 가방 칸을 차지하지 않고 별도 탭에 둔다.

### 희귀도 5단계

| 단계 | 이름 | 색 | 기준 | 가격 배율 |
| --- | --- | --- | --- | --- |
| 1 | 흔함 | 흰 `#E8E8E8` | 어디서나 | ×1 |
| 2 | 고급 | 초록 `#6BCB77` | 기술 숙련(20+) | ×2 |
| 3 | 희귀 | 파랑 `#4D96FF` | 엘리트, 장인(40+) | ×4 |
| 4 | 영웅 | 보라 `#B983FF` | 보스, 달인(60+) | ×8 |
| 5 | 전설 | 금 `#FFC93C` | 보스 낮은 확률, 명인(80+) | ×16 |

- 아이템 이름·테두리·바닥에 떨어진 빛기둥 색으로 표시.
- 나날빛 색(빨~흰)과 겹치지 않게 **채도 낮은 별도 팔레트**를 쓴다. 테두리 굵기도 단계마다 다르게(색약 대응).

### 인벤토리 (가방)

| 항목 | 값 |
| --- | --- |
| 시작 칸 | 24칸 (6×4) |
| 확장 | 6칸(한 줄)씩, 최대 60칸 |
| 확장 비용 | 1000 → 2000 → 4000 … 골드 ×2 ([Economy.md](Economy.md)) |
| 빠른 칸 | 가방과 별개 8칸(아이템 참조만, 칸 차지 안 함). 키 1~8 기본 ([Controls.md](Controls.md)) |
| 자동 정리 | 분류 → 희귀도 높은 순 → id 순 |
| 가득 찼을 때 | 줍기 실패 + 알림. 땅의 아이템은 5분간 남음 |

- 줍기 순서: 같은 아이템이 덜 찬 칸에 먼저 합치고, 남으면 빈 칸.
- 버리기: 확인창. 장비·희귀 3 이상은 한 번 더 확인.

### 창고

- 집 안 **창고 상자** 가구로 연다 ([Housing.md](Housing.md)). 상자끼리는 내용 공유.
- 시작 60칸, 상자 추가 설치 시 +30칸, 최대 300칸.
- 제작·건축 시 **창고 재료도 자동 사용**: 아무 마을 안전 지대(`V`) 안이면 어디서든. 1인 게임이라 번거로움을 줄인다.

### 도감

- 처음 얻은 순간 도감에 등록. 분류별 탭.
- 표시: 그림, 이름, 희귀도, 얻는 곳 힌트(처음엔 `???`).
- 분류별 달성률 10%마다 작은 보상(골드, 염색약, 가방 확장권).
- 물고기는 최대 크기 기록 ([Fishing.md](Fishing.md)).

## 데이터 모델

```ts
export type ItemKind =
  | "material" | "loot" | "weapon" | "gear" | "furniture"
  | "building" | "consumable" | "dye" | "animal" | "key";

export type Rarity = 1 | 2 | 3 | 4 | 5;

/** 정적 정의. constants/items/*.ts 에 둔다 */
export interface ItemDef {
  id: string;                 // "mat_wood"
  name: string;
  kind: ItemKind;
  rarity: Rarity;
  icon: string;               // 아이콘 경로
  maxStack: number;           // 1 = 겹치지 않음
  baseValue: number;          // 기준 가치(골드). 판매가 계산에 사용
  sellable: boolean;
  /** kind 별 연결 */
  gearId?: string;            // weapon·gear → EquipDef ([Character.md])
  placeableId?: string;       // furniture·building → FurnitureDef/BuildingDef ([Housing.md])
  useEffect?: { heal?: number; buffId?: string; durationSec?: number };
  dyeColor?: string;          // dye
  sources?: string[];         // 도감 힌트 ("에버그린 채집 숲", "목공 Lv20")
}

/** 가방 한 칸 */
export interface ItemStack {
  itemId: string;
  count: number;
  quality?: 0 | 1 | 2 | 3;    // 제작 장비·음식만 (Crafting.md). 품질이 다르면 따로 겹침
  /** 장비·무기 개체 정보 (maxStack 1 일 때만) */
  instance?: { uid: string; color?: string; plus?: number };
}

export interface Inventory {
  size: number;                    // 현재 칸 수 (24~60)
  slots: (ItemStack | null)[];     // 길이 = size
  keyItems: string[];              // 중요 아이템 id
}

export interface Storage { size: number; slots: (ItemStack | null)[] }

export interface Codex { found: Record<string, { firstAt: number; best?: number }> }

export const INVENTORY = { start: 24, step: 6, max: 60, dropKeepSec: 300 } as const;
export const RARITY_MULT: Record<Rarity, number> = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
```

- 저장: `Inventory`, `Storage`, `Codex`를 Zustand 스토어 → localStorage ([Save.md](Save.md)).
- 아이템 로직(합치기, 빼기)은 순수 함수로 `utils/inventory.ts`에. 테스트 쉽게.

## 단계 (MVP → 이후)

1. **MVP**: `ItemDef` 10종(재료 위주), 24칸 가방, 줍기·겹치기·버리기, 가방 UI. 
   - 수용 기준: 나무 120개 주우면 99+21 두 칸. 가득 차면 줍기 실패 알림. 새로고침 후 유지.
2. 희귀도 색 표시, 자동 정리, 빠른 칸 8개.
3. 창고 상자, 제작 시 창고 재료 사용.
4. 도감, 달성 보상, 가방 확장.

## 참고한 게임

- Minecraft: 36칸 + 단축 줄 9칸, 겹치기 64. 단축 줄을 가방 일부로 두는 구조가 단순하다. https://minecraft.wiki/w/Inventory
- Terraria: 희귀도를 이름 색으로만 보여줘도 직관적. 단계가 너무 많으면(13단계) 구분이 어렵다 → 5단계로 줄임. https://terraria.wiki.gg/wiki/Rarity
- Stardew Valley: 가방 확장을 큰 골드 지출처로 사용. 상자 여러 개로 창고. https://stardewvalleywiki.com/Backpack

## 열린 질문

- 장비에 내구도가 있나? → 제안 기본값: **없음**(생활 게임이라 수리 부담 제거).
- 장비 강화(+1, +2)를 넣나? → 제안 기본값: 2단계 이후 검토, MVP는 `plus` 필드만 예약.
- 재료에 품질(별)을 두나? → 제안 기본값: 없음. 희귀도 하나로 충분.
- 창고 재료 자동 사용 범위 → 정리됨: 아무 마을 안이면 어디서든 (Crafting과 통일, 덜 번거로운 쪽).
