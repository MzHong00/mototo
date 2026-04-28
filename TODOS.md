# TODOs

## 현황

Phase 1–5 구현 완료.
Phase 1–6 구현 완료.
Phase 7 구현 완료.

---

## ~~Phase 1 시작 전~~ ✅ 완료

### ~~캐릭터 이동 구현~~ ✅

- **What:** WASD + 마우스 카메라로 캐릭터가 3D 맵에서 움직임
- **How:** R3F Canvas + @react-three/rapier 지형 충돌

### ~~캐릭터 모델 로딩~~ ✅

- **What:** 로우폴리 캐릭터 모델 1개 (Mixamo 무료)

### ~~기본 맵 세팅~~ ✅

- **What:** 간단한 잔디 맵 + Rapier 지형 충돌

---

## ~~Phase 2 시작 전~~ ✅ 완료

### ~~애니메이션 상태 머신 설계~~ ✅

### ~~히트 감지 방식 결정~~ ✅

### ~~전투 루프 구현~~ ✅ (몹 3종, HP바, 경험치바 HUD)

---

## ~~Phase 3 시작 전~~ ✅ 완료

### ~~성장 시스템 구현~~ ✅ (레벨업, 스킬, 장비 드랍·장착)

### ~~zustand/persist version + migrate 적용~~ ✅

---

## ~~Phase 4 시작 전~~ ✅ 완료

### ~~포탈 시스템 (맵 이동)~~ ✅

### ~~직업 선택 화면~~ ✅ (전사 / 궁수 / 마법사)

### ~~NPC 거래 UI~~ ✅

---

## ~~Phase 5 — 카메라·전투·직업 개편~~ ✅ 완료

### ~~카메라 시스템 재작성~~ ✅

- 고정 아이소메트릭 카메라, 스크롤 줌만 유지

### ~~이동 키 재편~~ ✅

- 화살표 키 이동, QWER·ASDF 스킬 전용 키

### ~~스킬 키 재편 (1~9 / QWER / ASDF)~~ ✅

- 인덱스 기반 17슬롯 매핑, 스킬바 UI 3행

### ~~직업별 스킬 이펙트 분리~~ ✅

- 전사 / 궁수 / 마법사 / 도적 이펙트 8종

### ~~도적(rogue) 직업 추가~~ ✅

---

## ~~Phase 6 — 직업-인식 보스 시스템~~ ✅ 완료

> 설계 문서: `.gstack/projects/ai_tech/jeongminhong-main-design-20260427-094019.md`
> 보스: 붉은 수호자 (Red Guardian) — 3페이즈, 직업별 전략 차별화

### ~~기반 파일 작성~~ ✅

- `src/types/boss.ts` — BossPhase, BossState 타입
- `src/constants/boss.ts` — 보스 스탯, 페이즈 상수, 보상 아이템 (수호자의 검)

### ~~스토어·레퍼런스 확장~~ ✅

- `worldRefs.ts` — bossDamageFn, bossGateProximity 추가
- `gameStore.ts` — bossCleared, addFXBatch 추가

### ~~App.tsx — currentScene 로컬 state~~ ✅

- `'field' | 'boss'` 전환, DeathScreen respawn 시 필드 복귀 연동

### ~~BossArena.tsx~~ ✅

- 원형 아레나 바닥 + 경계 링 + 어두운 배경
- Rapier 물리 바닥 + 16개 벽 콜라이더로 진짜 경계 구현

### ~~BossMonster.tsx — Phase 1~3 전부~~ ✅

- Phase 1 (HP 100%→60%): 기본 돌진 + 근접 공격
- Phase 2 (HP 60%→30%): 근접 폭풍 AoE (반경 3.5, 1초마다 15 데미지) — 근접 직업 불리
- Phase 3 (HP 30%→0%): 8방향 파이어볼 2.5초마다 + 2초 예고 경고 링 — 원거리 직업 불리
- 페이즈 전환 시 1초 무적 + 색상 변화 (빨강→주황→보라)

### ~~BossEntry.tsx + BossGateMesh.tsx~~ ✅

- 필드 동쪽(x=15)에 빨간 게이트 오브젝트
- 근접 시 커스텀 Dialog (window.confirm 금지)
- bossCleared 분기: 첫 도전 vs 재도전 메시지 분리

### ~~Scene.tsx 업데이트~~ ✅

- currentScene 기반 조건부 렌더
- Sky ↔ 어두운 배경 전환, 필드 복귀 시 scene.background 명시 리셋

### 버그 수정 완료 ✅

- [x] 보스 씬에서 필드 맵(풀밭/나무)이 아레나 아래 보이던 문제 → Map 조건부 렌더
- [x] 필드 복귀 시 Sky 사라지던 문제 → SceneBackground 리셋
- [x] 보스 클릭 안 되던 문제 → 스폰 위치 분리 ([0,0,-8])
- [x] 아레나 경계 클램프 작동 안 하던 문제 → Rapier 물리 벽으로 교체
- [ ] 보스 입장 시 캐릭터 낙하 문제 → bossEnterTrigger 텔레포트 + 바닥 두께 6으로 확장

---

## ~~Phase 7 — 맵·엔티티 컴포넌트 아키텍처 리팩터링~~ ✅ 완료

> `Scene.tsx`의 `field`/`boss` 조건 분기를 없애고, 맵·NPC·몬스터를 **이름 기반 개별 컴포넌트**로 관리

### ~~맵 상수 + 타입~~ ✅

- `src/constants/maps.ts` — `MAPS` 상수로 맵 id·type(`normal|boss`)·label·flashColor 정의
- `src/types/map.ts` — `MapConfig`, `MapId`, `MapType` 타입

### ~~맵 컴포넌트 분리~~ ✅

- `src/components/game/maps/FieldMap.tsx`, `BossArenaMap.tsx`
- `Scene.tsx`는 `mapId: MapId`만 받아 `MAP_COMPONENTS` record로 렌더링 — 조건문 제거

### ~~NPC 컴포넌트 분리~~ ✅

- `src/components/game/npc/ShopkeeperNPC.tsx` — 위치·상호작용 자체 관리
- `src/components/game/npc/GateKeeperNPC.tsx` — 보스 게이트 메시 + 근접 감지

### ~~몬스터 컴포넌트 분리~~ ✅

- `src/components/game/monster/SlimeMonster.tsx` (green)
- `src/components/game/monster/GoblinMonster.tsx` (blue)
- `src/components/game/monster/OrcMonster.tsx` (red)
- `src/components/game/monster/RedGuardianBoss.tsx` — `BossMonster.tsx` 이전
- `Monsters.tsx` — `MONSTER_COMPONENTS` record로 타입→컴포넌트 매핑 단순화

### ~~보스 컴포넌트 포함 모든 도메인 컴포넌트 분리~~ ✅

---

## Phase 8 — 다음 콘텐츠 후보

> office-hours에서 선정한 우선순위 순서

### 던전/추가 맵 + 보스 시스템 확장 ⬜

- 보스 아레나 외 2~3개 던전 구역 추가
- 구역별 고유 몬스터 + 배경 테마

### 캐릭터 성장 심화 ⬜

- 스킬 강화 (레벨업 포인트 투자)
