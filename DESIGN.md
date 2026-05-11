# 브라우저 RPG 디자인 시스템 — 모토토 (Mototo)

Neutral UI + Sky Blue Accent — 무채색 기반에 하늘색 포인트.

---

## 프로덕트 컨텍스트

- **게임명:** 모토토 (Mototo)
- **장르:** 브라우저 기반 3D RPG
- **스택:** React 19 + Three.js (R3F) + Zustand + CSS Modules
- **감성:** 허접하지 않되 세련되지도 않은 — 닌텐도 DS 시절 RPG처럼 공들인 티가 나되 힘 빼고 만든 느낌

---

## 미적 방향

- **방향:** Storybook-RPG — 밝고 생동감 있는 세계관, 조용하고 세련된 UI
- **장식 수준:** Intentional — 기능적 색상은 살리되 UI 자체는 절제
- **분위기:** 기본 UI는 무채색(흰 패널, 회청 보더)으로 조용하게. 포인트 컬러(`#74B9E8`)는 활성 상태·중요 강조에만.

---

## 컬러 팔레트

### CSS 변수 (main.scss)

```css
:root {
  /* 배경 */
  --bg:            #D6E8FF;   /* 전체 배경 (하늘색) */
  --surface:       #EAF2FF;   /* 서피스 레이어 */

  /* 패널 */
  --panel-bg:      #FFFFFF;   /* 기본 패널 배경 */
  --panel-sub:     #F4F7FA;   /* 보조 패널 — 스킬 슬롯, 인벤토리 */
  --panel-warm:    #FFFAF0;   /* 다이얼로그·상점 전용 크림 배경 */

  /* 보더 */
  --border:        #C8D8E8;   /* 기본 보더 — 무채색 회청 */
  --border-active: #74B9E8;   /* 포인트 보더 — 활성·강조 전용 */

  /* 상태 바 */
  --hp:            #FF4D4D;   /* HP 빨강 */
  --exp:           #55CC22;   /* EXP 초록 */

  /* 텍스트 */
  --text:          #1A1A2E;   /* 기본 텍스트 */
  --text-muted:    #7A8AA0;   /* 보조 텍스트 */

  /* 액션 */
  --accent:        #74B9E8;   /* 포인트 컬러 — 하늘색 */
  --success:       #33BB55;
  --danger:        #FF3344;

  /* 그림자 */
  --shadow-card:   0 2px 8px rgba(0,0,0,0.08), 0 4px 0 rgba(0,0,0,0.06);

  /* 데미지·힐 타입 */
  --dmg-physical:  #FF6B35;
  --dmg-magic:     #9B59B6;
  --dmg-heal:      #27AE60;

  /* 상태 효과 */
  --status-poison: #7FB800;
  --status-burn:   #E74C3C;
  --status-freeze: #3498DB;
}
```

### 색상 역할 요약

| 토큰 | 값 | 쓰임새 |
|------|-----|--------|
| `--border` | `#C8D8E8` | 대부분의 패널·슬롯 기본 보더 |
| `--border-active` | `#74B9E8` | 활성 슬롯, 선택된 창, 레벨업 패널 |
| `--accent` | `#74B9E8` | Primary 버튼, 레벨 뱃지, 포인트 강조 |
| `--panel-warm` | `#FFFAF0` | NPC 대화창, 상점 패널 전용 |
| `--hp` | `#FF4D4D` | HP 바, 위험 알림 |
| `--exp` | `#55CC22` | EXP 바 |
| `--dmg-physical` | `#FF6B35` | 물리 데미지 숫자 |
| `--dmg-magic` | `#9B59B6` | 마법 데미지 숫자 |
| `--dmg-heal` | `#27AE60` | 힐 숫자 |

---

## 타이포그래피

```css
:root {
  --font-ui:    'M PLUS Rounded 1c', sans-serif;  /* UI 전체 */
  --font-title: 'Shippori Mincho', serif;          /* 제목, NPC 이름 */
}
```

Google Fonts import (`index.html` `<head>`):

```html
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&family=Shippori+Mincho:wght@400;600&display=swap" rel="stylesheet">
```

