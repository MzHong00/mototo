# 조작

> 자판 그림에 기능 아이콘을 **끌어다 놓아** 키를 내 맘대로 정한다. 이동·점프·카메라 기본 규칙도 여기서 정의.

## 확정 사항

- 기능을 키에 고정하지 않는다. **자판 그림에 기능 아이콘을 끌어 놓는** 키 설정 (메이플식).
- 기본 배치: WASD·방향키 이동, Shift 달리기, Space 점프. 공격 키는 고정하지 않음 (현재 J는 임시).
- 스킬은 A·B·C·D 콤보 4개뿐 ([Combat.md](Combat.md)). 키 하나 연타 = 4단 콤보.
- 게임패드·모바일 터치는 나중.

## 규칙과 수치

### 1. 키 설정 화면

```
┌──────────────────────── 키 설정 ─────────────────────────┐
│ [Esc][F1]...[F12]                                         │
│ [`][1][2][3][4][5][6][7][8][9][0][-][=][⌫]                │
│ [Tab][Q][W↑][E][R][T][Y][U][I][O][P][[][]][\]             │
│ [Caps][A←][S↓][D→][F][G][H][J⚔A][K][L][;]['][Enter]       │
│ [Shift🏃][Z][X][C][V][B][N][M][,][.][/][Shift🏃]          │
│ [Ctrl][Alt][   Space 점프   ][Alt][Ctrl]   [←][↑][↓][→]   │
├───────────────────────────────────────────────────────────┤
│ 기능 서랍: [이동][점프][달리기][상호작용][A][B][C][D]...   │
│ [기본값으로] [되돌리기]                       [저장] [닫기] │
└───────────────────────────────────────────────────────────┘
```

| 동작 | 결과 |
| --- | --- |
| 서랍 아이콘 → 빈 키에 놓기 | 배치 |
| 서랍 아이콘 → 이미 찬 키에 놓기 | 덮어쓰기. 밀려난 기능은 서랍으로 돌아감 |
| 키 위 아이콘 → 다른 키 | 이동. 대상 키가 찼으면 **서로 맞바꿈** |
| 키 위 아이콘 → 자판 밖 | 해제 |
| 키 클릭 후 기능 클릭 | 끌기 없이 배치 (접근성·트랙패드) |
| 서랍 아이콘 → 소비 아이템 | 가방에서 끌어 놓기도 가능 |

- 한 기능을 **여러 키**에 둘 수 있다 (예: 이동 WASD + 방향키).
- 한 키에는 **기능 하나**만.
- 잠긴 키: `Esc`(설정 닫기·메뉴)는 바꿀 수 없음. 브라우저 단축키(`Ctrl+W`, `F5`, `F11`, `F12`)는 배치 금지(회색).
- 방향 이동 4개는 "이동" 묶음으로 끌면 WASD 모양 그대로 4칸에 놓인다 (선택: 낱개 배치도 가능).
- 아직 해금 안 된 스킬은 서랍에 자물쇠로 보이고 끌 수 없음.
- 키 설정 창은 아무 때나 열 수 있고, 열린 동안 게임은 멈춤. 다른 창의 정지 규칙은 [Ui.md](Ui.md).
- 같은 키를 일반 기능과 편집 기능에 함께 둘 수 있다(문맥이 달라 겹치지 않음). 편집 모드 안 Ctrl+Z(되돌리기)는 고정.

### 2. 배치 가능한 기능

| 분류 | 기능 | 비고 |
| --- | --- | --- |
| 이동 | 위·아래·왼·오른, 달리기, 점프, 구르기 | 구르기는 전투 2단계 |
| 행동 | 상호작용(줍기·말 걸기·문), 무기 넣기/꺼내기 | |
| 편집 | 편집 모드 들어가기, 회전, 집어넣기·철거 | 회전·철거는 편집 모드 안에서만 동작 ([Housing.md](Housing.md)) |
| 전투 | 스킬 A, B, C, D | 해금된 것만 |
| 빠른 칸 | 소비 아이템 1~8 | 8칸 고정. 가방 칸과 별개(아이템 참조만) |
| 메뉴 | 가방, 기술, 장비·외형, 스킬 조립, 주민, 지도, 키 설정, HUD 숨기기 | |
| 카메라 | (나중) 회전·확대 | |

### 3. 기본 배치

| 키 | 기능 |
| --- | --- |
| W A S D, 방향키 | 이동 |
| Shift | 달리기 |
| Space | 점프 |
| J | 스킬 A (임시) |
| K / L / U | 스킬 B / C / D (해금 시 자동 배치) |
| F | 상호작용 |
| 1~8 | 빠른 칸 |
| I | 가방 |
| T | 기술 |
| E | 장비·외형 |
| O | 스킬 조립 |
| N | 주민 |
| M | 지도 |
| B | 편집 모드 (집·마을) |
| R / Delete | 편집 모드 안: 회전 / 집어넣기·철거 |
| \\ | 키 설정 |
| Esc | 메뉴 / 닫기 (고정) |

- 새 스킬이 해금되면 기본 키가 비어 있을 때만 자동 배치. 차 있으면 서랍에 두고 알림.

### 4. 저장

- [Save.md](Save.md)의 `settings` 묶음(`mototo:settings`)에 `keys`로 저장. 별도 localStorage 키를 만들지 않는다 (저장 규칙 통일).
- 키 식별은 `KeyboardEvent.code` (자판 위치 기준, 한/영 상태 무관). 현재 코드(`src/engine/runtime/keyState.ts`)와 같음.
- 버전 숫자로 저장. 기능 목록이 바뀌면 없는 기능은 버리고, 새 기능은 기본값으로 채움.
- 프리셋 칸 2개(기본·보조) — 2단계.

### 5. 입력 처리 규칙

- 매 프레임 `code → action` 표를 한 번 찾는다(Map). 바인딩 바뀔 때만 표 재생성.
- 채팅·이름 입력처럼 글 입력 칸에 포커스가 있으면 게임 키 무시.
- 창 포커스 잃으면(blur) 눌린 키 전부 해제 (끼임 방지).
- 스킬 키는 **누른 순간**만 입력 (꾹 누르기 연타는 안 됨, 2단계에 옵션 검토).

### 6. 이동

- 걷기·달리기, 부드러운 가속·방향 전환
- 점프 약 1m, 공중에서 다시 점프 불가
- 경사로 오르내리기, 35cm 이하 턱은 자동으로 올라섬
- 떨어지면 시작 위치로 복구

### 7. 카메라

- 고정 각도로 캐릭터를 따라온다. 회전·확대는 나중.

## 데이터 모델

```ts
type MoveAction = 'up' | 'down' | 'left' | 'right' | 'run' | 'jump' | 'roll';
type ActAction = 'interact' | 'sheathe';
type EditAction = 'build' | 'rotate' | 'remove';   // rotate·remove 는 편집 모드에서만
type SkillAction = 'skillA' | 'skillB' | 'skillC' | 'skillD';
type QuickAction = `quick${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
type MenuAction = 'bag' | 'skills' | 'equip' | 'combo' | 'npcs' | 'map' | 'keyConfig' | 'hideHud';
type GameAction = MoveAction | ActAction | EditAction | SkillAction | QuickAction | MenuAction;

type KeyCode = string;               // KeyboardEvent.code, 예 'KeyJ'

interface KeyBinding {
  code: KeyCode;
  action: GameAction;
}

interface QuickSlot {
  index: number;                     // 1~8
  itemId: string | null;             // 소비 아이템
}

interface KeyConfig {
  version: 1;
  bindings: KeyBinding[];            // 같은 문맥(일반/편집) 안에서 code는 겹치지 않음
  quickSlots: QuickSlot[];
}

export const QUICK_SLOT_COUNT = 8;
export const LOCKED_CODES: KeyCode[] = ['Escape'];
export const BLOCKED_CODES: KeyCode[] = ['F5', 'F11', 'F12'];

export const DEFAULT_BINDINGS: KeyBinding[] = [
  { code: 'KeyW', action: 'up' }, { code: 'ArrowUp', action: 'up' },
  { code: 'KeyS', action: 'down' }, { code: 'ArrowDown', action: 'down' },
  { code: 'KeyA', action: 'left' }, { code: 'ArrowLeft', action: 'left' },
  { code: 'KeyD', action: 'right' }, { code: 'ArrowRight', action: 'right' },
  { code: 'ShiftLeft', action: 'run' }, { code: 'ShiftRight', action: 'run' },
  { code: 'Space', action: 'jump' },
  { code: 'KeyJ', action: 'skillA' },
  { code: 'KeyF', action: 'interact' },
  { code: 'KeyI', action: 'bag' }, { code: 'KeyT', action: 'skills' },
  { code: 'KeyE', action: 'equip' }, { code: 'KeyM', action: 'map' },
  { code: 'KeyO', action: 'combo' }, { code: 'KeyN', action: 'npcs' },
  { code: 'KeyB', action: 'build' }, { code: 'KeyR', action: 'rotate' }, { code: 'Delete', action: 'remove' },
  { code: 'Backslash', action: 'keyConfig' },
  // Digit1~8 → quick1~8
];

/** 바인딩 → 조회표. 바인딩 바뀔 때만 다시 만든다 */
type ActionLookup = Map<KeyCode, GameAction>;
```

- 현재 `src/constants/ui/controls.ts`의 `KEY_BINDINGS`(action → code[])는 `DEFAULT_BINDINGS`로 옮기고, 스토어(Zustand)에서 저장값을 읽어 덮는다.

## 단계 (MVP → 이후)

| 단계 | 만들 것 | 수용 기준 |
| --- | --- | --- |
| 1 | `KeyConfig` 스토어 + `settings` 묶음 저장, `code→action` 조회표로 입력 교체. 설정 화면 없이 기본값만 | 기존 조작이 그대로 동작. 저장값의 J를 K로 바꾸면 K로 공격 |
| 2 | 키 설정 화면: 자판 그림, 끌어 놓기·맞바꾸기·해제, 기본값·되돌리기·저장 | 아무 기능을 아무 키로 옮기고 새로고침 후에도 유지. 잠긴 키에는 안 놓임 |
| 3 | 빠른 칸(소비 아이템), 해금 스킬 자동 배치, 클릭 배치 | 가방에서 음식을 1번 키로 끌면 1번으로 먹음 |
| 4 | 프리셋 2개, 게임패드, 모바일 터치 | |

## 참고한 게임

- MapleStory: 키 설정 창에 스킬·소비 아이템을 끌어 놓음, 기본/보조 프리셋과 기본값 버튼. https://maplestory.nexon.net/game/beginners-guide/controls
- MapleStory Classic World: 이동 키도 바꿀 수 있고 배치 3개 저장. https://meowdb.com/msclassic/guides/controls-and-settings
- 입력 버퍼 일반론: 키 입력을 짧게 저장해 반응성 확보 (콤보는 [Combat.md](Combat.md)). https://www.wayline.io/blog/input-buffering-responsive-game-feel

## 열린 질문

| 질문 | 제안 기본값 |
| --- | --- |
| 공격(스킬 A) 기본 키 | J 유지 (WASD 오른손 짝) |
| 이동 키도 바꿀 수 있게? | 가능 (낱개 배치 허용) |
| 꾹 누르면 콤보 자동 연타? | 1단계는 안 됨. 나중에 옵션 |
| 프리셋 개수 | 2개 (기본·보조), 3단계 이후 |
| 마우스 클릭 공격 | 안 함 (키보드 위주). 나중 검토 |
