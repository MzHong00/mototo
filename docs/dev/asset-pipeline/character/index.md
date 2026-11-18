# 캐릭터 파츠 만들기

> 머리·상의·하의·신발·장신구·무기 공통. 모든 파츠는 몸 하나(`ChibiBody`, 뼈 `ChibiRig` 51개, `out/chibi_v12.blend`)에 맞춘다.
> 몸·동작은 [body.md](body.md), 얼굴은 [face.md](face.md) · [expression.md](expression.md)

**흐름: 제미나이 시트(3×3, 9개) → 칸별로 자름 → 칸마다 우리 몸에 맞춰 코드로 만듦(병렬) → 게임 확인.**
AI 그림은 참고용. AI 3D 모양은 결과에 안 씀(디테일이 뭉개짐).

## 1. 사용자에게 물을 것

- 어떤 파츠 · 분위기 · 색 (기본은 9개를 한 번에)

## 2. 시트 (사용자)

제미나이에 [base_body.png](../reference/base_body.png) 첨부 + 아래 프롬프트 → 받은 그림을 Claude에게

```
첨부한 치비 기본 캐릭터 몸에 맞는 <파츠> 9개를 3×3 격자 한 장으로 그려 줘.

[9개]
- 서로 다른 디자인. 이미 있는 것과 겹치지 않게: <지금 있는 것 목록>
- <파츠별 고를 수 있는 것 (아래 표)>
- 몸에 붙는 단순한 모양. 프릴·레이스·얇은 끈·글씨·작은 무늬 없음
- 색은 메인 1색 + 흰색 포인트

[그림]
- 사람·몸·머리는 그리지 말고 파츠만. 보이지 않는 마네킹이 입은 것처럼
- 치비 비율 (첨부 캐릭터처럼 짧고 통통)
- 9개 모두 같은 크기·같은 자세, 완전 정면, 칸 가운데
- 칸 사이 여백 넉넉히. 격자선·번호·글자·로고·그림자 없음
- 부드러운 3D 장난감 렌더, 고른 조명, 연회색 단색 배경
```

## 3. 만들기 (Claude)

1. 시트 → `refs/<파츠>_sheet<N>.png` → `python3 scripts/sheet_split.py refs/<파츠>_sheet<N>.png refs/<파츠>_sheet<N>/`
2. 칸마다 보고 **이미 있는 파츠와 비슷하면 버림** (`web/thumbs/` 비교). 남은 것에 id·이름·설정을 정해 사용자에게 표로 보여줌
3. 칸마다 빌드 (아래 표의 스크립트). 여러 개는 병렬로 (`&` … `wait`)

