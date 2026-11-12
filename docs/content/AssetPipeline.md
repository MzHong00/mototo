# 에셋 파이프라인

> AI 이미지 → 3D → Blender 스크립트 정리·피팅·리깅 → 게임 동기화. 파츠·몬스터·애니메이션을 같은 길로 대량 생산한다.
> 원본 작업 폴더: `~/Desktop/chibi-pipeline` (Blender 5.2 스크립트, 웹 뷰어, 꾸미기 화면). 게임 반영: `scripts/sync_game.sh` → `public/chibi/`, `src/engine/chibi/character.js`
> 표시: ✅ 실제로 한 단계 · 🧪 시도했다 버린 방법 · ❓ 확인 필요

## 확정 사항

- **몸체 베이스 1개 고정**: `out/chibi_v9.blend`의 `ChibiBody` + 뼈대 `ChibiRig`(21개 뼈). 모든 파츠는 이 몸에 맞춘다. NPC도 같은 몸 → 파츠가 매우 많이 필요 ([Npc.md](Npc.md)).
- **모든 파츠는 색을 바꿀 수 있다**: 회색조 텍스처/단색 머티리얼 × 게임 틴트.
- **LLM이 코드로 모양을 직접 만들면 품질이 낮다.** 모양은 AI 생성·CC0 에셋, Blender 스크립트는 정리·피팅·리깅만.
- 외부 에셋은 **CC0만**. 출처는 파이프라인 `web/parts/CREDITS.txt` → 게임 루트 `CREDITS.md`로 옮겨 적는다 ([ArtStyle.md](ArtStyle.md)).
- 무기 에셋 있음(몽둥이 등). 엘리트·보스 몬스터 필요 ([Combat.md](Combat.md)).

## 규칙과 수치

### 에셋 종류별 경로

| 에셋 | 경로(요약) | 애니메이션 | 상태 |
| --- | --- | --- | --- |
| 베이스 몸 | Meshy 컨셉 이미지 → Hunyuan3D Gen Shape → 세우기·감축 → 자체 리그 → Mixamo 리타깃 | Idle·Walk·Run·Jump·Attack | ✅ 완료. 다시 뽑지 않음 |
| 머리 | VRoid CC0 샘플 → `fit_vroid_hair.py` 피팅 → 회색조 텍스처 → 흔들림 뼈 | 몸 리그 + 흔들림 | ✅ 2종 |
| 얼굴 | 컨셉 투영 → `draw_face.py` 텍스처 → 몸 텍스처 교체 | 감은 눈 텍스처로 깜빡임 | ✅ 1종 |
| 옷·신발 | `outfit_build.py`가 몸 표면 껍질로 모양 → 몸 웨이트 복사 | 몸 리그 | ✅ 8종 (AI 미사용) |
| 모자·장신구 | 머리 뼈(`Head`)에 단단히 붙임. 이미지→3D 후 피팅 예상 | 불필요 | ❓ |
| 무기 | 이미지→3D → 손 뼈 `Hand.R`의 `socket_weapon_R` ([Character.md](Character.md)) | 불필요 | ❓ |
| NPC | 플레이어와 같은 베이스+파츠 | 몸과 같음 | ❓ (새 파츠만) |
| 몬스터·동물 | 이미지→3D → 비사람형은 별도 리깅(아래) | 필요 | ❓ |
| 가구·건물·자연물 | CC0 팩(Kenney·Quaternius·KayKit) → 색·외곽선 변환 → `public/world/` | 대부분 불필요 | ❓ 계획만 |

### 1) 컨셉 이미지

- 쓴 도구 ✅ **Meshy** 텍스트→이미지(`src/concept.png`). Meshy는 **이미지까지만**("Convert to 3D" 다운로드는 유료).
- 대안(추천만): Google Gemini(무료 1순위), ChatGPT, Bing Image Creator, Leonardo.ai.
- 프롬프트 규칙: ① 한 장에 대상 하나, 정사각형, 꽉 채움, 연회색 단색 배경 ② 몸은 T자세·좌우 대칭·정면 ③ 파츠는 "~ only, no body/no head", 정면·3/4·뒷면 시트 ④ 색은 **단색 하나**(그라데이션은 틴트 불가) ⑤ `cute chibi`, `simple 2-3 tone cel shading`, `thin dark outline`, `no text, no logo`.

