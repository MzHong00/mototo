import { Sky } from "@react-three/drei";
import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";
import { ShopkeeperNPC } from "@/components/game/npc/ShopkeeperNPC";
import { GateKeeperNPC } from "@/components/game/npc/GateKeeperNPC";

interface EvergreenMeadowProps {
  onPortalEnter: () => void;
}

export function EvergreenMeadow({ onPortalEnter }: EvergreenMeadowProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[100, 20, 100]} />
      <Map zone={1} />
      <Monsters zone={1} />
      <Portal zone={1} onEnter={onPortalEnter} />
      <ShopkeeperNPC />
      <GateKeeperNPC />
    </>
  );
}
