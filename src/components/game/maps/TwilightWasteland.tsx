import { Sky } from "@react-three/drei";
import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";
import { GateKeeperNPC } from "@/components/game/npc/GateKeeperNPC";

interface TwilightWastelandProps {
  onPortalEnter: () => void;
}

export function TwilightWasteland({ onPortalEnter }: TwilightWastelandProps) {
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
      <Map zone={2} />
      <Monsters zone={2} />
      <Portal zone={2} onEnter={onPortalEnter} />
      <GateKeeperNPC />
    </>
  );
}