| 파츠 | 만드는 법 | 스크립트 | 시트에서 고를 수 있는 것 |
| --- | --- | --- | --- |
| 상의 | 몸 껍데기 + 코드 장식 | `top_build.py` | 소매 · 길이 · 목(둥근·V·카라·터틀·스탠드·세일러) · 단추 · 지퍼 · 줄무늬 · 라글란 · 리본 · 별 |
| 하의 | 몸 껍데기 | `outfit_build.py`의 `build_*` | 길이 · 통 · 치마 퍼짐·주름 |
| 신발 | 발 모양 따라 밑창 + 몸통 | `outfit_build.py`의 `build_shoe_generic` | 목 높이 · 앞코 · 끈 |
| 머리 | VRoid CC0 머리 씌우기 (아래) | `fit_vroid_hair.py` | 시트는 고르기 참고만 |
| 장신구·무기 | AI 3D ❓ 해 본 적 없음 | [이미지→3D](../index.md#이미지--3d-ai로-모양-만들-때만) | — |

- 시트에 표에 없는 장식이 있으면 스크립트에 기능을 추가한 뒤 만든다
- 몸 껍데기 = 몸 메시를 복사해 띄운 옷. 몸과 같은 뼈 가중치라 어떤 동작에서도 팔·손에 안 뚫림. 대신 크게 부푼 모양(퍼프 소매·퍼지는 밑단)은 못 함

### 상의 `top_build.py`

옷마다 설정 한 줄을 스크립트 위 `SPECS`에 추가 → 빌드 (10벌 병렬 약 10초)
```
for t in top_a top_b; do Blender -b out/chibi_v12.blend --python scripts/top_build.py -- $t & done; wait
```
- 설정: `hem` 밑단 높이 · `slv` 소매 끝(0.3 미만 = 민소매 둥근 진동둘레, 0.40 반팔, 0.50 7부, 0.62 긴팔 — 0.625부터는 손 메시라 끝단이 깨져서, 소맷부리를 손 쪽으로 `CUFF_OUT` 3.2cm 뽑아 손목까지 덮음) · `neck_r` 목 크기 · `collar` · `vneck` · `buttons` · `placket` 앞여밈 띠 · `inner` V 안 흰 티 · `knit` 니트 골 진하기(0.06 약하게) · `tee` 몸판 세부(목 모양·테두리 두께·부풀림) · `stripes` · `raglan` · `zipper` · `bow` · `star`
- 소매는 팔에서 `SLEEVE_O`(1.2cm)만 띄우고 팔꿈치만 조금 더(`outfit_build.py` `elbow`). 소매는 손 뼈를 안 따라감(손목 꺾여도 끝단이 안 찌그러짐). 소매 속 팔 피부는 게임이 숨김(`character.js` uHideC, 민소매 제외) → 팔 굽혀도 안 비침
- 흰 장식은 `Trim`(흰색 고정), 나머지는 `Main`
- 새 장식은 납작한 건 `decal()`(앞·뒤에 비춰 붙임), 목둘레를 따라가는 건 `strip()`으로 추가

### 머리 `fit_vroid_hair.py`

```
Blender -b out/chibi_v9.blend --python scripts/fit_vroid_hair.py -- \
  <재료.glb> out/hair_<이름>.blend web/parts/hair_<이름>.glb Hair_<이름> out/<회색텍스처>.png
```
- 재료: `vroid/avatarsample_*.glb`, `hairgen/vroid_*.glb` (CC0). 새 재료는 VRoid Hub·OpenGameArt CC0만
- 안 맞으면 `SRC_DY` · `SRC_DZ` · `SRC_K` · `HUG` (예시 `scripts/build_hair_male.sh`), 귀 빼기 `EARS=0`
- 확인: 귀·몸 뚫림, 뒤통수 빈 곳, 두피 보임

### 장신구·무기 (처음 할 때 여기를 고친다)

- 모자·안경은 `Head`, 목걸이는 `Chest` 뼈에 100% 고정. 모자를 쓰면 머리 윗부분 숨기기
- 무기는 `Hand.R`의 `socket_weapon_R`에. 손잡이를 원점, 날이 +Z

## 4. 확인 (Claude → 사용자)

- **게임 화면**(팔 내린 자세)에서 확인. 블렌더 T자세 렌더로는 팔 뚫림이 안 보임
- 하의·신발은 `outfit_check.py -- <파츠들> 2`로 뚫림 검사 (달릴 때 사타구니·발끝)
- 9개를 한 장에 모아 보여주고 OK 받기

## 5. 마무리

1. 등록: `web/character.js`의 `PART_CATALOG`에 `{ id, label }` (머리는 `scalp: true, spring: true, gender`)
2. 미리보기: `python3 scripts/devserver.py web 4180` → http://127.0.0.1:4180/customize.html
3. 게임에 넣기: `scripts/sync_game.sh` (썸네일 생성 + `public/chibi/`로 복사)

## 색 바꾸기

색이 바뀌는 재질 이름: 머리 `Hair`(회색조 텍스처), 그 밖 `Main`(단색). `Trim`·`Accent`·`Sole`은 고정

## 윤곽선

몸·머리만 검은 윤곽선. 옷·신발은 없음 — 얇은 껍데기라 안쪽 면 윤곽선이 밑단·소매·신발 입구로 비쳐 선이 겹쳐 보였음

## 해 봤는데 안 된 것

- LLM 코드로 머리카락 모델링, Sketchfab 머리 씌우기 → 품질 미달·뚫림
- 그림 → Hunyuan3D 옷 → 몸에 입힘 → 칼라·단추가 뭉개지고 팔에 걸림
