# 브라우저 RPG 디자인 시스템

MapleStory2 + Animal Crossing 감성 — 브라이트 원색, 아기자기한 3D 세계.

---

## 컬러 팔레트

### 시맨틱 토큰 (globals.css에 추가)

```css
:root {
  /* 배경 */
  --bg:            #D6E8FF;   /* 전체 배경 (연한 하늘색) */
  --surface:       #EAF2FF;   /* 서피스 레이어 */

  /* 패널 */
  --panel-bg:      #FFFFFF;   /* 기본 패널 배경 */
  --panel-blue:    #EAF2FF;   /* 보조 패널 (스킬슬롯, 인벤토리) */

  /* 보더 */
  --border:        #FFD700;   /* 기본 보더 — 골드 (강조 패널) */
  --border-blue:   #5BA3FF;   /* 보조 보더 — 블루 (일반 요소) */

  /* 상태 바 */
  --hp:            #FF4D4D;   /* HP 빨강 */
  --mp:            #4488FF;   /* MP 파랑 */
  --exp:           #55CC22;   /* EXP 초록 */

  /* 텍스트 */
  --text:          #1A1A2E;   /* 기본 텍스트 (딥 네이비) */
  --text-muted:    #5566AA;   /* 보조 텍스트 */

  /* 액션 */
  --accent:        #FF9900;   /* 1차 액션 (버튼, 레벨 뱃지) */
  --accent2:       #5BA3FF;   /* 2차 액션 */
  --success:       #33BB55;
  --danger:        #FF3344;
}
```

### 색상 역할 요약

| 토큰 | 값 | 쓰임새 |
|------|-----|--------|
| `--border` | `#FFD700` | 강조 패널, HUD 창, NPC 대화창 테두리 |
| `--border-blue` | `#5BA3FF` | 스킬 슬롯, 인벤토리, 일반 입력 |
| `--hp` | `#FF4D4D` | HP 바, 위험 알림 |
| `--mp` | `#4488FF` | MP 바 |
| `--exp` | `#55CC22` | EXP 바, 획득 알림 |
| `--accent` | `#FF9900` | 주 CTA 버튼, 레벨 뱃지, 장착 표시 |

---

## 타이포그래피

```css
:root {
  --font-ui:    'M PLUS Rounded 1c', sans-serif;  /* UI 전체 */
  --font-title: 'Shippori Mincho', serif;          /* 제목, NPC 이름 */
}
```

Google Fonts import (globals.css `<head>` 또는 `layout.tsx`):

```html
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&family=Shippori+Mincho:wght@400;600&display=swap" rel="stylesheet">
```

| 용도 | 폰트 | 굵기 | 크기 |
|------|------|------|------|
| 게임 타이틀 / NPC 이름 | Shippori Mincho | 600 | 24px+ |
| HUD 캐릭터 이름 | Shippori Mincho | 600 | 15px |
| 숫자 (HP/MP/EXP 값) | M PLUS Rounded 1c | **900** | 12–15px |
| 버튼 레이블 | M PLUS Rounded 1c | **900** | 13px |
| 본문 / 대화 | M PLUS Rounded 1c | 400 | 13–14px |

숫자는 반드시 `font-variant-numeric: tabular-nums` 적용 — 값이 바뀔 때 레이아웃 흔들림 방지.

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
  --r-full: 9999px;  /* 알약형 버튼, 레벨 뱃지 */
}
```

---

## 컴포넌트 패턴

### 패널

```css
.panel {
  background: var(--panel-bg);
  border: 2px solid var(--border);           /* 골드 테두리 */
  border-radius: var(--r-lg);
  padding: var(--sp-md);
  box-shadow: 0 2px 12px rgba(91,163,255,0.15), 0 0 0 1px rgba(255,215,0,0.3);
}

