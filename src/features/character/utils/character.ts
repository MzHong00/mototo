import { CHARACTER_NAME_PATTERN } from "@/features/character/constants/rules";

/** 닉네임 유효성 검사 */
export const isValidCharacterName = (name: string): boolean => CHARACTER_NAME_PATTERN.test(name);
