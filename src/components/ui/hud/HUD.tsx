import { useEffect } from "react";

import { useGameStore } from "@/stores/gameStore";
import { getControlsState } from "@/stores/controlsStore";
import { useSkillInput } from "@/hooks/useSkillInput";
import { useMpRegen } from "@/hooks/useMpRegen";
import { useNpcProximity } from "@/hooks/useNpcProximity";
import { CharacterPanel } from "@/components/ui/hud/characterPanel/CharacterPanel";
import { SkillBar } from "@/components/ui/hud/skillBar/SkillBar";
import { HelpHint } from "@/components/ui/hud/helpHint/HelpHint";
import { PlayerDamageNumbers } from "@/components/ui/hud/playerDamageNumbers/PlayerDamageNumbers";

export function HUD() {
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const npcNear = useNpcProximity();

  useSkillInput();
  useMpRegen();

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
      <CharacterPanel />
      <SkillBar />
      <HelpHint />
      <PlayerDamageNumbers />
    </>
  );
}
