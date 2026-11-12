# 소리

> 맵마다 분위기 음악, 손맛 효과음. 외부 소리는 CC0만.

## 확정 사항

- 외부 소리는 CC0만, 출처는 루트 `CREDITS.md` ([ArtStyle.md](ArtStyle.md)).
- 본 맵 5개 + 첫걸음 섬 + 마을당 전투맵 1개 ([World.md](World.md)).

## 규칙과 수치

### 배경음악 (BGM)

| 맵 | 분위기 | 템포 | 낮/밤 |
| --- | --- | --- | --- |
| 첫걸음 섬 | 잔잔한 파도, 어쿠스틱 | 느림 | 1곡 |
| 에버그린 | 따뜻한 숲, 실로폰·우쿨렐레 | 보통 | 낮·밤 2곡 |
| 블루 코브 | 바닷바람, 휘파람 | 보통 | 낮·밤 |
| 단풍골 | 가야금 느낌 플럭 | 느림 | 낮·밤 |
| 구름 고원 | 바람, 피아노 | 느림 | 낮·밤 |
| 달빛 호숫가 | 몽환, 벨 | 느림 | 낮·밤 |
| 전투맵 일반 | 경쾌한 긴장 | 빠름 | 맵별 1곡 |
| 엘리트·보스방 | 보스 공용 1곡 + 최종 보스 | 빠름 | — |
| 실내(집·가게) | 맵 곡의 낮은 음량 버전 | — | — |

- 맵 이동 시 1초 교차 페이드. 같은 곡이면 끊지 않음.
- 비 오는 날: 음악 음량 70% + 빗소리 환경음.
- 루프 곡 1.5~3분. 형식 OGG(용량) + MP3 대체. 곡당 2MB 이하.
- 첫 재생은 사용자 입력 이후(브라우저 자동 재생 정책).

### 효과음 (SFX) 목록 — 1단계 우선

| 분류 | 소리 |
| --- | --- |
| 이동 | 발소리 4종(풀·길·모래·나무 바닥), 점프, 착지, 물 첨벙 |
| 전투 | 휘두르기, 타격(약·강), 콤보 4단 마무리, 피격, 몬스터 쓰러짐, 문 잠김·열림 |
| 채집 | 나무 흔들기, 열매 떨어짐, 줍기 |
| 채광 | 곡괭이 타격, 바위 부서짐 |
| 낚시 | 던지기, 찌 퐁당, 입질, 릴 감기, 낚음 |
| 제작·건축 | 망치질, 완성 반짝, 철거 퍽 |
| UI | 클릭, 창 열기·닫기, 토스트, 레벨업 팡파르(짧게), 해금 |
| 주민 | 말할 때 웅얼 음절(성격별 음높이), 감정 소리 4종 |
| 환경 | 바다, 바람, 새, 풀벌레(밤), 비 |

- 발소리는 바닥 글자(g p s w)로 고른다 ([Terrain.md](Terrain.md)).
- 같은 소리 반복 피로 방지: 재생마다 음높이 ±5% 무작위, 변형 2~3개.
- 동시 재생 상한 16. 같은 소리는 50ms 안 중복 재생 안 함.
- 3D 위치 소리: 몬스터·주민·환경만. 최대 거리 20m.

### 음량 설정

| 항목 | 기본 | 범위 |
| --- | --- | --- |
| 전체 | 80 | 0~100 |
| 음악 | 60 | 0~100 |
| 효과음 | 80 | 0~100 |
| 환경음 | 60 | 0~100 |
| 주민 목소리 | 70 | 0~100 |
| 창이 비활성일 때 음소거 | 켬 | 켬/끔 |

- 저장: 설정 데이터 ([Save.md](Save.md)).

### CC0 출처 후보

| 출처 | 쓸 곳 | 비고 |
| --- | --- | --- |
| Kenney (kenney.nl) Audio 팩 | UI, 타격, 발소리 | 전부 CC0 |
| OpenGameArt (CC0 필터) | BGM, 효과음 | 작품마다 라이선스 확인 필수 |
| Freesound (CC0 필터) | 환경음, 낚시 | CC-BY 섞여 있음 → CC0만 |
| Sonniss GDC 무료 묶음 | 효과음 | 로열티 프리(CC0 아님). 약관 확인 후 사용 여부 결정 |

- 구현: Howler.js 또는 Web Audio 직접. 제안: Howler.js(MIT, 작음).

## 데이터 모델

```ts
type AudioBus = "music" | "sfx" | "ambient" | "voice";

interface SoundDef {
  id: string; // "sfx.step.grass"
  bus: AudioBus;
  files: string[]; // 변형들, 무작위 선택
  volume: number; // 0~1 기본 음량
  pitchJitter: number; // 0.05 = ±5%
  is3d: boolean; // 위치 소리 여부
}

interface MapMusic {
  mapId: string;
  day: string; // 곡 id
  night?: string;
  combat?: string;
}

interface AudioSettings {
  master: number; // 0~100
  music: number;
  sfx: number;
  ambient: number;
  voice: number;
  isMutedWhenHidden: boolean; // 창 비활성 시 음소거
}
```

## 단계 (MVP → 이후)

1. **MVP**: 에버그린 BGM 1곡, 발소리(풀·길), 점프, 공격, 줍기, UI 클릭. 음악·효과음 음량 2개.
   - 수용: 첫 클릭 뒤 음악이 나온다. 음량 0이면 무음. 새로고침 후 음량 유지.
2. 맵별 BGM + 교차 페이드, 채집·채광·낚시 효과음.
3. 3D 위치 소리, 환경음, 주민 웅얼 목소리.
4. 낮·밤 곡, 비 효과.

## 참고한 게임

- Animal Crossing: 시간대별 BGM으로 하루 흐름을 소리로 느끼게 함. 낮·밤 곡에 반영. https://nookipedia.com/wiki/Music
- Animal Crossing: 의미 없는 음절 목소리(Animalese)로 TTS 없이 말하는 느낌. 주민 웅얼 음절에 반영. https://nookipedia.com/wiki/Animalese
- Kenney: 게임용 CC0 효과음 묶음. https://kenney.nl/assets/category:Audio

## 열린 질문

- BGM을 직접 의뢰(작곡)할까, CC0만 쓸까? — 제안 기본값: MVP는 CC0, 출시 전 마을 곡만 의뢰.
- 낮·밤 곡 2개씩 필요? — 제안: 마을만 2곡, 전투맵은 1곡.
