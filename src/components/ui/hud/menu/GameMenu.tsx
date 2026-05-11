import styles from "./GameMenu.module.scss";

interface GameMenuProps {
  onInventory: () => void;
  onEquipment: () => void;
  onSkillWindow: () => void;
  onSettings: () => void;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: "🎒", label: "인벤토리", action: "inventory" },
  { icon: "🗡️", label: "장비창", action: "equipment" },
  { icon: "✨", label: "스킬", action: "skill" },
  { icon: "⚙️", label: "설정", action: "settings" },
] as const;

export function GameMenu({
  onInventory,
  onEquipment,
  onSkillWindow,
  onSettings,
  onClose,
}: GameMenuProps) {
  const handlers: Record<string, () => void> = {
    inventory: onInventory,
    equipment: onEquipment,
    skill: onSkillWindow,
    settings: onSettings,
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {MENU_ITEMS.map(({ icon, label, action }) => (
          <button
            key={action}
            className={styles.item}
            onClick={() => {
              handlers[action]();
              onClose();
            }}
          >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