베이스 몸 프롬프트 ✅:
```
A cute chibi-style 3D game character base body, mannequin style, standing in a symmetrical
T-pose with arms straight out to the sides and legs slightly apart. Super-deformed proportions:
oversized round head about 1/3 of total height, small torso, short arms and legs, simple
mitten-like hands with separated thumbs. Completely bald smooth head, simple face with large eyes.
No clothes, no hair, no hat, no accessories, no shoes - smooth doll-like body with no anatomical
detail. Plain uniform skin tone, clean low-poly-friendly shapes, game-ready, front-facing,
neutral expression.
```
파츠 틀(`<PART>`·`<모양 설명>`·`<단색>`만 바꿈. 몬스터는 `cute round chibi monster, T-pose or neutral standing pose, all limbs separated` 추가):
```
Original character design sheet of a cute chibi 3D game character's <PART> only, front view,
3/4 view and back view on a plain light grey background. <모양 설명>. <단색 하나>, simple 2-3 tone
cel shading, thin dark outline. Cute Korean casual MMORPG chibi style, big head proportions,
clean stylized shapes, game asset concept art, no text, no logo.
```

### 2) 이미지 → 3D

| 항목 | 내용 |
| --- | --- |
| 쓴 곳 ✅ | HF Space **tencent/Hunyuan3D-2.1** — **Gen Shape만**(텍스처 생성은 무료 GPU 한도 초과) → Export → Transform → Download |
| 결과 | `white_mesh.glb` (약 24만 면, 기울고 뒤집힘) |
| 실패 사례 ✅ | 배경이 남으면 납작한 판 → Advanced Options **Remove Background** 켜기, 정사각형·한 명만 |
| 예비 | TRELLIS(빠름, 텍스처 포함, 형태 품질 낮음, 미사용) / 유료: Meshy·Tripo(리메시·리깅, 다운로드 유료 ❓) |

### 3) Blender 정리 (스크립트 = `~/Desktop/chibi-pipeline/scripts/`)

실행 형식: `Blender -b <입력> --python scripts/<x>.py -- <인자>` (`Blender` = `/Applications/Blender.app/Contents/MacOS/Blender`)

| 단계 ✅ | 방법 | 스크립트·예 |
| --- | --- | --- |
| 세우기·원점 | 기울기 자동 감지 → 머리 위, 정면 -Y, 발바닥 Z=0 | `fix_orient.py -- src/white_mesh.glb out/step1.blend` |
| 감축 | Decimate 24만 → 2만 면, 스무스, 단색 피부 | `finalize.py -- out/step1.blend out/chibi_base.glb 20000` |
| 표면 | 라플라시안 스무딩 반복 | `smooth_all.py -- <in> <out> <반복>` |
| 얼굴 | 정면 투영 UV(`Proj`) → 4096 텍스처 다시 그림 → 뜬/감은 눈 2장 | `reproject.py`, `python3 scripts/draw_face.py`, `swap_tex.py -- out/chibi_v10.blend` |
| 머리 피팅 | VRoid 헤어 부풀림·감싸기, 귀 제거, 머리카락 뼈 `HJ_*`를 `Head` 아래 | `fit_vroid_hair.py -- <vroid.glb> <out.blend> <out.glb> <ObjName> <gray.png>`, `build_hair_male.sh` |
| 옷 피팅 | 몸 표면 껍질 → 가까운 몸 웨이트 복사·스무딩, 단추는 단단한 웨이트 | `outfit_build.py -- top_tshirt` (`outfit_lib.py`) |
| 뚫림 검사 | 동작 프레임마다 몸 안 정점 수 | `outfit_check.py -- top_tshirt,bottom_pants 2` |
| 틴트 | 머리: 회색조 텍스처, 머티리얼 `Hair`. 옷: 단색 `Main`. 게임은 이 이름만 색 곱함 | `character.js` `RECOLOR_MAT` |
| 피부·눈 | 셰이더에서 `SKIN_BASE`·홍채 영역만 | `character.js` `czRecolor` |
| 검수 렌더 | 정면·3/4·옆·뒤·근접 5장 | `render_anim.py -- out/chibi_v9.blend Walk 0,8,16 renders/rw side`, `shot_*.py`, `outfit_render.py` |

### 4) 리깅·애니메이션 ✅

