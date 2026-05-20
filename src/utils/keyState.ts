export const KEYS = new Set<string>();
export const KEY_ORDER: string[] = [];

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (!KEYS.has(e.code)) {
      KEYS.add(e.code);
      KEY_ORDER.push(e.code);
    }
  });
  window.addEventListener("keyup", (e) => {
    KEYS.delete(e.code);
    const idx = KEY_ORDER.indexOf(e.code);
    if (idx !== -1) KEY_ORDER.splice(idx, 1);
  });
}
