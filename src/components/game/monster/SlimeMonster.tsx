import type { MonsterConfig } from "@/types/monster";
import { Monster } from "./Monster";

type SlimeMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function SlimeMonster({ id, position, onDeath }: SlimeMonsterProps) {
  return <Monster id={id} type="slime" position={position} onDeath={onDeath} />;
}
