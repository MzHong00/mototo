# 자율 작업 진행표 (2026-11-12 밤 ~ 사용자 복귀 전)

> 사용자 부재 중 자율 진행. 질문하지 않고 결정은 아래 "결정 로그"에 남긴다.
> 토큰 초기화 후 재개 시: 이 파일을 읽고 첫 미완료 단계부터 이어서 한다.

## 단계

- [x] 0. 사용자 요구 11개 문서 반영 (Skills·Character·Controls·Combat·Village·Npc·Animals·GameDesign·index)
- [x] 1. 콘텐츠 전 항목 개발 가능 수준으로 구체화 (웹 리서치 + 서브에이전트 검토)
- [x] 2. 에셋 AI 파이프라인 문서화 (`docs/content/AssetPipeline.md`)
- [x] 3. 월드맵 구현: 시작 섬(작게) + 본 맵 5개(크게) + 마을별 전투맵 입구·브랜치(엘리트·보스방) + 미니맵 + 3D 노선도 지도
- [x] 4. 검증(tsc·eslint·build·스크린샷) 후 커밋, 사용자용 요약 작성

## 결정 로그

(사용자 복귀 후 확인받을 결정들)
- 본 맵 원본: 문서는 PNG+JSON이었지만, 1차 구현은 TS 설계도(blueprint)를 런타임에 칸 지도로 변환. 이유: 에셋 도구 없이 바로 수정·검증 가능. PNG는 지도 편집기 단계에서.
- 전투맵 미니맵: 방 그래프 대신 현재 방 칸 지도를 보여줌 (1차).
- 전투가 아직 없어 전투방 문은 처음부터 열림. 방 종류는 표식 물체로 구분.

## 진행 메모 (메인용)

- 1·2단계는 서브에이전트 6개가 문서를 직접 작성 중. 제한에 걸려 멈추면 SendMessage로 재개(새로 띄우지 말 것):
  전투·조작 a36bddf3165df567d / 세계·맵 a1ac347f5e47f396b / 기술·생활 adad49e37d1ff48a1 / 아이템·경제 af29ab731f2c309d1 / NPC·UI·운영 a56ae2862a4559281 / 에셋 파이프라인 a57b313084c0a3ff9
- 브리프: 세션 scratchpad/brief.md
- 6개 완료 → 검토 에이전트 1개로 일관성 검토 → 수정 → index.md 갱신 → 커밋 → 3단계
- (진행) 6개 완료. 검토 에이전트 a6d76b8d2f0611345 가 충돌 통일·index·Decisions.md 작업 중 (src 금지). 끝나면 1단계 체크 후 커밋.
- 3단계는 메인이 동시에 구현 중. 설계: 지도는 blueprint(TS) → 런타임 래스터화(utils/mapBlueprint.ts), 경로가 층 경계를 지나면 경사로 자동. 청크 32. worldStore(persist) + 페이드 + 확인창. 전투맵 방은 종류별 자동 생성.
- 3단계 코드 작성 완료(미커밋): types/world, utils/mapBlueprint·dungeonRoom·maps·noise, constants/maps/*, stores/worldStore, CurrentMap·MapObjects·ExitLabels, Minimap·WorldMapOverlay·FadeOverlay·ExitConfirmDialog, scripts/validateMaps.ts(npm run maps:check 통과). 다음: ~/Desktop/vsc/ai_tech_shots/world.py 스크린샷 검증 → 수정 → 커밋.
- 3단계 커밋 8394969. 스크린샷 검증 완료(ai_tech_shots/world). 코드 검토 에이전트 ab5261deb58808d5b 결과 대기 → 수정 → 문서(index·Todos·Architecture 수정됨, 미커밋) 커밋 → 4단계 요약.

## 완료 요약 (2026-11-12)

- 문서: 요구 11개 반영 → 27개 콘텐츠 문서 구체화(웹 리서치 + 검토 에이전트 통일) → `docs/content/Decisions.md`에 확인할 결정 25개.
- 에셋 파이프라인: `docs/content/AssetPipeline.md` (지난 작업 기록 기준, 미확인 단계 ❓).
- 월드맵: 첫걸음 섬 + 본 맵 5개 + 마을별 전투맵(방 10개) + 미니맵 + 노선도 지도. 검토 지적 7건 수정.
