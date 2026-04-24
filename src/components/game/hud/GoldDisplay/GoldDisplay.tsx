import { useGameStore } from "@/stores/gameStore";
import s from "./GoldDisplay.module.scss";

export function GoldDisplay() {
  const gold = useGameStore((s) => s.gold);
  return <div className={s.gold}>💰 {gold}G</div>;
}
