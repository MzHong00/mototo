import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";

export function TwilightWasteland() {
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
      <EvergreenFloor />
    </>
  );
}
