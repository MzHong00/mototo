import { RigidBody } from "@react-three/rapier";

import { TREE_POSITIONS, MAP_WALLS } from "@/constants/map/world";
import { MAP_THEMES, TREE_COLORS } from "@/constants/map/maps";
import { TerrainBlock } from "@/components/game/map/TerrainBlock";
import type { MapId, MapObjects, TreeVariant } from "@/types/map";

interface MapProps {
  mapId: MapId;
  objects?: MapObjects;
}

export function Map({ mapId, objects }: MapProps) {
  const { ground, wire } = MAP_THEMES[mapId];
  const [width, depth] = objects?.size ?? [40, 40];
  const gridDiv = Math.floor(Math.min(width, depth) / 2);

  const trees =
    objects?.trees ??
    TREE_POSITIONS.map(([x, z]) => ({
      pos: [x, z] as [number, number],
      variant: "pine" as TreeVariant,
    }));
  const walls = objects?.walls ?? MAP_WALLS;
  const terrain = objects?.terrain ?? [];

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={ground} />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[width, depth, gridDiv, gridDiv]} />
        <meshStandardMaterial color={wire} wireframe />
      </mesh>

      {terrain.map((block, i) => (
        <TerrainBlock key={i} {...block} />
      ))}

      {trees.map(({ pos: [x, z], variant }, i) => {
        const { trunk, mid, top } = TREE_COLORS[variant];
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
              <meshStandardMaterial color={trunk} />
            </mesh>
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[0.8, 1.6, 6]} />
              <meshStandardMaterial color={mid} />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
              <coneGeometry args={[0.55, 1.2, 6]} />
              <meshStandardMaterial color={top} />
            </mesh>
          </group>
        );
      })}

      {walls.map(({ pos, size }, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh position={pos} visible={false}>
            <boxGeometry args={size} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
