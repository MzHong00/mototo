import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type RamMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function RamMonster({ id, position, onDeath }: RamMonsterProps) {
  return <Monster id={id} type="ram" position={position} onDeath={onDeath} />;
}
