import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";

import { START_TARGET } from "@/features/world/constants/maps/registry";
import { FADE_MS, WORLD_STORAGE_KEY } from "@/features/world/constants/world";
import { MINIMAP_DEFAULT_ZOOM, MINIMAP_ZOOMS } from "@/features/world/constants/minimap";

import type { MapExit, TravelTarget } from "@/features/world/types/world";

export type FadePhase = "none" | "out" | "in";

export interface WorldState {
  location: TravelTarget; // 지금 맵 + 도착한 자리
  spawnCount: number; // 도착할 때마다 증가 — 캐릭터를 도착 위치로 옮기는 신호
  fade: FadePhase; // 맵 이동 화면 전환 단계
  pendingExit: MapExit | null; // 확인창에 띄운 출구
  isAreaMapOpen: boolean; // 지금 맵 전체 보기 열림
  minimapZoom: number; // 미니맵 확대 단계 (MINIMAP_ZOOMS 순번)
  /** 화면을 어둡게 → 맵 바꾸고 도착 위치로 → 밝게 */
  travel: (to: TravelTarget) => void;
  /** 확인이 필요한 출구 묻기 (null이면 닫기) */
  askExit: (exit: MapExit | null) => void;
  /** 지금 맵 전체 보기 열기/닫기 */
  setAreaMapOpen: (isOpen: boolean) => void;
  /** 미니맵 확대 단계 바꾸기 (+1 확대, -1 축소) */
  stepMinimapZoom: (step: number) => void;
}

const worldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      location: START_TARGET,
      spawnCount: 0,
      fade: "none",
      pendingExit: null,
      isAreaMapOpen: false,
      minimapZoom: MINIMAP_DEFAULT_ZOOM,
      travel: (to) => {
        if (get().fade !== "none") return;
        set({ fade: "out", pendingExit: null, isAreaMapOpen: false });
        setTimeout(() => {
          set({ location: to, spawnCount: get().spawnCount + 1, fade: "in" });
          setTimeout(() => set({ fade: "none" }), FADE_MS);
        }, FADE_MS);
      },
      askExit: (pendingExit) => set({ pendingExit }),
      setAreaMapOpen: (isAreaMapOpen) => set({ isAreaMapOpen }),
      stepMinimapZoom: (step) =>
        set((st) => ({
          minimapZoom: Math.min(Math.max(st.minimapZoom + step, 0), MINIMAP_ZOOMS.length - 1),
        })),
    }),
    {
      name: WORLD_STORAGE_KEY,
      partialize: (s) => ({ location: s.location, minimapZoom: s.minimapZoom }),
    },
  ),
);

export const useWorldStore = <T>(selector: (s: WorldState) => T) =>
  worldStore(useShallow(selector));
export const getWorldState = worldStore.getState; // 매 프레임 로직(useFrame)에서 구독 없이 읽기
