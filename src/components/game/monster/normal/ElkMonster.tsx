import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type ElkMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function ElkMonster({ id, position, onDeath }: ElkMonsterProps) {
  return <Monster id={id} type="elk" position={position} onDeath={onDeath} />;
}
