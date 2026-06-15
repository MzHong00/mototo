import type { SkillFXType } from "@/types/combat";
import { SKILL_FX_TYPE } from "@/constants/skill/combat";

export const FX_DURATION: Record<SkillFXType, number> = {
  [SKILL_FX_TYPE.SLASH]: 480,
  [SKILL_FX_TYPE.BLAST]: 600,
  [SKILL_FX_TYPE.ARROW]: 450,
  [SKILL_FX_TYPE.ARROW_BLAST]: 700,
  [SKILL_FX_TYPE.FIREBALL]: 550,
  [SKILL_FX_TYPE.METEOR]: 900,
  [SKILL_FX_TYPE.SHURIKEN]: 500,
  [SKILL_FX_TYPE.SHURIKEN_BLAST]: 750,
};

export const SKILL_COLOR: Record<string, string> = {
  // Warrior
  slash: "var(--accent)",
  charge: "var(--red-orange-400)",
  taunt: "var(--lavender-400)",
  cataclysm: "var(--danger)",
  // Archer
  arrow_shot: "var(--exp)",
  piercing_arrow: "var(--emerald-400)",
  backstep: "var(--blue-400)",
  explosive_arrow: "var(--amber-400)",
  // Mage
  fireball: "var(--red-orange-400)",
  ice_spike: "var(--cyan-300)",
  blink: "var(--lavender-400)",
  black_hole: "var(--neutral-800)",
  // Rogue
  dagger_slash: "var(--accent)",
  shadow_slash: "var(--slate-400)",
  smoke_bomb: "var(--yellow-green-500)",
  death_dance: "var(--danger)",
  // Common
  dash: "var(--purple-500)",
};

export const SKILL_ICON: Record<string, string> = {
  // Warrior
  slash: "⚔️",
  charge: "⚡",
  taunt: "📣",
  cataclysm: "💀",
  // Archer
  arrow_shot: "🏹",
  piercing_arrow: "🎯",
  backstep: "↩️",
  explosive_arrow: "💥",
  // Mage
  fireball: "🔥",
  ice_spike: "❄️",
  blink: "✨",
  black_hole: "🌀",
  // Rogue
  dagger_slash: "🗡️",
  shadow_slash: "👤",
  smoke_bomb: "💨",
  death_dance: "💃",
  // Common
  dash: "⚡",
};

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  // Warrior
  slash: "전방 근접 범위 적에게 물리 데미지",
  charge: "전방으로 돌진, 첫 번째 적에게 강타 + 0.5초 경직",
  taunt: "주변 적을 4초간 집중시킴. 피해 감소 20%",
  cataclysm: "긴 선딜 후 ATK × 3.0 강타",
  // Archer
  arrow_shot: "전방으로 화살 1발 발사. 기본 평타",
  piercing_arrow: "충전 후 발사. 경로 위 모든 적 관통 타격",
  backstep: "뒤로 대시하며 화살 3발 동시 발사",
  explosive_arrow: "폭발 화살 발사. 착탄 시 광역 폭발",
  // Mage
  fireball: "전방으로 화염볼 발사. 기본 평타",
  ice_spike: "빙결 창 발사. 적중 시 이동속도 -60% 2초",
  blink: "바라보는 방향으로 단거리 순간이동",
  black_hole: "전방에 블랙홀 생성. 3초 흡입 후 폭발",
  // Rogue
  dagger_slash: "단검으로 전방 적을 빠르게 베는 기본 평타",
  shadow_slash: "대상에게 순간이동하며 ATK × 1.8 베기",
  smoke_bomb: "발 아래 연막 생성 3초. 연막 내 은신·적 슬로우",
  death_dance: "6초간 적에게 순간이동하며 12타",
  // Common
  dash: "진행 방향으로 빠르게 대시",
};
