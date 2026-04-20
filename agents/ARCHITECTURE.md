# 아키텍처 가이드

## 폴더 구조

```
├── middleware.ts               # Next.js 미들웨어 (인증 라우트 가드, 반드시 루트에 위치)
│
├── app/                        # Next.js App Router (라우팅 전용)
│   ├── (auth)/                 # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/                 # 메인 라우트 그룹
│   │   ├── [feature]/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── not-found.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── providers/                  # 앱 레벨 Provider 래퍼
│   ├── query-provider.tsx      # QueryClientProvider
│   └── index.tsx               # 전체 Provider 조합
│
├── components/                 # UI 컴포넌트
│   ├── common/                 # 도메인 무관 재사용 컴포넌트
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Dialog/
│   │   ├── Toast/
│   │   └── ErrorBoundary/      # 페이지 단위 Error Boundary
│   └── features/               # 도메인별 컴포넌트
│       └── [feature]/
│           ├── [Feature]Card.tsx
│           ├── [Feature]List.tsx
│           └── index.ts
│
├── hooks/                      # 커스텀 훅
│   ├── common/                 # 공통 훅 (useDebounce, useMediaQuery 등)
│   └── [feature]/              # 도메인별 훅
│       └── use[Feature].ts
│
├── services/                   # 비즈니스 로직
│   └── [feature].service.ts
│
├── server/                     # 서버 상태 (HTTP 호출 + TanStack Query)
│   └── [feature]/
│       ├── [feature].api.ts    # HTTP 호출 · 도메인 에러 변환
│       └── [feature].queries.ts # queryOptions · mutation · 키 정의
│
├── stores/                     # Zustand 전역 상태
│   └── [feature].store.ts
│
├── types/                      # 타입 정의
│   ├── common.ts               # 공통 타입 (ApiResponse, Pagination 등)
│   └── [feature].ts            # 도메인 타입 (Dto, Entity, ViewModel)
│
├── constants/                  # 상수
│   ├── config.ts               # 환경변수 래핑 (process.env 직접 참조 금지)
│   ├── routes.ts               # 라우트 경로
│   ├── api.ts                  # API 엔드포인트
│   └── [feature].ts            # 도메인별 상수
│
├── lib/                        # 외부 라이브러리 설정 및 래퍼
│   ├── axios.ts                # Axios 인스턴스 설정
│   └── query-client.ts         # TanStack Query 클라이언트 설정
│
└── utils/                      # 순수 유틸 함수 (부수효과 없음)
    ├── format.ts               # 날짜·숫자·문자열 포맷
    └── validator.ts            # 공통 유효성 검사

# @/* → 루트 기준 (tsconfig paths: "@/*": ["./*"])
# 예) @/components/common/Button → components/common/Button
```

## 상태 관리 기준

| 상태 유형    | 도구            | 기준                             |
| ------------ | --------------- | -------------------------------- |
| 서버 상태    | TanStack Query  | API에서 가져오는 모든 데이터     |
| 전역 UI 상태 | Zustand         | 여러 페이지에서 공유되는 UI 상태 |
| 로컬 상태    | useState        | 단일 컴포넌트 내에서만 사용      |
| 폼 상태      | React Hook Form | 폼 입력값 및 유효성 검사         |
