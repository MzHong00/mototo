# 주민 NPC

> 스스로 하루를 사는 주민. 생활은 규칙(로컬), 말과 기억은 LLM(서버 경유). 1인 게임의 고립감을 채운다.

## 확정 사항

- 심즈처럼 스스로 생활한다. **AI(LLM)를 적극 활용**해 실제 사람처럼 대화·상호작용한다.
- 외형은 캐릭터 베이스 메시(치비 몸체 1개) 커스텀. 파츠 조합 + 색 → 파츠 에셋이 매우 많이 필요 ([Character.md](Character.md), [AssetPipeline.md](AssetPipeline.md)).
- NPC는 철거 대상이 아니다 ([Village.md](Village.md)).

## 규칙과 수치

### 역할 나누기 (핵심 구조)

| 층 | 담당 | 실행 위치 | 이유 |
| --- | --- | --- | --- |
| 생활 | 욕구·일과표·장소·이동·행동 고르기 | 브라우저(규칙) | 매 프레임 필요. 무료·즉시·결정적 |
| 말 | 대화 답변, 인사 한마디 | 서버 → LLM | 사람 같은 말 |
| 기억 | 대화 요약, 관계 요약 | 서버 → LLM (하루 1회 정리) | 토큰 절약 |
| 의뢰 | 의뢰 문장 꾸미기 | 규칙이 내용 결정 → LLM이 말투만 | 보상·조건은 게임이 통제 |

- LLM은 **게임 상태를 바꾸지 못한다.** 호감도·아이템·의뢰 보상은 규칙 코드만 바꾼다. LLM 출력은 "말"과 "감정 태그" 뿐.

### 욕구 (Need)

| 욕구 | 하락/1시간 | 채우는 곳 |
| --- | --- | --- |
| 배고픔 `hunger` | -8 | 집 식탁, 식당 |
| 기력 `energy` | -5 (밤 -8) | 침대 |
| 사교 `social` | -6 | 광장, 다른 주민, **플레이어** |
| 재미 `fun` | -4 | 취미 장소(낚시터, 벤치, 꽃밭) |

- 값 0~100. 시작 70. 30 아래면 "급함".
- 행동 고르기(유틸리티 방식): 장소마다 `채워주는 욕구·양`을 광고 → 점수 = Σ(욕구 부족분 × 채움양) ÷ 거리 보정. 상위 3개 중 무작위 1개(뻔함 방지).
- 일과표가 우선. 일과 칸이 "자유"일 때만 욕구로 고른다. 욕구 20 아래면 일과를 끊고 채우러 간다.

### 일과표 (Schedule)

- 하루를 시각 블록으로 나눈다(시각은 [Time.md](Time.md)의 실제 시각 연동). 예: 06 기상 → 07 아침 → 09 일(가게) → 12 점심 → 13 일 → 17 자유 → 20 저녁 → 22 잠.
- 주민마다 직업형 템플릿 1개 + 요일 변형 1개. 비 오는 날 변형(실내).
- 플레이어가 없는 맵의 주민은 **시뮬 생략**: 맵에 들어올 때 현재 시각 블록 위치로 바로 배치.

### 대화

| 항목 | 값 |
| --- | --- |
| 모델 | Claude Haiku 5.5 (`claude-haiku-5-5`), 입력 $0.10 / 출력 $0.50 per 1M |
| 답변 길이 | 한국어 1~3문장, `max_tokens` 160 |
| 노력 | `effort: "low"` (잡담은 깊은 생각 불필요) |
| 입력 구성 | [고정] 세계 규칙 + 주민 성격 카드 → (캐시) / [변동] 관계 요약 + 최근 기억 5개 + 지금 상황 + 대화 최근 6턴 |
| 출력 형식 | JSON `{ text, emotion }` (emotion: happy·sad·angry·shy·neutral → 표정·말풍선 아이콘) |
| 1회 대화 | 최대 10턴. 넘으면 주민이 자연스럽게 마무리 |
| 지연 목표 | 첫 글자 1.5초 이내(스트리밍). 3초 넘으면 "음..." 말풍선 |
| 입력 | 자유 입력 (최대 80자) + 빠른 선택지 3개(규칙이 생성: 인사·선물·의뢰) |

- 비용 추정: 1턴 ≈ 입력 1,500 + 출력 100 토큰 → 약 $0.0002. 하루 100턴이어도 $0.02. (모델·가격은 구현 시점에 다시 확인)

### 기억 (요약 방식)

