import { useEffect } from "react";
import { useGameStore, type Item } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";

interface InventoryProps {
  open: boolean;
  onClose: () => void;
}

const SLOT_SIZE = 56;
const TOTAL_SLOTS = 16;

const SLOT_TYPES: (keyof ReturnType<
  typeof useGameStore.getState
>["equipped"])[] = ["weapon", "armor", "ring"];
const SLOT_LABELS: Record<string, string> = {
  weapon: "⚔️ 무기",
  armor: "🛡️ 방어구",
  ring: "💍 반지",
};

export function Inventory({ open, onClose }: InventoryProps) {
  const { inventory, equipped } = useGameStore(
    useShallow((s) => ({ inventory: s.inventory, equipped: s.equipped })),
  );
  const equipItem = useGameStore((s) => s.equipItem);
  const unequipItem = useGameStore((s) => s.unequipItem);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const totalDef = useGameStore((s) => s.totalDef);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "KeyI") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const emptySlots = TOTAL_SLOTS - inventory.length;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 360,
        background: "var(--panel-bg)",
        border: "2px solid var(--border)",
        borderRadius: "var(--r-lg)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,215,0,0.3)",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(91,163,255,0.2)",
          background: "var(--panel-blue)",
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
          인벤토리
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "var(--text-muted)",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: 16, display: "flex", gap: 16 }}>
        {/* 장착 슬롯 */}
        <div style={{ width: 100 }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            장착
          </div>
          {SLOT_TYPES.map((slot) => {
            const item = equipped[slot];
            return (
              <div
                key={slot}
                onClick={() => item && unequipItem(slot)}
                style={{
                  height: 52,
                  background: item
                    ? "rgba(255,153,0,0.1)"
                    : "var(--panel-blue)",
                  border: `2px solid ${item ? "var(--accent)" : "var(--border-blue)"}`,
                  borderRadius: "var(--r-md)",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 8px",
                  cursor: item ? "pointer" : "default",
                  boxShadow: item ? "0 0 0 2px rgba(255,153,0,0.25)" : "none",
                }}
              >
                {item ? (
                  <>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontWeight: 900,
                          fontSize: 10,
                          color: "var(--accent)",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 9,
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.atk > 0 && `ATK +${item.atk} `}
                        {item.def > 0 && `DEF +${item.def} `}
                        {item.hpBonus > 0 && `HP +${item.hpBonus}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 10,
                      color: "var(--text-muted)",
                    }}
                  >
                    {SLOT_LABELS[slot]}
                  </span>
                )}
              </div>
            );
          })}

          {/* 스탯 요약 */}
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              background: "var(--panel-blue)",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border-blue)",
            }}
          >
            {[
              { label: "ATK", value: totalAtk(), color: "var(--accent)" },
              { label: "DEF", value: totalDef(), color: "var(--accent2)" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-ui)",
                  fontWeight: 900,
                  fontSize: 11,
                  fontVariantNumeric: "tabular-nums",
                  color,
                  marginBottom: 2,
                }}
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 아이템 그리드 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            가방 ({inventory.length}/{TOTAL_SLOTS})
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
            }}
          >
            {inventory.map((item) => (
              <ItemSlot
                key={item.uid}
                item={item}
                onClick={() => equipItem(item)}
              />
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  width: SLOT_SIZE,
                  height: SLOT_SIZE,
                  background: "var(--panel-blue)",
                  border: "2px solid var(--border-blue)",
                  borderRadius: "var(--r-sm)",
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>
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
        아이템 클릭 → 장착 · 장착 슬롯 클릭 → 해제 · I 닫기
      </div>
    </div>
  );
}

function ItemSlot({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      title={`${item.name}\n${item.atk > 0 ? `ATK +${item.atk}` : ""}${item.def > 0 ? ` DEF +${item.def}` : ""}${item.hpBonus > 0 ? ` HP +${item.hpBonus}` : ""}`}
      style={{
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        background: "var(--panel-blue)",
        border: "2px solid var(--border-blue)",
        borderRadius: "var(--r-sm)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.1s",
        fontSize: 22,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border-blue)";
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    >
      <span>{item.icon}</span>
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 8,
          color: "var(--text-muted)",
          marginTop: 1,
        }}
      >
        {item.name.slice(0, 4)}
      </span>
    </div>
  );
}
