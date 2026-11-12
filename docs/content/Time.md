# 시간

> 하루 초기화(오전 5시), 낮밤, 날씨, 계절. MVP는 하루 초기화만.

## 확정 사항

- 매일 접속하면 나날빛이 +1 ([Nanalbit.md](Nanalbit.md)). 하루 기준이 필요하다.
- 1인 게임 → 시간은 내 기기 시계 기준.

## 규칙과 수치

### 하루 초기화

| 항목 | 값 |
| --- | --- |
| 기준 | 기기 현지 시각 **오전 5시**. 0~4시 접속은 전날로 친다 |
| 날짜 키 | `YYYY-MM-DD` (5시간 뺀 날짜) |
| 초기화되는 것 | 나날빛 출석, 일일 할 일, 주민 의뢰 후보, 전투맵 보스 하루 보너스, 상점 특별품·되사기, 날씨 |
| 하루 처리(누적 상태 계산) | 동물 먹이·생산·친밀도(`dailyTick`), 채광 바위·하루형 채집물 재생, 주민 기억 요약, 공사 완료 |
| 자기 타이머 | 실시간형 채집물(분 단위), 제작 진행 |
| 게임 켜둔 채 5시 지남 | 다음 맵 이동 때 초기화 처리 (플레이 중 끊지 않음) |
| 시계 되돌리기 | 마지막 날짜 키보다 이전이면 무시 (보상 중복 방지) |

### 낮밤 (2단계)

- 제안: **실제 시각 연동**. 매일 접속 게임이라 "지금 시간"이 자연스럽다.
- 4구간, 빛 프리셋만 바꿈 (그림자 맵 다시 굽지 않음).

| 구간 | 실제 시각 | 빛 |
| --- | --- | --- |
| 아침 | 05~10 | 따뜻한 노랑, 밝기 0.9 |
| 낮 | 10~17 | 흰빛, 밝기 1.0 |
| 저녁 | 17~20 | 주황·분홍, 밝기 0.75 |
| 밤 | 20~05 | 푸른빛, 밝기 0.55. 가로등·창문 켜짐 |

- 구간 경계 10분 동안 색을 섞음.
- 밤에만 나오는 물고기·몬스터 가능 ([Fishing.md](Fishing.md)).
- 밤이 너무 어두우면 안 됨: 최저 밝기 0.55, 설정에서 "항상 낮" 선택 가능.

### 날씨 (3단계)

- 날짜 키로 시드 → 하루 날씨 고정 (다시 켜도 같음). 맵(지역)마다 따로 굴림.

| 날씨 | 확률 | 효과 |
| --- | --- | --- |
| 맑음 | 65% | 없음 |
| 흐림 | 20% | 빛 0.85 |
| 비 | 15% | 빗방울 파티클(인스턴싱 1개), 특정 물고기 |
| 눈 | 겨울에만 비 대신 | 바닥 색 살짝 하얗게 |

### 계절 (4단계)

- 실제 월 연동 (북반구): 봄 3~5, 여름 6~8, 가을 9~11, 겨울 12~2.
- 바뀌는 것: 풀·나무 색표, 계절 채집물·물고기, 계절 한정 염색약.
- 단풍골은 항상 가을빛(지역 특색 우선).

## 데이터 모델

```ts
type DayPhase = 'morning' | 'day' | 'evening' | 'night';
type Weather = 'clear' | 'cloudy' | 'rain' | 'snow';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface TimeState {
  dayKey: string;          // 'YYYY-MM-DD' (5시 기준)
  phase: DayPhase;
  season: Season;
  weatherByMap: Record<string, Weather>;
}

interface SaveTime {
  lastDayKey: string;      // 마지막으로 초기화 처리한 날
}

export const DAY_RESET_HOUR = 5;
export const PHASE_START_HOURS: Record<DayPhase, number> = {
  morning: 5, day: 10, evening: 17, night: 20,
};
export const PHASE_BLEND_MINUTES = 10;
export const WEATHER_WEIGHTS = { clear: 65, cloudy: 20, rain: 15 } as const;
```

- `getDayKey(now: Date): string` — `now - 5시간`의 현지 날짜.
- `onNewDay(prevKey, nextKey)` — 초기화 목록 실행. 여러 날 건너뛰어도 1번만.

## 단계 (MVP → 이후)

1. **MVP**: `getDayKey` + 하루 초기화(나날빛·보스 보너스). 항상 낮.
   - 수용 기준: 4:59 → 5:00 넘기면 맵 이동 시 1회만 초기화. 시계 뒤로 돌려도 보상 중복 없음.
2. 낮밤 4구간 실시간 연동 + "항상 낮" 설정.
3. 날씨 (맑음·흐림·비).
4. 계절과 계절 한정 아이템.

## 참고한 게임

- Animal Crossing: New Horizons: 실제 시각·계절 연동, 하루가 오전 5시(기기 시계)에 바뀌고 일일 활동·공사가 그때 갱신 → 5시 초기화 채택. https://primagames.com/tips/when-does-new-day-start-animal-crossing-new-horizons
- Stardew Valley: 비 오는 날에만 잡히는 물고기(메기 등) → 날씨에 실익 부여. https://stardewvalleywiki.com/Catfish

## 열린 질문

- 낮밤 실시간 연동 vs 게임 시간(예: 하루 24분)? — 제안 기본값: 실시간 연동 + "항상 낮" 옵션.
- 초기화 시각 5시? — 제안 기본값: 5시.
- 남반구 계절 반전? — 제안 기본값: 지원 안 함.
