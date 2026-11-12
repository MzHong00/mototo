# 기술

> **모든 성장은 기술**이다. 캐릭터 레벨은 없다. 기술마다 레벨 1~100이 따로 있고, 그 활동을 해야만 오른다.

## 확정 사항

- 생활(채집·채광·낚시·요리·목공), 외형(미용·분장·재봉·제화·세공·염색), 마을(건축·사육), 전투 직업.
- 외형 파츠는 처음부터 다 주지 않는다. 모험·기술로 해금한다.
- 전투 직업은 처음부터 고르지 않는다. 숨겨진 조건으로 해금 ([Combat.md](Combat.md)).

## 규칙과 수치

### 기술 목록 (확정안)

| 분류 | id | 기술 | 경험치 얻는 행동 | 해금하는 것 | 문서 |
| --- | --- | --- | --- | --- | --- |
| 생활 | `gathering` | 채집 | 꽃·풀 줍기, 과일 따기, 나무 베기, 흙 파기 | 채집 장소, 도끼 등급 | [Gathering.md](Gathering.md) |
| 생활 | `mining` | 채광 | 바위 깨기, 용광로 제련 | 광석, 곡괭이 등급, 깊은 광산 | [Mining.md](Mining.md) |
| 생활 | `fishing` | 낚시 | 물고기 낚기 (완벽 낚기 보너스) | 물고기, 낚싯대·미끼 | [Fishing.md](Fishing.md) |
| 생활 | `cooking` | 요리 | 조리대에서 요리 | 회복·강화 음식 레시피 | [Crafting.md](Crafting.md) |
| 생활 | `woodworking` | 목공 | 작업대에서 가구·도구·무기 제작 | 가구·도구·무기 레시피 | [Crafting.md](Crafting.md) |
| 외형 | `hairdressing` | 미용 | 거울대에서 머리 손질 (나·주민) | **머리 모양** | 아래 외형 흐름 |
| 외형 | `makeup` | 분장 | 거울대에서 얼굴 꾸미기 (나·주민) | **얼굴(눈·입·표정)** | 〃 |
| 외형 | `sewing` | 재봉 | 재봉틀에서 천·옷 제작 | 상의·하의·한벌·망토 | [Crafting.md](Crafting.md) |
| 외형 | `shoemaking` | 제화 | 제화대에서 신발 제작 | 신발 | 〃 |
| 외형 | `jewelcrafting` | 세공 | 세공대에서 장신구 제작, 보석 다듬기 | 모자·안경·장신구 | 〃 |
| 외형 | `dyeing` | 염색 | 염색통에서 염색약 만들기·옷 물들이기 | 색 (나날빛과 연결) | 〃, [Nanalbit.md](Nanalbit.md) |
| 마을 | `building` | 건축 | 마을 구조물 짓기·철거 | 건물·구조물 | [Housing.md](Housing.md), [Village.md](Village.md) |
| 마을 | `husbandry` | 사육 | 동물 먹이·쓰다듬기·산물 얻기 | 동물 종류, 우리 크기 | [Animals.md](Animals.md) |
| 전투 | `job:<직업id>` | 전투 직업 | 몬스터 처치 (엘리트·보스 가산) | B·C·D 스킬, 콤보 변형 (조건은 Combat) | [Combat.md](Combat.md) |

- 전투 직업은 직업마다 기술 하나. 해금 전에는 기술 창에 `???`로만 보인다.
- 1단계에서 보이는 기술: 채집·채광·낚시·요리·목공·재봉. 나머지는 해당 시설·의뢰를 처음 만나면 나타난다.

### 경험치 곡선

- 다음 레벨까지 필요치: `xpToNext(L) = floor(100 × 1.05^(L-1))`
- 레벨 L 도달 누적치: `xpTotal(L) = Σ xpToNext(1..L-1)`
- 초반은 빠르고(Lv2까지 행동 5~10번), 후반은 길다. 누적 기준 절반 지점은 **Lv86**.

| 레벨 | 이 레벨→다음 필요 | 도달 누적 |
| --- | --- | --- |
| 1 | 100 | 0 |
| 10 | 155 | 1,099 |
| 20 | 252 | 3,045 |
| 50 | 1,092 | 19,820 |
| 80 | 4,720 | 92,365 |
| 100 | — (만렙) | 248,431 |

