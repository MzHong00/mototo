# TODOs

완료된 항목은 `TodosSuccess.md` 참조.

---

## 버그픽스 · 고도화 (2026-05-18)

- [x] **피격 데미지 수치 텍스트 미소멸 버그 수정** — `useCharacterPhysics.ts` setDamages 반환 조건 오류 (`next.length === 0`일 때 `prev` 반환 → `prev.length === 0` 조건으로 수정)
- [x] **만렙 50 설정** — `MAX_LEVEL = 50` 상수 추가, `gainExp` 만렙 체크, `ExpBar` 만렙 시 100% 고정

---

## Phase 11 — GLB 몬스터·보스 비주얼 업그레이드 🚧 진행 중

> 설계 문서: `~/.gstack/projects/ai_tech/jeongminhong-main-design-20260506-094535.md`
> 테스트 플랜: `~/.gstack/projects/ai_tech/jeongminhong-main-test-plan-20260506-100033.md`
> 구체(sphere) → Quaternius CC0 무료 GLB 3D 모델 교체. Fix 1-9 블로커 설계 반영 완료.

### [사용자 액션] 에셋 준비

- [ ] **에셋 소스 결정**: Quaternius quaternius.com Ultimate Animals Pack 또는 Kenney.nl
  - 둘 다 무료 CC0, GLB 직접 제공
  - Quaternius 팩에 wildBoar/bear 실제 포함 여부 다운로드 전 목록 확인 필요
- [ ] **GLB 파일 배치**: `/public/models/monsters/` 폴더 생성 후 다음 12종 복사
  - Chicken.glb, Rooster.glb (에버그린 초원)
  - Sheep.glb, Ram.glb (에버그린 숲)
  - Deer.glb, Elk.glb (에버그린 늪지)
  - Pig.glb, WildBoar.glb (에버그린 유적)
  - Bear.glb (킹베어 보스 + 에버그린 챔버용)
  - 기타 추가 필요 시

### [코드] 상수 업데이트

- [ ] **`src/constants/monster.ts`**
  - `MonsterStats` 인터페이스에 `modelScale: number` 필드 추가
  - `MONSTER_MODELS` 경로 맵 추가 (`{ chicken: '/models/monsters/Chicken.glb', ... }`)
  - Fix 4: `"boar"` 키 → `"wildBoar"` camelCase 수정
  - Fix 8: 각 몬스터별 `modelScale` 초기값 설정 (캘리브레이션 전 임시값 1.0)

### [코드] Monster.tsx 교체

- [ ] **`src/components/game/monster/Monster.tsx`**
  - sphereGeometry → `useGLTF` + `Clone` (drei) 패턴으로 교체
  - Fix 2: `useGLTF` 훅 컴포넌트 최상단 호출 (JSX 외부)
  - Fix 3: `<Suspense fallback={<sphereGeometry />}>` 경계 추가
  - Fix 5: hit flash → `groupRef.current.traverse()` 멀티머티리얼 패턴
  - Fix 6: 어그로 표시 → eyeMatRefs 제거, `<ringGeometry>` Billboard 인디케이터
  - Fix 7: 죽음 그림자 → flat sphere → `<circleGeometry>`
  - Fix 1: RigidBody 참조 오류 없음 확인 (Monster.tsx는 pure Three.js position math)

### [코드] KingBearBoss.tsx 교체

- [ ] **`src/components/game/monster/boss/KingBearBoss.tsx`**
  - 동일한 GLB Clone 패턴 적용 (Fix 2-7)
  - Bear.glb 사용, 보스 스케일 별도 설정

### [코드] 맵 파일 업데이트

- [ ] **`src/components/game/maps/EvergreenMeadow.tsx`**
  - `useGLTF.preload()` 호출 추가
  - `useEffect` cleanup 시 `useGLTF.clear()` 호출 (Fix 9: VRAM 해제)
- [ ] **`src/components/game/maps/KingBearChamber.tsx`** — 동일 패턴

### [테스트] 스케일 캘리브레이션

