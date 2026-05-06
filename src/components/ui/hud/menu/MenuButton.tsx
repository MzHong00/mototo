import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  open: boolean;
  onClick: () => void;
}

export function MenuButton({ open, onClick }: MenuButtonProps) {
  return (
    <button
      className={`${styles.btn} ${open ? styles.active : ""}`}
      onClick={onClick}
      aria-label="메뉴"
    >
      <span />
      <span />
      <span />
    </button>
  );
}
