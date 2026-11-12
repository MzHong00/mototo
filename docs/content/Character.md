# 캐릭터 커스터마이징

> 치비 몸체 1개에 파츠를 갈아입힌다. 입은 장비가 능력치를, **외형 칸**에 등록한 장비가 보이는 모습을 정한다.
> 원본 파이프라인: `~/Desktop/chibi-pipeline` (Blender 피팅 스크립트, 웹 뷰어·꾸미기 화면)

## 확정 사항

- **몸체 베이스 1개 고정** (`chibi_v9`, 뼈대 `ChibiRig`). 모든 파츠는 이 몸에 맞춘다. NPC도 같은 몸 ([Npc.md](Npc.md)).
- 체형 차이(성별·키)는 뼈 길이 조절로 처리.
- 모든 파츠는 색 변경 가능 (회색조 텍스처 × 틴트).
- 외형은 처음부터 다 주지 않는다. 모험과 외형 기술(미용·분장·재봉·제화·세공·염색)로 해금 ([Skills.md](Skills.md)).
- 옷·모자·신발 등은 **능력치가 있는 장비**. 외형 전용 아이템은 없다.
- 장비를 **외형 칸에 등록**하면 보이는 모습만 바뀐다(글래머 방식).
- 무기도 장비 (몽둥이 등, [Combat.md](Combat.md)).

## 규칙과 수치

### 성별

- 여자 / 남자. 성별에 따라 고를 수 있는 머리가 다르다(공용 파츠는 둘 다).
- 성별을 바꾸면 맞지 않는 머리는 그 성별 기본 머리로 바뀐다.

### 몸 파츠 (장비 아님)

| 슬롯 | 현재 | 해금 기술 | 비고 |
| --- | --- | --- | --- |
| 머리 | 트윈테일(여), 숏컷(남) | 미용 | VRoid CC0 샘플 피팅. 흔들림 물리 |
| 얼굴 | 기본 1종 | 분장 | 텍스처 교체 |
| 피부 톤, 눈 색 | 자유 | — | 처음부터 |

- 몸 파츠는 능력치가 없다. 해금된 스타일은 거울대에서 무료로 바꾼다. 새 스타일 첫 적용만 재료 1개 ([Crafting.md](Crafting.md)).

### 시작 외형

- 기준은 [Skills.md](Skills.md) "시작 외형" 표 하나. 캐릭터 만들기 화면에서 고르는 것: 성별, 성별별 머리 1종, 얼굴 1종, 피부·눈 색(자유), 머리·옷 기본 8색. 옷은 티셔츠·반바지·운동화로 시작.
- 위 장비 표 "현재 에셋" 중 나머지(후드티·튜닉·긴바지·치마·부츠)는 재봉·제화로 해금. 지금 코드의 꾸미기 화면은 전부 열려 있음 → 기술 연결 단계(4)에서 잠근다.

### 장비 슬롯 (8칸)

| 슬롯 | 현재 에셋 | 제작 기술 | 주 능력치 | 비고 |
| --- | --- | --- | --- | --- |
| 무기 | 몽둥이 등 | 목공 (+ 전리품·상점) | 공격 | 오른손 소켓 |
| 모자 | — | 세공 | 방어·생활 | 머리 윗부분 숨김/눌림 처리 |
| 상의 | 티셔츠, 후드티, 튜닉 | 재봉 | 방어·체력 | |
| 하의 | 반바지, 긴바지, 치마 | 재봉 | 방어 | |
| 한벌 | — | 재봉 | 방어·체력 (상+하 합) | 입으면 상의·하의 해제 |
| 신발 | 운동화, 부츠 | 제화 | 이동속도·방어 | |
| 장신구 | 안경 등 | 세공 | 치명·생활 | 얼굴 슬롯(안경·귀걸이) |
| 망토 | — | 재봉 | 체력·이동 | 날개·가방 모양도. 휘날림 물리는 나중 |

