# 전투

> 숨겨진 조건으로 얻는 **전투 직업** + 같은 키 연타로 나가는 **4단 콤보 스킬**을 내 맘대로 조립해 싸운다.

## 확정 사항

- 전투 직업은 처음에 고르지 않는다. 모험 중 **숨겨진 조건**으로 해금. 직업도 기술의 하나 ([Skills.md](Skills.md)).
- 스킬 개수는 최소. 스킬 하나 = **4단 콤보** (A1→A2→A3→A4, 같은 키 연타).
- 단계마다 **변형 2개 이상** 중 하나를 골라 나만의 기본형 콤보를 조립.
- 이후 **B, C, D 스킬**을 차례로 해금. 각각 4단 콤보 + 단계별 변형.
- 무기는 능력치 장비. 외형 칸 등록 가능 ([Character.md](Character.md)). 무기 에셋 있음(몽둥이 등).
- 몬스터: 일반 · **엘리트** · **보스**. 마을마다 전투맵 1개, 갈래·엘리트방·보스방 ([World.md](World.md)).
- 키는 고정하지 않는다. 스킬도 자판에 끌어 놓는다 ([Controls.md](Controls.md)).

## 규칙과 수치

### 1. 콤보 흐름

한 단계 = `준비 → 판정 → 후딜` 세 구간.

- 입력 버퍼 **0.2초**: 단계 끝나기 0.2초 안의 입력은 저장 → 바로 다음 단계.
- 콤보 유지 **0.6초**: 후딜 뒤 0.6초 안에 누르면 다음 단계, 넘기면 1단계. A4 뒤엔 A1.
- 한 단계 0.35~0.7초(1·2단 짧게, 4단 길고 강하게). 단계 배율 **1.0 / 1.1 / 1.25 / 1.6**.

- 공격 중 이동 입력: 판정 전까지만 방향 전환 허용(조준 보정). 이후 고정.
- 맞아도 콤보 단계는 유지되지만 행동은 끊긴다(경직). 콤보 유지 시간은 그대로 흐른다.

### 2. 캔슬 규칙

| 캔슬 | 언제 | 결과 |
| --- | --- | --- |
| 구르기(회피) | 판정 이후 후딜 아무 때 | 콤보 단계 **유지**. 구른 뒤 0.6초 안에 이어 치기 가능 |
| 점프 | 후딜 마지막 50% | 콤보 리셋 |
| 다른 스킬 키 | 판정 이후 | 그 스킬 1단계로 시작. 이전 스킬 단계는 리셋 |
| 준비 구간 | 캔슬 불가 | 신중하게 누르게 하는 무게감 |

- MVP는 구르기 없이 점프 캔슬만. 구르기는 2단계에서 추가.

### 3. 단계별 변형 (StepVariant)

변형은 **모양**과 **효과 태그**로 만든다. 새 변형 = 데이터 한 줄.

| 모양 | 판정 범위 | 특징 |
| --- | --- | --- |
| 찌르기 | 앞 좁고 길게 (폭 0.6m, 길이 2.2m) | 한 놈 집중, 피해 높음 |
| 베기 | 앞 부채꼴 120°, 1.6m | 여럿 맞춤, 피해 보통 |
| 띄우기 | 앞 1.4m | 일반 몹 공중에 띄움(0.8초 무력화). 엘리트·보스는 경직만 |
| 내려찍기 | 둥글게 반경 1.8m | 느리지만 넓음. 넉다운 |
| 돌진 | 앞으로 3m 이동하며 타격 | 거리 좁히기 |
| 회전 | 360°, 1.5m | 둘러싸였을 때 |

효과 태그: `knockback` 밀침, `launch` 띄움, `stagger` 경직, `guardBreak` 방어 깨기, `lifesteal` 흡혈(소량).

- 단계마다 변형 2~3개. 처음엔 각 단계 변형 1개만 열려 있다.
- 변형 교체는 전투 밖(마을·전투맵 입구·휴식 지점) 아무 때나 무료.

### 4. 변형 해금

- 직업 Lv 5·10·15…마다 변형 1개 / 행동 누적("띄우기로 50번" → 4단 '내리꽂기') / 엘리트·보스 전리품 '비급 쪽지'.
- 해금 조건은 기술창에서 **물음표 + 힌트 한 줄**로 보여 준다(완전 비공개 아님).

