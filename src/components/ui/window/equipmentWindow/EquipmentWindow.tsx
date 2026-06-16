import { useGameStore } from "@/stores/gameStore";
import { useDraggable } from "@/hooks/useDraggable";
import { ITEM_TYPE, ITEM_TYPE_LABEL } from "@/constants/item/item";

import s from "./EquipmentWindow.module.scss";

interface EquipmentWindowProps {
  onClose: () => void;
}

export function EquipmentWindow({ onClose }: EquipmentWindowProps) {
  const { equipped, character, unequipItem, totalAtk, totalDef } = useGameStore((s) => ({
    equipped: s.equipped,
    character: s.character,
    unequipItem: s.unequipItem,
    totalAtk: s.totalAtk,
    totalDef: s.totalDef,
  }));
  const { pos, onHeaderMouseDown } = useDraggable(480, 80);

  return (
    <div className={s.panel} style={{ left: pos.x, top: pos.y }}>
      <div className={s.header} onMouseDown={onHeaderMouseDown}>
        <span className={s.title}>장비창</span>
        <button className={s.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={s.body}>
        <div className={s.charInfo}>
          <span className={s.classBadge}>{character.cls ?? "—"}</span>
          <span className={s.levelBadge}>Lv.{character.level}</span>
        </div>

        <div className={s.slots}>
          {Object.values(ITEM_TYPE).map((slot) => {
            const item = equipped[slot];
            return (
              <div
                key={slot}
                className={`${s.slot} ${item ? s.equipped : ""}`}
                onClick={() => item && unequipItem(slot)}
                title={item ? "클릭하여 해제" : undefined}
              >
                {item ? (
                  <>
                    <span className={s.itemIcon}>{item.icon}</span>
                    <div className={s.itemInfo}>
                      <div className={s.itemName}>{item.name}</div>
                      <div className={s.itemStats}>
                        {item.atk > 0 && `ATK +${item.atk} `}
                        {item.def > 0 && `DEF +${item.def} `}
                        {item.hpBonus > 0 && `HP +${item.hpBonus}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className={s.emptyLabel}>{ITEM_TYPE_LABEL[slot]}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className={s.stats}>
          {[
            { label: "ATK", value: totalAtk(), color: "var(--accent)" },
            { label: "DEF", value: totalDef(), color: "var(--accent)" },
            { label: "HP", value: character.maxHp, color: "var(--hp)" },
          ].map(({ label, value, color }) => (
            <div key={label} className={s.statRow} style={{ color }}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <p className={s.hint}>장착 슬롯 클릭 → 해제</p>
      </div>
    </div>
  );
}
