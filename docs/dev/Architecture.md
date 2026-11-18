# 아키텍처

> React 19 · Three.js · R3F · drei · Rapier · Zustand · Vite · TypeScript · SCSS Modules

## 치비 캐릭터

- `src/lib/chibi/character.js`는 `~/Desktop/chibi-pipeline/web/character.js` **원본 사본**. 직접 수정 금지. 타입은 `character.d.ts`.
- 캐릭터·파츠 갱신: `~/Desktop/chibi-pipeline/scripts/sync_game.sh` (→ `public/chibi/`).

## 폴더 (Bulletproof React + `sim`·`data`)

```
src/
  main.tsx
  app/          app.tsx(화면 선택) · routes/(characterCreate · game)
  config/       전역 설정 (controls 키 배치)
  features/     기능별. 안에 components/ hooks/ stores/ types/ utils/ constants/
    character/  꾸미기(chibiEditor·ChibiPreview), characterStore
    world/      3D 장면·맵·플레이어·미니맵·출구, worldStore  (지금은 임시 맵 1개: OSM 역 맵이 오면 교체)
    hud/        GameHud
  lib/          chibi(원본 사본 + 로딩 훅·에셋 경로) · runtime(frameState·keyState)
  stores/ types/ utils/ styles/   공용
  sim/          (예정) 게임 규칙. React·Three 금지, 시드 고정 → Node에서 자동 실행
  data/         (예정) 직업·이벤트·물가·역 JSON
scripts/validateMaps.ts   맵 검사 (npm run maps:check)
```

- import 방향: `data` → `sim` → 공용(`lib`·`config`·`stores`·`types`·`utils`) → `features` → `app`. 반대 방향 금지
- `features`끼리 import 금지. 섞을 때는 `app/`에서 조립

## 맵

- 맵은 `constants/maps/registry.ts`의 `MAP_SPECS`에 등록. 지금은 임시 맵 `temp-town`(64×64 풀밭·십자 길, 출구 없음) 1개, `START_TARGET`도 여기.
- `getMapDef(id)` → 설계도(`utils/mapBlueprint.ts`)로 칸 지도를 만들고 캐시. 바탕은 0층 풀밭, 지도 밖은 땅판(`outskirts`)이 이어진다.
- 테마(`constants/maps/themes.ts`): 중립 테마 1개(맑은 낮) — 하늘·안개·빛·나무·바닥 장식·입자. `MapAtmosphere`가 적용, 입자는 `useAmbientParticles`.
- 물체 모양은 `constants/mapObjects.ts`(나무·바위·장식), 같은 종류는 인스턴싱.
- 출구 `mode`: `walk`(밟으면 이동) · `confirm`(확인창, 지하철 탑승용 예정).
- `CurrentMap`은 `key={map.id}`로 맵이 바뀌면 통째로 다시 만든다.
- 출구 판정은 매 프레임 발밑 칸 표시 글자만 본다 (`useMapExits`).

## 상태

| 스토어 | 저장 | 내용 |
| --- | --- | --- |
| characterStore | ✅ | 외형·닉네임 |
| worldStore | ✅ 위치·`minimapZoom` | 맵 이동·페이드, 출구 확인, `isAreaMapOpen`(N) |
| uiStore | — | 꾸미기 화면 여부 |

- 매 프레임 값(플레이어 위치·방향·애니메이션 신호)은 `lib/runtime/frameState.ts` 가변 객체로 공유. React 상태로 올리지 않는다.
