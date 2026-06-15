import { useTexture, RoundedBox } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import type { TerrainBlock as TerrainBlockProps, TerrainMaterial } from "@/types/map";

const TEXTURE_PATH: Record<TerrainMaterial, string | string[]> = {
  grass: [
    "/textures/terrain/grass_top.png",
    "/textures/terrain/grass_side.png",
    "/textures/terrain/grass_bottom.png",
  ],
  wood: ["/textures/terrain/wood_top.png", "/textures/terrain/wood_side.png"],
  stone: "/textures/terrain/stone.png",
  dirt: "/textures/terrain/dirt.png",
  sand: "/textures/terrain/sand.png",
};

function setWrap(tex: THREE.Texture, u = 2, v = 2) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(u, v);
}

// boxGeometry 면 순서: +X, -X, +Y(top), -Y(bottom), +Z, -Z
function FaceBox({
  size,
  pos,
  rotation,
  top,
  bottom,
  side,
}: {
  size: [number, number, number];
  pos: [number, number, number];
  rotation: [number, number, number];
  top: THREE.Texture;
  bottom: THREE.Texture;
  side: THREE.Texture;
}) {
  return (
    <mesh position={pos} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial attach="material-0" map={side} />
      <meshStandardMaterial attach="material-1" map={side} />
      <meshStandardMaterial attach="material-2" map={top} />
      <meshStandardMaterial attach="material-3" map={bottom} />
      <meshStandardMaterial attach="material-4" map={side} />
      <meshStandardMaterial attach="material-5" map={side} />
    </mesh>
  );
}

function GrassBlock({
  pos,
  size,
  rotation,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}) {
  const [top, side, bottom] = useTexture(TEXTURE_PATH.grass as string[]);
  setWrap(top, 2, 2);
  setWrap(side, 2, 2);
  setWrap(bottom, 2, 2);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <FaceBox pos={pos} size={size} rotation={rotation} top={top} bottom={bottom} side={side} />
    </RigidBody>
  );
}

function WoodBlock({
  pos,
  size,
  rotation,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
}) {
  const [top, side] = useTexture(TEXTURE_PATH.wood as string[]);
  setWrap(top, 2, 2);
  setWrap(side, 2, 2);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <FaceBox pos={pos} size={size} rotation={rotation} top={top} bottom={side} side={side} />
    </RigidBody>
  );
}

function SingleBlock({
  pos,
  size,
  rotation,
  material,
  rounded,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  material: "stone" | "dirt" | "sand";
  rounded?: boolean;
}) {
  const texture = useTexture(TEXTURE_PATH[material] as string);
  setWrap(texture, 2, 2);

  return (
    <RigidBody type="fixed" colliders="cuboid">
      {rounded ? (
        <RoundedBox
          args={size}
          radius={0.15}
          smoothness={4}
          position={pos}
          rotation={rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial map={texture} />
        </RoundedBox>
      ) : (
        <mesh position={pos} rotation={rotation} castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial map={texture} />
        </mesh>
      )}
    </RigidBody>
  );
}

export function TerrainBlock({ pos, size, rotation, material, rounded }: TerrainBlockProps) {
  const rot = rotation ?? ([0, 0, 0] as [number, number, number]);

  if (material === "grass") return <GrassBlock pos={pos} size={size} rotation={rot} />;
  if (material === "wood") return <WoodBlock pos={pos} size={size} rotation={rot} />;
  return <SingleBlock pos={pos} size={size} rotation={rot} material={material} rounded={rounded} />;
}
