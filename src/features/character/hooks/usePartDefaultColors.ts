import { useEffect, useState } from "react";

import { CATEGORIES, loadPart, partDefaultColor } from "@/lib/chibi/character";

import type { PartCategory } from "@/lib/chibi/character";

/** 지금 입은 아이템들의 원래 색 — 파츠 파일을 읽어야 알 수 있어 읽은 뒤 채움 */
export function usePartDefaultColors(parts: Record<PartCategory, string | null>) {
  const [colors, setColors] = useState<Partial<Record<PartCategory, string>>>({});

  useEffect(() => {
    let isAlive = true;
    const read = async () => {
      const entries = await Promise.all(
        CATEGORIES.map(async (cat) => {
          const id = parts[cat];
          if (!id) return [cat, undefined] as const;
          await loadPart(id).catch(() => null);
          return [cat, partDefaultColor[id]] as const;
        }),
      );
      if (isAlive) setColors(Object.fromEntries(entries));
    };
    void read();
    return () => {
      isAlive = false;
    };
  }, [parts]);

  return colors;
}
