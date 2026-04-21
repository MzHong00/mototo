"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { HUD } from "@/components/game/HUD";
import { LevelUpEffect } from "@/components/game/LevelUpEffect";
import { Inventory } from "@/components/game/Inventory";
import { ClassSelect } from "@/components/game/ClassSelect";
import { DeathScreen } from "@/components/game/DeathScreen";
import { Shop } from "@/components/game/Shop";
import { useGameStore, type JobClass } from "@/stores/gameStore";

const Scene = dynamic(
  () => import("@/components/game/Scene").then((m) => m.Scene),
  { ssr: false }
);

export default function GamePage() {
  const [zone, setZone]             = useState(1);
  const [inventoryOpen, setInventory] = useState(false);
  const [flash, setFlash]            = useState(false);

  const isDead     = useGameStore((s) => s.isDead);
  const shopOpen   = useGameStore((s) => s.shopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const selectClass = useGameStore((s) => s.selectClass);
  const respawn    = useGameStore((s) => s.respawn);
  const jobClass   = useGameStore((s) => s.character.jobClass);

  // I키 인벤토리 토글
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "KeyI") setInventory((v) => !v);
      if (e.code === "Escape") { setInventory(false); setShopOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [setShopOpen]);

  const handlePortalEnter = useCallback(() => {
    setFlash(true);
    setTimeout(() => {
      setZone((z) => z === 1 ? 2 : 1);
      setFlash(false);
    }, 400);
  }, []);

  const handleClassSelect = useCallback((cls: JobClass) => {
    selectClass(cls);
  }, [selectClass]);

  // 직업 미선택 시 직업 선택 화면
  if (!jobClass) {
    return <ClassSelect onSelect={handleClassSelect} />;
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Scene zone={zone} onPortalEnter={handlePortalEnter} />
      <HUD />
      <LevelUpEffect />
      <Inventory open={inventoryOpen} onClose={() => setInventory(false)} />
      <Shop open={shopOpen} onClose={() => setShopOpen(false)} />
      {isDead && <DeathScreen onRespawn={respawn} />}

      {/* 구역 표시 */}
      <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "rgba(255,255,255,0.85)", border: "2px solid var(--border-blue)", borderRadius: "var(--r-full)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 11, color: "var(--text-muted)", zIndex: 10 }}>
        {zone === 1 ? "🌿 1구역 — 초원" : "🔥 2구역 — 황야"}
      </div>

      {/* 포탈/죽음 플래시 */}
      {flash && (
        <div style={{ position: "absolute", inset: 0, background: zone === 1 ? "rgba(91,163,255,0.55)" : "rgba(255,100,0,0.45)", zIndex: 40, pointerEvents: "none", animation: "flash 0.4s ease-out forwards" }} />
      )}

      <style>{`
        @keyframes flash { 0% { opacity:1 } 100% { opacity:0 } }
      `}</style>
    </div>
  );
}
