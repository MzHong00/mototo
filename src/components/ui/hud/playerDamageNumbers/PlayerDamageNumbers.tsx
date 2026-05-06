import { useState, useEffect } from "react";

import { playerDamageEvents } from "@/stores/worldRefs";

import s from "./PlayerDamageNumbers.module.scss";

interface DmgEntry {
  id: number;
  amount: number;
  offsetX: number;
}

const FLOAT_DURATION_MS = 850;
const POLL_MS = 50;

export function PlayerDamageNumbers() {
  const [entries, setEntries] = useState<DmgEntry[]>([]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (playerDamageEvents.length === 0) return;

      const newEntries: DmgEntry[] = [];
      while (playerDamageEvents.length > 0) {
        const e = playerDamageEvents.shift()!;
        newEntries.push({
          id: e.id,
          amount: e.amount,
          offsetX: Math.floor(Math.random() * 80) - 40,
        });
      }

      setEntries((prev) => [...prev, ...newEntries]);

      newEntries.forEach((entry) => {
        setTimeout(() => {
          setEntries((prev) => prev.filter((en) => en.id !== entry.id));
        }, FLOAT_DURATION_MS);
      });
    }, POLL_MS);

    return () => clearInterval(iv);
  }, []);

  return (
    <div className={s.container}>
      {entries.map((e) => (
        <div
          key={e.id}
          className={s.number}
          style={{ left: `calc(50% + ${e.offsetX}px)`, transform: "translateX(-50%)" }}
        >
          -{e.amount}
        </div>
      ))}
    </div>
  );
}
