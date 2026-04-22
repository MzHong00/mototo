# 아키텍처 가이드

## 폴더 구조

```
├── index.html                  # Vite 진입점 (Google Fonts <link> 포함)
├── vite.config.ts              # Vite 설정 (플러그인, @/ 알리아스)
│
└── src/                        # 모든 소스 파일
    ├── main.tsx                # 앱 진입점 (createRoot)
    ├── App.tsx                 # 루트 컴포넌트 (게임 메인 화면)
    ├── globals.css             # 전역 CSS (디자인 토큰, Tailwind import)
    │
    ├── components/             # UI 컴포넌트
    │   ├── game/               # 게임 전용 컴포넌트
    │   │   ├── Scene.tsx       # R3F Canvas 루트
    │   │   ├── Character.tsx   # 플레이어 캐릭터
    │   │   ├── Monster.tsx     # 몹 단일 인스턴스
    │   │   ├── Monsters.tsx    # 몹 목록 관리
    │   │   ├── Map.tsx         # 사냥터 맵
    │   │   ├── HUD.tsx         # HP/MP/EXP 오버레이
    │   │   ├── Inventory.tsx   # 인벤토리 UI
    │   │   ├── Shop.tsx        # NPC 상점 UI
    │   │   ├── ClassSelect.tsx # 직업 선택 화면
    │   │   ├── DeathScreen.tsx # 사망 화면
    │   │   ├── Portal.tsx      # 맵 이동 포탈
    │   │   ├── Npc.tsx         # NPC 메시
    │   │   ├── SkillEffects.tsx # 스킬 이펙트
    │   │   └── LevelUpEffect.tsx # 레벨업 이펙트
    │   └── common/             # 도메인 무관 재사용 컴포넌트
    │       └── ErrorBoundary/  # 페이지 단위 Error Boundary
    │
    ├── stores/                 # Zustand 전역 상태
    │   ├── gameStore.ts        # 게임 상태 (HP, EXP, 레벨, 인벤토리)
    │   └── worldRefs.ts        # R3F 씬 간 공유 ref
    │
    ├── hooks/                  # 커스텀 훅
    │   ├── common/             # 공통 훅 (useDebounce, useMediaQuery 등)
    │   └── [feature]/          # 도메인별 훅
    │       └── use[Feature].ts
    │
    ├── services/               # 비즈니스 로직
    │   └── [feature].service.ts
    │
    ├── server/                 # 서버 상태 (HTTP 호출 + TanStack Query)
    │   └── [feature]/
    │       ├── [feature].api.ts    # HTTP 호출 · 도메인 에러 변환
    │       └── [feature].queries.ts # queryOptions · mutation · 키 정의
    │
    ├── types/                  # 타입 정의
    │   ├── common.ts           # 공통 타입
    │   └── [feature].ts        # 도메인 타입
    │
    ├── constants/              # 상수
    │   ├── config.ts           # 환경변수 래핑 (import.meta.env 사용, process.env 금지)
    │   ├── routes.ts           # 라우트 경로
    │   └── [feature].ts        # 도메인별 상수
    │
    └── utils/                  # 순수 유틸 함수 (부수효과 없음)
        ├── format.ts           # 날짜·숫자·문자열 포맷
        └── validator.ts        # 공통 유효성 검사

# @/* → src/ 기준 (tsconfig paths: "@/*": ["./src/*"])
# 예) @/components/game/Scene → src/components/game/Scene
```

## 상태 관리 기준

| 상태 유형    | 도구            | 기준                             |
| ------------ | --------------- | -------------------------------- |
| 서버 상태    | TanStack Query  | API에서 가져오는 모든 데이터     |
| 전역 UI 상태 | Zustand         | 여러 페이지에서 공유되는 UI 상태 |
| 로컬 상태    | useState        | 단일 컴포넌트 내에서만 사용      |
| 폼 상태      | React Hook Form | 폼 입력값 및 유효성 검사         |
