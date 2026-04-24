import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import type { EquipSlots } from "@/types/character";
import type { Item } from "@/types/item";
import s from "./inventory.module.scss";

const TOTAL_SLOTS = 16;

const EQUIP_SLOT_KEYS: (keyof EquipSlots)[] = ["weapon", "armor", "ring"];
const EQUIP_SLOT_LABELS: Record<keyof EquipSlots, string> = {
  weapon: "⚔️ 무기",
  armor:  "🛡️ 방어구",
  ring:   "💍 반지",
};

interface InventoryProps {
  open: boolean;
  onClose: () => void;
}

export function Inventory({ open, onClose }: InventoryProps) {
  const { inventory, equipped } = useGameStore(useShallow((s) => ({ inventory: s.inventory, equipped: s.equipped })));
  const equipItem   = useGameStore((s) => s.equipItem);
  const unequipItem = useGameStore((s) => s.unequipItem);
  const totalAtk    = useGameStore((s) => s.totalAtk);
  const totalDef    = useGameStore((s) => s.totalDef);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.code === "KeyI") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const emptySlots = TOTAL_SLOTS - inventory.length;

  return (
    <div className={s.modal}>
      <div className={s.header}>
        <span className={s.title}>인벤토리</span>
        <button onClick={onClose} className={s.closeBtn}>✕</button>
      </div>

      <div className={s.body}>
        <div className={s.equipCol}>
          <div className={s.sectionLabel}>장착</div>
          {EQUIP_SLOT_KEYS.map((slot) => {
            const item = equipped[slot];
            return (
              <div
                key={slot}
                onClick={() => item && unequipItem(slot)}
                className={`${s.equipSlot} ${item ? s.equipped : ""}`}
              >
                {item ? (
                  <>
                    <span className={s.equipIcon}>{item.icon}</span>
                    <div>
                      <div className={s.equipName}>{item.name}</div>
                      <div className={s.equipStats}>
                        {item.atk > 0 && `ATK +${item.atk} `}
                        {item.def > 0 && `DEF +${item.def} `}
                        {item.hpBonus > 0 && `HP +${item.hpBonus}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className={s.emptySlotLabel}>{EQUIP_SLOT_LABELS[slot]}</span>
                )}
              </div>
            );
          })}

          <div className={s.statSummary}>
            {[
              { label: "ATK", value: totalAtk(), color: "var(--accent)"  },
              { label: "DEF", value: totalDef(), color: "var(--accent2)" },
            ].map(({ label, value, color }) => (
              <div key={label} className={s.statLine} style={{ color }}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.gridCol}>
          <div className={s.sectionLabel}>가방 ({inventory.length}/{TOTAL_SLOTS})</div>
          <div className={s.grid}>
            {inventory.map((item) => (
              <ItemSlot key={item.uid} item={item} onClick={() => equipItem(item)} />
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div key={`empty-${i}`} className={s.emptyInvSlot} />
            ))}
          </div>
        </div>
      </div>

      <div className={s.footer}>아이템 클릭 → 장착 · 장착 슬롯 클릭 → 해제 · I 닫기</div>
    </div>
  );
}

function ItemSlot({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={s.invSlot}
      title={`${item.name}\n${item.atk > 0 ? `ATK +${item.atk}` : ""}${item.def > 0 ? ` DEF +${item.def}` : ""}${item.hpBonus > 0 ? ` HP +${item.hpBonus}` : ""}`}
    >
      <span>{item.icon}</span>
      <span className={s.itemName}>{item.name.slice(0, 4)}</span>
    </div>
  );
}
