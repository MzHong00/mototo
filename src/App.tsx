import { useState, useEffect, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { Scene } from "@/components/game/Scene";
import { HUD } from "@/components/ui/hud/HUD";

import { ClassSelect } from "@/components/ui/overlay/classSelect/ClassSelect";
import { DeathScreen } from "@/components/ui/overlay/deathScreen/DeathScreen";
import { WindowManager } from "@/components/ui/window/WindowManager";
import { BossEntry } from "@/components/ui/overlay/bossEntry/BossEntry";
import { Modal } from "@/components/ui/modal/Modal";
import { Toast } from "@/components/ui/toast/Toast";
import { useGameStore } from "@/stores/gameStore";
import { bossEnterTrigger, portalTravelTrigger } from "@/stores/worldRefs";
import { MAPS } from "@/constants/maps";

import type { MapId } from "@/types/map";
import type { JobClass } from "@/types/character";
import type { BossType } from "@/types/boss";

import styles from "./App.module.scss";

const ZONE_FLASH_DURATION_MS = 400;

export default function App() {
  const [flash, setFlash] = useState(false);

  const {
    isDead,
    selectClass,
    respawn,
    jobClass,
    currentMapId,
    travelTo,
    exitBoss,
    bossEntryId,
  } = useGameStore(
    useShallow((s) => ({
      isDead: s.isDead,
      selectClass: s.selectClass,
      respawn: s.respawn,
      jobClass: s.character.jobClass,
      currentMapId: s.currentMapId,
      travelTo: s.travelTo,
      exitBoss: s.exitBoss,
      bossEntryId: s.bossEntryId,
    }))
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handlePortalEnter = useCallback(
    (dest: MapId, spawnPos?: [number, number, number]) => {
      portalTravelTrigger.spawnPos = spawnPos ?? [0, 1, 0];
      portalTravelTrigger.pending = true;
      setFlash(true);
      setTimeout(() => {
        travelTo(dest);
        setFlash(false);
      }, ZONE_FLASH_DURATION_MS);
    },
    [travelTo],
  );

  const handleBossEnter = useCallback(() => {
    bossEnterTrigger.pending = true;
    travelTo("kingBearChamber");
  }, [travelTo]);

  const handleClassSelect = useCallback((cls: JobClass) => selectClass(cls), [selectClass]);

  if (!jobClass) return <ClassSelect onSelect={handleClassSelect} />;

  return (
    <div className={styles.root}>
      <Scene mapId={currentMapId} onPortalEnter={handlePortalEnter} onBossExit={exitBoss} />
      <HUD />
      <WindowManager />

      {bossEntryId !== null && (
        <BossEntry
          bossId={bossEntryId as BossType}
          subtitle={{
            cleared: "재도전 시 골드·경험치만 획득",
            uncleared: "클리어 시 곰 발톱 검 획득",
          }}
          onEnter={handleBossEnter}
        />
      )}
      {isDead && (
        <DeathScreen
          onRespawn={() => {
            respawn();
            exitBoss();
          }}
        />
      )}

      {flash && (
        <div className={styles.flash} style={{ background: MAPS[currentMapId].flashColor }} />
      )}
      <Modal />
      <Toast />
    </div>
  );
}
