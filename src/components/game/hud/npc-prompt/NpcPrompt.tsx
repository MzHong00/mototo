import s from "./npc-prompt.module.scss";

interface NpcPromptProps {
  visible: boolean;
}

export function NpcPrompt({ visible }: NpcPromptProps) {
  if (!visible) return null;
  return <div className={s.prompt}>F 상점 열기</div>;
}
