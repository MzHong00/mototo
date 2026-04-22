import { useGameStore } from "@/stores/gameStore";

let shopUidCounter = 0;

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  desc: string;
  action: () => void;
}

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

  const SHOP_ITEMS: ShopItem[] = [
    {
      id: "hp_potion",
      name: "HP 포션",
      icon: "🧪",
      price: 50,
      desc: "HP를 80 회복합니다",
      action: () => {
        if (spendGold(50)) healHp(80);
      },
    },
    {
      id: "mp_potion",
      name: "MP 포션",
      icon: "💧",
      price: 30,
      desc: "MP를 50 회복합니다",
      action: () => {
        if (spendGold(30)) healMp(50);
      },
    },
    {
      id: "iron_sword",
      name: "철제 검",
      icon: "⚔️",
      price: 150,
      desc: "ATK +12",
      action: () => {
        if (spendGold(150))
          addItem({
            uid: `iron_sword_${shopUidCounter++}`,
            id: "iron_sword",
            name: "철제 검",
            type: "weapon",
            icon: "⚔️",
            atk: 12,
            def: 0,
            hpBonus: 0,
          });
      },
    },
    {
      id: "iron_armor",
      name: "철제 갑옷",
      icon: "🛡️",
      price: 120,
      desc: "DEF +7",
      action: () => {
        if (spendGold(120))
          addItem({
            uid: `iron_armor_${shopUidCounter++}`,
            id: "iron_armor",
            name: "철제 갑옷",
            type: "armor",
            icon: "🛡️",
            atk: 0,
            def: 7,
            hpBonus: 0,
          });
      },
    },
    {
      id: "life_ring",
      name: "생명의 반지",
      icon: "💍",
      price: 100,
      desc: "MaxHP +40",
      action: () => {
        if (spendGold(100))
          addItem({
            uid: `life_ring_${shopUidCounter++}`,
            id: "life_ring",
            name: "생명의 반지",
            type: "ring",
            icon: "💍",
            atk: 0,
            def: 0,
            hpBonus: 40,
          });
      },
    },
    {
      id: "enhance_rune",
      name: "강화의 룬",
      icon: "✨",
      price: 200,
      desc: "baseATK +5 (영구)",
      action: () => {
        if (spendGold(200)) {
          useGameStore.setState((s) => ({
            character: { ...s.character, baseAtk: s.character.baseAtk + 5 },
          }));
        }
      },
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380,
        background: "var(--panel-bg)",
        border: "2px solid var(--border)",
        borderRadius: "var(--r-lg)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        zIndex: 50,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "var(--panel-blue)",
          borderBottom: "1px solid rgba(91,163,255,0.2)",
          borderRadius: "var(--r-lg) var(--r-lg) 0 0",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-title)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--text)",
          }}
        >
          🏪 상점
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 14,
              color: "#FFB300",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            💰 {gold}G
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "var(--text-muted)",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* 아이템 목록 */}
      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {SHOP_ITEMS.map((item) => {
          const canAfford = gold >= item.price;
          return (
            <div
              key={item.id}
              onClick={item.action}
              style={{
                padding: "12px 14px",
                background: canAfford
                  ? "var(--panel-blue)"
                  : "rgba(200,200,200,0.3)",
                border: `2px solid ${canAfford ? "var(--border-blue)" : "#ccc"}`,
                borderRadius: "var(--r-md)",
                cursor: canAfford ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "border-color 0.15s, transform 0.1s",
                opacity: canAfford ? 1 : 0.6,
              }}
              onMouseEnter={(e) =>
                canAfford &&
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--accent)")
              }
              onMouseLeave={(e) =>
                canAfford &&
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--border-blue)")
              }
            >
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 900,
                    fontSize: 12,
                    color: "var(--text)",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                  }}
                >
                  {item.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 900,
                    fontSize: 11,
                    color: canAfford ? "#FFB300" : "#aaa",
                    marginTop: 2,
                  }}
                >
                  {item.price}G
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "6px 16px 12px",
          fontFamily: "var(--font-ui)",
          fontSize: 10,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        F키 또는 ESC로 닫기
      </div>
    </div>
  );
}
