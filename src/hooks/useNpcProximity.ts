import { useState, useEffect } from "react";
import { npcProximity } from "@/stores/worldRefs";

const POLL_MS = 200;

export function useNpcProximity(): boolean {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setIsNear(npcProximity.isNear), POLL_MS);
    return () => clearInterval(iv);
  }, []);

  return isNear;
}
