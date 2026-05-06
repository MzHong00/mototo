import styles from "./GameMenu.module.scss";

interface GameMenuProps {
  onInventory: () => void;
  onEquipment: () => void;
  onSkillWindow: () => void;
  onSettings: () => void;
  onClose: () => void;
}

export function GameMenu({
  onInventory,
  onEquipment,
  onSkillWindow,
  onSettings,
  onClose,
}: GameMenuProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.item}
          onClick={() => {
            onInventory();
            onClose();
          }}
        >
          🎒 인벤토리
        </button>
        <button
          className={styles.item}
          onClick={() => {
            onEquipment();
            onClose();
          }}
        >
          🗡️ 장비창
        </button>
        <button
          className={styles.item}
          onClick={() => {
            onSkillWindow();
            onClose();
          }}
        >
          ✨ 스킬
        </button>
        <button
          className={styles.item}
          onClick={() => {
            onSettings();
            onClose();
          }}
        >
          ⚙️ 설정 (키 세팅)
        </button>
      </div>
    </div>
  );
}