| 용도 | 폰트 | 굵기 | 크기 |
|------|------|------|------|
| 게임 타이틀 / NPC 이름 | Shippori Mincho | 600 | 24px+ |
| HUD 캐릭터 이름 | Shippori Mincho | 600 | 15px |
| 숫자 (HP/EXP 값) | M PLUS Rounded 1c | **900** | 12–15px |
| 버튼 레이블 | M PLUS Rounded 1c | **900** | 13px |
| 본문 / 대화 | M PLUS Rounded 1c | 400 | 13–14px |
| 데미지·힐 숫자 | M PLUS Rounded 1c | **900** italic | 20–24px |

숫자는 반드시 `font-variant-numeric: tabular-nums` 적용.

---

## 스페이싱 & 반경

```css
:root {
  /* 스페이싱 */
  --sp-xs:  4px;
  --sp-sm:  8px;
  --sp-md:  16px;
  --sp-lg:  24px;
  --sp-xl:  32px;

  /* 보더 반경 */
  --r-sm:   4px;
  --r-md:   8px;
  --r-lg:   14px;
  --r-xl:   20px;
  --r-full: 9999px;
}
```

---

## 컴포넌트 패턴

### 패널 3종

```css
/* 기본 패널 — 대부분의 HUD */
.panel {
  background: var(--panel-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-md);
  box-shadow: var(--shadow-card);
}

/* 활성·강조 패널 — 포인트 컬러 */
.panel-active {
  background: var(--panel-bg);
  border: 2px solid var(--border-active);
  border-radius: var(--r-lg);
  padding: var(--sp-md);
  box-shadow: 0 0 0 3px rgba(116,185,232,0.15), var(--shadow-card);
}

/* 따뜻한 패널 — 다이얼로그·상점 전용 */
.panel-warm {
  background: var(--panel-warm);
  border: 1.5px solid var(--border);
  border-radius: var(--r-lg);
  padding: var(--sp-md);
  box-shadow: var(--shadow-card);
}

/* 보조 패널 — 스킬 슬롯·인벤토리 슬롯 배경 */
.panel-sub {
  background: var(--panel-sub);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
}
```

### 상태 바 (HP / MP / EXP)

```css
.bar-track {
  height: 10px;
  background: #E8EEF4;
  border-radius: var(--r-full);
  border: 1px solid var(--border);
  overflow: hidden;
}

.bar-hp  { background: linear-gradient(90deg, #FF2222, #FF6666); }
.bar-mp  { background: linear-gradient(90deg, #2255FF, #55AAFF); }
.bar-exp { background: linear-gradient(90deg, #22AA22, #66EE33); }
```

### 버튼

```css
.btn {
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 13px;
  padding: 9px 20px;
  border-radius: var(--r-full);
  border: 2px solid transparent;
  cursor: pointer;
  transition: filter 0.12s, transform 0.1s;
}
.btn:hover  { filter: brightness(1.08); transform: translateY(-1px); }
.btn:active { transform: translateY(0); filter: brightness(0.95); }

.btn-primary   { background: var(--accent); color: #fff; box-shadow: 0 3px 10px rgba(116,185,232,0.4); }
.btn-secondary { background: var(--panel-bg); color: var(--text); border-color: var(--border); }
.btn-ghost     { background: transparent; color: var(--text-muted); border-color: rgba(200,216,232,0.5); }
.btn-danger    { background: var(--danger); color: #fff; box-shadow: 0 3px 10px rgba(255,51,68,0.3); }
```

### 다크 글래스 패널 (오버레이·모달·윈도우 공통)

오버레이(ClassSelect, DeathScreen, BossEntry), Modal, Toast, MiniMap 등 게임 3D 뷰 위에 뜨는 모든 UI에 적용.

```css
/* 풀스크린 또는 반투명 오버레이 배경 */
.overlay {
  background: rgba(6, 10, 22, 0.82);
  backdrop-filter: blur(12px);
}

/* 다크 글래스 카드/패널 */
.glass-panel {
  background: rgba(10, 16, 30, 0.93);
  border: 1px solid rgba(116, 185, 232, 0.2);
  border-radius: var(--r-lg);
  box-shadow:
    0 0 0 1px rgba(116, 185, 232, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(116, 185, 232, 0.1);
  backdrop-filter: blur(12px);
}

/* 헤더 구분선 (MiniMap 상단 바 등) */
.glass-header {
  background: rgba(6, 10, 22, 0.6);
  border-bottom: 1px solid rgba(116, 185, 232, 0.1);
  padding: 5px 10px;
}
```

