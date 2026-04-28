import { useState, useEffect, useCallback } from "react";
import styles from "./App.module.scss";
import { Scene } from "@/components/game/Scene";
import { HUD } from "@/components/game/hud/HUD";
import { LevelUpEffect } from "@/components/game/screen/levelUpEffect/LevelUpEffect";
import { Inventory } from "@/components/game/inventory/Inventory";
import { ClassSelect } from "@/components/game/screen/classSelect/ClassSelect";
import { DeathScreen } from "@/components/game/screen/deathScreen/DeathScreen";
import { Shop } from "@/components/game/shop/Shop";
import { RedGuardianEntry } from "@/components/game/boss/redGuardian/RedGuardianEntry";
import { useGameStore } from "@/stores/gameStore";
import { bossEnterTrigger } from "@/stores/worldRefs";
import { MAPS } from "@/constants/maps";
import type { JobClass } from "@/types/character";

const ZONE_FLASH_DURATION_MS = 400;

export default function App() {
  const [inventoryOpen, setInventory] = useState(false);
  const [flash, setFlash] = useState(false);

  const isDead = useGameStore((s) => s.isDead);
  const shopOpen = useGameStore((s) => s.shopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const selectClass = useGameStore((s) => s.selectClass);
  const respawn = useGameStore((s) => s.respawn);
  const jobClass = useGameStore((s) => s.character.jobClass);
  const currentMapId = useGameStore((s) => s.currentMapId);
  const travelTo = useGameStore((s) => s.travelTo);
  const exitBoss = useGameStore((s) => s.exitBoss);

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
    const nextMapId = currentMapId === "evergreenMeadow" ? "twilightWasteland" : "evergreenMeadow";
    setFlash(true);
    setTimeout(() => {
      travelTo(nextMapId);
      setFlash(false);
    }, ZONE_FLASH_DURATION_MS);
  }, [currentMapId, travelTo]);

  const handleBossEnter = useCallback(() => {
    bossEnterTrigger.pending = true;
    travelTo("redGuardianChamber");
  }, [travelTo]);

  const handleClassSelect = useCallback((cls: JobClass) => selectClass(cls), [selectClass]);

  if (!jobClass) return <ClassSelect onSelect={handleClassSelect} />;

  return (
    <div className={styles.root}>
      <Scene mapId={currentMapId} onPortalEnter={handlePortalEnter} onBossExit={exitBoss} />
      <HUD />
      <LevelUpEffect />
      <Inventory open={inventoryOpen} onClose={() => setInventory(false)} />
      <Shop open={shopOpen} onClose={() => setShopOpen(false)} />
      {currentMapId !== "redGuardianChamber" && <RedGuardianEntry onEnter={handleBossEnter} />}
      {isDead && (
        <DeathScreen
          onRespawn={() => {
            respawn();
            exitBoss();
          }}
        />
      )}

      <div className={styles.zoneLabel}>{MAPS[currentMapId].label}</div>
      {flash && (
        <div className={styles.flash} style={{ background: MAPS[currentMapId].flashColor }} />
      )}
    </div>
  );
}
