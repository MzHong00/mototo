import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useSkillInput } from "@/hooks/useSkillInput";
import { useMpRegen } from "@/hooks/useMpRegen";
import { useNpcProximity } from "@/hooks/useNpcProximity";
import { CharacterPanel } from "@/components/game/hud/CharacterPanel/CharacterPanel";
import { SkillBar } from "@/components/game/hud/SkillBar/SkillBar";
import { GoldDisplay } from "@/components/game/hud/GoldDisplay/GoldDisplay";
import { NpcPrompt } from "@/components/game/hud/NpcPrompt/NpcPrompt";
import { HelpHint } from "@/components/game/hud/HelpHint/HelpHint";

export function HUD() {
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const npcNear = useNpcProximity();

  useSkillInput();
  useMpRegen();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "KeyF" && npcNear) setShopOpen(true);
      if (e.code === "Escape") setShopOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShopOpen, npcNear]);

  return (
    <>
      <CharacterPanel />
      <SkillBar />
      <GoldDisplay />
      <NpcPrompt visible={npcNear} />
      <HelpHint />
    </>
  );
}
