import { useGameStore } from "@/stores/gameStore";
import { SHOP_CATALOG } from "@/constants/shop";
import s from "./shop.module.scss";

let shopUidCounter = 0;

interface ShopProps {
  open: boolean;
  onClose: () => void;
}

export function Shop({ open, onClose }: ShopProps) {
  const gold = useGameStore((s) => s.gold);
  const spendGold = useGameStore((s) => s.spendGold);
  const healHp = useGameStore((s) => s.healHp);
  const healMp = useGameStore((s) => s.healMp);
  const addItem = useGameStore((s) => s.addItem);

  if (!open) return null;

  const handleBuy = (id: string) => {
    const def = SHOP_CATALOG.find((d) => d.id === id);
    if (!def) return;
    if (!spendGold(def.price)) return;

    if (def.healHp) healHp(def.healHp);
    if (def.healMp) healMp(def.healMp);
    if (def.grantItem) addItem({ ...def.grantItem, uid: `${def.id}_${shopUidCounter++}` });
    if (def.enhanceAtk) {
      useGameStore.setState((s) => ({
        character: { ...s.character, baseAtk: s.character.baseAtk + (def.enhanceAtk ?? 0) },
      }));
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.header}>
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
              <div style={{ flex: 1 }}>
                <div className={s.itemName}>{def.name}</div>
                <div className={s.itemDesc}>{def.desc}</div>
                <div className={s.itemPrice} style={{ color: canAfford ? "#FFB300" : "#aaa" }}>
                  {def.price}G
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.footer}>F키 또는 ESC로 닫기</div>
    </div>
  );
}
