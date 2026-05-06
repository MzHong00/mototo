import { useGameStore } from "@/stores/gameStore";
import { useDraggable } from "@/hooks/useDraggable";

import type { Item } from "@/types/item";

import s from "./InventoryWindow.module.scss";

const TOTAL_SLOTS = 16;

interface InventoryWindowProps {
  onClose: () => void;
}

export function InventoryWindow({ onClose }: InventoryWindowProps) {
  const inventory = useGameStore((st) => st.inventory);
  const equipItem = useGameStore((st) => st.equipItem);
  const gold = useGameStore((st) => st.gold);
  const { pos, onHeaderMouseDown } = useDraggable(80, 80);

  const emptySlots = TOTAL_SLOTS - inventory.length;

  return (
    <div className={s.panel} style={{ left: pos.x, top: pos.y }}>
      <div className={s.header} onMouseDown={onHeaderMouseDown}>
        <span className={s.title}>인벤토리</span>
        <span className={s.count}>
          {inventory.length}/{TOTAL_SLOTS}
        </span>
        <button onClick={onClose} className={s.closeBtn}>
          ✕
        </button>
      </div>

      <div className={s.grid}>
        {inventory.map((item) => (
          <ItemSlot key={item.uid} item={item} onClick={() => equipItem(item)} />
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className={s.emptySlot} />
        ))}
      </div>

      <div className={s.footer}>
        <span className={s.gold}>💰 {gold}G</span>
        <span>아이템 클릭 → 장착</span>
      </div>
    </div>
  );
}

function ItemSlot({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={s.slot}
      title={`${item.name}${item.atk > 0 ? `\nATK +${item.atk}` : ""}${item.def > 0 ? `\nDEF +${item.def}` : ""}${item.hpBonus > 0 ? `\nHP +${item.hpBonus}` : ""}`}
    >
      <span className={s.icon}>{item.icon}</span>
      <span className={s.name}>{item.name.slice(0, 4)}</span>
    </div>
  );
}
