# 동물

> **사육 기술**로 동물을 들이고 마을에 둔다. 돌보면 친해지고, 친해지면 생산물이 좋아진다.

## 확정 사항

- 사육 기술로 강아지·고양이·소 등 다양한 동물을 얻어 **마을에 배치** ([Skills.md](Skills.md), [Village.md](Village.md)).
- 1인 게임. 동물은 마을의 생기를 더하는 역할도 한다.

## 규칙과 수치

### 초기 6종

| 동물 | 분류 | 해금(사육 Lv) | 입양가 | 집 | 생산물 | 주기 |
| --- | --- | --- | --- | --- | --- | --- |
| 닭 | 가축 | 1 | 300 | 닭장 | 알 | 매일 |
| 토끼 | 가축 | 5 | 600 | 닭장 | 털뭉치 | 2일 |
| 강아지 | 반려 | 10 | 1000 | 개집 | (없음) 땅 파기로 재료 | 매일 확률 |
| 양 | 가축 | 15 | 1500 | 외양간 | 양털 | 3일 |
| 고양이 | 반려 | 20 | 1500 | 캣타워 | (없음) 선물 물어오기 | 매일 확률 |
| 소 | 가축 | 25 | 3000 | 외양간 | 우유 | 매일 |

- 반려 동물(강아지·고양이)은 생산물 대신 **선물**(랜덤 재료)과 나를 따라오는 기능.
- 털·색 무늬 변형 2~3종씩 (같은 메시 + 텍스처/틴트).

### 얻는 법

| 방법 | 내용 |
| --- | --- |
| 목장 상점 | 입양권 구매 → 집 건물이 있어야 사용 가능. 목장은 에버그린 전문 상점 ([Economy.md](Economy.md)) |
| 모험 | 길 잃은 동물 이벤트 (본 맵 필드에서 낮은 확률) → 데려오기 |
| 번식 | 나중 (MVP 제외) |

- 동물 집(닭장·외양간 등)은 **건축**으로 짓는다 ([Housing.md](Housing.md)). 집당 수용: 닭장 4, 외양간 4, 개집·캣타워 1.
- 마을 전체 동물 상한 20 (성능). Village.md와 통일한 값.
- 이름 짓기: 입양 시 (닉네임 규칙과 같음).

### 배치

- 동물 집을 놓으면 그 주변 **활동 구역**(집 기준 반경 6칸, 또는 울타리 안) 안에서 돌아다닌다.
- 울타리로 둘러싸면 그 안이 구역이 된다(채우기 판정).
- 반려 동물은 마을 전체를 돌아다닌다.

### 돌봄 (하루 기준)

| 행동 | 효과 | 횟수 |
| --- | --- | --- |
| 먹이 주기 (사료 1개) | 배부름 → 다음 날 생산 가능 | 하루 1회 |
| 쓰다듬기 (상호작용 키) | 친밀도 +15, 하트 연출 | 하루 1회 |
| 빗질 (빗 도구, 사육 Lv20) | 친밀도 +10 | 하루 1회 |
| 생산물 수확 | 상호작용 키로 줍기·짜기 | 준비됐을 때 |

- 먹이 안 주면 그날 생산 없음. 친밀도 -10.
- 하루 초기화 시 처리 ([Time.md](Time.md)). 오래 안 들어와도 **떠나지 않는다**(1인 게임, 벌주지 않음). 최대 감소는 -30에서 멈춤.
- 마을에 **사료통**을 지으면 자동 먹이(사육 Lv30, 사료는 채워 줘야 함).

### 친밀도와 생산물 품질

| 친밀도 (0~1000) | 하트 | 생산물 |
| --- | --- | --- |
| 0~199 | 0~1 | 보통 |
| 200~499 | 2 | 고급(희귀도 2) 30% |
| 500~799 | 3~4 | 고급 60%, 희귀 10% |
| 800~1000 | 5 | 고급 70%, 희귀 25%, 큰 생산물 |

- 생산물 희귀도는 [Items.md](Items.md) 단계를 따른다. 가공(치즈·실)은 [Crafting.md](Crafting.md), 가격은 [Economy.md](Economy.md).
- 사육 경험치: 쓰다듬기 5, 먹이 3, 수확 10.

### 행동 (단순 배회 AI)

