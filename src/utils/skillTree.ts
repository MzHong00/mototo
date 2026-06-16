import type { Class } from "@/types/class";
import type { SkillTreeDef } from "@/types/skillTree";
import { SKILL_TREES } from "@/constants/skill/skillTree";

export function getSkillTree(cls: Class, skillId: string): SkillTreeDef | undefined {
  return SKILL_TREES[cls].find((t) => t.skillId === skillId);
}
