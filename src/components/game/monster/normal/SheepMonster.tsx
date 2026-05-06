import type { MonsterConfig } from "@/types/monster";
import { Monster } from "../Monster";

type SheepMonsterProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

export function SheepMonster({ id, position, onDeath }: SheepMonsterProps) {
  return <Monster id={id} type="sheep" position={position} onDeath={onDeath} />;
}