- 능력치는 6개 고정: `hp` 체력, `atk` 공격, `def` 방어, `crit` 치명, `speed` 이동속도, `gather` 생활 보너스. 기본값·공식은 [Combat.md](Combat.md). (회피 같은 다른 능력치는 두지 않음 — 더 단순한 쪽)
- 착용 조건: 무기만 **그 무기 직업의 레벨** 제한(캐릭터 레벨 없음). 나머지는 제한 없음. 제작 기술 레벨은 만들 때만 필요.
- 한벌 ↔ 상의·하의: 한벌을 입으면 상의·하의는 가방으로. 반대도 같다.

### 외형 칸 (글래머)

장비 슬롯마다 **외형 칸**이 1개씩 붙는다.

| 규칙 | 내용 |
| --- | --- |
| 등록 조건 | ① 한 번이라도 **얻은 적 있는 장비**(도감 등록)면 등록 가능 ② 같은 슬롯끼리만 (모자 → 모자 칸) ③ 성별 제한 파츠는 성별 맞을 때만 |
| 등록 비용 | 무료. 1인 게임이라 부담 없이 |
| 원본 장비 | 등록 후에도 **사라지지 않는다**. 팔거나 버려도 외형은 유지(도감 기준) |
| 해제 | 외형 칸 비우기 → 입은 장비 모습으로 돌아감 |
| "안 보이기" | 모자·장신구·망토 칸은 `숨김` 선택 가능 (모자를 써도 안 보이게) |
| 한벌 외형 | 한벌을 외형 칸에 넣으면 상의·하의 외형 칸은 무시 |
| 무기 외형 | 같은 무기 종류끼리만 (몽둥이 → 몽둥이). 모션이 달라서 |
| 색 | **외형 칸 기준**. 외형 칸에 색을 따로 저장. 비었으면 입은 장비 색 |
| 세트 저장 | 외형 세트 5개 저장, 원클릭 교체 (어디서나) |

- 표시 우선순위: `외형 칸(숨김 포함) > 입은 장비 > 없음(기본 속옷 파츠)`.
- 능력치는 항상 **입은 장비**에서만 계산.

### 색

- 기본 팔레트 8색은 처음부터, **무료로 언제든** 바꾼다. 피부·눈도 무료.
- 그 밖의 색은 염색약 1개 소모(머리 포함). 색 계열은 나날빛 단계, 계열 안 색 수는 염색 Lv ([Nanalbit.md](Nanalbit.md), [Crafting.md](Crafting.md)).

### 무기 붙이기 (손 뼈 소켓)

- `ChibiRig`의 오른손 뼈(`Hand.R`)에 빈 노드 `socket_weapon_R`을 붙인다. 왼손 `socket_weapon_L`은 방패·양손용 예약.
- 무기 glb는 **손잡이 원점**(쥐는 위치 = 0,0,0), +Y가 칼끝 방향으로 만든다.
- 무기 정의에 소켓 기준 보정값(`offset`, `rotation`, `scale`)을 둔다 → 에셋마다 미세 조정.
- 무기는 스킨 메시가 아니라 **일반 메시를 소켓 자식으로** 붙인다(뼈 따라 이동). 드로우콜 1개.
- 무기 없을 때 맨손 모션. 마을에서는 등 소켓(`socket_back`)으로 옮겨 멘다(선택).

### 닉네임

- 2~12자, 한글·영문·숫자 (`/^[a-zA-Z0-9가-힣]{2,12}$/`)

## 데이터 모델