- [ ] **12종 개별 modelScale 튜닝** (예산 2-3시간)
  - `new THREE.Box3().setFromObject(scene)` 측정 후 각 모델 크기 파악
  - 게임 월드 스케일 기준으로 개별 modelScale 값 조정
  - 보스는 일반 몬스터 대비 1.5-2× 크게 설정

---

## Phase 16 — 스킬 트라이포드 시스템

> 설계 문서: `~/.gstack/projects/ai_tech/jeongminhong-main-design-20260518-155652.md`
> 스킬 콘텐츠 문서: `docs/content/Class.md`
> 각 스킬에 Tier 1·2 특성을 찍으면 스킬 동작 자체가 바뀌는 시스템. 전사부터 프로토타입 후 나머지 3클래스 적용.

### Step 1 — 타입·상수

- [ ] `src/types/skillTree.ts` 신규 — `SkillNodeModifier`, `SkillBehaviorTag`, `SkillNodeChoice`, `SkillTierDef`, `SkillTreeDef`, `ResolvedSkillParams`
- [ ] `src/constants/skillTree.ts` 신규 — `WARRIOR_SKILL_TREES` (slash·charge·taunt·cataclysm 각 Tier 1·2)
- [ ] `src/types/character.ts` — `SkillState`에 `selectedNodes: Record<number, string>` 필드 추가
- [ ] `src/stores/gameStore.ts` — `selectSkillNode(skillId, tier, choiceId)` 액션 추가 (토글 취소 지원)

### Step 2 — 전사 스킬 교체 (charge·taunt·cataclysm)

- [ ] `src/constants/character.ts` — `CLASS_CONFIG.warrior.skills` 업데이트
  - `shield` → `charge` (돌진, CD 8s)
  - `heal` → `taunt` (도발, CD 15s)
  - `blast` → `cataclysm` (파멸의 일격, CD 25s)
- [ ] 전투 로직에서 `charge` · `taunt` · `cataclysm` 핸들러 추가

### Step 3 — 전투 로직 연동

- [ ] `src/game/skill/applySkillModifiers.ts` 신규
  - `selectedNodes`를 읽어 `ResolvedSkillParams` 반환
  - `damageMultiplier`, `cooldown`, `fxType`, `targetType`, `behaviorTags[]`, `statusEffects[]` 합산
- [ ] `behaviorTag` 분기 처리
  - `aoe_360` — 360° 원형 타격 범위
  - `reflect_damage` — 방패 해제 시 blast FX + AOE 데미지
  - `speed_boost` — 버프 중 이동속도 배율 적용
  - `execute_bonus` — HP 40% 이하 데미지 2배
  - `dash_then_attack` — 순간이동 후 공격

### Step 4 — SkillWindow UI

- [ ] `src/components/ui/window/skillWindow/SkillWindow.tsx` — 트리 뷰 교체
  - 스킬 탭 (베기·돌진·도발·파멸의 일격)
  - Tier 행: 잠금(회색) / 선택 가능 / 선택됨(accent 테두리) 3상태
  - 클릭 → `selectSkillNode` 호출, 재클릭 → 취소
  - `disabled: true` 노드 → "준비 중" 표시

### Step 5 — 나머지 3클래스 (전사 검증 후)

- [ ] `src/constants/character.ts` — archer·mage·rogue 스킬 교체
  - 궁수: `rapid_shot` 유지, `piercing_arrow`·`backstep`·`explosive_arrow`
  - 마법사: `fireball` 유지, `ice_spike`·`blink`·`black_hole`
  - 도적: `shuriken` 유지, `shadow_slash`·`smoke_bomb`·`death_dance`
- [ ] `ARCHER_SKILL_TREES`, `MAGE_SKILL_TREES`, `ROGUE_SKILL_TREES` 상수 정의

---

## Phase 12 — 펫 시스템 🔄 재설계 필요

> 기존 구현(petStore, usePetBehavior, PetModel, PetEgg, PetHUD, PetWindow 등)을 전면 제거함 (2026-05-18).
> 새로운 시스템 설계 후 재구현 예정.

