import { useState, useEffect, useCallback } from "react";
import { Scene } from "@/components/game/Scene";
import { HUD } from "@/components/game/hud/HUD";
import { LevelUpEffect } from "@/components/game/screen/LevelUpEffect/LevelUpEffect";
import { Inventory } from "@/components/game/Inventory/Inventory";
import { ClassSelect } from "@/components/game/screen/ClassSelect/ClassSelect";
import { DeathScreen } from "@/components/game/screen/DeathScreen/DeathScreen";
import { Shop } from "@/components/game/Shop/Shop";
import { useGameStore } from "@/stores/gameStore";
import type { JobClass } from "@/types/character";

const ZONE_FLASH_DURATION_MS = 400;

export default function App() {
  const [zone, setZone] = useState(1);
  const [inventoryOpen, setInventory] = useState(false);
  const [flash, setFlash] = useState(false);

  const isDead = useGameStore((s) => s.isDead);
  const shopOpen = useGameStore((s) => s.shopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const selectClass = useGameStore((s) => s.selectClass);
  const respawn = useGameStore((s) => s.respawn);
  const jobClass = useGameStore((s) => s.character.jobClass);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "KeyI") setInventory((v) => !v);
      if (e.code === "Escape") {
        setInventory(false);
        setShopOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShopOpen]);

  const handlePortalEnter = useCallback(() => {
    setFlash(true);
    setTimeout(() => {
      setZone((z) => (z === 1 ? 2 : 1));
      setFlash(false);
    }, ZONE_FLASH_DURATION_MS);
  }, []);

  const handleClassSelect = useCallback((cls: JobClass) => selectClass(cls), [selectClass]);

  if (!jobClass) return <ClassSelect onSelect={handleClassSelect} />;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <Scene zone={zone} onPortalEnter={handlePortalEnter} />
      <HUD />
      <LevelUpEffect />
      <Inventory open={inventoryOpen} onClose={() => setInventory(false)} />
      <Shop open={shopOpen} onClose={() => setShopOpen(false)} />
      {isDead && <DeathScreen onRespawn={respawn} />}

      <div
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 16px",
          background: "rgba(255,255,255,0.85)",
          border: "2px solid var(--border-blue)",
          borderRadius: "var(--r-full)",
          fontFamily: "var(--font-ui)",
          fontWeight: 900,
          fontSize: 11,
          color: "var(--text-muted)",
          zIndex: 10,
        }}
      >
        {zone === 1 ? "🌿 1구역 — 초원" : "🔥 2구역 — 황야"}
      </div>

      {flash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: zone === 1 ? "rgba(91,163,255,0.55)" : "rgba(255,100,0,0.45)",
            zIndex: 40,
            pointerEvents: "none",
            animation: "flash 0.4s ease-out forwards",
          }}
        />
      )}

      <style>{`@keyframes flash { 0% { opacity:1 } 100% { opacity:0 } }`}</style>
    </div>
  );
}