### 5. 스킬 해금 흐름 (A→B→C→D)

| 스킬 | 해금 조건 | 성격 예 (몽둥이) |
| --- | --- | --- |
| A 기본형 | 직업 해금 시 | 근접 연타 |
| B | 직업 Lv 10 | 범위·밀치기 |
| C | 직업 Lv 20(숙련) + 보스 1마리 처치 | 돌진·이동기 |
| D | 직업 Lv 40(장인) + 보스 3마리 처치 | 느리고 강한 마무리 |

- 직업 해금 전: 누구나 **맨손/무기 기본 공격**(4단 고정, 변형 없음). 무기 착용 요구 Lv 1짜리만 쓸 수 있다.
- 직업 = 기술 `job:<id>` (Lv 1~100, 곡선은 [Skills.md](Skills.md)). 그 직업 무기로 몹을 처치·타격해야 오른다.
- 무기 착용 조건은 **그 무기 직업의 레벨**. 방어구는 레벨 제한 없음.

### 6. 숨겨진 직업 해금 — 방식 제안

- ① 행동 누적(몰래 숫자 셈): 자연스럽고 구현 쉬움 / 발견 재미 약함.
- ② 장소·아이템(낡은 몽둥이를 바위 제단에): 탐험 보상 / 못 찾으면 막힘.
- ③ 숨은 NPC 시험(전투맵 구석 은둔 NPC): AI 주민과 잘 맞음 / 제작 비용.

**추천: ①+③ 혼합.** 자격(행동 누적) 충족 → 주민이 **소문** → 숨은 NPC의 짧은 시험(몹 처치·콤보 성공) → 해금. ②는 특수 직업(나중).

### 7. 초기 직업 예시

| 직업 | 무기 | 자격(행동 누적) | 성격 |
| --- | --- | --- | --- |
| 몽둥이꾼 | 몽둥이 | 몽둥이로 몹 30마리 처치 | 느리고 묵직, 경직·넉다운 |
| 칼잡이 | 한손검 | 검으로 콤보 4단 100회 | 빠른 연타, 균형형 |
| 창꾼 | 창 | 찌르기로 몹 30마리 처치 | 긴 사거리, 찌르기·돌진 |
| 맨주먹 | 장갑/맨손 | 무기 없이 몹 30마리 처치 | 짧고 매우 빠름, 회피 캔슬 강함 |

- 여러 직업 동시 보유 가능. **장착 무기 = 현재 직업**. 무기 에셋 목록을 보고 직업 확정.

### 8. 능력치와 피해 공식

능력치는 **이 6개뿐**이다. 장비(Character·Items)도 이 키만 쓴다. 캐릭터 레벨은 없다.

| 키 | 능력치 | 기본값 | 출처 |
| --- | --- | --- | --- |
| `hp` | 체력 | 100 + 장착 직업 Lv×2 | 직업 기술 레벨·장비 |
| `atk` | 공격 | 10 | 무기 위주 |
| `def` | 방어 | 0 | 옷·신발·모자 |
| `crit` | 치명 확률 | 5% (피해 ×1.5) | 장신구 |
| `speed` | 이동속도 | +0% (최대 +30%) | 신발·망토 |
| `gather` | 생활 보너스 | +0%p (2배 획득 확률에 더함) | 장신구·모자 |

```
피해 = ATK × 무기배율 × 단계배율 × 변형배율 × (100 / (100 + DEF)) × (치명 ? 1.5 : 1)
최소 1, 소수점 버림, ±5% 흔들림
```

- 방어는 비율 감소(DEF 100 = 피해 절반). 피격 후 0.5초 무적. 히트스톱 0.05초(4단 0.1초).

### 9. 쓰러졌을 때

- HP 0 → 쓰러짐 연출 2초 → 그 마을 **전투맵 입구 앞**(필드면 마을 광장 `@`)에서 HP 100%로 일어남.
- 벌칙: **없음.** 전리품·장비·골드·경험치 모두 유지. 전투맵 진행(방 위치)만 초기화 ([World.md](World.md)).
  - 통일 이유: 1인·가벼운 생활게임 톤 → 덜 가혹한 쪽(World·Economy 안과 맞춤).
