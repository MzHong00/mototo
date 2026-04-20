# 테스트 가이드

## 테스트 전략

| 레이어 | 테스트 종류 | 도구 |
|--------|------------|------|
| Api (`server/`) | 단위 테스트 (HTTP 모킹) | Jest + MSW |
| Service | 단위 테스트 (순수 로직) | Jest |
| Hook | 단위 테스트 | Jest + React Testing Library |
| Component | 통합 테스트 | Jest + React Testing Library |
| 페이지 흐름 | E2E 테스트 | Playwright |

## 파일 위치

```
├── server/
│   └── [feature]/
│       ├── [feature].api.ts
│       └── __tests__/[feature].api.test.ts
├── services/
│   ├── [name].service.ts
│   └── __tests__/[name].service.test.ts
├── hooks/
│   └── [feature]/
│       ├── use[Name].ts
│       └── __tests__/use[Name].test.ts
└── components/
    └── features/
        └── [feature]/
            ├── [Name].tsx
            └── __tests__/[Name].test.tsx

e2e/[feature]-flow.spec.ts   # 단위: .test.ts / E2E: .spec.ts
```

## 레이어별 원칙

**Api (`server/`)** — MSW로 HTTP 요청 흐름 검증 · 성공/4xx/5xx/네트워크 에러 케이스 포함 · 응답이 도메인 타입으로 매핑되는지 확인

**Service** — `server/[feature]/[feature].api.ts`는 Jest mock으로 대체 · 경계값·유효성 실패·비즈니스 룰 위반 케이스 필수

**Hook** — `renderHook`으로 단독 테스트 · 비동기 상태 변화는 `waitFor`로 검증 · loading → success / error 전환 확인

**Component** — 사용자 행동(클릭·입력)과 결과(텍스트·콜백) 검증 · 내부 구현 세부사항 테스트 금지 · `getByRole`·`getByLabelText` 접근성 쿼리 우선

**E2E** — 핵심 사용자 플로우 중심 · 세부 UI 검증은 컴포넌트 테스트에 위임 · `data-testid`는 E2E에서만 사용

## 공통 규칙

- **AAA 패턴**: Arrange → Act → Assert
- **독립성**: 테스트 간 상태 공유 금지 · `beforeEach`로 초기화
- **단언 최소화**: 테스트 1개당 핵심 단언 1~3개
- **모킹 최소화**: 가능한 낮은 레이어까지 실제 구현 사용
- **설명**: `it('~하면 ~한다')` 형식