- Smallville처럼 "모든 기록 + 검색"은 무겁다. **하루 1회 요약**으로 줄인다.
- 대화가 끝나면 원문을 임시 보관 → 하루 초기화 때 LLM이 주민별 "오늘의 기억" 1~3줄 + 중요도(1~5)로 요약.
- 주민당 기억 30개 상한. 넘으면 중요도 낮고 오래된 것부터 버림. 중요도 5(생일 축하, 큰 선물)는 고정.
- 관계 요약 1문단(200자): 주 1회 기억들로 다시 씀. ("플레이어는 낚시를 좋아하고 나에게 사과를 자주 준다")
- 규칙 사건도 기억이 된다(LLM 없이 템플릿): 선물 받음, 의뢰 완료, 생일.

### 호감도

| 단계 | 점수 | 열리는 것 |
| --- | --- | --- |
| 0 낯섦 | 0~99 | 인사만 |
| 1 아는 사이 | 100~299 | 자유 대화, 의뢰 |
| 2 친구 | 300~599 | 주민 집 방문, 레시피·파츠 선물 받음 |
| 3 단짝 | 600~999 | 이벤트 장면 1개, 같이 산책 |
| 4 소중한 사람 | 1000 | 특별 이벤트, 고유 외형 파츠 해금 |

- 오르는 법(규칙만): 하루 첫 대화 +10, 선물 좋음 +30 / 보통 +10 / 싫음 -20, 의뢰 완료 +40, 생일 선물 ×3.
- 선물 하루 1회/주민. 대화 점수는 **LLM 판단 없음**(조작·주입 방지).
- 7일 안 만나면 하루 -2 (단계 하한 아래로는 안 내려감).
- 단계 이벤트는 사람이 쓴 짧은 장면 + LLM이 대사만 변주.

### 의뢰 생성

- 규칙이 정함: 종류(가져오기·잡기·배달) × 대상 아이템(주민 취향·현재 맵에서 구할 수 있는 것) × 수량 × 보상.
- LLM은 부탁 문장만 쓴다. 실패 시 템플릿 문장.
- 주민당 동시 1개, 하루 마을 전체 3개 ([Quests.md](Quests.md)).

### 비용·지연 대책

| 대책 | 내용 |
| --- | --- |
| 프롬프트 캐시 | 고정부(세계 규칙 + 성격 카드)를 앞에 두고 캐시. 변동부는 뒤 |
| 짧은 응답 | 1~3문장, `max_tokens` 160 |
| 주민 수 상한 | 맵당 상주 6명, 초기 전체 12명 (첫걸음 섬 뱃사공 1 + 에버그린 3 + 나머지 마을 2명씩, [Village.md](Village.md)) |
| 인사 캐시 | "지나가며 한마디"는 LLM 안 씀. 주민별 사전 생성 대사 20개 풀에서 고름(하루 1회 서버에서 갱신) |
| 사용량 제한 | 플레이어당 하루 300턴, 분당 10턴. 넘으면 오프라인 대사 |
| 오프라인 대체 | 서버 실패·오프라인·한도 초과 → 성격별 템플릿 대사(상황 태그로 고름). 게임 진행은 막히지 않음 |

### 서버 프록시 (1인 게임이어도 필요)

- API 키를 브라우저에 두면 누구나 훔쳐 쓴다 → **작은 서버**(서버리스 `POST /npc/chat`, `POST /npc/summarize`)가 키를 들고 대신 호출. 익명 id + 서명 토큰으로 횟수 제한.
- 서버가 프롬프트를 조립. 브라우저는 `npcId`, 플레이어 입력, 상황 태그만 보냄(시스템 프롬프트 변조 불가).

### 안전

- 프롬프트 주입: 플레이어 입력은 `<player>` 태그로 감싸 데이터로만. LLM은 상태 변경 권한 없음.
- 부적절한 출력: 금칙어 필터 → 템플릿 대사로 교체. 전체 이용가 기준. 캐릭터 이탈("AI입니다")·형식 오류는 폐기.
- 개인정보: 입력의 전화번호·이메일 모양은 서버에서 가림.

### 외형 생성

- `NpcLook` = 파츠 id 조합 + 색. 사람 손으로 12명 지정(초기). 이후 무작위 생성기: 성별 → 슬롯별 파츠 가중치 → 색 팔레트 조화 규칙([ArtStyle.md](ArtStyle.md)).
- 주민 전용 파츠는 호감도 4단계에서 플레이어에게 해금.

## 데이터 모델

