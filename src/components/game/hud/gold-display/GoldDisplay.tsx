import { useGameStore } from "@/stores/gameStore";
import s from "./gold-display.module.scss";

export function GoldDisplay() {
  const gold = useGameStore((s) => s.gold);
  return <div className={s.gold}>💰 {gold}G</div>;
}
