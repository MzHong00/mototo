# TODOs

완료된 항목은 `TodosSuccess.md` 참조.

---

## 🔥 현재 진행 중

### Phase 11 — GLB 몬스터·보스 비주얼 업그레이드

> Quaternius CC0 무료 GLB 3D 모델로 교체. Fix 1-9 블로커 설계 반영 완료.

#### [사용자 액션] 에셋 준비

- [ ] **에셋 소스 결정**: Quaternius quaternius.com Ultimate Animals Pack 또는 Kenney.nl
  - 둘 다 무료 CC0, GLB 직접 제공
  - Quaternius 팩에 wildBoar/bear 실제 포함 여부 다운로드 전 목록 확인 필요
- [ ] **GLB 파일 배치**: `/public/models/monsters/` 폴더에 12종 복사
  - Chicken.glb, Rooster.glb (에버그린 초원)
  - Sheep.glb, Ram.glb (에버그린 숲)
  - Deer.glb, Elk.glb (에버그린 늪지)
  - Pig.glb, WildBoar.glb (에버그린 유적)
  - Bear.glb (킹베어 보스 + 챔버용)

#### [코드] 구현

- [ ] `src/constants/monster.ts` — `modelScale` 필드 추가, `MONSTER_MODELS` 경로 맵 추가, `"boar"` → `"wildBoar"` 수정
- [ ] `Monster.tsx` — sphereGeometry → `useGLTF` + `Clone` 패턴, hit flash, 어그로 인디케이터, 죽음 그림자 교체
- [ ] `KingBearBoss.tsx` — 동일 GLB Clone 패턴 적용, Bear.glb 사용
- [ ] `EvergreenMeadow.tsx`, `KingBearChamber.tsx` — `useGLTF.preload()` + cleanup 시 `useGLTF.clear()` 추가

#### [테스트]

- [ ] 12종 개별 `modelScale` 튜닝 (Box3 측정 후 월드 스케일 기준 조정, 보스 1.5~2×)

---

## 📋 예정

### Phase 12 — 펫 시스템 재설계

> 기존 구현(petStore, usePetBehavior, PetModel 등) 전면 제거 완료 (2026-05-18).
> 새로운 시스템 설계 후 재구현 예정.

- [ ] 펫 시스템 재설계 (스펙 확정 후 세부 태스크 추가)

---

### Phase 13 — 경매장 시스템

> **전략:** MapleStory 자유시장 스타일 고정가 마켓. 실제 플레이어 간 거래.
> **백엔드:** Supabase free tier (PostgreSQL + supabase-js, 폴링 30s)
> **신원:** 로컬 UUID + zustand/persist (로그인 없음)

#### Week 1 — 백엔드 + 데이터 레이어

- [ ] Supabase 프로젝트 생성 + `auction_listings`, `transactions` 테이블 마이그레이션
- [ ] `@supabase/supabase-js` 설치
- [ ] `src/server/auction/auction.client.ts` — Supabase 클라이언트 싱글턴
- [ ] `src/server/auction/auction.queries.ts` — fetchListings, createListing, buyListing, cancelListing, fetchPriceStats, fetchMyTransactions
- [ ] `src/server/auction/auction.types.ts` — AuctionListing, Transaction, PriceStats, ListingFilter 타입
- [ ] `src/stores/auctionStore.ts` — UUID 초기화 + zustand/persist
- [ ] `src/constants/config.ts` — VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 래핑 (미설정 시 조기 에러)
- [ ] `src/hooks/useAuctionPolling.ts` — 30s 폴링 + Visibility API 탭 비활성 시 중단
- [ ] `src/hooks/useAuctionListings.ts` — 전체 목록 + 필터 상태

#### Week 2 — 전체 시장 UI

- [ ] `AuctionWindow.tsx` — WindowManager 패턴, 탭 구조 (전체 시장 / 내 등록 / 내 거래내역 / 시세)
- [ ] `tabs/MarketTab.tsx` — 목록 + 필터 + 폴링 연동
- [ ] `ListingCard.tsx` — 아이템명/등급/직업/스탯/가격/구매버튼
- [ ] `MarketFilter.tsx` — 아이템타입/직업/등급/가격범위 필터
- [ ] 구매 플로우: gameStore gold 차감 + 인벤토리 추가 + Toast 피드백

#### Week 3 — 내 등록 + 거래내역 + 시세 + 등록폼

- [ ] `tabs/MyListingsTab.tsx` + 취소 기능 (cancelListing)
- [ ] `tabs/MyHistoryTab.tsx` — 구매/판매 내역
- [ ] `tabs/PriceTab.tsx` — 아이템별 최근 50건 avg/min/max + 거래 건수
- [ ] `ListingForm.tsx` — 인벤토리 선택 → 가격 입력 → 등록 (일일 50건 rate limit 클라이언트 검증)

