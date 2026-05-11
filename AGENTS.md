# AI 가이드

## 코드 작성 공통 규칙

**규칙 학습:** 사용자가 새로운 규칙을 제시하면 즉시 AGENTS.md의 프로젝트 코드 작성 규칙 섹션에 추가
**코드 품질:** 코드 작성 시 UX · 성능 · 보안 · 접근성 · 유지보수성 항상 고려
**간결성:** 최소한의 코드로 작성 · 불필요한 추상화·중간 변수·반복 제거 · 읽는 사람이 한눈에 의도를 파악할 수 있어야 함
**네이밍:** `camelCase` 변수·함수·폴더 · `PascalCase` 컴포넌트·타입·파일(.tsx·.scss) · `UPPER_SNAKE_CASE` 상수
**Import 순서:** 외부 → 내부(`@/`) → 타입(`import type`) → 스타일(`import styles`) 각 섹션은 빈 줄로 구분
**Export:** 컴포넌트 named · 배럴 index는 공개 API만
**타입:** `any` 금지 → `unknown` + 타입 가드 · Props는 파일 상단 `interface [Name]Props`
**문법:** ES2020+ 최신 문법 우선 사용
**함수:** 단일 책임 · 20줄 초과 시 분리 · 매직값 금지 → 상수 추출
**기존 자원 우선:** 구현 전 `package.json` 설치된 라이브러리 · `components/` · `hooks/` · `utils/` 기존 자원 확인 필수 → 활용 가능한 것이 있으면 반드시 사용 · 없을 때만 신규 생성
**하드코딩 금지:** 라우트·문자열 상수는 반드시 상수로 분리 · 색상·간격은 디자인 토큰 규칙 따름
**환경변수:** `process.env.*` 직접 참조 금지 → 반드시 `constants/config.ts`에서 래핑 후 사용 · `NEXT_PUBLIC_*`은 클라이언트 노출 여부 주석 명시 · 미설정 시 앱 시작 전 명시적 에러를 던져 조기 실패 유도
**UI 동작:** `window.alert/confirm` 금지 → Dialog/Toast 사용
**비동기:** async/await 우선(Promise chain 금지) · loading·error·empty 3상태 필수 처리
**훅 분리:** 컴포넌트 내 로직 30줄+ 또는 재사용 가능 로직 → Hooks로 추출
**상태 관리:** Props 2depth 초과 → Context/상태관리로 격상
**조건부:** 3항 연산자 1depth 제한 · 복잡하면 변수 추출 · &&는 boolean 조건만(`0 &&` 금지)
**레이어:** Component → Hook → Service → Api(`server/`) 단방향 · 컴포넌트는 UI만(비즈니스 로직 금지) · 단순 CRUD는 Hook → Api(`server/`) 직접 허용 · 비즈니스 로직 포함 시 Hook → Service → Api(`server/`) 필수
**에러 처리:** Api에서 네트워크·HTTP 에러를 도메인 에러로 변환 후 throw · Error Boundary는 페이지 단위 필수 적용 · 에러 타입은 `unknown` + 타입 가드로 좁힘
**디자인 토큰:** 색상·간격은 반드시 `main.scss`에 정의된 CSS 변수 사용 — 배경(`--bg` `--surface` `--panel-bg` `--panel-sub` `--panel-warm`) · 보더(`--border` `--border-active`) · 텍스트(`--text` `--text-muted`) · 액션(`--accent` `--danger` `--success`) · 상태 바(`--hp` `--mp` `--exp`) · 간격(`--sp-xs` ~ `--sp-xl`) · 반경(`--r-sm` ~ `--r-full`). 하드코딩된 색상·간격 값 금지 → 토큰 우선

## 코드 작성 프로젝트 규칙

**마크다운 현행화 의무:** 작업 완료 후 변경 내용과 관련된 `.md` 파일을 반드시 업데이트 — `README.md`(지역·NPC·몬스터·보스·직업·아이템) · `agents/ARCHITECTURE.md`(폴더·레이어 구조) · `agents/TESTING.md`(테스트 전략) · `DESIGN.md`(디자인 토큰·컴포넌트 패턴) · `agents/TODOS.md`(완료 항목 체크·신규 할 일 추가)

**[참조] 아키텍처:** 파일 생성·폴더 위치 결정 시 `agents/ARCHITECTURE.md` 참조
**[참조] 테스트:** 테스트 파일 작성·수정 시 `agents/TESTING.md` 참조

**[TanStack Query] 쿼리 정의:** 도메인별 `server/[feature]/[feature].queries.ts`에 키(`keys`)와 `queryOptions` · mutation 함께 정의 · `useQuery(userQueries.detail(id))` 형태로 사용 · 키 문자열 직접 사용 금지 · 계층 구조(`all→lists→detail(id)`)로 범위 무효화 가능하게 유지
**[Zustand] 셀렉터·useShallow:** `Store`는 내부에 `useShallow`가 내장되어 있도록 작성했으므로 외부에서 별도로 감쌀 필요 없음 · 셀렉터 없이 스토어 전체 구독 금지
**스타일:** 컴포넌트 파일(`.tsx`)과 반드시 동일 폴더에 `[ComponentName].module.scss` 쌍으로 생성 · 인라인 `style={{}}` 금지 → CSS Modules 사용 · 전역 스타일은 `main.scss`에만 작성