- 행동 1번 기본 경험치는 5~40 (각 문서 표). 만렙까지 한 기술 약 10~15시간.
- **레벨 차 감쇠**: 대상(자원·레시피) 요구 레벨보다 내 레벨이 20 이상 높으면 ×0.5, 40 이상이면 ×0.1. 낮은 것만 반복하는 노가다 방지.
- 레벨업 시: 효과음 + 머리 위 빛 + 알림 "채집 Lv12!" + 새로 해금된 것 목록.

### 등급과 칭호

| 등급 | 레벨 | 예시 칭호 |
| --- | --- | --- |
| 견습 | 1~19 | 견습 낚시꾼 |
| 숙련 | 20~39 | 숙련 낚시꾼 |
| 장인 | 40~59 | 낚시 장인 |
| 달인 | 60~79 | 낚시 달인 |
| 명인 | 80~100 | 낚시 명인 |

- 종합 칭호: 공개된 모든 생활·외형·마을 기술이 같은 등급 이상이면 붙는다 (전투 직업 제외).
  - 전부 숙련↑ 솜씨꾼 · 장인↑ 만물 장인 · 달인↑ 만물 달인 · 전부 명인 만물 명인
- 칭호는 이름표 아래에 하나 골라 단다.

### 레벨 보상 (해금)

- 레벨 보상은 **해금 목록**(`Unlock[]`)으로 정의한다. 레벨이 되면 자동으로 열린다.
- 일부 레시피는 레벨 + **도안**(모험·의뢰 보상 아이템)이 둘 다 있어야 열린다. 희귀 외형은 대부분 도안 필요.
- 기술별 큰 보상 시점 (초기값):

| 레벨 | 공통 패턴 |
| --- | --- |
| 1 | 기본 도구·레시피 2~3개 |
| 5, 10, 15 … | 5레벨마다 레시피·파츠 1~3개 |
| 10 / 25 / 45 / 70 | 도구 등급 1~4 사용 가능 |
| 20 / 40 / 60 / 80 | 등급 승급: 새 장소(본 맵 구역·깊은 광산) 또는 새 시설 1개 |

### 외형 파츠 얻는 흐름

옷·신발·모자 (장비형 파츠):
```
기술 레벨 도달 (+도안) → 레시피 해금 → 재료 모으기(채집·채광·전리품)
→ 재봉틀/제화대/세공대에서 제작 → 장비 아이템 획득
→ 처음 얻는 순간 옷장 도감에 모양 등록 → 장비 칸에 입거나, 외형 칸에 등록
```

머리·얼굴 (몸에 붙은 파츠, 아이템 아님):
```
미용/분장 레벨 도달 (+스타일북) → 스타일 해금 → 거울대에서 재료(헤어 크림·화장품) 1개 써서 적용
→ 이후 같은 스타일로 바꾸는 건 무료
```

- 색: 기본 8색은 무료. 그 밖의 색은 염색 레벨 + 나날빛 단계로 열리고, 염색약 1개로 한 부위를 바꾼다 ([Character.md](Character.md)).
- 장비/외형 칸 규칙 자체는 [Character.md](Character.md).

### 시작 외형 (최소)

| 슬롯 | 시작 시 | 이후 첫 해금 예 |
| --- | --- | --- |
| 머리 | 성별별 1종 (트윈테일 / 숏컷) | 미용 Lv1 공용 단발 |
| 얼굴 | 기본 얼굴 1종 | 분장 Lv1 웃는 눈 |
| 상의 | 티셔츠 | 재봉 Lv3 후드티, Lv8 튜닉 |
| 하의 | 반바지 | 재봉 Lv1 긴바지, Lv5 치마 |
| 신발 | 운동화 | 제화 Lv5 부츠 |
| 모자·안경·망토 | 없음 | 세공·재봉 해금 |
| 색 | 피부·눈은 전부 자유. 옷·머리는 기본 8색(무료로 바꿈) | 나머지는 염색 |

## 데이터 모델

