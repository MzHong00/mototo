import type { PartCategory } from "@/engine/chibi/character";

export type ColorKey = PartCategory | "skin" | "eyes";

// 색 팔레트 — chibi-pipeline/web/customize.js 와 동일
export const CHIBI_PALETTE: Record<ColorKey, string[]> = {
  hair: [
    "#2b2630",
    "#f2d27a",
    "#f7a8c4",
    "#6ea8ff",
    "#a98cf0",
    "#eeeef4",
    "#e0603a",
    "#7ccb8a",
    "#3d4f8a",
  ],
  top: [
    "#ff7a8a",
    "#ffd166",
    "#8ed1a5",
    "#7fb7ff",
    "#b79cff",
    "#2f3440",
    "#ff9f5a",
    "#ffc4d8",
    "#f4f1ea",
  ],
  bottom: ["#2a3a6b", "#5b4636", "#3a3a44", "#d8c6a5", "#ff8fab", "#5aa9e6", "#6bbf8e", "#f2f2f2"],
  shoes: ["#ffffff", "#2b2b33", "#ff6b6b", "#ffc04d", "#5aa9e6", "#9b7bf2", "#7a4a2a", "#5fc49a"],
  skin: ["#ffe6d6", "#f0bf9c", "#e2a57c", "#c98a5e", "#a86e4c", "#7a4a33"],
  eyes: ["#3e8ee6", "#2fae66", "#8b5cf6", "#e84c6a", "#f2b33d", "#22b5b5", "#6b6f80", "#1f1d2b"],
};

export const COLOR_KEYS: ColorKey[] = ["hair", "top", "bottom", "shoes", "skin", "eyes"];

export const COLOR_KEY_LABEL: Record<ColorKey, string> = {
  hair: "머리 색",
  top: "상의 색",
  bottom: "하의 색",
  shoes: "신발 색",
  skin: "피부 톤",
  eyes: "눈 색",
};

export const EDITOR_TAB = { LOOKS: "looks", PARTS: "parts", COLORS: "colors" } as const;
export type EditorTab = (typeof EDITOR_TAB)[keyof typeof EDITOR_TAB];

export const EDITOR_TAB_LABEL: Record<EditorTab, string> = {
  looks: "외형",
  parts: "파츠",
  colors: "색상",
};

export const DEFAULT_COLOR_LABEL = "기본";
