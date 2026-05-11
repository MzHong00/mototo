# TODOs

완료된 항목은 `TODOS_SUCCESS.md` 참조.

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

## Phase 12 — 펫 시스템 📋 설계 완료 (CEO·Design·Eng 리뷰 반영)

> 설계 문서: `~/.gstack/projects/ai_tech/jeongminhong-main-design-20260506-174417.md`
> 알 수집 → 부화기 → 확률 부화 → 코스친 팔로우 + 자동공격 + 패시브 버프 + 등급별 특수스킬

### [사용자 액션] 에셋 확보 + 2h 감사 (Week 1 전 선행 필수)

- [ ] **quaternius.itch.io** 에서 Stylized Animals 팩 다운로드
  - Week 1 목표: 고양이(Cat.glb)·여우(Fox.glb) 2종만
  - `public/models/pets/` 폴더 생성 후 배치
  - 바로 `console.log(actions)` 로 GLB 클립명 확인 — `Idle` / `Walk` / `Attack` 실제 이름 기록

### [Week 1] 상수 + 스토어 + PetModel GLB 팔로우 (시각적 "와" 먼저)

- [ ] **`src/constants/pet.ts`** 생성
  - `PET_GRADES`, `PET_SPECIES`, `EGG_HATCH_DURATION_MS`, `PET_SKILL_COOLDOWN_MS`
- [ ] **`src/stores/petStore.ts`** 생성 (zustand/persist, `name: "mototo-pets"`)
  - `eggs[]`, `activePet`, `hatchStartedAt`, `pickedEggs: Record<eggId, pickedAt>`, `petSkillLastUsedAt`
- [ ] **`src/hooks/usePetBehavior.ts`** 생성 (Week 1: lerp 팔로우 로직만)
  - `useFrame` lerp — `FOLLOW_DISTANCE` 초과 시 캐릭터 위치로 이동
  - `portalTravelTrigger.pending` 감지 → petRef position 즉시 텔레포트 (Character.tsx는 건드리지 않음, pending 리셋 금지)
- [ ] **`src/components/game/pet/PetModel.tsx`** 생성
  - Character.tsx GLB 패턴 참조 (`useGLTF` + `useAnimations` + `playLoop`/`playOnce`)
  - `usePetBehavior` 호출
  - `Suspense` + fallback 구조
- [ ] devtest: `activePet` 하드코딩으로 펫이 캐릭터를 따라다니는 것 확인

### [Week 2] 알 오브젝트 (맵 배치 + Space 획득)

- [ ] **`src/components/game/world/EggObject.tsx`** 생성
  - Portal.tsx `prevInteract` 패턴 복사 — Space 엣지 감지
  - **Egg 근처이면 Portal보다 Space 우선** (거리 비교로 처리)
  - `pickedEggs` 확인 → 리스폰 전이면 invisible 처리
  - 획득 시 `petStore.addEgg()` + `useToast()` 알림
- [ ] 에버그린 초원 맵에 Normal 알 2~3개 고정 위치 배치 후 플로우 확인

### [Week 3] 부화기 UI (HatcheryWindow)

- [ ] **`src/components/ui/window/hatcheryWindow/HatcheryWindow.tsx`** + `.module.scss` 생성
  - `WindowManager`에 추가 (기존 InventoryWindow 패턴)
  - 알 클릭 → 부화기 슬롯 배치 (최대 2개 동시)
  - `Date.now() - hatchStartedAt` 진행도 표시
  - 테스트용 `EGG_HATCH_DURATION_MS = 10_000` (10초)로 먼저 검증
  - localStorage 소실 경고 — `useToast()`로 최초 1회 안내
- [ ] 부화 완료 시 확률 처리 (Normal/Rare/Epic 등급표)
- [ ] 부화 파티클: `<Sparkles count={40} size={0.3} speed={1.5}>` (drei, 0.8초 후 unmount)
- [ ] globals.css — `--grade-normal`, `--grade-rare`, `--grade-epic: #9966FF` 추가

### [Week 4] HUD + 패시브 버프 + 자동공격 + 특수스킬

- [ ] **`src/components/ui/hud/petHUD/PetHUD.tsx`** + `.module.scss` 생성
  - 등급 뱃지 + 특수스킬 쿨타임 잔여 (기존 `StatBar` 재활용)
  - `HUD.tsx`에 `<PetHUD />` 추가
- [ ] `gameStore.ts` `totalAtk()`·`totalDef()` — `getPetState()` 직접 호출로 등급 multiplier 반영
- [ ] `usePetBehavior.ts` 자동공격 추가
  - `prevAttackCount = useRef(...)` → useFrame 엣지 감지 → 반경 3 내 최근접 몬스터 `monsterDamageFns` 호출
- [ ] `usePetBehavior.ts` 특수스킬 자동 발동 (쿨타임 충족 + 전투 중)
  - Normal: `healHp()` (HP +30)
  - Rare: 이동속도 +30%, 3초
  - Epic: 보호막 50% 감소, 3초 (`activateShield()` 패턴)

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

## Phase 15 — 캐릭터 생성 페이지

> 로그인 후 DB에 캐릭터 없을 때 진입. 직업 선택 → 닉네임 입력 → 서버 저장 → 게임 시작.
> 기존 `ClassSelect` 오버레이를 대체하는 전용 페이지 흐름.

### Week 1 — 직업 선택 스텝

- [ ] `src/components/ui/overlay/characterCreate/CharacterCreate.tsx` + `.module.scss`
  - 다크 글래스 풀스크린 오버레이 패턴
  - Step 1 / Step 2 스텝 인디케이터
- [ ] `CharacterCreate` Step 1 — 직업 선택
  - 기존 `ClassSelect`의 직업 카드 UI 재활용 (warrior/archer/mage/rogue)
  - 직업 카드: 직업명(Shippori Mincho) + 기본 스탯(HP/ATK/DEF) + 대표 스킬 목록
  - 직업 hover 시 3D 모델 프리뷰 (R3F 미니 캔버스 or 이미지)
  - "다음" 버튼 → Step 2로 전환

### Week 2 — 닉네임 입력 + 서버 저장

- [ ] `CharacterCreate` Step 2 — 닉네임 입력
  - 텍스트 입력 (2~12자, 한글/영문/숫자, 특수문자 금지)
  - 실시간 유효성 검사 + 중복 체크 (`characters` 테이블 name 조회)
  - "이전" 버튼 → Step 1 복귀
  - "캐릭터 생성" 버튼 → 서버 저장 후 게임 시작
- [ ] `src/server/character/character.queries.ts` — `checkNameDuplicate(name)` 추가
- [ ] 캐릭터 생성 완료 시
  - `createCharacter()` 호출 → DB 저장
  - `gameStore.selectClass()` + 닉네임 반영 → 게임 인트로 시작
  - 기존 `ClassSelect` 오버레이 제거 (CharacterCreate로 대체)

### Week 3 — 기존 ClassSelect 제거 + 연동 마무리

- [ ] `ClassSelect.tsx` 삭제, `App.tsx`에서 `CharacterCreate` 조건부 렌더로 교체
  - 로그인 O + 캐릭터 없음 → `CharacterCreate`
  - 로그인 O + 캐릭터 있음 → 바로 게임
  - 로그인 X → `LoginScreen`
- [ ] `gameStore.selectClass()` — 닉네임 파라미터 추가 (`selectClass(cls, name)`)
- [ ] 전체 Toast 피드백 (캐릭터 생성 완료, 닉네임 중복, 유효성 오류)
