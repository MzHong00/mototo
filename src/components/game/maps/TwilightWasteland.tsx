import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import type { MapId } from "@/types/map";

interface TwilightWastelandProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function TwilightWasteland({ onPortalEnter: _onPortalEnter }: TwilightWastelandProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[80, 15, 10]} />
      <Map mapId="twilightWasteland" />
    </>
  );
}