- `rig.py`가 `ChibiRig`(Hips·Spine·Chest·Neck·Head, 좌우 Shoulder·UpperArm·LowerArm·Hand·UpperLeg·LowerLeg·Foot·Toe) 생성 + `ARMATURE_AUTO` 웨이트. Mixamo 자동 리깅 안 씀. 손가락 뼈 없음.
- Mixamo 동작: 로그인, 기본 X Bot 그대로. `Breathing Idle`, `Walking`/`Running`(In Place), `Jumping`, `Punching`. **FBX Binary, Without Skin, 30 FPS** (`mx_dl.js`). 저장 `mixamo/<이름>.fbx`. 자동화 브라우저는 네트워크 기록 주소로 받음. 점프는 후보 4개 렌더 비교 후 교체.
- 뼈 매핑(`retarget.py`): Chest↔**Spine2**, Shoulder/UpperArm/LowerArm/Hand ↔ Shoulder/Arm/ForeArm/Hand, UpperLeg/LowerLeg/Foot/Toe ↔ UpLeg/Leg/Foot/ToeBase (`.L`=Left, `.R`=Right).
- 리타깃: 월드 회전 기준, 골반 높이 비율 보정. 인자 `이름:수평유지:수직유지[:시작:끝]`, `원본>새이름`. 예 `retarget.py -- out/chibi_v9.blend out/chibi_v10.blend "Jump:0:0:10:30" keep`. 점프는 `DAMP`(Head 0.25·Neck 0.3·Chest/Spine 0.6). 내보내기 전 Mixamo 원본 액션 삭제. 이동 속도: 걷기 1.25, 달리기 2.8(단위/초).

### 5) 내보내기·동기화

1. 몸: `export_scene.gltf(export_format='GLB', export_animation_mode='ACTIONS', export_force_sampling=True, export_image_format='JPEG', export_jpeg_quality=92)` → `web/chibi.glb`. NLA 트랙 음소거 해제 먼저.
2. 파츠: `use_selection=True, export_animations=False, export_skins=True` → `web/parts/<id>.glb`. 머리는 `<id>.spring.json`(강도·저항·중력·충돌 반지름) 함께.
3. 등록: `web/character.js`의 `PART_CATALOG`에 추가. 게임 쪽 사본은 직접 고치지 않는다.
4. 미리보기 `python3 scripts/devserver.py web 4180` → `http://127.0.0.1:4180/customize.html`. 썸네일 `export_thumbs.py`(Playwright, 4180 필요) → `web/thumbs/<id>.png`.
5. 동기화 `scripts/sync_game.sh`(기본 `GAME=~/Desktop/vsc/mototo`): 썸네일 갱신 → `character.js`, `chibi.glb`, `face_closed.jpg`, `parts/*.glb|*.json|CREDITS.txt`, `thumbs/*` 복사. parts는 지우고 다시 채움.
6. 압축(Draco·meshopt): 아직 안 함 ❓.

### 6) 검수 기준

| 항목 | 기준 (현재 실측) |
| --- | --- |
| 폴리곤 | 몸 약 4.5만 삼각형, 파츠 9천~1.7만. 새 파츠 **2만 이하** (화면 예산은 [ArtStyle.md](ArtStyle.md)) |
| 파일 | 파츠 300~670KB, 몸 1.9MB. 파츠 **700KB 이하** |
| 텍스처·머티리얼 | 얼굴 4096 JPEG, 옷은 단색, 머리 회색조 1장. 색 부분 이름 `Hair`/`Main` |
| 외곽선 | 뒤집은 껍질(`#5a3a32`). 얇은 판·뾰족한 끝 깨짐 확인 |
| 뚫림 | Walk·Run·Jump·Attack 프레임. 사타구니·겨드랑이·어깨 주의(달릴 때 바지 사이 살색 사례) |
| 머리 | 몸통·귀 뚫림, 뒤쪽 면 빠짐, 두피 노출(`scalp`) |
| 출처 | CC0 확인, `CREDITS.txt`에 출처·URL·수정 내용 |

### 시도했다 버린 방법 (반복 금지)

| 방법 | 결과 |
| --- | --- |
| LLM 코드로 머리 모델링 (`hair.py`, `hairv2_*`, `hairv3_*`, `hairwavy_*`) | 🧪 품질 미달 |
| Sketchfab 헤어 피팅 (`sketchfab/`, `sf_girl/`) | 🧪 이마·옆머리·몸 뚫림 |
| 머리 달린 몸 재생성 후 차이로 머리 추출 (`extract_genhair.py`, `finalize_genhair2.py`) | 🧪 구멍·뒷머리 문제 |
| 절차적 키프레임 동작 (`anims.py`) | 🧪 뻣뻣함 → Mixamo |
| Meshy 3D 생성 | 🧪 다운로드 유료 |

### 대량 생산

- 파일 이름 `<슬롯>_<이름>` 소문자·밑줄: `hair_wavy_long`, `top_hoodie`, `hat_beret`, `weapon_club`, `mon_slime`, `ani_dog`, `prop_chair_wood`. 접두어 = `PART_CATALOG` 분류·썸네일 이름.
- 일괄: `assets/raw/<id>.glb`를 돌며 `fix_orient → finalize → 피팅 → 5각도 렌더` 쉘 스크립트. 옷은 `outfit_build.py <id>` 목록 반복. 검수 렌더는 `outfit_compose.py`로 격자 한 장.
- 현재 CC0 기록: VRoid Project `HairSample_Female`, `HairSample_Male` (OpenGameArt, CC0 1.0).
- AI 생성물: Hunyuan3D 2.x 커뮤니티 라이선스는 **EU·영국·한국 제외**로 알려짐 → 출시 전 확인.

