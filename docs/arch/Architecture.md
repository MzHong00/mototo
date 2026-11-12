# 아키텍처

## 스택

React 19 · Three.js · React Three Fiber · drei · Rapier · Zustand · Vite · TypeScript · SCSS Modules

## 치비 캐릭터 (원본: `~/Desktop/chibi-pipeline`)

- `src/engine/chibi/character.js` 는 `chibi-pipeline/web/character.js` **원본 사본**. 직접 수정하지 않는다.
- 타입은 옆의 `character.d.ts`.
- 캐릭터·파츠·썸네일 갱신: `~/Desktop/chibi-pipeline/scripts/sync_game.sh` (→ `public/chibi/`)
- 새 파츠(머리·옷)는 파이프라인에서 만들고 동기화만 한다.

## 폴더

```
src/
  App.tsx                 캐릭터 유무·꾸미기 여부로 화면 선택
  screens/                characterCreate(만들기·꾸미기) · game
  components/game/        character(ChibiPreview) · world(GameCanvas·PlayerCharacter·TestGround·FollowCamera·SunLight)
  components/ui/          common/chibiEditor(꾸미기 패널) · hud(GameHud)
  hooks/                  useChibiCharacter · useChibiAnimations · useCharacterAnimation · usePlayerMovement · useAttackInput
  engine/                 chibi(원본 사본) · runtime(keyState·frameState: 프레임 공유 상태)
  stores/                 characterStore(persist) · uiStore
  constants/ utils/ types/ styles/
```

## 프레임 상태

렌더와 무관한 매 프레임 값(플레이어 위치·방향·애니메이션 신호)은 `engine/runtime/frameState.ts` 의 가변 객체로 공유한다. React 상태로 올리지 않는다.