```ts
type LifeSkillId = 'gathering' | 'mining' | 'fishing' | 'cooking' | 'woodworking';
type LookSkillId = 'hairdressing' | 'makeup' | 'sewing' | 'shoemaking' | 'jewelcrafting' | 'dyeing';
type VillageSkillId = 'building' | 'husbandry';
type SkillId = LifeSkillId | LookSkillId | VillageSkillId | `job:${string}`;

type SkillGrade = 'novice' | 'adept' | 'artisan' | 'expert' | 'master'; // 견습~명인

interface SkillProgress {
  id: SkillId;
  level: number;     // 1~100
  xp: number;        // 현재 레벨 안에서 쌓인 경험치
  isRevealed: boolean; // 기술 창에 보이는지
}

type Unlock =
  | { kind: 'recipe'; recipeId: string }
  | { kind: 'style'; slot: 'hair' | 'face'; styleId: string }
  | { kind: 'toolTier'; tier: ToolTier }
  | { kind: 'area'; areaId: string }        // 본 맵 안 구역·장소
  | { kind: 'station'; stationId: string }
  | { kind: 'dyeColor'; colorId: string }
  | { kind: 'animal'; animalId: string };

interface SkillDef {
  id: SkillId;
  name: string;                 // '채집'
  titleNoun: string;            // '채집꾼' → '견습 채집꾼'
  unlocks: Record<number, Unlock[]>; // 레벨 → 해금 목록
}

interface XpGainEvent { skill: SkillId; baseXp: number; targetLevel: number } // targetLevel: 감쇠 계산용
```

```ts
const MAX_SKILL_LEVEL = 100;
const XP_BASE = 100;
const XP_GROWTH = 1.05;
const XP_FALLOFF = [{ gap: 40, mult: 0.1 }, { gap: 20, mult: 0.5 }];
const GRADE_MIN_LEVEL = { novice: 1, adept: 20, artisan: 40, expert: 60, master: 80 };
```

- 순수 함수: `xpToNext`, `applyXp(progress, event) → { progress, levelUps: number[] }`, `gradeOf(level)` → `utils/skill.ts`.
- 상태: `stores/skillStore.ts` (Zustand), 저장은 [Save.md](Save.md).

## 단계 (MVP → 이후)

1. **MVP**: 채집·채광·낚시·목공·재봉 5개. 곡선·감쇠·레벨업 알림, 기술 창(레벨·바·등급). 해금은 레시피만.
   - 수용 기준: 꽃 20번 채집 → 채집 Lv2 이상, 새로고침해도 유지, 레벨업 시 해금 레시피가 제작 목록에 뜬다.
2. 요리·제화·세공·염색, 도구 등급, 칭호 선택.
3. 미용·분장(거울대 + 스타일 해금), 도안 아이템.
4. 건축·사육, 전투 직업 기술, 종합 칭호.

## 참고한 게임

- Old School RuneScape: 레벨마다 약 10%씩 늘어 92가 99의 절반인 곡선 → 우리는 5%로 완만하게, 절반 지점 86. https://oldschool.runescape.wiki/w/Experience_table
- 마비노기: 생활 기술마다 등급, 도안 등급이 높으면 좋은 결과 → 레벨 + 도안 이중 해금. https://wiki.mabinogiworld.com/view/Tailoring_(Talent)
- Stardew Valley: 기술 레벨이 미니게임을 쉽게 만든다(낚시 막대 길이) → 레벨이 체감되게. https://stardewvalleywiki.com/Fishing

## 열린 질문

- 경험치 증가율 5%가 맞는가? — 제안 기본값: 1.05, 플레이 테스트 후 조정.
- 전투 직업 기술도 1~100인가? — 제안 기본값: 같은 곡선. 캐릭터 레벨은 없고, HP·무기 착용은 직업 레벨 기준 ([Combat.md](Combat.md)).
- 머리·얼굴은 아이템이 아닌 "스타일"로 두는가? — 제안 기본값: 예 (장비 아님, 능력치 없음).
- 도구·무기 제작 — 정리됨: 목공(주괴는 채광 제련). 대장 기술은 두지 않음(더 단순한 쪽).
