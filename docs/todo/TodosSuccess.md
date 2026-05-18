# TODOS SUCCESS

완료된 Phase 아카이브. 진행 중·예정 항목은 `Todos.md` 참조.

---

## Phase 1 ✅ 완료

- 캐릭터 이동 (WASD + 마우스 카메라, R3F + Rapier)
- 캐릭터 모델 로딩 (Mixamo 무료 로우폴리)
- 기본 맵 세팅 (잔디 맵 + Rapier 지형 충돌)

## Phase 2 ✅ 완료

- 애니메이션 상태 머신 설계
- 히트 감지 방식 결정
- 전투 루프 구현 (몹 3종, HP바, 경험치바 HUD)

## Phase 3 ✅ 완료

- 성장 시스템 구현 (레벨업, 스킬, 장비 드랍·장착)
- zustand/persist version + migrate 적용

## Phase 4 ✅ 완료

- 포탈 시스템 (맵 이동)
- 직업 선택 화면 (전사 / 궁수 / 마법사)
- NPC 거래 UI

## Phase 5 — 카메라·전투·직업 개편 ✅ 완료

- 고정 아이소메트릭 카메라, 스크롤 줌만 유지
- 화살표 키 이동, QWER·ASDF 스킬 전용 키
- 스킬 키 재편 (1~9 / QWER / ASDF) — 인덱스 기반 17슬롯 매핑, 스킬바 UI 3행
- 직업별 스킬 이펙트 분리 (전사 / 궁수 / 마법사 / 도적 이펙트 8종)
- 도적(rogue) 직업 추가

## Phase 6 — 직업-인식 보스 시스템 ✅ 완료

> 보스: 붉은 수호자 (Red Guardian) — 3페이즈, 직업별 전략 차별화

- `src/types/boss.ts`, `src/constants/boss.ts` 기반 파일 작성
- `worldRefs.ts` — bossDamageFn, bossGateProximity 추가
- `gameStore.ts` — bossCleared, addFXBatch 추가
- App.tsx — `'field' | 'boss'` currentScene 전환
- BossArena.tsx — 원형 아레나 + Rapier 물리 벽 경계
- BossMonster.tsx — Phase 1~3 (돌진 → 근접 AoE → 8방향 파이어볼)
- BossEntry.tsx + BossGateMesh.tsx — 필드 동쪽 빨간 게이트

## Phase 7 — 맵·엔티티 컴포넌트 아키텍처 리팩터링 ✅ 완료

- `src/constants/maps.ts` — `MAPS` 상수, `MapConfig`/`MapId`/`MapType` 타입
- 맵 컴포넌트 분리: `FieldMap.tsx`, `BossArenaMap.tsx`
- NPC 컴포넌트 분리: `ShopkeeperNPC.tsx`, `GateKeeperNPC.tsx`
- 몬스터 컴포넌트 분리: `SlimeMonster.tsx`, `GoblinMonster.tsx`, `OrcMonster.tsx`, `RedGuardianBoss.tsx`

## Phase 8 — 에버그린 세계 완성·UX 개선 ✅ 완료

- 세계 구조: evergreenVillage → Meadow → Forest → Swamp → Ruins → kingBearChamber
- 동물 몬스터 8종 (닭·수탉·양·숫양·사슴·엘크·돼지·멧돼지)
- 대쉬 스킬 전 직업 추가 (5번 슬롯 공통, `dashUntil` ref 방식)
- 상호작용 키 시스템 (Space 통합, `controlsStore` + KEYS Set)
- 키 리매핑 UI: `KeySettings.tsx`, `MenuButton.tsx`, `GameMenu.tsx`
- 피격 데미지 표시: `PlayerDamageNumbers.tsx`

## Phase 9 — 캐릭터 성장 심화 ✅ 완료

- 스킬 포인트 시스템 (레벨업 시 SP +1, 패널 뱃지 깜빡임)
- 스킬 강화 1→5레벨 (`SkillState.level`, `upgradeSkill`)
- 패시브 트리 (HP/MP/ATK/DEF 레벨당 보너스, `passiveUpgrades` 스토어)
- 성장 패널 UI (K키, 강화/패시브 탭, 드래그 이동)

## Phase 10 — 직업별 GLB 캐릭터 모델 + 무기 + 애니메이션 ✅ 완료

