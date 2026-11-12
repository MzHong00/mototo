# 낚시

> 물가에서 찌를 던지고, 입질에 맞춰 당기고, 타이밍 미니게임으로 낚는다. 낚시 기술(`fishing`).

## 확정 사항

- 낚시는 생활 기술 ([Skills.md](Skills.md)). 손맛은 **타이밍** 미니게임.
- 무대: 본 맵 안 낚시터·해변·개울 구역 ([World.md](World.md)).

## 규칙과 수치

### 흐름

```
물(w) 칸을 바라보고 섬(물가 1칸 안) → 낚시 키 누르고 있기 (차징 0~1초)
→ 떼면 던지기: 거리 2~6m (차징 비례), 찌가 물 칸에 떨어져야 함
→ 대기 2~8초 (무작위, 미끼로 단축)
→ 가짜 입질 0~2번 (찌 톡: 누르면 실패·놓침)
→ 진짜 입질: 찌 쑥 + "!" + 효과음 → 0.6초 안에 키
→ 손맛 미니게임 → 성공: 물고기 들어 올리는 연출 + 크기 표시
```

- 놓치면 다시 던지면 된다. 실패 패널티 없음.
- 이동하면 낚싯줄 걷기(취소).

### 손맛 미니게임 (타이밍)

- 화면 가운데 원형 게이지. 바늘이 돈다. 초록 구간에서 키를 누르면 성공 1회.
- 초록 구간 안 가운데 금색 **완벽 구간**.
- 필요 성공 수 = 물고기 난이도(1~4). 실패 2번이면 놓침.
- 매 성공마다 구간 위치가 바뀌고 바늘이 빨라진다.

| 값 | 초기값 |
| --- | --- |
| 바늘 속도 | 1바퀴 1.6초, 성공마다 ×1.15 |
| 초록 구간 | 60° + 낚시 Lv × 0.4° (Lv100 = 100°) |
| 완벽 구간 | 초록의 25% |
| 난이도별 보정 | 난이도 1 ×1.2 넓힘 … 난이도 4 ×0.7 |

- 전부 완벽이면 **완벽 낚기**: 경험치 ×2, 크기 상위 30% 구간에서 뽑기.
- 접근성: 설정에서 "느린 바늘"(속도 ×0.7) 선택 가능.
- 첫 낚시(튜토리얼)는 실패해도 놓치지 않음 ([Quests.md](Quests.md)).

### 물고기 출현

- 물 종류: `sea`(바다), `river`(개울), `pond`(연못). 맵 메타데이터로 낚시 칸마다 지정.
- 조건: 물 종류 + 시간대(아침·낮·저녁·밤) + 날씨(맑음·비) + 요구 Lv.
- 조건 맞는 물고기 중 가중치로 하나 고른다. 쓰레기(빈 깡통 등) 가중치 기본 5%.
- **물결 자리**: 물고기가 모인 반짝이는 수면. 맵마다 1~2곳, 10분마다 위치 이동. 여기 던지면 대기 −40%, 희귀 가중치 ×2.

| id | 물고기 | 물 | 시간 | 요구 Lv | 난이도 | 크기(cm) | 경험치 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `minnow` | 송사리 | river, pond | 전부 | 1 | 1 | 3~6 | 8 |
| `carp` | 붕어 | pond | 전부 | 1 | 1 | 10~30 | 10 |
| `mackerel` | 고등어 | sea | 아침·낮 | 5 | 2 | 25~45 | 15 |
| `trout` | 산천어 | river | 아침·저녁 | 15 | 2 | 20~40 | 20 |
| `squid` | 오징어 | sea | 밤 | 20 | 3 | 20~50 | 28 |
| `eel` | 뱀장어 | river | 밤·비 | 35 | 3 | 40~90 | 35 |
| `seaBream` | 참돔 | sea | 낮 | 50 | 4 | 30~80 | 50 |
| `moonfish` | 달빛물고기 (전설) | pond | 밤·맑음 | 70 | 4 | 60~120 | 120 |