#### Week 4 — 연동 + 마무리

- [ ] WindowManager에 AuctionWindow 추가, HUD/NPC 오픈 트리거
- [ ] 만료 매물 자동 필터링 (`expires_at < now()`)
- [ ] buyListing atomic 처리 (Supabase RPC)
- [ ] 전체 Toast 피드백 (구매/등록/취소 완료, 한도 초과)

---

### Phase 14 — 인증 + 서버 연동 + 데이터 저장

> **전략:** Supabase Auth (Phase 13 동일 인스턴스) + Google OAuth 오픈베타
> 게임 종료 전 명시적 저장 방식으로 캐릭터 데이터 영속화

#### Week 1 — Supabase Auth + Google OAuth

- [ ] Supabase Google OAuth Provider 활성화
- [ ] `src/server/auth/auth.client.ts` — Supabase 클라이언트 싱글턴 (Phase 13과 통합 고려)
- [ ] `src/server/auth/auth.queries.ts` — `signInWithGoogle()`, `signOut()`, `getSession()`, `onAuthStateChange()`
- [ ] `src/stores/authStore.ts` — `session`, `user`, `isLoading` (zustand, persist 제외)
- [ ] `LoginScreen.tsx` + `.module.scss` — 다크 글래스 패널, Google 로그인 버튼, 오픈베타 안내
- [ ] `src/hooks/useAuth.ts` — 세션 감지 + authStore 동기화
- [ ] `App.tsx` — 비로그인 시 LoginScreen, 로그인 완료 시 게임 진입

#### Week 2 — DB 스키마 + 캐릭터 저장

- [ ] Supabase `characters` 테이블 마이그레이션
  ```sql
  characters(
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES auth.users,
    name text, job_class text,
    level int, hp int, max_hp int, exp int,
    base_atk int, base_def int, gold int,
    inventory jsonb, equipped jsonb,
    skills jsonb, key_bindings jsonb,
    current_map_id text, cleared_bosses text[],
    updated_at timestamptz DEFAULT now()
  )
  ```
- [ ] `src/server/character/character.queries.ts` — `fetchCharacter`, `saveCharacter`, `createCharacter`
- [ ] `src/hooks/useCharacterSync.ts` — `saveToServer()`, `loadFromServer()`, `beforeunload` 자동 저장
- [ ] `App.tsx` — 로그인 후 `loadFromServer()`, 캐릭터 없으면 캐릭터 생성 화면

#### Week 3 — 저장 UI + 소셜 로그인 확장 준비

- [ ] `GameMenu.tsx` — "저장" 버튼 추가 → `saveToServer()` + Toast 피드백
- [ ] 자동 저장 인터벌 (5분, Visibility API 탭 비활성 시 중단)
- [ ] `controlsStore` bindings도 `characters.key_bindings`에 포함
- [ ] `auth.queries.ts` — `signInWithKakao()`, `signInWithNaver()` 스텁 (disabled UI)

---

### Phase 15 잔여 — 서버 저장 연동 (Phase 14 완료 후)

- [ ] `character.queries.ts` — `checkNameDuplicate(name)` + `createCharacter(data)`
- [ ] `CharacterCreate` Step 2 — 닉네임 중복 체크 실시간 연동
- [ ] 캐릭터 생성 시 서버 저장 + Toast 피드백
- [ ] `App.tsx` — 로그인 O + 캐릭터 있음 → 바로 게임 분기

---

### Phase 16 잔여 — 스킬 트리 전투 로직 연동

> UI·타입·상수·스토어 구현 완료 (2026-05-20). 전투 효과 반영이 남은 상태.

- [ ] `src/game/skill/applySkillModifiers.ts` 신규
  - `selectedNodes`를 읽어 `ResolvedSkillParams` 반환
  - `damageMultiplier`, `cooldown`, `fxType`, `targetType`, `behaviorTags[]`, `statusEffects[]` 합산
- [ ] `behaviorTag` 분기 처리
  - `aoe_360` — 360° 원형 타격 범위
  - `reflect_damage` — 방패 해제 시 blast FX + AOE 데미지
  - `speed_boost` — 버프 중 이동속도 배율 적용
  - `execute_bonus` — HP 40% 이하 데미지 2배
  - `dash_then_attack` — 순간이동 후 공격
- [ ] `SkillWindow` 스킬 업그레이드 버튼 → `downgradeSkill` 연동 확인
