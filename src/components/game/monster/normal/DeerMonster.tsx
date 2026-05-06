import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type DeerMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function DeerMonster({ id, position, onDeath }: DeerMonsterProps) {
  return <Monster id={id} type="deer" position={position} onDeath={onDeath} />;
}