- 크기는 정규분포 비슷하게 뽑고, 낚시 Lv가 높을수록 큰 쪽이 살짝 잘 나온다. 최대 크기는 도감에 기록.

### 낚싯대와 미끼

| 도구 | tier | 효과 |
| --- | --- | --- |
| 낡은 낚싯대 | 0 | 시작 지급 |
| 구리 낚싯대 | 1 | 대기 −10% |
| 철 낚싯대 | 2 | 대기 −20% |
| 은 낚싯대 | 3 | 대기 −25%, 희귀 +5% |
| 별빛 낚싯대 | 4 | 대기 −30%, 희귀 +10% |

- 낚싯대는 초록 구간을 넓히지 않는다 (실력은 레벨이 결정).
- 미끼: 지렁이(흙더미 채집) 대기 −30% · 반딧불 미끼(밤 채집) 밤 물고기 가중치 ×1.5. 던질 때 1개 소모.

## 데이터 모델

```ts
type WaterKind = 'sea' | 'river' | 'pond';
// TimeOfDay = Time.md DayPhase, Weather = Time.md Weather 를 그대로 쓴다
type TimeOfDay = DayPhase;

interface FishDef {
  id: string;
  name: string;
  waters: WaterKind[];
  times: TimeOfDay[];        // 비면 전부
  weathers?: Weather[];      // 없으면 상관없음
  minSkillLevel: number;
  difficulty: 1 | 2 | 3 | 4; // 필요 성공 수
  sizeCm: [number, number];
  weight: number;            // 출현 가중치
  baseXp: number;
  isLegendary?: boolean;
}

type FishingPhase = 'idle' | 'charging' | 'casting' | 'waiting' | 'nibble' | 'bite' | 'reeling' | 'caught' | 'lost';

interface ReelState {
  fishId: string;
  needleDeg: number;     // 바늘 각도
  zoneStartDeg: number;  // 초록 구간 시작
  zoneSizeDeg: number;
  hits: number;          // 성공 수
  misses: number;        // 실패 수
  isAllPerfect: boolean;
}

interface FishRecord { fishId: string; count: number; maxSizeCm: number } // 도감
```

- 상태 전이는 순수 함수 `stepFishing(state, input, dt)` (`utils/fishing.ts`). UI 게이지는 HTML 오버레이.

## 단계 (MVP → 이후)

1. **MVP**: 던지기·대기·입질·타이밍 게이지, 물고기 4종(송사리·붕어·고등어·산천어), 시간대 조건.
   - 수용 기준: 물 칸이 아닌 곳에 던지면 "물에 던져야 해요". 입질 0.6초 지나면 놓침. 난이도 2 물고기는 성공 2번에 잡힘. 도감에 최대 크기 기록.
2. 가짜 입질, 미끼, 낚싯대 등급, 물결 자리.
3. 날씨·계절, 전설 물고기, 낚시 대회 의뢰.

## 참고한 게임

- Stardew Valley: 레벨이 오를수록 막대가 길어져 쉬워지고, 완벽 낚기는 품질·경험치 보너스. 낚싯대 등급은 막대 크기와 무관 → 그대로 반영. https://stardewvalleywiki.com/Fishing
- Animal Crossing: New Horizons: 찌 가짜 입질과 진짜 입질 구분 → 긴장감 있는 대기. https://nookipedia.com/wiki/Fishing
- Old School RuneScape: 낚시 장소별 요구 레벨 → 물고기 요구 Lv. https://oldschool.runescape.wiki/w/Fishing

## 열린 질문

- 게이지를 원형 타이밍으로 할까, 막대 유지형으로 할까? — 제안 기본값: 원형 타이밍 (모바일·짧은 집중).
- 물고기가 물속에 그림자로 보이게 할까? — 제안 기본값: 1단계 없음, 물결 자리만.
- 실시간 시간대인가 게임 시간인가 — 제안 기본값: [Time.md](Time.md) 결정에 따름.
