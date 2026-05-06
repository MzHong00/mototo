import { RigidBody } from "@react-three/rapier";
import { TREE_POSITIONS, MAP_WALLS } from "@/constants/world";
import type { MapId } from "@/types/map";

interface MapTheme {
  ground: string;
  wire: string;
  tree: string;
  treeTop: string;
}

const THEMES: Record<MapId, MapTheme> = {
  evergreenVillage: { ground: "#99DD66", wire: "#88CC55", tree: "#33BB44", treeTop: "#55DD66" },
  evergreenMeadow: { ground: "#88CC55", wire: "#77BB44", tree: "#33AA44", treeTop: "#44CC55" },
  evergreenForest: { ground: "#66AA44", wire: "#558833", tree: "#225522", treeTop: "#336633" },
  evergreenSwamp: { ground: "#667744", wire: "#556633", tree: "#334422", treeTop: "#445533" },
  evergreenRuins: { ground: "#9B9B8A", wire: "#7A7A6A", tree: "#4A5440", treeTop: "#5A6450" },
  twilightWasteland: { ground: "#AA8855", wire: "#997744", tree: "#886633", treeTop: "#AA7722" },
  kingBearChamber: { ground: "#AA8855", wire: "#997744", tree: "#886633", treeTop: "#AA7722" },
};

interface MapProps {
  mapId: MapId;
}

export function Map({ mapId }: MapProps) {
  const { ground, wire, tree, treeTop } = THEMES[mapId];

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color={ground} />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 40, 20, 20]} />
        <meshStandardMaterial color={wire} wireframe />
      </mesh>

      {TREE_POSITIONS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
            <meshStandardMaterial color="#8B5E3C" />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <coneGeometry args={[0.8, 1.6, 6]} />
            <meshStandardMaterial color={tree} />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <coneGeometry args={[0.55, 1.2, 6]} />
            <meshStandardMaterial color={treeTop} />
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