- [ ] 펫 시스템 재설계 (스펙 확정 후 이 섹션에 세부 태스크 추가)

---

## Phase 13 — 경매장 시스템

> 설계 완료 (2026-05-11) — **B Full Market** 전략 확정
> 설계 문서: `~/.gstack/projects/ai_tech/main-auction-design-20260511-092929.md`

**전략:** MapleStory 자유시장 스타일 고정가 마켓. 진짜 플레이어 간 거래.
**백엔드:** Supabase free tier (PostgreSQL + supabase-js, 폴링 30s, WebSocket 없음)
**신원:** 로컬 UUID + zustand/persist (로그인 없음)

### Week 1 — 백엔드 + 데이터 레이어

- [ ] Supabase 프로젝트 생성 + `auction_listings`, `transactions` 테이블 마이그레이션
- [ ] `@supabase/supabase-js` 설치
- [ ] `src/server/auction/auction.client.ts` — Supabase 클라이언트 싱글턴
- [ ] `src/server/auction/auction.queries.ts` — fetchListings, createListing, buyListing, cancelListing, fetchPriceStats, fetchMyTransactions
- [ ] `src/server/auction/auction.types.ts` — AuctionListing, Transaction, PriceStats, ListingFilter 타입
- [ ] `src/stores/auctionStore.ts` — UUID 초기화 + zustand/persist
- [ ] `src/constants/config.ts` — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 래핑 (미설정 시 조기 에러)
- [ ] `src/hooks/useAuctionPolling.ts` — 30s 폴링 + Visibility API 탭 비활성 시 중단
- [ ] `src/hooks/useAuctionListings.ts` — 전체 목록 + 필터 상태

### Week 2 — 전체 시장 UI

- [ ] `src/components/ui/window/auctionWindow/AuctionWindow.tsx` — WindowManager 패턴 루트 + 탭 구조 (전체 시장 / 내 등록 / 내 거래내역 / 시세)
- [ ] `tabs/MarketTab.tsx` — 목록 + 필터 + 폴링 연동
- [ ] `ListingCard.tsx` — 아이템명/등급/직업/스탯/가격/구매버튼
- [ ] `MarketFilter.tsx` — 아이템타입/직업/등급/가격범위 필터 (ListingFilter 타입)
- [ ] 구매 플로우: gameStore gold 차감 + 인벤토리 추가 + Toast 피드백

### Week 3 — 내 등록 + 거래내역 + 시세 + 등록폼

- [ ] `tabs/MyListingsTab.tsx` + 취소 기능 (cancelListing)
- [ ] `src/hooks/useMyListings.ts` + `src/hooks/useMyTransactions.ts`
- [ ] `tabs/MyHistoryTab.tsx` — 구매/판매 내역 (buyer_uuid / seller_uuid 기준)
- [ ] `tabs/PriceTab.tsx` + `src/hooks/usePriceStats.ts` — 아이템별 최근 50건 avg/min/max + 거래 건수
- [ ] `ListingForm.tsx` — 인벤토리 아이템 선택 → 가격 입력 → 등록 (일일 50건 rate limit 클라이언트 검증)

### Week 4 — 연동 + 마무리

- [ ] WindowManager에 AuctionWindow 추가
- [ ] HUD / NPC 상호작용으로 경매장 창 오픈 트리거
- [ ] 만료 매물 (`expires_at < now()`) 폴링 시 자동 필터링
- [ ] buyListing atomic 처리 (Supabase RPC — `status = 'active'` WHERE 조건)
- [ ] 전체 Toast 피드백 (구매 완료, 등록 완료, 취소 완료, 한도 초과)

---

## Phase 14 — 인증 + 서버 연동 + 데이터 저장

> **전략:** Supabase Auth (Phase 13 동일 인스턴스 재사용) + Google OAuth 오픈베타
> 웹소켓 미사용 — 게임 종료 전 명시적 저장 방식으로 캐릭터 데이터 영속화

### Week 1 — Supabase Auth + Google OAuth

