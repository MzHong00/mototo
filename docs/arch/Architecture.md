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
  components/game/        character(ChibiPreview) · world(GameCanvas·CurrentMap·Terrain·MapObjects·ExitLabels·PlayerCharacter·FollowCamera·SunLight)
  components/ui/          common/chibiEditor(꾸미기 패널) · hud(GameHud·Minimap·ExitConfirmDialog·FadeOverlay) · worldMap(노선도 지도)
  hooks/                  캐릭터(useChibi*·useCharacterAnimation·usePlayerMovement·useActionInput) · 맵(useTerrainGeometry·useObjectInstances·useMapExits·useMinimap·useWorldMap)
  engine/                 chibi(원본 사본) · runtime(keyState·frameState: 프레임 공유 상태)
  stores/                 characterStore(persist) · worldStore(persist: 현재 맵·방문 기록, 맵 이동·페이드) · uiStore
  constants/maps/         맵 설계도(startIsland·evergreen·…) · dungeons · worldGraph(노선도) · registry
  utils/                  terrain(칸 지도→메시) · mapBlueprint(설계도→칸 지도) · dungeonRoom(방 생성) · maps(맵 조회·좌표)
  constants/ types/ styles/
scripts/validateMaps.ts   맵 검사 (npm run maps:check)
```

## 맵

- 맵 id로 `getMapDef(id)` → 설계도/방 생성기에서 칸 지도를 만들고 캐시. 전투맵 방 id는 `전투맵id/방id`.
- `CurrentMap`은 `key={map.id}`로 맵이 바뀌면 지형·물체·충돌체를 통째로 다시 만든다.
- 출구 판정은 매 프레임 발밑 칸의 표시 글자만 본다 (`useMapExits`).

## 프레임 상태

렌더와 무관한 매 프레임 값(플레이어 위치·방향·애니메이션 신호)은 `engine/runtime/frameState.ts` 의 가변 객체로 공유한다. React 상태로 올리지 않는다.
