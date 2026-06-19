import { useEffect } from "react";

import { GameCanvas } from "@/components/game/gameCanvas/GameCanvas";
import { HUD } from "@/components/ui/hud/HUD";
import { DeathScreen } from "@/components/ui/overlay/deathScreen/DeathScreen";
import { WindowManager } from "@/components/ui/window/WindowManager";
import { Modal } from "@/components/ui/modal/Modal";
import { Toast } from "@/components/ui/toast/Toast";
import { useGameStore } from "@/stores/gameStore";

import styles from "./GameScreen.module.scss";

export default function GameScreen() {
  const { isDead, respawn, currentMapId, exitBoss, isFlashing } = useGameStore((s) => ({
    isDead: s.isDead,
    respawn: s.respawn,
    currentMapId: s.currentMapId,
    exitBoss: s.exitBoss,
    isFlashing: s.isFlashing,
  }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={styles.root}>
      <GameCanvas mapId={currentMapId} />
      <HUD />
      <WindowManager />
      {isDead && (
        <DeathScreen
          onRespawn={() => {
            respawn();
            exitBoss();
          }}
        />
      )}
      {isFlashing && <div className={styles.flash} />}
      <Modal />
      <Toast />
    </div>
  );
}
