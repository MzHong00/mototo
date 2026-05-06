# 아키텍처 가이드

## 폴더 구조

```
src/
├── main.tsx / App.tsx / main.scss
│
├── components/
│   ├── game/                       # R3F Canvas 안 — Three.js 전용
│   │   ├── Scene.tsx               # Canvas 루트 + 카메라
│   │   ├── character/              # 플레이어 (이동·물리·대시)
│   │   ├── map/                    # Map.tsx (지형), Portal.tsx (존 이동)
│   │   ├── maps/                   # 존별 씬 조합
│   │   │                           #   Evergreen(Village·Meadow·Forest·Swamp·Ruins)
│   │   │                           #   TwilightWasteland, KingBearChamber
│   │   ├── monster/                # Monsters.tsx (관리·리스폰), Monster.tsx (AI·HP)
│   │   │   ├── boss/               # KingBearBoss.tsx
│   │   │   └── normal/             # 8종 (Chicken·Rooster·Sheep·Ram·Deer·Elk·Pig·WildBoar)
│   │   ├── npc/                    # LucasNPC.tsx, ShopkeeperNPC.tsx
│   │   └── effects/                # SkillEffects.tsx + fx/ (8종 FX)
│   │
│   └── ui/                         # DOM 오버레이 — position: absolute
│       ├── hud/                    # 항상 표시 (HUD.tsx 조합 루트)
│       │   ├── characterPanel/     # 이름·HP/MP/EXP
│       │   ├── helpHint/           # 조작 힌트
│       │   ├── menu/               # 게임 메뉴
│       │   ├── playerDamageNumbers/# 피격 데미지 팝업
│       │   ├── skillBar/           # 하단 스킬 슬롯 바
│       │   ├── skillSlot/          # 개별 슬롯
│       │   └── statBar/            # 재사용 HP/MP/EXP 바
│       ├── overlay/                # 풀스크린 오버레이
│       │   ├── bossEntry/          # 보스 입장 연출
│       │   ├── classSelect/        # 직업 선택
│       │   └── deathScreen/        # 사망·리스폰
│       ├── window/                 # 드래그 가능한 윈도우
│       │   ├── WindowManager.tsx   # 윈도우 조합 루트
│       │   ├── inventoryWindow/
│       │   ├── equipmentWindow/
│       │   ├── shopWindow/
│       │   ├── skillWindow/
│       │   └── keySettings/
│       ├── modal/                  # Modal.tsx
│       └── toast/                  # Toast.tsx
│
├── stores/                         # Zustand 전역 상태
│   ├── gameStore.ts                # HP·EXP·레벨·인벤토리·스킬
│   ├── worldRefs.ts                # 씬 간 공유 ref (위치·방향 — 리렌더 불필요)
│   ├── controlsStore.ts            # 키 바인딩
│   ├── modalStore.ts               # 모달 열림 상태
│   └── toastStore.ts               # 토스트 큐
│
├── hooks/
│   ├── useDraggable.ts             # 윈도우 드래그
│   ├── useModal.ts                 # 모달 제어
│   ├── useMpRegen.ts               # MP 자동 회복
│   ├── useNpcProximity.ts          # NPC 근접 폴링
│   ├── useSkillInput.ts            # 키 입력 → 스킬 발동·히트 판정
│   └── useToast.ts                 # 토스트 제어
│
├── types/                          # boss · character · combat · item · job · map · monster
├── constants/                      # boss · character · combat · controls · growth
│                                   # item · items · maps · monster · shop · skill · world
└── utils/keyState.ts               # KEYS Set — useFrame용 non-reactive 키 상태
                                    # (Zustand 대신 Set: 매 프레임 읽어도 리렌더 없음)
```

`@/*` → `src/` 기준 (tsconfig paths: `"@/*": ["./src/*"]`)

---

## 컴포넌트 레이어 분리 원칙

| 폴더 | 렌더 환경 | 설명 |
|------|-----------|------|
| `components/game/` | R3F Canvas 안 | Three.js 객체만. DOM 접근 금지 |
| `components/ui/` | DOM (Canvas 위) | HTML/CSS만. R3F hook(`useFrame` 등) 사용 금지 |

두 레이어는 **Zustand store**와 **worldRefs**를 통해서만 통신한다.

---

## 상태 관리 기준

| 상태 유형 | 도구 | 기준 |
|-----------|------|------|
| 게임 전역 상태 | Zustand (`gameStore`) | HP, EXP, 레벨, 인벤토리, 스킬 |
| 씬 간 공유 ref | `worldRefs.ts` (plain ref) | 위치·방향처럼 매 프레임 쓰는 값 — 리렌더 불필요 |
| 키 입력 상태 | `utils/keyState.ts` (Set) | `useFrame` 안에서 polling — Zustand 쓰면 60fps 리렌더 발생 |
| 로컬 UI 상태 | `useState` | 단일 컴포넌트 내부 |

---

## 레이어 의존 방향

```
Component → Hook → Store / Constants / Types
                 → utils/keyState  (R3F 전용 직접 참조 허용)
```

- 컴포넌트는 UI만 담당 — 비즈니스 로직은 Hook으로 분리
- Hook은 Store 구독 + 도메인 로직 담당
- 타입·상수는 어디서든 가져다 쓸 수 있는 순수 모듈
- `utils/keyState`는 `useFrame` 콜백 안에서만 직접 참조 허용