```ts
export type EquipSlot =
  | "weapon" | "hat" | "top" | "bottom" | "outfit" | "shoes" | "accessory" | "cape";

/** 능력치 6개 — Combat.md `StatKey` 와 같음 */
export type Stats = Partial<Record<"hp" | "atk" | "def" | "crit" | "speed" | "gather", number>>;

/** 장비 정의 (ItemDef.gearId 로 연결, [Items.md]) */
export interface EquipDef {
  id: string;
  slot: EquipSlot;
  partId: string;               // 3D 파츠 id (chibi 파츠 카탈로그)
  gender?: "female" | "male";
  stats: Stats;
  require?: { skill: string; level: number };
  weaponType?: WeaponKind;      // Combat.md: club | sword | spear | fist
  socket?: {                    // 무기만
    bone: "socket_weapon_R" | "socket_weapon_L";
    offset: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
  hidesHairTop?: boolean;       // 모자
}

/** 입은 장비: 슬롯 → 가방 개체 uid */
export type Equipment = Partial<Record<EquipSlot, string>>;

/** 외형 칸 한 개 */
export interface AppearanceOverride {
  equipId: string | "hidden";   // 도감에 있는 EquipDef id 또는 숨김
  color?: string;               // 외형 칸 색 (없으면 입은 장비 색)
}

export type AppearanceSlots = Partial<Record<EquipSlot, AppearanceOverride>>;

export interface PlayerLook {
  body: { gender: "female" | "male"; hair: string; hairColor: string; face: string; skin: string; eyes: string };
  equipment: Equipment;
  appearance: AppearanceSlots;
  outfitSets: AppearanceSlots[]; // 최대 5
}

export const LOOK = { outfitSets: 5, basePalette: 8 } as const;

/** 실제로 그릴 파츠 계산: 외형 칸 > 장비 > 기본 */
export function resolveVisual(look: PlayerLook, items: Inventory): ChibiState;
```

- 기존 `ChibiState`(parts, colors)는 **렌더링 결과**로 유지. `resolveVisual`이 `PlayerLook` → `ChibiState`로 변환. 엔진 수정 최소.
- `PartCategory`에 `outfit | hat | accessory | cape | weapon` 추가 필요 (chibi-pipeline 동기화 대상).

## 단계 (MVP → 이후)

1. **MVP**: 무기 1종을 `Hand.R` 소켓에 붙여 공격 모션과 함께 표시. 장비 슬롯 4개(무기·상의·하의·신발), 능력치 표시만.
   - 수용 기준: 몽둥이가 걷기·공격 중 손에서 떨어지지 않음. 장비 바꾸면 모습·능력치 둘 다 바뀜.
2. 외형 칸: 등록·해제·색, `resolveVisual`. 수용 기준: 상의 A 입고 외형 B 등록 → 보이는 건 B, 능력치는 A.
3. 모자·한벌·장신구·망토 슬롯, 숨김, 세트 5개.
4. 기술로 파츠 해금 연결, 염색약 소모.

## 참고한 게임

- FFXIV 글래머: 장비를 보관함에 넣고 외형 세트(플레이트)로 조합. 같은 슬롯·직업 제한, 빈 칸 허용. 비용(프리즘)은 1인 게임에 불필요해 뺌. https://ffxiv.consolegameswiki.com/wiki/Glamour_Dressers
- Lost Ark 아바타: 외형 칸이 능력치 칸과 분리되어 "보이는 것"과 "강해지는 것"이 충돌하지 않음. 우리는 별도 아바타 아이템 없이 장비 자체를 등록. https://lostark.wiki.gg/wiki/Avatars
- Stardew Valley 모자·반지: 모자는 머리를 눌러 표시하는 처리가 필요. https://stardewvalleywiki.com/Hats

## 열린 질문

- 등록 조건이 "얻은 적 있음"이면 충분한가, "지금 가지고 있음"인가? → 제안 기본값: **얻은 적 있음(도감)**. 팔아도 유지.
- 장비 착용 레벨 제한 기준 → 정리됨: 무기만 그 무기 직업 레벨, 나머지 없음.
- 무기 외형 제한(같은 종류끼리) → 제안 기본값: 같은 종류만.
- 장신구 칸 1개로 충분? → 제안 기본값: 1개(안경류). 귀걸이 등은 나중에 2번째 칸.
