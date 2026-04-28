import type { MonsterConfig } from "@/types/monster";
import { Monster } from "./Monster";

type OrcMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function OrcMonster({ id, position, onDeath }: OrcMonsterProps) {
  return <Monster id={id} type="orc" position={position} onDeath={onDeath} />;
}