### 몬스터·동물 리깅 (비사람형)

| 방법 | 장점 | 단점 |
| --- | --- | --- |
| 직접 리깅(`rig.py`식 뼈 2~4개 + 자동 웨이트) | 무료, 슬라임·버섯에 최적 | 동작 직접 제작 |
| Blender **Rigify** 메타리그(Cat·Wolf·Horse·Bird·Shark) | 무료, 네발·새 틀 | 메타리그 손 맞춤, 동작 직접 |
| Reallusion **AccuRIG** | 무료, 사람형 품질 좋음 | 두 발 사람형 전용 |
| **Tripo** 자동 리깅 | 네발·곤충·새·뱀·물고기형 지정 | 유료 크레딧, 라이선스 확인 |
| **Meshy** 자동 리깅 | Humanoid·Quadruped·Smart Rig(베타) | 다운로드 유료 |
| Auto-Rig Pro | 비사람형 수동 보정 가능 | 유료 |

추천: 둥근 몬스터는 **직접 리깅 + 짧은 절차적 동작**(통통·찌그러짐). 네발 동물이 늘면 Rigify 리그 1개를 표준으로 고정 → "리그 1개 + 메시 여러 개".

## 데이터 모델

```ts
/** web/character.js PART_CATALOG 한 줄 (게임은 동기화된 사본을 읽기만) */
interface PartCatalogEntry {
  id: string;            // 'top_hoodie' — 접두어가 슬롯
  label: string;         // '후드티'
  gender?: 'female' | 'male';
  scalp?: boolean;       // 머리: 두피 노출 처리
  spring?: string;       // 머리: '<id>.spring.json'
}

/** 검수 기준 상수 */
const PART_LIMITS = { maxTris: 20_000, maxBytes: 700 * 1024, tintMaterials: ['Hair', 'Main'] } as const;

/** 몬스터·동물 공용 동작 세트 (표준 리그 결정 후) */
type CreatureClip = 'idle' | 'move' | 'attack' | 'hit' | 'down';
```

## 단계 (MVP → 이후)

1. **MVP**: 무기 `weapon_club` 1개(이미지→3D→`Hand.R` 소켓), 몬스터 `mon_slime` 1개(직접 리깅, 공용 동작 5개). 루트 `CREDITS.md` 작성.
   - 수용 기준: 두 에셋 모두 검수 표 통과(2만 삼각형·700KB 이하, 5각도 렌더). 게임에서 몽둥이가 공격 중 손에서 안 떨어짐. 슬라임이 5개 동작 재생.
2. 모자·장신구 3종, NPC용 파츠 10종, 일괄 처리 스크립트.
3. 네발 표준 리그(Rigify) + 동물 6종 ([Animals.md](Animals.md)), 엘리트·보스 1종씩.
4. CC0 가구·건물 변환 스크립트(팔레트·외곽선·스케일), GLB 압축.

## 참고한 출처

- Tripo 자동 리깅: https://developers.tripo3d.com/en/docs/animations-rig
- Meshy 리깅: https://docs.meshy.ai/en/webapp/guides/3d-model/rigging
- AccuRIG 네발 미지원 답변: https://forum.reallusion.com/PrintTopic523069.aspx
- Rigify: https://docs.blender.org/manual/en/2.81/addons/rigging/rigify.html
- Hunyuan3D 라이선스 지역 조항: https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE

## 열린 질문

- Hunyuan3D 라이선스 한국 제외가 2.1에도 있나? — 제안 기본값: 출시 전 확인. 해당되면 TRELLIS(MIT ❓)로 바꾸고 베이스 몸도 검토.
- Meshy 무료 플랜 이미지의 상업 이용? — 제안 기본값: 확인 전엔 Gemini 등 대안으로 새 컨셉.
- 모자 쓸 때 머리 윗부분 처리? — 제안 기본값: 모자별 `hidesHairTop` 플래그로 숨김 ([Character.md](Character.md)).
- 손가락 뼈 없이 무기 쥐는 모양 자연스러운가? — 제안 기본값: 주먹 쥔 손 모양 파츠 1개 추가.
- 몬스터·동물 표준 리그와 공용 동작 세트 — 제안 기본값: 위 `CreatureClip` 5개.
- GLB 압축 도입? — 제안 기본값: 4단계에 meshopt.
- NPC 전용 파츠(앞치마 등)를 플레이어 해금과 분리? — 제안 기본값: 분리, 호감도 4단계에서 해금 ([Npc.md](Npc.md)).
