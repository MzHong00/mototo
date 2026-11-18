# 몸·동작

> 모든 캐릭터·NPC가 쓰는 몸 하나. ✅ 완료 — **다시 만들지 않는다**. 할 일은 동작 추가뿐.

## 있는 것

- 몸 최신 `out/chibi_v12.blend` (`ChibiBody`, 뼈 `ChibiRig` 51개 = 몸 21 + 손가락 30, 동작 포함) → `web/chibi.glb`
- 손: VRoid 샘플 아바타(CC0) 손을 떼어 통통하게 키워 붙임, 손가락마다 뼈 3개 (`build_hands.py`). 손 길이·폭·두께 배율을 비슷하게(두께만 키우면 괴물 손), 손가락은 짧게. 손목 쪽 팔을 가늘게 좁혀 이음. 손톱·손등 너클 골을 다듬고, 매끈하게 나눠 가중치를 번져 마디가 둥글게 굽음. 주먹은 첫 마디를 덜 꺾고, 그 밖 동작은 힘 뺀 손(`add_fingers.py` CURL·CURL_SOFT), 원본 동작의 손가락 벌림은 SPREAD만큼만 남기고 엄지는 검지 쪽으로 모음(THUMB_CLOSE). 손가락은 가로로 통통하게(FING_W) 해서 사이가 안 벌어져 보임. 손바닥은 단면을 타원으로 다시 잡고, 손등 윗면은 너클 너머까지 매끈한 곡면 하나로 맞춰 너클 알·뼈 혹이 없음(dorsal_fit). 손가락 밑동의 손등 쪽 높이를 손가락 중간 높이로 눌러 맞추고(EVEN — 옆은 그대로, 줄이면 손날이 패임), 손날·검지 쪽 가장자리 패임은 채우고(SIDE_FILL), 손날 살은 바깥으로 둥글게 부풀림(HYPO — 새끼 뿌리 앞까지만, 넘어가면 새끼가 옆으로 튀어나와 보임). 새끼는 약지 쪽으로 옮겨 붙임(PINKY_IN) 손등 쪽 손가락 사이 골은 채움(WEB)
- 손톱: 메시 없이 피부 셰이더가 그림(`character.js` czNail). 위치는 `build_hands.py`가 재서 몸 extras `nails`로 내보냄 → 손을 다시 만들면 자동으로 따라감
- 동작: Idle · Walk · Run · Jump · Attack

## 동작 추가하기

1. **사용자에게 물을 것**: 어떤 동작? (예: 앉기, 손 흔들기)
2. **사용자가 할 일**: Mixamo(로그인 필요)에서 동작 고르기 → 기본 X Bot 그대로 → **FBX Binary · Without Skin · 30 FPS**로 받아 `mixamo/<이름>.fbx`에 저장
   (Claude가 사용자 브라우저를 쓸 수 있으면 `mx_dl.js`로 직접 받는다)
3. **Claude**: 우리 뼈로 옮기기
   ```
   Blender -b --python scripts/retarget.py -- out/chibi_v12.blend out/chibi_v13.blend "<이름>:0:0" keep
   Blender -b --python scripts/add_fingers.py -- out/chibi_v13.blend    # 손가락 움직임 (원본·시작 프레임 자동)
   ```
4. **확인**: 동작 렌더를 보여주고 OK 받기 (`render_anim.py`)
5. **마무리**: `Blender -b --python scripts/export_body.py -- out/chibi_v<N>.blend` → `sync_game.sh`

## 주의

- 동작을 키프레임 코드로 직접 만들면 뻣뻣함 → Mixamo만 쓴다
- 치비는 몸통이 넓고 팔이 짧아 Mixamo 팔 그대로면 손이 엉덩이에 박힘 → `retarget.py`의 `ARM_OUT`(Idle 22°)로 팔을 벌림

## 몸을 처음 만든 방법 (기록)

Meshy 이미지 → Hunyuan3D → 세우기·2만 면 → 얼굴 그리기 → `rig.py` 뼈 → Mixamo 동작 옮기기 → `build_hands.py` VRoid 손·손가락 뼈 → `add_fingers.py`