- [ ] Supabase 프로젝트에서 Google OAuth Provider 활성화
- [ ] `src/constants/config.ts` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 래핑 (Phase 13과 공유)
- [ ] `src/server/auth/auth.client.ts` — Supabase 클라이언트 싱글턴 (Phase 13 `auction.client.ts`와 통합 고려)
- [ ] `src/server/auth/auth.queries.ts` — `signInWithGoogle()`, `signOut()`, `getSession()`, `onAuthStateChange()`
- [ ] `src/stores/authStore.ts` — `session`, `user`, `isLoading` (zustand, persist 제외 — 세션은 Supabase가 관리)
- [ ] `src/components/ui/overlay/loginScreen/LoginScreen.tsx` + `.module.scss`
  - 다크 글래스 패널 패턴 적용
  - 구글 로그인 버튼 (Primary 버튼 스타일)
  - 오픈베타 안내 문구
- [ ] `src/hooks/useAuth.ts` — 세션 감지 + `authStore` 동기화
- [ ] `App.tsx` — 비로그인 시 `LoginScreen` 렌더, 로그인 완료 시 게임 진입

### Week 2 — DB 스키마 + 캐릭터 데이터 저장

- [ ] Supabase `characters` 테이블 마이그레이션
  ```sql
  characters(
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES auth.users,
    name text,
    job_class text,
    level int, hp int, max_hp int, exp int,
    base_atk int, base_def int,
    gold int,
    inventory jsonb,        -- Item[]
    equipped jsonb,         -- EquipSlots
    skills jsonb,           -- SkillState[]
    passive_upgrades jsonb, -- Record<PassiveStat, number>
    key_bindings jsonb,     -- controlsStore bindings
    current_map_id text,
    cleared_bosses text[],
    updated_at timestamptz DEFAULT now()
  )
  ```
- [ ] `src/server/character/character.queries.ts` — `fetchCharacter(userId)`, `saveCharacter(data)`, `createCharacter(data)`
- [ ] `src/hooks/useCharacterSync.ts` — 저장 로직 담당 훅
  - `saveToServer()` — gameStore 현재 상태 → `saveCharacter()` 호출
  - `loadFromServer()` — DB 데이터 → gameStore `setState()` 적용
  - `beforeunload` 이벤트 리스너 등록 (게임 종료 전 자동 저장)
- [ ] `App.tsx` — 로그인 직후 `loadFromServer()` 호출, 캐릭터 없으면 캐릭터 생성 화면으로

### Week 3 — 명시적 저장 UI + 소셜 로그인 확장 준비

- [ ] **메뉴에 저장 버튼 추가** (`GameMenu.tsx`)
  - "저장" 버튼 클릭 → `saveToServer()` 호출 + Toast 피드백 ("저장 완료")
  - 저장 중 로딩 상태 표시
- [ ] **자동 저장 인터벌** (5분마다 백그라운드 저장, Visibility API 탭 비활성 시 중단)
- [ ] **키 설정 저장** — `controlsStore` bindings도 `characters.key_bindings`에 포함
- [ ] **소셜 로그인 확장 준비** — `auth.queries.ts`에 `signInWithKakao()`, `signInWithNaver()` 스텁 추가
  - 카카오/네이버는 Supabase Custom OAuth Provider로 추후 활성화
  - 로그인 버튼 UI는 disabled 상태로 미리 배치 ("준비 중")

---

## Phase 15 — 캐릭터 생성 페이지 ✅ 완료 (서버 저장 제외)

> 완료 항목은 `TodosSuccess.md` 참조.
> 서버 저장(Phase 14 의존)과 닉네임 중복 체크는 Phase 14 완료 후 연동 예정.

### [Phase 14 연동 후] 잔여 작업

- [ ] `src/server/character/character.queries.ts` — `checkNameDuplicate(name)` + `createCharacter(data)`
- [ ] `CharacterCreate` Step 2 — 닉네임 중복 체크 실시간 연동
- [ ] 캐릭터 생성 시 서버 저장 + Toast 피드백 (캐릭터 생성 완료, 닉네임 중복)
- [ ] `App.tsx` — 로그인 O + 캐릭터 있음 → 바로 게임 분기 추가