- 마을은 안전 지대, 전투 없음. 방 종류·갈래·문 규칙은 [World.md](World.md), 휴식방에서 변형 교체·회복.

### 10. 몬스터 등급

| 등급 | HP 배율 | 공격 배율 | 패턴 | 보상 |
| --- | --- | --- | --- | --- |
| 일반 | ×1 | ×1 | 1~2개, 단순 | 재료 전리품, 직업 경험치 |
| 엘리트 | ×4 | ×1.5 | 일반 패턴 + 1개, 경직 저항, 빛나는 테두리·이름표 | 희귀 전리품, 비급 쪽지 확률, 장비 |
| 보스 | ×20 | ×2 | 3~5개, 체력 50%에서 2페이즈 | 보스 전용 재료, 스킬 해금 조건, 외형 장비 |

- 엘리트는 따로 만들지 않고 **일반 몹 + 수식어**(예: 단단한·빠른·분열하는)로 만든다.
- 띄우기·넉다운은 일반 몹만. 엘리트는 경직만, 보스는 경직 게이지가 찼을 때만 휘청(3초 딜 타임).

### 11. 보스 패턴 원칙

- **예고**: 큰 공격은 준비 0.6초 이상 + 바닥 범위 표시. **틈**: 큰 공격 뒤 1~2초 빈틈(4단까지 칠 시간).
- **읽힘**: 패턴마다 고유 동작·소리. **페이즈**: 50%에서 패턴 +1, 속도 ×1.2, 새 패턴은 쉬운 버전 먼저.
- **페이크 금지(초기)**: 예고 후 타이밍 비틀기는 후반 보스만.

## 데이터 모델

```ts
type VariantShape = 'thrust' | 'slash' | 'launch' | 'slam' | 'dash' | 'spin';
type HitTag = 'knockback' | 'launch' | 'stagger' | 'guardBreak' | 'lifesteal';
type WeaponKind = 'club' | 'sword' | 'spear' | 'fist';   // Character.md 무기도 이 타입
type StatKey = 'hp' | 'atk' | 'def' | 'crit' | 'speed' | 'gather';
type Stats = Partial<Record<StatKey, number>>;
type MonsterRank = 'normal' | 'elite' | 'boss';

type UnlockCond =
  | { kind: 'jobLevel'; level: number }
  | { kind: 'counter'; counterId: string; count: number } // 행동 누적
  | { kind: 'item'; itemId: string }                      // 비급 쪽지
  | { kind: 'bossKills'; count: number };

interface StepVariant {
  id: string; name: string;      // 'club_a1_slash', '옆으로 후리기'
  shape: VariantShape;
  damageMul: number;             // 변형배율
  windup: number; active: number; recovery: number; // 초
  hitbox: { range: number; width?: number; angle?: number; radius?: number; dashDist?: number };
  tags: HitTag[];
  anim: string;
  unlock: UnlockCond | null;     // null = 처음부터
}
interface ComboStep { index: 1 | 2 | 3 | 4; stepMul: number; variants: string[] } // 변형 2개 이상
interface SkillDef {
  id: string; job: string; slot: 'A' | 'B' | 'C' | 'D'; name: string;
  steps: [ComboStep, ComboStep, ComboStep, ComboStep];
  unlock: UnlockCond[];          // 모두 만족 시
}
interface JobDef {
  id: string; name: string;      // 'clubber', '몽둥이꾼'
  weapon: WeaponKind;
  qualify: UnlockCond;           // 숨은 자격
  trialNpc: string | null;       // 시험 내는 숨은 NPC
  skills: string[];              // A~D
}

/** 저장 (직업 레벨·경험치는 Skills.md의 SkillProgress `job:<id>`에) */
interface PlayerCombat {
  unlockedJobs: string[];
  unlockedVariants: string[];
  combos: Record<string, [string, string, string, string]>; // skillId → 단계별 고른 변형
  counters: Record<string, number>;   // 행동 누적
  bossKills: string[];
}

/** 런타임 */
type ComboPhase = 'idle' | 'windup' | 'active' | 'recovery' | 'linger';
interface ComboState { skillId: string | null; step: 0 | 1 | 2 | 3 | 4; phase: ComboPhase; timer: number; buffered: string | null }

const RANK_MUL: Record<MonsterRank, { hp: number; atk: number }> = {
  normal: { hp: 1, atk: 1 }, elite: { hp: 4, atk: 1.5 }, boss: { hp: 20, atk: 2 },
};
export const COMBO = { bufferSec: 0.2, lingerSec: 0.6, stepMul: [1, 1.1, 1.25, 1.6], iFrameSec: 0.5 } as const;
export const BASE_STATS = { hp: 100, hpPerJobLv: 2, atk: 10, def: 0, crit: 0.05, critMul: 1.5, speedMax: 0.3 } as const;
```

