# 경제

> 화폐는 골드 하나. 1인 게임이므로 인플레이션 관리가 아니라 **진행 속도**(무엇을 언제 살 수 있나)를 맞추는 것이 목적이다.

## 확정 사항

- **1인 게임**. 플레이어 간 거래·경매장 없음 (다인은 나중, [Social.md](Social.md)).
- 마을은 내가 꾸민다. 건축으로 재건 ([Village.md](Village.md), [Housing.md](Housing.md)).

## 규칙과 수치

### 화폐

| 화폐 | 용도 | 얻는 법 |
| --- | --- | --- |
| 골드 | 모든 거래 | 판매, 의뢰, 몬스터, 도감 보상 |

- 화폐는 골드 하나만. 특수 화폐(토큰 등)는 만들지 않는다. 특별 보상은 아이템으로 준다.
- 최대 9,999,999 골드.

### 가격 공식

```
재료 가치 V(item)  = baseValue (정의서에 직접 적음)
제작품 가치          = Σ(재료 V × 개수) × 제작 배율 × 희귀도 배율
판매가               = floor(가치 × 품질 배율 × 0.5)  ← 상점에 팔 때 (품질 배율 ×1/1.25/1.5/2, Crafting.md)
구매가               = 가치 (상점 기본) × 마을 배율
```

| 제작 배율 (분류) | 값 | 이유 |
| --- | --- | --- |
| 요리 | ×1.5 | 가공하면 이득이 있게 |
| 가구 | ×1.3 | 꾸미기용, 판매는 부차적 |
| 장비·무기 | ×1.5 | |
| 염색약 | ×2 | 재료가 적어서 |
| 동물 생산물 가공(치즈·실) | ×2 | 사육 보상 |

- 희귀도 배율은 [Items.md](Items.md)의 ×1/2/4/8/16.
- 기본 재료 `baseValue` 예: 나무 2, 돌 2, 꽃 5, 구리 광석 8, 잉어 15, 가죽 10, 우유 20, 알 10.
- 같은 아이템을 많이 팔아도 값이 떨어지지 않는다(단순). 대신 **하루 판매 상한 없음**.
- 마을 배율: 0.9~1.2. 마을마다 특산품은 싸게, 먼 곳 물건은 비싸게.

### 상점

| 상점 | 파는 것 | 사는 것 | 있는 마을 |
| --- | --- | --- | --- |
| 잡화점 | 미끼, 기본 음식, 기본 재료, 가방 확장 | 전부 | 모든 마을 |
| 목공소 | 기본 가구, 가구 레시피 | 가구, 나무 | 에버그린 |
| 목장 | 사료, 동물 입양권 | 동물 생산물 | 에버그린 |
| 도구점 | 기본 무기·도구, 도구 레시피 | 무기, 광석 | 단풍골 |
| 재단소 | 외형 레시피, 기본 염색약 | 장비, 천 | 블루 코브 |
| 보석점 | 세공 도안, 원석 | 장신구, 원석 | 구름 고원 |
| 염색 공방 | 염색약, 염색 도안 | 염색약, 꽃 | 달빛 호숫가 |

- 마을마다 상점 건물 = 잡화점 1 + 전문 상점 1 (에버그린만 2). [Village.md](Village.md) 기본 구조물과 같음.
- 대장 기술은 두지 않는다. 도구·무기 **제작은 목공**(주괴는 채광 제련), 도구점은 파는 곳일 뿐. 더 단순한 쪽으로 통일 ([Crafting.md](Crafting.md)).

- 상점 주인은 NPC ([Npc.md](Npc.md)). 영업 시간은 NPC 일과를 따른다.
- 판매는 어느 상점에서나 가능(분류 무관). 단 그 상점 전문 분류는 판매가 ×1.1.
- 판매 후 **되사기 칸** 10개: 그날 판 물건을 판 값에 다시 살 수 있다(실수 방지).
- 상점 재고: 기본품은 무한. 특별품은 하루 초기화마다 갱신 ([Time.md](Time.md)).

### 돈 쓰는 곳 (진행 속도 기준)