```
Idle(2~5초) → 구역 안 무작위 칸 선택 → Walk → Idle …
   ├ 플레이어 2m 안 + 친밀도 ≥200 → 바라보기
   ├ 밤 → 집으로 Walk → Sleep (숨김)
   └ 비 → 집으로 (가축)
반려: 플레이어가 "따라와" 하면 Follow (거리 1.5m 유지, 마을 안만)
```

- 길찾기는 쓰지 않는다. 직선 이동 + 막히면 다른 칸 선택(3회 실패 시 Idle).
- 물리 강체 대신 **키네마틱**: 지형 높이만 읽어 붙인다. 충돌은 동물 사이 무시.
- 화면 밖(카메라 30m 밖) 동물은 애니메이션 정지, 위치만 1초마다 갱신.
- 같은 종은 스킨드 메시 공유. 동물 수가 많아지면 버텍스 애니메이션 텍스처(VAT) 인스턴싱 검토.

## 데이터 모델

```ts
export type AnimalSpecies = "chicken" | "rabbit" | "dog" | "sheep" | "cat" | "cow";

export interface AnimalDef {
  species: AnimalSpecies;
  role: "livestock" | "pet";
  unlockLevel: number;              // 사육 Lv
  adoptPrice: number;
  homeBuilding: string;             // BuildingDef id
  model: string;
  variants: string[];               // 무늬 텍스처
  produce?: { itemId: string; everyDays: number };
  gift?: { table: string; chance: number };  // 반려
  walkSpeed: number;                // m/s
}

export type AnimalState = "idle" | "walk" | "sleep" | "follow" | "look";

/** 저장되는 동물 개체 */
export interface AnimalData {
  uid: string;
  species: AnimalSpecies;
  name: string;
  variant: number;
  homeUid: string;                  // PlacedObject uid
  friendship: number;               // 0~1000
  fedToday: boolean;
  pettedToday: boolean;
  brushedToday: boolean;
  daysSinceProduce: number;
  produceReady?: { itemId: string; rarity: Rarity };
}

/** 실행 중 상태 (저장 안 함) */
export interface AnimalRuntime {
  uid: string;
  state: AnimalState;
  pos: [number, number, number];
  target?: [number, number];
  timer: number;
}

export const ANIMAL = {
  maxInVillage: 20,
  roamRadius: 6,
  pet: 15, brush: 10, hungry: -10, maxDailyLoss: -30,
  idleSec: [2, 5],
  sleepDistanceM: 30,
} as const;
```

- 하루 처리(`dailyTick`)는 순수 함수: `(AnimalData[], date) → AnimalData[]`. 테스트 쉽게.

## 단계 (MVP → 이후)

1. **MVP**: 닭 1종, 닭장 1개, 배회 AI, 먹이·쓰다듬기·알 수확, 저장.
   - 수용 기준: 먹이 준 다음 날 알 1개 준비. 쓰다듬으면 하트 연출 + 친밀도 증가. 닭이 구역 밖으로 안 나감.
2. 6종 전부, 친밀도별 생산물 희귀도, 입양 상점.
3. 반려 동물 따라오기·선물, 밤에 집 가기, 울타리 구역.
4. 사료통, 빗질, 길 잃은 동물 이벤트. (번식은 이후 검토)

## 참고한 게임

- Stardew Valley: 친밀도(0~1000, 하트 5개)와 기분이 생산물 품질·크기를 정한다. 매일 쓰다듬기가 짧은 의식이 됨. https://stardewvalleywiki.com/Animals
- Animal Crossing: 벌주지 않는 설계 — 오래 안 와도 크게 잃지 않음. 1인 힐링 게임에 맞음. https://www.digitaltrends.com/gaming/animal-crossing-new-horizons-terraforming-guide/

## 열린 질문

- 동물이 죽거나 떠나는가? → 제안 기본값: **절대 아님**.
- 반려 동물을 전투맵에 데려가나? → 제안 기본값: 아니오(마을 전용). 나중에 보조 동료 검토.
- 동물에 탈것(말 등)? → 제안 기본값: 초기 6종엔 없음. 이동 시스템 정해지면 추가.
- 번식 → 제안 기본값: 3단계 이후, 친밀도 5하트 두 마리 + 빈 자리.
