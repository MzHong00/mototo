# 의뢰

> 할 일을 알려 주는 장치. 첫 접속 튜토리얼, AI 주민이 직접 부탁하는 주민 의뢰, 매일 바뀌는 일일 할 일 세 가지.

## 확정 사항

- 캐릭터 생성 직후 맵은 작아도 된다 → **첫걸음 섬**(`start-island`, 48×48)에서 튜토리얼 ([World.md](World.md)).
- 1인 게임. 주민은 AI(LLM)로 사람처럼 대화한다 ([Npc.md](Npc.md)).
- 출석(나날빛)은 의뢰와 섞지 않는다. 나날빛은 출석으로만 오른다 ([Nanalbit.md](Nanalbit.md)).

## 규칙과 수치

### 1. 첫 접속 튜토리얼 (첫걸음 섬, 약 10분)

첫걸음 섬: 48×48칸(테스트 섬 재활용). 해변·작은 숲·연못·작업대·재봉틀·선착장. 주민 1명(안내역, 뱃사공).

| # | 단계 | 목표 | 배우는 것 | 보상 |
| --- | --- | --- | --- | --- |
| 1 | 깨어남 | 선착장까지 걷기 | 이동·달리기·카메라 | — |
| 2 | 언덕 | 경사로로 올라가기, 낮은 턱 점프 | 점프, 층 | — |
| 3 | 첫 채집 | 꽃 3, 가지 3 줍기 | 상호작용 키 | 낡은 도끼 |
| 4 | 나무 | 나무 1그루 베기 | 도구 타격 | 목재 |
| 5 | 작업대 | 판자 → 나무 의자 1 | 제작 창 | 의자(가구) |
| 6 | 낚시 | 연못에서 1마리 (실패해도 놓치지 않음) | 낚시 미니게임 | 낡은 낚싯대(시작 시 지급), 미끼 3 |
| 7 | 목화 | 목화 3 → 천 1 → 긴바지 | 재봉, **외형 해금 체험** | 긴바지 |
| 8 | 옷장 | 긴바지를 외형 칸에 등록 | 장비/외형 칸 | — |
| 9 | 키 설정 | 자판 그림에서 기능 하나 옮기기 (건너뛰기 가능) | 키 설정 ([Controls.md](Controls.md)) | — |
| 10 | 대화 | 뱃사공과 자유 대화 1번 | AI 주민 대화 | — |
| 11 | 출항 | 배 타고 에버그린 마을 | 세계 지도 | 골드 100, 기술 창 열림 |

- 각 단계는 화면 왼쪽 위 한 줄 목표 + 목표 지점 화살표. 대사는 짧게(2~3줄), 건너뛰기 버튼.
- 튜토리얼 중 낡은 곡괭이는 주지 않는다 (마을 첫 의뢰에서).
- 중간에 끄면 마지막 완료 단계부터 이어감. 다 끝내면 첫걸음 섬은 지도에서 다시 갈 수 있다.

### 2. 주민 의뢰

- 주민이 직접 말을 걸거나(머리 위 `!`), 마을 게시판에 붙는다.
- **게임 규칙이 목표·보상을 정하고, AI는 사연·대사만 만든다.** LLM 응답으로 보상·아이템이 바뀌지 않는다.

```
매일 05시 → 주민별로 의뢰 후보 템플릿 뽑기 (주민 성격·직업·호감도 가중치)
→ 규칙으로 목표·수량·보상 확정 → AI에 "주민 정보 + 목표"를 주고 사연 2~3문장 생성
→ 실패·지연 시 템플릿 기본 대사 사용 → 플레이어 수락 → 완료 시 주민에게 직접 전달
→ AI가 감사 대사 생성, 호감도 반영
```

| 템플릿 | 목표 예 | 연결 기술 |
| --- | --- | --- |
| 가져다주기 | 붕어 2마리 | 채집·낚시·채광 |
| 만들어주기 | 과일 샐러드 1 (좋음 이상) | 요리·목공·재봉 … |
| 꾸며주기 | 거울대에서 이 주민 머리·얼굴 바꿔주기 | 미용·분장 |
| 물들이기 | 주민 옷을 파랑으로 | 염색 |
| 돌봐주기 | 강아지 산책 1번 | 사육 |
| 찾아오기 | 채집 숲 구역에서 잃어버린 물건 | 탐험 |
| 고쳐주기 | 부서진 울타리 다시 짓기 | 건축 |