- KayKit Adventurers 2.0 FREE (CC0) — warrior/archer/mage/rogue.glb
- `CHARACTER_MODELS`, `WEAPON_MODELS`, `CHARACTER_ANIMATIONS` 상수 추가
- 캐릭터 모델 폴더 구조 job-per-folder 재편 (`characters/{job}/model.glb`, `shared/animations/`)
- Character.tsx — GLB 모델 + `useGLTF.preload()` + `CuboidCollider` 분리
- 애니메이션 상태 머신 (Death_A → Hit_A → Slash/Throw → Running_A → Walking_A → Idle_A)
- `WeaponSlot` 컴포넌트 — `handslotr`/`handslotl` 본에 무기 부착 (KayKit Rig_Medium 실제 본 이름)
- 전사 슬래시 애니메이션 (Mixamo Sword And Shield Slash, timeScale 조정으로 500ms 단축)
- 공격·스킬 중 이동 잠금 (`playerAnimSignals.attackUntil` timestamp 방식)
- 전사 슬래시 FX 제거 — GLB 모션 + 히트박스만 유지, 250ms 히트 딜레이 적용
- 몬스터 사망 시 데미지 숫자 미표시 버그 수정 (dead 분기 JSX 누락 원인)
- 방패 오프셋 조정 (`SHIELD_OFFSET` 상수, `handslotl` 본 부착)
- `Monster.tsx` — `useRef` 배열 내 호출 훅 규칙 위반 수정, HP 색상 헬퍼 분리, 색상 상수화
- `useSkillInput.ts` — `ppos.clone()` stale closure 수정, `fireSlash`/`fireBlast` 헬퍼 분리, 타입 단언 제거, `BLAST_ARC_COS` 상수 추출
- `worldRefs.ts` — `bossDamageFnRef` ref 객체 패턴 통일, `consumePlayerDamageEvents()` 캡슐화
- `MapConfig` — `spawnPos` 필드 추가, 전체 맵 스폰 좌표 정의
- `useCharacterPhysics.ts` — 낙하 복구를 현재 맵 `spawnPos` 기반으로 변경, `FALL_THRESHOLD` 상수화
- `AGENTS.md` — `useGameStore` 내장 `useShallow` 명시, `docs/todo/Todos.md` 현행화 의무 추가

## Phase UI — HUD·UX 전면 개편 ✅ 완료

- 다크 글래스 UI 시스템 도입 (오버레이·모달·토스트 전체 적용)
- MP 시스템 제거 (CharacterPanel HP·EXP만)
- HUD 레이아웃 재편 (`charInfo/`, `expBar/`, `miniMap/` 서브폴더)
- 스킬 바 최적화 (36px 슬롯, 이모지 아이콘, `SKILL_ICON` 상수)
- 레벨 기반 스킬 해금 시스템 (`requiredLevel`, 🔒 잠금 배지)
- 드래그 앤 드롭 스킬 키 배치 (SkillWindow → 스킬바)
- 미니맵 구현 (Canvas 120×120, `MAP_MARKERS` 상수, 5종 마커)

## Phase 12 — 펫 시스템 ✅ 완료 (GLB 에셋 제외) → ⚠️ 2026-05-18 전면 제거, 재설계 예정

> 알 수집 → 부화기 → 확률 부화 → 팔로우 + 자동공격 + 패시브 버프 + 특수스킬
> **시스템 변경으로 인해 아래 구현물 전체 삭제. 기록 목적으로만 유지.**

- `src/constants/pet.ts` — `PET_GRADES/SPECIES/EGG_GRADES`, `HATCH_RATES`, `PET_GRADE_ATK_MULT`, 아이콘/레이블/색상 상수
- `src/stores/petStore.ts` — zustand/persist (`mototo-pets`), `eggs[]`, `hatchSlots[]`, `activePet`, `pickedEggs`, `petSkillLastUsedAt`
- `src/hooks/usePetBehavior.ts` — lerp 팔로우, 포탈 텔레포트, 자동공격(플레이어 ATK 30%), 특수스킬(Normal: 힐)
- `src/components/game/pet/PetModel.tsx` — 구체 플레이스홀더 (GLB 교체 준비 구조), `Suspense` + fallback
- `src/components/game/world/EggObject.tsx` — Space 엣지 감지 획득, 5분 리스폰, Billboard 안내
- `src/constants/world.ts` — `MEADOW_EGGS` 3개 (일반×2, 희귀×1)
- `EvergreenMeadow.tsx` — `MEADOW_EGGS` 렌더
- `src/components/ui/window/hatcheryWindow/HatcheryWindow.tsx` — 부화 슬롯 2개, 진행도바, 확률 부화, 알 인벤토리
- `src/stores/gameStore.ts` — `totalAtk()` 펫 등급 배율 반영, `selectClass()` name 파라미터 추가
- `src/stores/controlsStore.ts` + `src/constants/controls.ts` — `hatchery: "KeyH"` 바인딩 추가
- `src/components/ui/hud/petHUD/PetHUD.tsx` — 펫 아이콘·이름·등급·스킬 쿨타임 HUD
- `src/main.scss` — `--grade-normal/rare/epic` 색상 변수 추가
- `WindowManager.tsx` — HatcheryWindow 등록 (H키 토글)
- `GameMenu.tsx` — 🥚 부화기 메뉴 항목 추가
- 미완: GLB 에셋 확보(Cat.glb·Fox.glb) 후 PetModel GLB 교체 필요

## Phase 15 — 캐릭터 생성 페이지 ✅ 완료

- `src/components/ui/overlay/characterCreate/CharacterCreate.tsx` — 2단계 플로우 (직업 선택 → 닉네임 입력)
  - 닉네임 실시간 유효성 검사 (2~12자, 한글·영문·숫자, Enter 확인)
  - 직업별 카드 hover 애니메이션 (`--cls-color` CSS 변수)
  - 스텝 인디케이터 (1·2 단계 표시)
- `src/stores/gameStore.ts` — `selectClass(cls, name?)` — 닉네임 저장
- `src/App.tsx` — `ClassSelect` → `CharacterCreate` 교체, 외부 `useShallow` 중복 제거
