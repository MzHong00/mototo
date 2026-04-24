# 아키텍처 가이드

## 폴더 구조

```
├── index.html                  # Vite 진입점 (Google Fonts <link> 포함)
├── vite.config.ts              # Vite 설정 (플러그인, @/ 알리아스)
│
└── src/                        # 모든 소스 파일
    ├── main.tsx                # 앱 진입점 (createRoot)
    ├── App.tsx                 # 루트 컴포넌트 (존 관리, 오버레이 렌더)
    ├── globals.css             # 전역 CSS (디자인 토큰)
    │
    ├── components/             # UI 컴포넌트
    │   └── game/               # 게임 전용 컴포넌트
    │       ├── Scene.tsx           # R3F Canvas 루트 + 카메라
    │       ├── Inventory.tsx       # 인벤토리 UI
    │       ├── Shop.tsx            # NPC 상점 UI
    │       │
    │       ├── hud/                # HUD 오버레이 (HTML)
    │       │   ├── HUD.tsx             # HUD 조합 루트 (useSkillInput, useMpRegen 호출)
    │       │   ├── CharacterPanel.tsx  # 캐릭터 이름·HP/MP/EXP 패널
    │       │   ├── SkillBar.tsx        # 하단 스킬 슬롯 바
    │       │   ├── SkillSlot.tsx       # 개별 스킬 슬롯 + EmptySlot
    │       │   ├── StatBar.tsx         # 재사용 상태 바 (HP/MP/EXP)
    │       │   ├── GoldDisplay.tsx     # 골드 카운터
    │       │   ├── NpcPrompt.tsx       # "F 상점 열기" 프롬프트
    │       │   └── HelpHint.tsx        # 조작 힌트
    │       │
    │       ├── character/          # 플레이어 캐릭터 (R3F)
    │       │   └── Character.tsx       # 이동·물리·방어막
    │       │
    │       ├── map/                # 맵 요소 (R3F)
    │       │   ├── Map.tsx             # 지형·나무·보이지 않는 벽
    │       │   ├── Portal.tsx          # 존 이동 포탈
    │       │   └── Npc.tsx             # NPC 메시
    │       │
    │       ├── monster/            # 몬스터 (R3F)
    │       │   ├── Monsters.tsx        # 몬스터 목록 관리·리스폰
    │       │   └── Monster.tsx         # 개별 몬스터 AI·HP
    │       │
    │       ├── effects/            # 스킬 이펙트 (R3F)
    │       │   ├── SkillEffects.tsx    # FX 레지스트리·클린업 루프
    │       │   └── fx/                 # 개별 FX 컴포넌트
    │       │       ├── SlashFX.tsx
    │       │       ├── BlastFX.tsx
    │       │       ├── ArrowFX.tsx
    │       │       ├── ArrowBlastFX.tsx
    │       │       ├── FireballFX.tsx
    │       │       ├── MeteorFX.tsx
    │       │       ├── ShurikenFX.tsx
    │       │       └── ShurikenBlastFX.tsx
    │       │
    │       └── screen/             # 풀스크린 오버레이
    │           ├── ClassSelect.tsx     # 직업 선택 화면
    │           ├── DeathScreen.tsx     # 사망·리스폰 화면
    │           └── LevelUpEffect.tsx   # 레벨업 연출
    │
    ├── stores/                 # Zustand 전역 상태
    │   ├── gameStore.ts        # 게임 상태 (HP, EXP, 레벨, 인벤토리, 스킬)
    │   └── worldRefs.ts        # R3F 씬 간 공유 ref (playerPositionRef 등)
    │
    ├── hooks/                  # 커스텀 훅
    │   ├── useMpRegen.ts       # MP 자동 회복 (1초마다 +2)
    │   ├── useNpcProximity.ts  # NPC 근접 여부 폴링
    │   └── useSkillInput.ts    # 키 입력 → 스킬 발동·히트 판정
    │
    ├── types/                  # 타입 정의
    │   ├── character.ts        # JobClass, CharacterStats, EquipSlots, SkillState
    │   ├── item.ts             # Item, ItemType
    │   ├── combat.ts           # SkillFXType, SkillFX
    │   └── monster.ts          # MonsterType, MonsterConfig
    │
    ├── constants/              # 상수
    │   ├── character.ts        # EXP_PER_LEVEL, CLASS_CONFIG (직업별 스탯·스킬)
    │   ├── combat.ts           # 공격 범위, 발사체 파라미터
    │   ├── monster.ts          # MONSTER_STATS, 어그로·공격 범위, 리스폰 시간
    │   ├── world.ts            # 존 스폰·드롭·나무·벽 위치, 포탈·NPC 위치
    │   ├── skill.ts            # FX_DURATION, SKILL_COLOR, 단축키 그룹
    │   └── shop.ts             # SHOP_CATALOG (ShopItemDef[])
    │
    └── utils/                  # 순수 유틸 함수 (부수효과 없음)
        ├── format.ts           # 날짜·숫자·문자열 포맷
        └── validator.ts        # 공통 유효성 검사

# @/* → src/ 기준 (tsconfig paths: "@/*": ["./src/*"])
# 예) @/components/game/hud/HUD → src/components/game/hud/HUD
```

## 상태 관리 기준

| 상태 유형    | 도구            | 기준                             |
| ------------ | --------------- | -------------------------------- |
| 서버 상태    | TanStack Query  | API에서 가져오는 모든 데이터     |
| 전역 UI 상태 | Zustand         | 여러 컴포넌트에서 공유되는 상태  |
| 로컬 상태    | useState        | 단일 컴포넌트 내에서만 사용      |
| 폼 상태      | React Hook Form | 폼 입력값 및 유효성 검사         |

## 레이어 의존 방향

```
Component → Hook → Store / Constants / Types
```

- 컴포넌트는 UI만 담당 — 비즈니스 로직은 Hook으로 분리
- Hook은 Store 구독 + 도메인 로직 담당
- 타입·상수는 어디서든 가져다 쓸 수 있는 순수 모듈
- R3F(3D) 컴포넌트와 HTML 오버레이는 서로 다른 레이어 — Canvas 밖에서 DOM을 직접 건드리지 않음