> 라이트 패널 (`--panel-bg: #FFFFFF`)은 NPC 상점·대화창 등 **마을 내 낮 배경** UI에만 사용.  
> 3D 뷰 위에 뜨는 UI는 반드시 다크 글래스 패턴을 사용한다.

### 커스텀 스크롤바 (main.scss 전역)

```css
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(116, 185, 232, 0.3) rgba(255, 255, 255, 0.04);
}
*::-webkit-scrollbar       { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.04); border-radius: 3px; }
*::-webkit-scrollbar-thumb { background: rgba(116, 185, 232, 0.3); border-radius: 3px; }
*::-webkit-scrollbar-thumb:hover { background: rgba(116, 185, 232, 0.5); }
```

### 스킬 슬롯

```css
.skill-slot {
  width: 36px; height: 36px;
  background: var(--panel-sub);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
}
.skill-slot.active   { border-color: var(--border-active); box-shadow: 0 0 0 2px rgba(116,185,232,0.3); }
.skill-slot.cooldown { opacity: 0.4; }
```

### 인벤토리 슬롯

```css
.inv-slot {
  aspect-ratio: 1;
  background: var(--panel-sub);
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
}
.inv-slot.equipped {
  border-color: var(--border-active);
  background: rgba(116,185,232,0.08);
  box-shadow: 0 0 0 2px rgba(116,185,232,0.2);
}
```

### 보스 HP 바

```css
.boss-bar-wrap {
  padding: var(--sp-sm) var(--sp-md);
  background: rgba(0,0,0,0.5);
  border: 1.5px solid rgba(255,51,68,0.5);
  border-radius: var(--r-lg);
}
.boss-track {
  height: 14px;
  background: #2A0000;
  border-radius: var(--r-full);
  border: 1px solid rgba(255,51,68,0.3);
  overflow: hidden;
}
.boss-fill {
  height: 100%;
  background: linear-gradient(90deg, #CC0000, #FF3344, #FF6666);
  border-radius: var(--r-full);
}
/* HP 25% 이하 경고 pulse */
.boss-fill.warning {
  animation: boss-pulse 1s ease-in-out infinite alternate;
}
@keyframes boss-pulse {
  from { filter: brightness(1); }
  to   { filter: brightness(1.3) drop-shadow(0 0 4px #FF3344); }
}
```

### 데미지·힐 숫자

```css
.dmg-number {
  font-family: var(--font-ui);
  font-weight: 900;
  font-style: italic;
  font-size: 22px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
  pointer-events: none;
  animation: dmg-float 600ms ease-out forwards;
}
@keyframes dmg-float {
  0%   { opacity: 1; transform: translateY(0) scale(1.1); }
  30%  { opacity: 1; transform: translateY(-20px) scale(1); }
  100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
}

.dmg-physical { color: var(--dmg-physical); }
.dmg-magic    { color: var(--dmg-magic); }
.dmg-heal     { color: var(--dmg-heal); }
```

### 상태 효과 배지

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--r-full);
  font-size: 11px;
  font-weight: 900;
  color: white;
}
.status-poison { background: var(--status-poison); }
.status-burn   { background: var(--status-burn); }
.status-freeze { background: var(--status-freeze); }
```

### 툴팁

```css
.tooltip {
  background: rgba(20,26,40,0.97);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: 8px 12px;
  color: #eee;
  max-width: 200px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  font-size: 12px;
  position: relative;
}
.tooltip::after {
  content: '';
  position: absolute;
  bottom: -8px; left: 20px;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 8px solid var(--border);
}
.tooltip-title {
  font-weight: 900;
  color: var(--accent);
  font-size: 13px;
  margin-bottom: 3px;
}
```

---

## 모션 토큰

| 이름 | 애니메이션 | 시간 |
|------|-----------|------|
| 패널 등장 | scale(0.95→1) + opacity(0→1) | 150ms ease-out |
| 스킬 발동 | glow pulse | 200ms |
| 데미지 숫자 | translateY(-60px) + fade | 600ms ease-out |
| 레벨 업 | radial flash + scale | 400ms |
| HP 위험(<25%) | 주황 pulse | 1s loop |

---

## HUD 레이아웃

```
┌─────────────────────────────────────────────────────┐
│ [미니맵 — 좌상단]   [캐릭터 정보 패널]               │
│  ┌──────────┐        Lv.12  홍길동                   │
│  │ Canvas   │        ████████░░ HP 840/1000          │
│  │ 120×120  │        ████████░░ EXP 78%              │
│  └──────────┘                                        │
│                                                      │
│               [3D 게임 뷰포트]                        │
│                                                      │
│  [다이얼로그 — panel-warm]                            │
│    ┌──────────────────────────────┐                  │
│    │  ⚔️   🛡️   ✨   💥   ⚡     │ ← 스킬 바 (36px) │
│    │  HP ████░░░░ 840/1000        │                  │
│    └──────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