```ts
type NeedKind = "hunger" | "energy" | "social" | "fun";
type NeedState = Record<NeedKind, number>; // 0~100

interface NpcDef {
  id: string; name: string;          // "npc-mira", 표시 이름
  homeMapId: string; homeSpotId: string; // World.md MapDef id, 집 자리
  look: NpcLook;
  personality: string; // 성격 카드 (LLM 고정부, 200자)
  speechStyle: string; // 말투 예: "반말, 느긋함"
  likes: string[]; dislikes: string[]; // 아이템 id
  birthday: { season: number; day: number }; // 생일
  scheduleId: string; // 일과표 템플릿
  fallbackLines: Record<string, string[]>; // 상황 태그 → 오프라인 대사
}

interface NpcLook {
  gender: "female" | "male";
  parts: Partial<Record<"hair" | "face" | Exclude<EquipSlot, "weapon">, string>>; // 슬롯 이름은 Character.md와 같음
  colors: Record<string, string>; // 슬롯 → 색
}

interface ScheduleBlock {
  startHour: number; // 0~23
  activity: "sleep" | "eat" | "work" | "free" | "hobby";
  spotId: string | null; // null이면 욕구로 고름
}

interface Schedule { id: string; days: ScheduleBlock[]; rainy?: ScheduleBlock[] }

interface Spot {
  id: string;
  mapId: string;
  pos: [number, number]; // 칸 좌표
  satisfies: Partial<Record<NeedKind, number>>; // 광고: 시간당 채움양
}

interface NpcMemory {
  day: number; // 게임 날짜
  text: string; // 요약 1줄
  importance: 1 | 2 | 3 | 4 | 5;
  source: "chat" | "gift" | "quest" | "event";
}

interface NpcRuntime {
  npcId: string;
  needs: NeedState;
  affinity: number; // 0~1000
  memories: NpcMemory[]; // 최대 30
  relationSummary: string; // 200자
  lastTalkDay: number; giftedToday: boolean;
  pendingChatLog: string[]; // 하루 요약 전 원문
}

const NPC_LIMITS = {
  MAX_PER_MAP: 6,
  MAX_MEMORIES: 30,
  CHAT_MAX_TURNS: 10,
  CHAT_MAX_TOKENS: 160,
  DAILY_TURNS: 300,
  INPUT_MAX_CHARS: 80,
} as const;
```

## 단계 (MVP → 이후)

1. **MVP**: 에버그린 주민 3명. 일과표만(욕구 없음)으로 걷기. 상호작용 키 → 대화창 → 템플릿 대사. 호감도 + 선물.
   - 수용: 시각이 바뀌면 주민이 정해진 장소로 걸어간다. 선물로 호감도가 오르고 저장된다.
2. 서버 프록시 + LLM 대화(Haiku 5.5). 오프라인 대체. 사용량 제한.
   - 수용: 키가 브라우저 번들·네트워크 탭에 없다. 서버 끄면 템플릿 대사로 계속 진행.
3. 욕구 + 장소 광고. 하루 요약 기억, 관계 요약.
   - 수용: 어제 준 선물을 오늘 대화에서 언급한다.
4. 의뢰 생성, 호감도 이벤트, 주민 12명, 외형 무작위 생성기.
5. 주민끼리 대화(규칙으로 만남 → LLM 한 줄씩, 멀리서 말풍선만).

## 참고한 게임

- Generative Agents(Smallville): 관찰→기억→반성→계획 구조가 믿음직함을 만든다. 우리는 반성을 "하루 요약"으로 축소. https://arxiv.org/abs/2304.03442
- The Sims: 물건이 욕구 충족을 "광고"하고 캐릭터가 점수로 고르는 단순한 유틸리티 AI. 상위 후보 무작위로 뻔함 방지. https://www.kmjn.org/notes/sims2_ai.html
- Stardew Valley: 하트당 점수, 주 단위 선물 제한, 안 만나면 감소. 단계별 이벤트 장면. https://stardewvalleywiki.com/Friendship
- Animal Crossing: 성격 유형별 말투로 적은 대사로도 개성. 성격 카드 + 말투 필드로 반영. https://nookipedia.com/wiki/Personality
- Inworld·Convai: 클라우드 대화 엔진, 스트리밍으로 체감 지연 감소, 성격·지식·기억 모듈 분리. https://app.cinevva.com/guides/ai-npcs-dialogue

## 열린 질문

- 자유 입력을 허용할까, 선택지만 줄까? — 제안 기본값: 자유 입력 + 선택지 3개 병행.
- LLM 비용은 누가 내나(무료 한도 vs 유료)? — 제안: 하루 300턴 무료, 이후 템플릿.
- 주민이 다른 주민 험담·연애 같은 관계를 가질까? — 제안: MVP 없음, 5단계에서 친구 관계만.
- 주민이 떠나거나 새로 이사 올까? — 제안: 떠나지 않음. 건축 기술로 집을 지으면 새 주민 이사.
- 음성(TTS)? — 제안: 없음. 동물의숲식 웅얼 효과음 ([Audio.md](Audio.md)).