.panel-blue {
  background: var(--panel-blue);
  border: 2px solid var(--border-blue);      /* 블루 테두리 */
  border-radius: var(--r-lg);
  padding: var(--sp-md);
  box-shadow: 0 2px 12px rgba(91,163,255,0.2);
}
```

### 상태 바 (HP / MP / EXP)

```css
.bar-track {
  height: 12px;
  background: #C8DCFF;
  border-radius: var(--r-full);
  border: 1px solid rgba(91,163,255,0.3);
  overflow: hidden;
}

.bar-hp  { background: linear-gradient(90deg, #FF2222, #FF6666); }
.bar-mp  { background: linear-gradient(90deg, #2255FF, #55AAFF); }
.bar-exp { background: linear-gradient(90deg, #22AA22, #66EE33); }
```

### 버튼

```css
/* 공통 */
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
.btn:hover  { filter: brightness(1.1); transform: translateY(-1px); }
.btn:active { transform: translateY(0); filter: brightness(0.95); }

/* 1차 액션 (주황) */
.btn-primary { background: linear-gradient(135deg, #FF9900, #FFB300); color: #fff; box-shadow: 0 3px 10px rgba(255,153,0,0.4); }

/* 2차 액션 (파랑) */
.btn-blue    { background: linear-gradient(135deg, #4488FF, #66AAFF); color: #fff; box-shadow: 0 3px 10px rgba(68,136,255,0.4); }

/* 보조 */
.btn-secondary { background: var(--panel-bg); color: var(--text); border-color: var(--border-blue); }
.btn-ghost     { background: transparent; color: var(--text-muted); border-color: rgba(91,163,255,0.4); }
```

### 스킬 슬롯

```css
.skill-slot {
  width: 52px; height: 52px;
  background: var(--panel-blue);
  border: 2px solid var(--border-blue);
  border-radius: var(--r-md);
}
.skill-slot.active   { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(255,153,0,0.35); }
.skill-slot.cooldown { opacity: 0.4; }
```

### 인벤토리 슬롯

```css
.inv-slot {
  aspect-ratio: 1;
  background: var(--panel-blue);
  border: 2px solid var(--border-blue);
  border-radius: var(--r-sm);
}
.inv-slot.equipped { border-color: var(--accent); background: rgba(255,153,0,0.1); box-shadow: 0 0 0 2px rgba(255,153,0,0.3); }
```

---

## HUD 레이아웃

```
┌─────────────────────────────────────────┐
│ [캐릭터 정보 패널 — 좌상단]              │
│  Lv.12 ○  홍길동                        │
│  ██████░░░░ HP 840/1000                 │
│  ████░░░░░░ MP 320/500                  │
│  ████████░░ EXP 78%                     │
│                                         │
│          [3D 게임 뷰포트]                │
│                                         │
│    ┌──────────────────────┐             │
│    │ Q  W  E  R  [item]   │ ← 스킬 바  │
│    └──────────────────────┘             │
└─────────────────────────────────────────┘
```

- 캐릭터 패널: `rgba(255,255,255,0.93)` + `backdrop-filter: blur(4px)` — 3D 뷰 위에 떠 있는 느낌
- 스킬 바: 화면 하단 중앙, 동일한 반투명 패널
- HTML overlay (`<div>`) — Three.js Canvas 위에 `position: absolute`로 얹힘

---

## 구현 주의사항

1. **HUD는 React DOM, 3D는 R3F Canvas** — 서로 다른 레이어. Canvas를 `position: relative` 컨테이너로 감싸고, HUD `<div>`를 `position: absolute`로 오버레이.
2. **폰트 로딩 전 FOUT 방지** — `next/font/google`로 `M_PLUS_Rounded_1c`와 `Shippori_Mincho` 임포트. `display: 'swap'`.
3. **숫자 깜빡임** — HP/EXP 숫자는 `font-variant-numeric: tabular-nums` + `font-weight: 900` 고정.
4. **색상 직접 참조 금지** — 컴포넌트에서 `#FF4D4D` 하드코딩 금지. 반드시 `var(--hp)` 토큰 사용.
5. **다크모드 없음** — MVP 범위 밖. 토큰 구조는 다크모드를 나중에 붙일 수 있게 설계되어 있음.
