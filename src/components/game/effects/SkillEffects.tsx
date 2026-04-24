import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/stores/gameStore";
import { FX_DURATION } from "@/constants/skill";
import type { SkillFX } from "@/types/combat";
import { SlashFX }        from "@/components/game/effects/fx/SlashFX";
import { BlastFX }        from "@/components/game/effects/fx/BlastFX";
import { ArrowFX }        from "@/components/game/effects/fx/ArrowFX";
import { ArrowBlastFX }   from "@/components/game/effects/fx/ArrowBlastFX";
import { FireballFX }     from "@/components/game/effects/fx/FireballFX";
import { MeteorFX }       from "@/components/game/effects/fx/MeteorFX";
import { ShurikenFX }     from "@/components/game/effects/fx/ShurikenFX";
import { ShurikenBlastFX } from "@/components/game/effects/fx/ShurikenBlastFX";

const FX_MAP: Record<SkillFX["type"], React.ComponentType<{ fx: SkillFX }>> = {
  slash:          SlashFX,
  blast:          BlastFX,
  arrow:          ArrowFX,
  arrow_blast:    ArrowBlastFX,
  fireball:       FireballFX,
  meteor:         MeteorFX,
  shuriken:       ShurikenFX,
  shuriken_blast: ShurikenBlastFX,
};

const FX_CLEANUP_BUFFER_MS = 50;

export function SkillEffects() {
  const fxList   = useGameStore((s) => s.fxList);
  const removeFX = useGameStore((s) => s.removeFX);
  const pending  = useRef(new Set<number>());

  useFrame(() => {
    const now = Date.now();
    fxList.forEach((fx) => {
      const dur = FX_DURATION[fx.type];
      if (now - fx.startTime > dur + FX_CLEANUP_BUFFER_MS && !pending.current.has(fx.fxId)) {
        pending.current.add(fx.fxId);
        removeFX(fx.fxId);
      }
    });
  });

  return (
    <>
      {fxList.map((fx) => {
        const Comp = FX_MAP[fx.type];
        return <Comp key={fx.fxId} fx={fx} />;
      })}
    </>
  );
}
