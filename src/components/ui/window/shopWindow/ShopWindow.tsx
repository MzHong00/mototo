import { useGameStore, setGameState } from "@/stores/gameStore";
import { useDraggable } from "@/hooks/useDraggable";
import { SHOP_CATALOG } from "@/constants/shop";

import s from "./ShopWindow.module.scss";

let shopUidCounter = 0;

interface ShopWindowProps {
  open: boolean;
  onClose: () => void;
}

export function ShopWindow({ open, onClose }: ShopWindowProps) {
  const gold = useGameStore((s) => s.gold);
  const spendGold = useGameStore((s) => s.spendGold);
  const healHp = useGameStore((s) => s.healHp);
  const addItem = useGameStore((s) => s.addItem);
  const { pos, onHeaderMouseDown } = useDraggable(Math.max(0, window.innerWidth / 2 - 190), 80);

  if (!open) return null;

  const handleBuy = (id: string) => {
    const def = SHOP_CATALOG.find((d) => d.id === id);
    if (!def) return;
    if (!spendGold(def.price)) return;

    if (def.healHp) healHp(def.healHp);
    if (def.grantItem) addItem({ ...def.grantItem, uid: `${def.id}_${shopUidCounter++}` });
    if (def.enhanceAtk) {
      setGameState((s) => ({
        character: { ...s.character, baseAtk: s.character.baseAtk + (def.enhanceAtk ?? 0) },
      }));
    }
  };

  return (
    <div className={s.modal} style={{ left: pos.x, top: pos.y }}>
      <div className={s.header} onMouseDown={onHeaderMouseDown}>
        <span className={s.shopTitle}>🏪 상점</span>
        <div className={s.headerLeft}>
          <span className={s.gold}>💰 {gold}G</span>
          <button onClick={onClose} className={s.closeBtn}>
            ✕
          </button>
        </div>
      </div>

      <div className={s.grid}>
        {SHOP_CATALOG.map((def) => {
          const canAfford = gold >= def.price;
          return (
            <div
              key={def.id}
              onClick={() => canAfford && handleBuy(def.id)}
              className={`${s.item} ${!canAfford ? s.disabled : ""}`}
            >
              <span className={s.itemIcon}>{def.icon}</span>
              <div className={s.itemContent}>
                <div className={s.itemName}>{def.name}</div>
                <div className={s.itemDesc}>{def.desc}</div>
                <div className={s.itemPrice}>{def.price}G</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.footer}>F키 또는 ESC로 닫기</div>
    </div>
  );
}
