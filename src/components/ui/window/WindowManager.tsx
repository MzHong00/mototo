import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/stores/gameStore";
import { getControlsState } from "@/stores/controlsStore";
import { MenuButton } from "@/components/ui/hud/menu/MenuButton";
import { GameMenu } from "@/components/ui/hud/menu/GameMenu";
import { InventoryWindow } from "@/components/ui/window/inventoryWindow/InventoryWindow";
import { EquipmentWindow } from "@/components/ui/window/equipmentWindow/EquipmentWindow";
import { SkillWindow } from "@/components/ui/window/skillWindow/SkillWindow";
import { KeySettings } from "@/components/ui/window/keySettings/KeySettings";
import { ShopWindow } from "@/components/ui/window/shopWindow/ShopWindow";

export function WindowManager() {
  const navigate = useNavigate();
  const shopOpen = useGameStore((s) => s.shopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);

  const [menuOpen, setMenuOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [skillWindowOpen, setSkillWindowOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { bindings } = getControlsState();
      if (e.code === bindings.inventory) setInventoryOpen((v) => !v);
      if (e.code === bindings.equipment) setEquipmentOpen((v) => !v);
      if (e.code === bindings.skillWindow) setSkillWindowOpen((v) => !v);
      if (e.code === "Escape") {
        setMenuOpen(false);
        setInventoryOpen(false);
        setEquipmentOpen(false);
        setSkillWindowOpen(false);
        setSettingsOpen(false);
        setShopOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShopOpen]);

  return (
    <>
      <MenuButton open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      {menuOpen && (
        <GameMenu
          onInventory={() => setInventoryOpen((v) => !v)}
          onEquipment={() => setEquipmentOpen((v) => !v)}
          onSkillWindow={() => setSkillWindowOpen((v) => !v)}
          onSettings={() => setSettingsOpen((v) => !v)}
          onLobby={() => navigate("/")}
          onClose={() => setMenuOpen(false)}
        />
      )}
      {inventoryOpen && <InventoryWindow onClose={() => setInventoryOpen(false)} />}
      {equipmentOpen && <EquipmentWindow onClose={() => setEquipmentOpen(false)} />}
      {skillWindowOpen && <SkillWindow onClose={() => setSkillWindowOpen(false)} />}
      {settingsOpen && <KeySettings onClose={() => setSettingsOpen(false)} />}
      <ShopWindow open={shopOpen} onClose={() => setShopOpen(false)} />
    </>
  );
}
