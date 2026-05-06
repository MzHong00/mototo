export const KEYS = new Set<string>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => KEYS.add(e.code));
  window.addEventListener("keyup", (e) => KEYS.delete(e.code));
}
