import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type RoosterMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function RoosterMonster({ id, position, onDeath }: RoosterMonsterProps) {
  return <Monster id={id} type="rooster" position={position} onDeath={onDeath} />;
}
