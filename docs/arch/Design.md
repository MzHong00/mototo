# 디자인 규칙 — 모토토 (Mototo)

> 토큰은 3계층(`src/styles/`): `_primitives.scss`(원시 팔레트) → `_semantic.scss`(역할 alias·다크모드 전환 지점) → `_component.scss`(컴포넌트 스코프·전역 기본값). `main.scss`가 순서대로 `@use`. 컴포넌트는 semantic 토큰만 참조.

---

## 감성

닌텐도 DS 시절 RPG — 공들인 티가 나되 힘 빼고 만든 느낌.

## 컬러

- 기본 UI는 무채색(`--border`)으로 조용하게.
- 포인트 컬러(`--accent`, `--border-active`)는 **활성 상태·강조에만** — 남용 금지.
- 색상 하드코딩 금지 → 반드시 CSS 변수 사용.

## 패널

- 마을·낮 배경 UI → 라이트 패널(`--panel-bg`, `--panel-warm`)
- 3D 뷰 위에 뜨는 UI (오버레이·모달·미니맵) → **반드시 다크 글래스 패턴**

## 브레이크포인트

`src/styles/_breakpoints.scss` — `$mobile-width: 768px` · `$mobile-height: 480px`(낮은 화면).
하드코딩 금지 → `@use "@/styles/breakpoints" as bp;` 후 `bp.$mobile-width`로 참조.
