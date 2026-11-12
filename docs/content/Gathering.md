# 채집

> 맨손과 도끼로 꽃·풀·과일·나무를 모은다. 채집 기술(`gathering`) 경험치를 얻는다.

## 확정 사항

- 채집은 생활 기술 중 하나. 레벨은 채집 행동으로만 오른다 ([Skills.md](Skills.md)).
- 본 맵 안 채집 숲 구역이 주 무대 ([World.md](World.md)). 전투맵 채집방에도 자원이 있다.

## 규칙과 수치

### 상호작용 흐름

```
자원 근처(1.5m 안) → 머리 위 "상호작용" 키 표시 → 키 누름
→ 맨손: 1초 줍기 모션 → 획득
→ 도구: 내려치기 N번 (0.6초 간격) → 마지막 타격에 획득
→ 자원은 "빈 상태"로 바뀜 → 재생 시간 뒤 되살아남
```

- 상호작용 키는 기본 `F` (키 설정에서 바꿈, [Controls.md](Controls.md)).
- 이동 입력이 들어오면 채집 취소 (모은 타격 수는 5초간 유지).
- 손맛: 타격마다 자원 흔들림 + 나뭇잎·꽃잎 파티클 + 효과음, 마지막 타격에 히트스톱 60ms·튀어나오는 아이템.
- 아이템은 땅에 튀었다가 0.4초 뒤 자동으로 가방에 빨려 들어온다.

### 자원 종류 (초기)

| id | 자원 | 도구 | 타격 | 요구 Lv | 경험치 | 재생 |
| --- | --- | --- | --- | --- | --- | --- |
| `flower` | 꽃 | 맨손 | 0 (1초) | 1 | 5 | 실시간 30분 |
| `weed` | 풀·섬유 | 맨손 | 0 | 1 | 4 | 실시간 20분 |
| `branch` | 떨어진 가지 | 맨손 | 0 | 1 | 4 | 하루 초기화 |
| `dirtSpot` | 흙더미 (지렁이) | 맨손 | 0 | 1 | 6 | 실시간 1시간 |
| `fruitTree` | 과일나무 흔들기 | 맨손 | 0 | 5 | 8 | 3일 (초기화 기준) |
| `tree` | 나무 베기 | 도끼 | 3 | 1 | 15 | 그루터기 1일 → 나무 |
| `hardTree` | 단단한 나무 | 도끼 1등급↑ | 5 | 20 | 30 | 2일 |
| `cotton` | 목화 | 맨손 | 0 | 3 | 7 | 하루 초기화 |
| `mushroom` | 버섯 | 맨손 | 0 | 10 | 10 | 하루 초기화 |

- 시간 판정 기준과 하루 초기화(오전 5시)는 [Time.md](Time.md).
- 꺼져 있는 동안에도 재생 시간은 흐른다 (타임스탬프 비교).
- 자원 위치는 맵마다 고정 스폰 지점. 각 지점에 들어갈 자원 후보와 가중치를 둔다.

### 도구 등급 (채집·채광·낚시 공통)

| tier | 이름 | 사용 요구 Lv | 힘 | 효과 |
| --- | --- | --- | --- | --- |
| 0 | 낡은 | 1 | 1 | 튜토리얼 지급(도끼·낚싯대), 곡괭이는 마을 첫 의뢰 ([Quests.md](Quests.md)) |
| 1 | 구리 | 10 | 2 | 단단한 나무·구리 광석 |
| 2 | 철 | 25 | 3 | 철 광석 |
| 3 | 은 | 45 | 5 | 은 광석, 희귀 확률 +5% |
| 4 | 별빛 | 70 | 8 | 보석 바위, 희귀 확률 +10% |

- 필요 타격 수 = `ceil(자원 체력 / 힘)`. 나무 체력 3, 단단한 나무 9 (구리 도끼로 5번).
- 도끼 → 채집 Lv, 곡괭이 → 채광 Lv, 낚싯대 → 낚시 Lv를 요구.
- 도구 제작은 목공 ([Crafting.md](Crafting.md)), 대장 기술 없음. 내구도 없음 (1인 생활 게임 피로 줄이기).

### 획득 테이블

- 자원마다 `LootTable` 하나. 가중치 뽑기 1회 + 보장 아이템.
- 채집 Lv 10마다 2배 획득 확률 +2% (최대 20%) + 장비 `gather` 능력치 ([Combat.md](Combat.md)).

## 데이터 모델

```ts
type ToolKind = 'hand' | 'axe' | 'pickaxe' | 'rod';
type ToolTier = 0 | 1 | 2 | 3 | 4;

interface LootEntry {
  itemId: string;
  weight: number;       // 가중치
  min: number;          // 최소 개수
  max: number;          // 최대 개수
  minSkillLevel?: number;
  minToolTier?: ToolTier;
}

interface LootTable {
  id: string;
  guaranteed: LootEntry[]; // 항상 주는 것
  rolls: number;           // 가중치 뽑기 횟수
  entries: LootEntry[];
}

interface ResourceDef {
  id: string;                 // 'tree'
  skill: 'gathering' | 'mining';
  tool: ToolKind;
  minToolTier: ToolTier;
  hp: number;                 // 0이면 맨손 1초 줍기
  minSkillLevel: number;
  baseXp: number;
  lootTableId: string;
  respawn: { kind: 'realtime'; minutes: number } | { kind: 'dailyReset'; days: number };
}

interface ResourceSpawn {
  spawnId: string;            // 맵 안에서 고유
  mapId: string;
  cell: [number, number];     // 지형 칸 좌표 (1m)
  candidates: { resourceId: string; weight: number }[];
}

interface ResourceState {
  spawnId: string;
  resourceId: string;         // 지금 서 있는 자원
  hpLeft: number;
  depletedAt: number | null;  // ms. null이면 살아 있음
}
```

- 렌더: 같은 자원은 `InstancedMesh` 하나로 그린다. 빈 상태는 인스턴스 스케일 0 또는 그루터기 메시.
- 충돌: 나무만 원기둥 충돌체, 꽃·풀은 충돌 없음.

## 단계 (MVP → 이후)

1. **MVP**: 꽃·풀·가지·나무(낡은 도끼). 상호작용 키, 타격·히트스톱, 실시간 재생, 가방 들어오기.
   - 수용 기준: 나무를 3번 치면 목재 1~3개와 채집 경험치 15. 그루터기가 남고 하루 초기화 뒤 나무가 다시 선다. 새로고침해도 빈 상태가 유지된다.
2. 과일나무, 목화, 버섯, 도구 등급.
3. 계절·날씨별 자원, 희귀 꽃(염색 재료).

## 참고한 게임

- Animal Crossing: New Horizons: 과일은 3일 뒤 다시 열림 → 과일나무 3일 재생. https://www.gamerevolution.com/guides/640094-animal-crossing-new-horizons-fruit-respawn-when-time
- Stardew Valley: 도구 등급이 한 번에 처리량을 늘림 → 힘 수치로 타격 수 감소. https://stardewvalleywiki.com/Tools
- Old School RuneScape: 자원마다 요구 레벨 → 마을에서 멀수록 높은 레벨. https://oldschool.runescape.wiki/w/Woodcutting

## 열린 질문

- 도구 내구도를 둘까? — 제안 기본값: 없음.
- 자원 재생을 실시간과 하루 초기화로 섞을까? — 제안 기본값: 작은 것은 실시간, 큰 것은 초기화 기준.
- 나무를 베면 자리에서 사라지게 해 마을 꾸미기와 연결할까? — 제안 기본값: 마을 안 나무는 건축 철거로만, 필드 구역 나무만 재생.
