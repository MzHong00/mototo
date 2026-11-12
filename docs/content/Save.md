# 저장

> 지금은 브라우저 저장(localStorage). 저장 범위를 넓히고, 버전·마이그레이션 규칙을 처음부터 박아 둔다. 서버·클라우드는 나중.

## 확정 사항

- 1인 게임. 캐릭터는 지금 localStorage에 저장 (`mototo-character-v1`, zustand `persist`).
- 다인·서버는 나중 ([Social.md](Social.md)). 단, NPC LLM 대화용 작은 서버 프록시는 필요 ([Npc.md](Npc.md)).

## 규칙과 수치

### 저장 범위

| 묶음(키) | 내용 | 크기 예상 | 저장 시점 |
| --- | --- | --- | --- |
| `character` | 외형, 닉네임, 장비·외형 칸 | 2KB | 변경 즉시 |
| `progress` | 기술 레벨·경험치, 해금 목록, 전투 직업, 콤보 조립 | 5KB | 자동 저장 |
| `inventory` | 가방, 창고, 골드 | 10KB | 자동 저장 |
| `world` | 현재 맵·위치, 방문한 맵, 게임 날짜·시각, 나날빛 | 2KB | 맵 이동 + 자동 |
| `village` | 마을별 구조물 배치, 철거 기록, 동물, 집·가구 | 50~300KB | 건축 완료 즉시 |
| `npc` | 주민별 호감도, 기억 30개, 관계 요약, 의뢰 | 주민당 6KB → 12명 72KB | 대화 종료 + 하루 초기화 |
| `settings` | 키 배치, 음량, 그래픽 | 2KB | 변경 즉시 |

- 묶음을 나눠 저장한다(한 곳 바뀔 때 전체를 다시 쓰지 않음). 키 이름: `mototo:<묶음>`.
- 모든 묶음은 같은 형태로 감싼다: `{ v: 버전, savedAt, data }`.

### 자동 저장

| 규칙 | 값 |
| --- | --- |
| 주기 | 60초마다 바뀐 묶음만 (dirty 표시) |
| 즉시 저장 | 맵 이동, 건축 완료, 레벨업, 해금, 대화 종료, 창 닫기(`visibilitychange` hidden) |
| 전투 중 | 전투맵 방 안에서는 주기 저장 보류, 방 클리어 시 저장 |
| 표시 | 저장 중 오른쪽 아래 작은 아이콘 1초 |
| 실패 | 용량 초과 → 경고 토스트 + 내보내기 권유 |

### 버전·마이그레이션

- 저장 형식 버전 `SAVE_VERSION`(정수). 형식이 바뀌면 +1, 마이그레이션 함수 1개 추가.
- 불러오기: 저장 v < 현재면 `migrations[v] → v+1`을 차례로 실행. v > 현재(미래 버전)면 불러오지 않고 안내.
- 마이그레이션 전 원본을 `mototo:backup:<묶음>`에 1벌 보관. 실패하면 원본 유지 + 오류 안내.
- 불러온 데이터는 스키마 검사(타입 가드). 모르는 아이템 id는 버리지 말고 "알 수 없는 물건"으로 가방에 남김.
- 기존 `mototo-character-v1` → 첫 마이그레이션(`0 → 1`)에서 `mototo:character`로 옮김.
- 테스트: 버전별 샘플 저장 파일을 남기고 "옛 저장 → 현재" 변환 테스트.

### IndexedDB 전환 기준

- localStorage는 동기·문자열·약 5MB 한도. 아래 중 하나면 IndexedDB(idb-keyval 같은 작은 래퍼)로.
  - 전체 저장이 **1MB 초과** (마을 5곳을 다 꾸미면 넘을 수 있음)
  - 저장 1회가 **16ms 초과**(프레임 끊김)
  - 스크린샷·사진 같은 바이너리 저장 필요
- 제안: `village`, `npc`는 2단계부터 IndexedDB. 나머지는 localStorage 유지 가능. 저장 계층은 `SaveStorage` 인터페이스 하나로 감싸 교체 쉽게.

### 내보내기·가져오기

- 설정 창에서 JSON 파일로 내보내기/가져오기 (기기 이전, 백업). 가져오기도 마이그레이션 거침.

### 나중: 클라우드

1. 익명 계정(기기 id) → 2. 이메일/소셜 로그인 연결 → 3. 서버 저장.
- 충돌 규칙: 묶음별 `savedAt` 최신이 이김 + 충돌 시 "어느 쪽을 쓸까요?" 선택 창.
- 서버 저장 전에는 치트 방지를 하지 않는다(1인 게임이라 의미 없음).

## 데이터 모델

```ts
const SAVE_VERSION = 1;
const SAVE_KEY_PREFIX = "mototo:";
const AUTOSAVE_INTERVAL_MS = 60_000;

type SaveSlice = "character" | "progress" | "inventory" | "world" | "village" | "npc" | "settings";

interface SaveEnvelope<T> {
  v: number; // 저장 형식 버전
  savedAt: number; // ms
  playerId: string; // 익명 id (다인·클라우드 대비)
  data: T;
}

type Migration = (old: unknown) => unknown; // v → v+1

interface SaveStorage {
  /** 묶음 읽기 (없으면 null) */
  read: (slice: SaveSlice) => Promise<SaveEnvelope<unknown> | null>;
  /** 묶음 쓰기 */
  write: (slice: SaveSlice, env: SaveEnvelope<unknown>) => Promise<void>;
}
```

## 단계 (MVP → 이후)

1. **MVP**: 봉투 형식 + 버전 + 마이그레이션 틀. `character` 옮기기, `inventory`·`progress`·`world`·`settings` 추가. 60초 자동 저장 + 창 숨김 시 저장.
   - 수용: 옛 `mototo-character-v1` 저장이 있는 브라우저에서 캐릭터가 유지된다. 탭을 닫았다 열면 가방·위치가 그대로다.
2. `village`·`npc` 저장, IndexedDB 계층, 내보내기·가져오기.
   - 수용: 마을 5곳 배치 저장 시 프레임 끊김 없음(16ms 이하).
3. 익명 계정 + 클라우드 저장.

## 참고한 게임

- Factorio: 저장 형식 버전마다 순서대로 마이그레이션 스크립트 적용, 모드 데이터도 같은 방식. https://lua-api.factorio.com/latest/auxiliary/migrations.html
- Stardew Valley: 하루가 끝날 때만 저장해 단순화(대신 중간 손실). 우리는 자동 저장으로 손실 최소화. https://stardewvalleywiki.com/Saves
- MDN Storage quotas: 브라우저 저장 한도와 삭제 정책. https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria

## 열린 질문

- 저장 슬롯 여러 개(캐릭터 여러 명)? — 제안 기본값: 1개. 클라우드 이후 3개.
- 브라우저 저장이 지워질 위험 안내? — 제안: `navigator.storage.persist()` 요청 + 주 1회 내보내기 알림(설정에서 끔).
