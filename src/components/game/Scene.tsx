import { useRef, useEffect, Suspense } from "react";
import { useFrame, useThree, type RootState } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { playerPositionRef } from "@/stores/worldRefs";
import { RigidBody } from "@react-three/rapier";
import { Character } from "@/components/game/character/Character";
import { SkillEffects } from "@/components/game/effects/SkillEffects";
import { EvergreenMeadow } from "@/components/game/maps/EvergreenMeadow";
import { TwilightWasteland } from "@/components/game/maps/TwilightWasteland";
import { RedGuardianChamber } from "@/components/game/maps/RedGuardianChamber";
import type { ReactElement } from "react";
import type { MapId } from "@/types/map";

const CAM_MIN = 6;
const CAM_MAX = 28;
const CAM_YAW = 0;
const CAM_PITCH = 0.75;

function SceneBackground({ mapId }: { mapId: MapId }) {
  const get = useThree((s: RootState) => s.get);
  useEffect(() => {
    if (mapId !== "redGuardianChamber") get().scene.background = null;
  }, [mapId, get]);
  return null;
}

function FollowCamera() {
  const { camera, gl } = useThree();
  const dist = useRef(14);

  useEffect(() => {
    const canvas = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? 200 : 1;
      dist.current = Math.max(CAM_MIN, Math.min(CAM_MAX, dist.current + e.deltaY * scale * 0.01));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [gl]);

  useFrame(() => {
    const { x, y, z } = playerPositionRef.current;
    const d = dist.current;
    const cosP = Math.cos(CAM_PITCH);
    camera.position.set(
      x + Math.sin(CAM_YAW) * cosP * d,
      y + Math.sin(CAM_PITCH) * d,
      z + Math.cos(CAM_YAW) * cosP * d,
    );
    camera.lookAt(x, y + 1, z);
  }, -1);

  return null;
}

type MapContentProps = { onPortalEnter: () => void; onBossExit: () => void };

const MAP_COMPONENTS: Record<MapId, (props: MapContentProps) => ReactElement> = {
  evergreenMeadow: ({ onPortalEnter }) => <EvergreenMeadow onPortalEnter={onPortalEnter} />,
  twilightWasteland: ({ onPortalEnter }) => <TwilightWasteland onPortalEnter={onPortalEnter} />,
  redGuardianChamber: ({ onBossExit }) => <RedGuardianChamber onBossExit={onBossExit} />,
};

interface SceneProps {
  mapId: MapId;
  onPortalEnter: () => void;
  onBossExit: () => void;
}

export function Scene({ mapId, onPortalEnter, onBossExit }: SceneProps) {
  const MapContent = MAP_COMPONENTS[mapId];

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 12], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <FollowCamera />
      <SceneBackground mapId={mapId} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          {/* 씬 전환 중에도 항상 유지되는 물리 바닥 — 공백 낙하 방지 */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -0.5, 0]} visible={false}>
              <boxGeometry args={[2000, 1, 2000]} />
            </mesh>
          </RigidBody>
          <Character />
          <MapContent onPortalEnter={onPortalEnter} onBossExit={onBossExit} />
        </Physics>
        <SkillEffects />
      </Suspense>
    </Canvas>
  );
}
