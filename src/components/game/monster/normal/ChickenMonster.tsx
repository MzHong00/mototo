import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type ChickenMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function ChickenMonster({ id, position, onDeath }: ChickenMonsterProps) {
  return <Monster id={id} type="chicken" position={position} onDeath={onDeath} />;
}
