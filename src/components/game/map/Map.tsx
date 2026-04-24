import { RigidBody } from "@react-three/rapier";
import { TREE_POSITIONS, MAP_WALLS } from "@/constants/world";

interface MapProps {
  zone: number;
}

export function Map({ zone }: MapProps) {
  const groundColor = zone === 2 ? "#AA8855" : "#88CC55";
  const wireColor = zone === 2 ? "#997744" : "#77BB44";
  const treeColor = zone === 2 ? "#886633" : "#33AA44";
  const topColor = zone === 2 ? "#AA7722" : "#44CC55";

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color={groundColor} />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 40, 20, 20]} />
        <meshStandardMaterial color={wireColor} wireframe />
      </mesh>

      {TREE_POSITIONS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
            <meshStandardMaterial color="#8B5E3C" />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <coneGeometry args={[0.8, 1.6, 6]} />
            <meshStandardMaterial color={treeColor} />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <coneGeometry args={[0.55, 1.2, 6]} />
            <meshStandardMaterial color={topColor} />
          </mesh>
        </group>
      ))}

      {MAP_WALLS.map(({ pos, size }, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh position={pos} visible={false}>
            <boxGeometry args={size} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