- 미니맵: 좌상단 `position: absolute; top: 14px; left: 14px` — 다크 글래스 패널 + Canvas 120×120
- 캐릭터 패널: 미니맵 우측 — HP·EXP 바 (MP 없음)
- 스킬 바: 하단 중앙 — 슬롯 36px, 이모지 아이콘, HP 바(`HP {현재}/{최대}` 텍스트) 포함
- 다이얼로그: `panel-warm` (`#FFFAF0`) — 상점·NPC 대화 전용
- HTML overlay (`<div>`) — Three.js Canvas 위에 `position: absolute`

---

## 구현 주의사항

1. **HUD는 React DOM, 3D는 R3F Canvas** — Canvas를 `position: relative` 컨테이너로 감싸고 HUD `<div>`를 `position: absolute`로 오버레이.
2. **폰트 FOUT 방지** — `index.html` `<head>`에 Google Fonts `<link>` 태그 추가. `display=swap` 파라미터 포함.
3. **숫자 깜빡임 방지** — HP/EXP 숫자는 `font-variant-numeric: tabular-nums` + `font-weight: 900` 고정.
4. **색상 하드코딩 금지** — `#74B9E8` 직접 참조 금지. 반드시 `var(--accent)` 또는 `var(--border-active)` 사용.
5. **포인트 컬러 남용 금지** — `--border-active` / `--accent`는 활성 상태·강조 패널에만. 기본 UI는 `--border`(무채색).
6. **다크모드 없음** — MVP 범위 밖.
7. **3D 뷰 위 UI는 다크 글래스** — 오버레이·모달·미니맵 등 게임 뷰 위에 뜨는 UI는 라이트 패널이 아닌 다크 글래스 패턴 사용.
8. **스킬 아이콘은 이모지** — `SKILL_ICON` 상수(`src/constants/skill.ts`)에서 관리. 슬롯에 텍스트 레이블 사용 금지.
9. **미니맵은 Canvas** — worldRefs(playerPositionRef, monsterPositions 등)를 rAF 루프로 직접 읽어 그림. React state 구독 없음.

---

## 결정 로그

| 날짜 | 결정 | 근거 |
|------|------|------|
| 2026-05-09 | 기본 보더 → 무채색 `#C8D8E8` | 주황 골드 제거, 덜 게임스럽고 더 세련된 느낌 |
| 2026-05-09 | 포인트 컬러 → 하늘색 `#74B9E8` | 게임 월드(하늘색 배경)와 자연스럽게 연결 |
| 2026-05-09 | `panel-warm` 신규 도입 | 다이얼로그·상점에 온도 차이 부여 |
| 2026-05-09 | 데미지 숫자 타입별 컬러 분리 | 물리/마법/힐 즉시 구분 |
| 2026-05-11 | 오버레이·모달 전체 → 다크 글래스 | 3D 뷰 위에서 라이트 패널은 이질감 — 게임 분위기와 통일 |
| 2026-05-11 | MP 시스템 제거 | 현재 스킬 비용 구조 미정 — HUD 단순화 우선 |
| 2026-05-11 | 스킬 슬롯 아이콘 → 이모지 | 텍스트 레이블이 36px 슬롯에 너무 좁음 |
| 2026-05-11 | 미니맵 Canvas 방식 도입 | worldRefs 직접 폴링으로 Zustand 구독 없이 60fps 갱신 |
| 2026-05-11 | 스킬 해금 Lv10 단위 | 초반 슬롯이 모두 채워져 있으면 드래그 배치 의미 없음 |
