import type { Class } from "@/types/class";
import type { SkillConfig } from "@/types/skill";

export const CLASS_SKILL_CONFIG: Record<Class, Record<string, SkillConfig>> = {
  warrior: {
    slash: { lockMs: 500, triggersAttack: true, hitDelay: 250, pattern: "slash" },
    charge: { lockMs: 800, triggersAttack: true, hitDelay: 300, pattern: "slash" },
    taunt: { lockMs: 1000, triggersAttack: false },
    cataclysm: { lockMs: 1800, triggersAttack: true, fx: "blast", pattern: "blast" },
  },
  archer: {
    arrow_shot: { lockMs: 350, triggersAttack: true, fx: "arrow", pattern: "slash" },
    piercing_arrow: { lockMs: 800, triggersAttack: true, fx: "arrow", pattern: "slash" },
    backstep: { lockMs: 500, triggersAttack: false },
    explosive_arrow: { lockMs: 500, triggersAttack: true, fx: "arrow_blast", pattern: "blast" },
  },
  mage: {
    fireball: { lockMs: 500, triggersAttack: true, fx: "fireball", pattern: "slash" },
    ice_spike: { lockMs: 700, triggersAttack: true, fx: "arrow", pattern: "slash" },
    blink: { lockMs: 300, triggersAttack: false },
    black_hole: { lockMs: 500, triggersAttack: true, fx: "blast", pattern: "blast" },
  },
  rogue: {
    dagger_slash: { lockMs: 300, triggersAttack: true, hitDelay: 150, pattern: "slash" },
    shadow_slash: { lockMs: 400, triggersAttack: true, hitDelay: 100, pattern: "slash" },
    smoke_bomb: { lockMs: 500, triggersAttack: false },
    death_dance: { lockMs: 500, triggersAttack: true, fx: "shuriken_blast", pattern: "blast" },
  },
};
