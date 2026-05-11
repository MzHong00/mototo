import { useEffect } from "react";

import { useGameStore } from "@/stores/gameStore";
import { getControlsState } from "@/stores/controlsStore";
import { useSkillInput } from "@/hooks/useSkillInput";
import { useNpcProximity } from "@/hooks/useNpcProximity";
import { SkillBar } from "@/components/ui/hud/skillBar/SkillBar";
import { ExpBar } from "@/components/ui/hud/expBar/ExpBar";
import { CharInfo } from "@/components/ui/hud/charInfo/CharInfo";
import { MiniMap } from "@/components/ui/hud/miniMap/MiniMap";

export function HUD() {
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const npcNear = useNpcProximity();

  useSkillInput();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { bindings } = getControlsState();
      if (e.code === bindings.interact && npcNear) setShopOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShopOpen, npcNear]);

  return (
    <>
      <MiniMap />
      <CharInfo />
      <SkillBar />
      <ExpBar />
    </>
  );
}
