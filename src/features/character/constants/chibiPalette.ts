import type { PartCategory } from "@/lib/chibi/character";

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

export const ORIGINAL_COLOR_LABEL = "원래 색";

// 꾸미기 패널 부위 — 위에서부터 이 순서로 한 목록에 이어짐
export type EditorSectionId = "gender" | "skin" | "face" | PartCategory;
export const EDITOR_SECTIONS: { id: EditorSectionId; label: string; color?: ColorKey }[] = [
  { id: "gender", label: "성별" },
  { id: "skin", label: "피부", color: "skin" },
  { id: "face", label: "얼굴", color: "eyes" },
  { id: "hair", label: "머리", color: "hair" },
  { id: "top", label: "상의", color: "top" },
  { id: "bottom", label: "하의", color: "bottom" },
  { id: "shoes", label: "신발", color: "shoes" },
];
