import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type PigMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function PigMonster({ id, position, onDeath }: PigMonsterProps) {
  return <Monster id={id} type="pig" position={position} onDeath={onDeath} />;
}
