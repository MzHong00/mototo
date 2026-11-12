import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";

import { dungeonOf } from "@/utils/maps";
import { START_TARGET } from "@/constants/maps/registry";
import { FADE_MS, WORLD_STORAGE_KEY } from "@/constants/game/world";

import type { MapExit, TravelTarget } from "@/types/world";

export type FadePhase = "none" | "out" | "in";

export interface WorldState {
  location: TravelTarget; // 지금 맵 + 도착한 자리
  visited: string[]; // 가 본 맵 id (첫 섬·본 맵만 — 지도 해금)
  spawnCount: number; // 도착할 때마다 증가 — 캐릭터를 도착 위치로 옮기는 신호
  fade: FadePhase; // 맵 이동 화면 전환 단계
  pendingExit: MapExit | null; // 확인창에 띄운 출구 (배·전투맵 입구)
  isMapOpen: boolean; // 전체 지도 열림
  /** 화면을 어둡게 → 맵 바꾸고 도착 위치로 → 밝게 */
  travel: (to: TravelTarget) => void;
  /** 확인이 필요한 출구 묻기 (null이면 닫기) */
  askExit: (exit: MapExit | null) => void;
  /** 전체 지도 열기/닫기 */
  setMapOpen: (isOpen: boolean) => void;
}

const worldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      location: START_TARGET,
      visited: [START_TARGET.map],
      spawnCount: 0,
      fade: "none",
      pendingExit: null,
      isMapOpen: false,
      travel: (to) => {
        if (get().fade !== "none") return;
        set({ fade: "out", pendingExit: null, isMapOpen: false });
        setTimeout(() => {
          const { visited, spawnCount } = get();
          const isRoom = dungeonOf(to.map) !== undefined;
          set({
            location: to,
            visited: isRoom || visited.includes(to.map) ? visited : [...visited, to.map],
            spawnCount: spawnCount + 1,
            fade: "in",
          });
          setTimeout(() => set({ fade: "none" }), FADE_MS);
        }, FADE_MS);
      },
      askExit: (pendingExit) => set({ pendingExit }),
      setMapOpen: (isMapOpen) => set({ isMapOpen }),
    }),
    {
      name: WORLD_STORAGE_KEY,
      // 전투맵 안에서 껐다 켜면 마을 입구에서 다시 시작
      partialize: (s) => ({
        location: dungeonOf(s.location.map)?.returnTo ?? s.location,
        visited: s.visited,
      }),
    },
  ),
);

export const useWorldStore = <T>(selector: (s: WorldState) => T) =>
  worldStore(useShallow(selector));
export const getWorldState = worldStore.getState; // 매 프레임 로직(useFrame)에서 구독 없이 읽기
