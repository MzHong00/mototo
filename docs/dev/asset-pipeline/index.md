# 에셋 만들기

> 어떤 에셋이든 공통으로 지킬 것만. 종류별 순서는 각 문서에.

## 문서

- 캐릭터: [파츠(머리·옷·신발·장신구·무기)](character/index.md) · [몸·동작](character/body.md) · [얼굴 외형](character/face.md) · [표정](character/expression.md)
- [몬스터](monster/monster.md) · [동물](animal/animal.md) · [건물](building/building.md) · [식물](plant/plant.md) · [가구](furniture/furniture.md)

## 진행 방법

1. 문서의 "사용자에게 물을 것"을 묻는다
2. 사용자가 할 일은 정확히 요청한다 (어디서 무엇을 눌러 어디에 저장)
3. 나머지는 Claude가 직접 한다
4. 렌더를 보여주고 OK를 받는다
5. 문서와 실제가 다르면 문서를 고친다

## 공통 규칙

- 작업 폴더 `~/Desktop/chibi-pipeline` · Blender `/Applications/Blender.app/Contents/MacOS/Blender`
- 삼각형 2만 이하, 파일 700KB 이하
- 외부 재료는 CC0만, 출처는 `CREDITS.txt`
- 렌더 확인: 앞·3/4·옆·뒤
- 파일 이름: `<종류>_<이름>` 소문자·밑줄

## 이미지 → 3D (AI로 모양 만들 때만)

1. **컨셉 이미지**: Claude가 HF 이미지 Space(FLUX 등)를 `gradio_client`로 호출 ❓ / 안 되면 사용자가 Gemini로 만들어 `refs/<id>.png`에 저장
   ```
   Cute chibi 3D game <대상>, front view, single object centered, plain light grey background,
   one flat color, simple 2-3 tone cel shading, thin dark outline, no text, no logo.
   ```
2. **3D**: HF Space `tencent/Hunyuan3D-2.1` — 배경 제거 켜고 Gen Shape만. Claude가 `gradio_client`로 ❓ / 한도에 걸리면 사용자에게 HF 토큰 또는 웹 작업 요청
3. **정리**: `fix_orient.py -- <받은.glb> out/<id>_s1.blend` → `finalize.py -- out/<id>_s1.blend out/<id>.glb <면 수>`

❓ = 아직 해 본 적 없음 → 처음 성공하면 방법을 여기에 적기 · ⚠️ Hunyuan3D 라이선스 한국 제외 여부 출시 전 확인