- 수량·요구 레벨은 내 해당 기술 레벨 근처에서 고른다 (−10 ~ +5).
- 주민당 동시 1개, 마을 전체 하루 3개 ([Npc.md](Npc.md)). 기한 1~3일. 기한 지나면 조용히 사라짐 (호감도 감소 없음).
- 보상: 골드 + 기술 경험치(해당 기술 baseXp × 5) + 호감도 + 10% 확률 **도안**(희귀 외형 레시피) ([Crafting.md](Crafting.md)).
- 호감도 단계가 오르면 그 주민만의 고정 의뢰(작은 이야기 3단계)가 열린다. 상세는 [Npc.md](Npc.md).

### 3. 일일 할 일

- 매일 05시 초기화 시 **3개** 무작위. 예: "꽃 10개 채집", "물고기 3마리", "아무 요리 2개", "주민 2명과 대화".
- 하나 완료 → 나날 도장 1개. 3개 다 → 보너스 도장 1개 더 (하루 최대 4개).
- 도장 20개 → 주간 선물 상자(재료·염색약·도안 낮은 확률). 도장은 주 단위 초기화(월요일 05시).
- 하루 1번 무료 "다시 뽑기".
- 일일 할 일은 출석과 별개. 안 해도 나날빛에는 영향 없음.

## 데이터 모델

```ts
type Objective =
  | { kind: 'reach'; mapId: string; cell: [number, number] }
  | { kind: 'gather' | 'catch' | 'mine'; targetId: string; count: number } // targetId: 자원·물고기 id 또는 '*'
  | { kind: 'craft'; recipeId: string; count: number; minQuality?: Quality }
  | { kind: 'deliver'; npcId: string; item: ItemStack }
  | { kind: 'style'; npcId: string; slot: 'hair' | 'face' }
  | { kind: 'talk'; npcId: string }
  | { kind: 'equipLook'; slot: string }
  | { kind: 'build'; structureId: string };

interface Reward {
  gold?: number;
  items?: ItemStack[];
  skillXp?: { skill: SkillId; amount: number }[];
  affinity?: { npcId: string; amount: number };
  unlocks?: Unlock[];
}

interface QuestDef {
  id: string;
  kind: 'tutorial' | 'story' | 'request' | 'daily';
  title: string;
  steps: { objective: Objective; hint: string }[]; // 순서대로
  reward: Reward;
}

interface RequestTemplate {
  id: string;            // 'deliverFish'
  objectiveKind: Objective['kind'];
  skill: SkillId;
  npcTags: string[];     // 어울리는 주민 성격·직업
  durationDays: [number, number];
}

interface QuestProgress {
  questId: string;
  stepIndex: number;
  counts: number[];        // 단계 목표 진행 수
  acceptedGameDate: string;
  expiresGameDate?: string;
  npcId?: string;
  storyText?: string;      // AI가 만든 사연 (저장해서 재사용)
}

interface DailyState { gameDate: string; quests: QuestProgress[]; rerollUsed: boolean; stamps: number; weekId: string }
```

- 진행은 게임 이벤트 버스로: `onGather`, `onCatch`, `onCraft` … → 활성 의뢰 목표에 `count` 반영.

## 단계 (MVP → 이후)

1. **MVP**: 튜토리얼 1~8 (첫걸음 섬), 목표 표시·화살표, 이벤트 기반 진행, 저장·이어하기.
   - 수용 기준: 새 캐릭터로 들어가면 1단계가 뜬다. 꽃 3개 줍기 중 새로고침하면 그 단계에서 이어진다. 긴바지를 외형 칸에 등록하면 8단계 완료.
2. 일일 할 일 3개 + 도장, 05시 초기화.
3. 주민 의뢰 (템플릿 + 기본 대사). AI 사연 생성은 그 다음.
4. 호감도 이야기 의뢰, 게시판.

## 참고한 게임

- Palia: 주민마다 주간 원하는 물건과 하루 1회 선물, 고정 시각 초기화 → 템플릿 의뢰 + 05시 초기화. https://palia.wiki.gg/wiki/Gifting
- Coral Island: 마을 게시판 의뢰와 마을 등급 기여 → 게시판 + 주민 직접 의뢰 병행. https://coralisland.fandom.com/wiki/Town_Rank
- Stardew Valley: 첫 낚시는 놓치지 않게 보정 → 튜토리얼 낚시 실패 없음. https://stardewvalleywiki.com/Fishing

## 열린 질문

- 시작 섬 크기·이름 — 정리됨: 48×48(테스트 섬 재활용, 더 단순), 이름 "첫걸음 섬"(가칭).
- AI 사연 생성 실패 시 — 제안 기본값: 템플릿 기본 대사, 플레이 멈추지 않음.
- 의뢰 기한을 둘까? — 제안 기본값: 1~3일, 지나면 사라지되 벌칙 없음.
- 주간 도장 수 — 제안 기본값: 20개 (하루 3개 꼴).
