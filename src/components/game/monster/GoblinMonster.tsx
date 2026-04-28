import type { MonsterConfig } from "@/types/monster";
import { Monster } from "./Monster";

type GoblinMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function GoblinMonster({ id, position, onDeath }: GoblinMonsterProps) {
  return <Monster id={id} type="goblin" position={position} onDeath={onDeath} />;
}