| 지출처 | 가격 예 | 언제 사게 할지 (목표) |
| --- | --- | --- |
| 가방 확장 | 1000 → 2000 → … ×2 | 첫 주 1회 |
| 건물 짓기 | 설계 재료 + 골드 500~20000 | 매 2~3일 1건 |
| 집 확장 | 5000 → 15000 → 40000 | 1주, 3주, 6주 |
| 레시피 구매 | 100~3000 | 기술 등급 오를 때 |
| 동물 입양 | 300~3000 | 사육 Lv마다 |
| 장비·무기 | 200~10000 | 전투맵 갈 때 |
| 염색약 | 50~500 | 수시로 |
| 철거 | 무료 | — |

### 진행 속도 목표

- 하루 30분 플레이 기준 수입 목표:

| 시기 | 하루 수입 | 쓸 곳 |
| --- | --- | --- |
| 1일차 | 300 | 기본 도구, 첫 가구 |
| 1주 | 1500 | 가방 확장, 작은 건물 |
| 1달 | 6000 | 집 확장, 동물 |
| 3달 | 20000 | 희귀 건물, 장비 |

- 가격 표는 `constants/economy.ts` 한 곳에. 밸런스 시트(CSV)에서 생성 가능하게.
- 개발용 지표: 하루 수입·지출을 로컬에 기록 → 목표와 비교.

## 데이터 모델

```ts
export interface Wallet { gold: number }

export interface ShopEntry {
  itemId: string;
  price?: number;           // 없으면 공식으로 계산
  stock: number | "inf";
  unlock?: { skill: string; level: number };
}

export interface ShopDef {
  id: string;               // "shop_general_v1"
  npcId: string;
  specialty: ItemKind[];    // 전문 분류 (판매가 ×1.1)
  townMult: number;         // 0.9~1.2
  entries: ShopEntry[];
  dailyEntries?: ShopEntry[]; // 하루마다 갱신
}

export interface BuybackEntry { stack: ItemStack; paid: number }

export const ECONOMY = {
  sellRate: 0.5,
  specialtyBonus: 1.1,
  buybackSlots: 10,
  goldMax: 9_999_999,
  craftMult: { food: 1.5, furniture: 1.3, gear: 1.5, dye: 2, animalGoods: 2 },
  qualityMult: [1, 1.25, 1.5, 2],
} as const;

export function itemValue(def: ItemDef, recipe?: Recipe): number; // 위 공식
export function sellPrice(def: ItemDef, shop: ShopDef): number;
```

## 단계 (MVP → 이후)

1. **MVP**: 골드, 잡화점 1곳, 사기·팔기, 판매가 = baseValue × 0.5.
   - 수용 기준: 나무 10개 팔면 +10골드. 골드 부족 시 구매 버튼 비활성. 새로고침 후 유지.
2. 제작품 가치 공식(품질 포함), 상점 종류 전부, 되사기.
3. 마을 배율, 하루 특별품, 지출처 연결(가방·건물·집 확장).
4. 수입 로그와 밸런스 조정.

## 참고한 게임

- Stardew Valley: 가공품 = 원재료 × 고정 배율(와인 ×3, 잼 ×2+50). 공식이 단순해 플레이어가 계산하며 즐긴다. https://stardewvalleywiki.com/Artisan_Goods
- Animal Crossing: 집 대출·건물 이전비 같은 큰 지출처가 장기 목표가 된다. 가격 하락 없는 판매로 1인 경제를 단순하게 유지. https://www.digitaltrends.com/gaming/animal-crossing-new-horizons-terraforming-guide/
- Palia: 하우징 확장에 점점 오르는 비용 → 진행 속도 조절. https://palia.wiki.gg/wiki/Housing_Plot

## 열린 질문

- 같은 물건 대량 판매 시 값 하락? → 제안 기본값: **없음**. 너무 쉬우면 baseValue를 낮춘다.
- 판매율 50%가 적당? → 제안 기본값: 50%. 초반 체감이 낮으면 60%.
- 쓰러지면 골드를 잃나? → 정리됨: 아무것도 잃지 않음 ([Combat.md](Combat.md)).
- NPC에게 선물·주문으로 돈 버는 길? → 제안 기본값: 주민 의뢰로 골드 지급 ([Quests.md](Quests.md)).
