# 아키텍처 가이드

## 폴더 구조

```
public/
├── models/
│   ├── characters/             # 직업별 GLB 캐릭터 모델 (KayKit Adventurers CC0)
│   │   ├── shared/animations/  # 공유 리그 애니메이션 (Rig_Medium)
│   │   │   ├── general.glb     # Idle_A/B, Hit_A/B, Death_A/B, Interact 등
│   │   │   └── movement.glb    # Walking_A/B/C, Running_A/B, Jump 등
│   │   ├── warrior/
│   │   │   ├── model.glb       # 전사 (Knight)
│   │   │   └── animations/slash.glb  # 베기 (Mixamo Sword And Shield Slash)
│   │   ├── archer/model.glb    # 궁수 (Ranger)
│   │   ├── mage/model.glb      # 마법사 (Mage)
│   │   └── rogue/model.glb     # 도적 (Rogue_Hooded)
│   └── weapons/                # 직업별 무기 props (캐릭터·NPC·상점 공용)
│       ├── warrior/            # sword_1h, sword_2h, axe_1h, axe_2h, shield, shield_badge
│       ├── archer/             # bow, crossbow, arrows, quiver
│       ├── mage/               # staff, wand, spellbook_open, spellbook_closed
│       └── rogue/              # dagger, smokebomb

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
│   │   ├── npc/                    # LucasNPC.tsx, MarcoNPC.tsx
│   │   └── effects/                # SkillEffects.tsx + fx/ (8종 FX)
│   │
│   └── ui/                         # DOM 오버레이 — position: absolute
│       ├── hud/                    # 항상 표시 (HUD.tsx 조합 루트)
│       │   ├── characterPanel/     # 캐릭터 이름·HP 패널
│       │   ├── charInfo/           # 이름·레벨 표시 (characterPanel 내부)
│       │   ├── expBar/             # EXP 바 (characterPanel 내부)
│       │   ├── miniMap/            # 좌상단 Canvas 미니맵 (120×120px)
│       │   ├── menu/               # 게임 메뉴
│       │   ├── playerDamageNumbers/ # 피격 데미지 숫자 플로팅 애니메이션
│       │   ├── skillBar/           # 하단 스킬 슬롯 바 (HP 바 포함)
│       │   ├── skillSlot/          # 개별 슬롯 (이모지 아이콘)
│       │   └── statBar/            # 재사용 상태 바 컴포넌트
│       ├── overlay/                # 풀스크린 오버레이
│       │   ├── bossEntry/          # 보스 입장 연출
│       │   ├── characterCreate/    # 캐릭터 생성 (직업 선택 → 닉네임 2단계)
│       │   ├── classSelect/        # 직업 선택 (레거시, characterCreate로 대체됨)
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
│   ├── useCharacterAnimation.ts    # 애니메이션 상태 머신 (공격·피격·대시·사망)
│   ├── useCharacterPhysics.ts      # 이동 물리 (Rapier RigidBody 제어)
│   ├── useDraggable.ts             # 윈도우 드래그
│   ├── useModal.ts                 # 모달 제어
│   ├── useNpcProximity.ts          # NPC 근접 폴링
│   ├── useSkillInput.ts            # 키 입력 → 스킬 발동·히트 판정
│   └── useToast.ts                 # 토스트 제어
│
├── types/                          # boss · character · combat · item · job · map(MapMarker 포함) · monster
├── constants/                      # boss · character · combat · controls · growth
│                                   # item · items · maps(MAP_MARKERS 포함) · monster · shop · skill(SKILL_ICON 포함) · world
└── utils/keyState.ts               # KEYS Set — useFrame용 non-reactive 키 상태
                                    # (Zustand 대신 Set: 매 프레임 읽어도 리렌더 없음)
```

`@/*` → `src/` 기준 (tsconfig paths: `"@/*": ["./src/*"]`)

---

## 컴포넌트 레이어 분리 원칙

