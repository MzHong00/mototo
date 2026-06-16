import { KEY_DISPLAY_MAP } from "@/constants/ui/controls";

export function getKeyDisplay(code: string): string {
  return KEY_DISPLAY_MAP[code] ?? code;
}
