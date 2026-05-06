import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type WildBoarMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function WildBoarMonster({ id, position, onDeath }: WildBoarMonsterProps) {
  return <Monster id={id} type="wildBoar" position={position} onDeath={onDeath} />;
}