| 폴더               | 렌더 환경       | 설명                                          |
| ------------------ | --------------- | --------------------------------------------- |
| `components/game/` | R3F Canvas 안   | Three.js 객체만. DOM 접근 금지                |
| `components/ui/`   | DOM (Canvas 위) | HTML/CSS만. R3F hook(`useFrame` 등) 사용 금지 |

두 레이어는 **Zustand store**와 **worldRefs**를 통해서만 통신한다.

---

## 상태 관리 기준

| 상태 유형      | 도구                       | 기준                                                       |
| -------------- | -------------------------- | ---------------------------------------------------------- |
| 게임 전역 상태 | Zustand (`gameStore`)      | HP, EXP, 레벨, 인벤토리, 스킬                              |
| 씬 간 공유 ref | `worldRefs.ts` (plain ref) | 위치·방향처럼 매 프레임 쓰는 값 — 리렌더 불필요            |
| 키 입력 상태   | `utils/keyState.ts` (Set)  | `useFrame` 안에서 polling — Zustand 쓰면 60fps 리렌더 발생 |
| 로컬 UI 상태   | `useState`                 | 단일 컴포넌트 내부                                         |

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

---

## GLB 모델 로딩 패턴

`character/`, `monster/` 등 GLB를 사용하는 컴포넌트는 아래 패턴을 따른다.

```tsx
// 1. 모듈 최상단에서 preload (앱 진입 시 백그라운드 로드)
Object.values(MODEL_MAP).forEach((path) => useGLTF.preload(path));

// 2. 모델 렌더링은 별도 컴포넌트로 분리 (useGLTF 훅 규칙)
function CharacterModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

// 3. 물리 컴포넌트 안에서 Suspense + 명시적 Collider 분리
<RigidBody colliders={false}>
  <CuboidCollider args={[hw, hh, hd]} /> // 물리 — 시각과 독립
  <group ref={modelGroupRef}>
    <Suspense fallback={<FallbackMesh />}>
      {" "}
      // 로딩 중 fallback
      <CharacterModel path={path} />
    </Suspense>
  </group>
</RigidBody>;
```

- `colliders="cuboid"` 대신 `colliders={false}` + `<CuboidCollider>` 명시: GLB geometry에서 자동 계산되는 충돌 박스를 막아 물리와 시각을 독립적으로 조정 가능하게 유지
- `<primitive object={scene} />`: 단일 인스턴스엔 Clone 불필요. 복수 인스턴스(몬스터 등)는 `<Clone object={scene} />` 사용

---

## 스켈레톤 본 부착 패턴 (WeaponSlot)

GLB 무기·소품을 캐릭터 스켈레톤 본에 부착할 때 사용하는 패턴.

```tsx
function WeaponSlot({
  charScene,
  weaponPath,
  boneName,
}: {
  charScene: THREE.Group;
  weaponPath: string;
  boneName: string; // 예: "handslotr", "handslotl"
}) {
  const { scene: weaponScene } = useGLTF(weaponPath);

  useEffect(() => {
    // getObjectByName 사용 → traverse + as 단언 불필요, 타입 안전
    const bone = charScene.getObjectByName(boneName);
    if (!bone) return;
    const clone = weaponScene.clone(true); // 캐시 오염 방지
    bone.add(clone);
    return () => {
      bone.remove(clone);
    };
  }, [charScene, weaponScene, boneName]);

  return null; // R3F 안에서 null 반환 — Three.js 명령형으로만 부착
}
```

- `handslotr` / `handslotl`: KayKit Rig_Medium 전용 무기 슬롯 본 (점 없는 소문자, offset 조정 불필요)
- `weaponScene.clone(true)`: 공유 캐시 원본을 건드리지 않기 위해 deep clone
- `WeaponSlot`은 부모 `<Suspense>` 안에서 렌더링 — 무기 GLB 로딩 중 fallback 처리 자동 위임
