import { RedGuardianArena } from "@/components/game/boss/redGuardian/RedGuardianArena";
import { RedGuardianBoss } from "@/components/game/boss/redGuardian/RedGuardianBoss";

interface RedGuardianChamberProps {
  onBossExit: () => void;
}

export function RedGuardianChamber({ onBossExit }: RedGuardianChamberProps) {
  return (
    <>
      <RedGuardianArena />
      <RedGuardianBoss onBossDeath={onBossExit} />
    </>
  );
}