## 단계 (MVP → 이후)

| 단계 | 만들 것 | 수용 기준 |
| --- | --- | --- |
| 1 | 기본 공격 4단 콤보(변형 없음), 입력 버퍼·유지 시간, 허수아비 + 일반 몹 1종, HP·피해 공식, 쓰러짐 | 연타 시 1→4단이 끊김 없이 나가고, 0.6초 쉬면 1단부터. 피해 숫자가 공식대로 뜬다 |
| 2 | 직업 1개(몽둥이꾼) + A 스킬, 단계별 변형 2개, 변형 고르기 창, 구르기 캔슬 | 변형을 바꾸면 범위·모션이 실제로 바뀐다. 저장 후 새로고침해도 유지 |
| 3 | 행동 누적 → 소문 → 숨은 NPC 시험 해금, 엘리트 수식어, 보스 1마리(예고·틈·2페이즈) | 조건 미달 시 직업이 안 보이고, 충족 시 소문이 뜬다. 보스 큰 공격은 모두 범위 표시 |
| 4 | 직업 4개, B·C·D 스킬, 비급 쪽지, 보스 마을별 1마리 | |

## 참고한 게임

- Lost Ark: 스킬마다 단계별 선택지(트라이포드) 중 1개 고르고 무료로 바꿈 → 변형 교체 무료. https://www.thegamer.com/lost-ark-tripod-skill-upgrades-explained/
- Hades: 대장장이 망치가 같은 공격의 패턴 자체를 바꿈 → 변형은 수치가 아닌 모양을 바꾼다. https://www.gamepressure.com/hades/daedalus-hammer/z1d9ca
- Mabinogi: 콤보 카드 뒤 순서일수록 보너스 증가(예 0→12→30→55%) → 단계배율 증가. https://wiki.mabinogiworld.com/view/Combo_Card
- Devil May Cry 5: 기술을 상점에서 사서 무기별 동작을 늘림 → 변형 해금이 성장 보상. https://shacknews.com/article/110182/skills-abilities-and-moves-in-devil-may-cry-5
- Monster Hunter: 같은 버튼 연타 콤보 + 회피로 이어가기 → 구르기 캔슬 시 콤보 유지. https://www.icy-veins.com/monster-hunter-wilds/long-sword-guide
- Dead Cells: 엘리트 = 일반 몹 강화 + 오라·이름표, 더 좋은 장비 보상. https://www.gamepressure.com/dead-cells/elites/z7a1b3
- Hollow Knight: 보스는 준비 동작→공격→빈틈 순환, 빈틈이 반격 기회. https://saschb2b.github.io/game-mechanics/games/hollow-knight/patterns
- 입력 버퍼: 0.1~0.2초 저장이 일반적, 너무 길면 둔해짐. https://www.wayline.io/blog/input-buffering-responsive-game-feel

## 열린 질문

- 직업 해금 방식 — 제안 기본값: ①행동 누적 + ③숨은 NPC 시험 혼합.
- 직업 여러 개 동시 보유? — 제안 기본값: 가능, 장착 무기로 전환.
- 구르기(회피)? — 제안 기본값: 넣음(2단계).
- 스킬 사이 이어 치기(A2→B3)? — 제안 기본값: 안 함.
- 초기 직업 4개 — 제안 기본값: 몽둥이꾼·칼잡이·창꾼·맨주먹 (무기 에셋 확인 후).
- 정리됨: 쓰러짐 벌칙 없음(덜 가혹한 쪽), 캐릭터 레벨 없음(HP = 100 + 직업 Lv×2 + 장비).
