import { useLayoutEffect, useRef } from "react";
import { Object3D } from "three";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { useObjectInstances } from "@/hooks/useObjectInstances";
import { MAP_OBJECTS } from "@/constants/game/mapObjects";

import type { InstancedMesh } from "three";
import type { TileMapData } from "@/types/terrain";
import type { ObjectPart } from "@/constants/game/mapObjects";
import type { ObjectInstance } from "@/hooks/useObjectInstances";

interface MapObjectsProps {
  tiles: TileMapData;
}

/** 맵 물체 (나무·바위·표식) — 종류·부분마다 인스턴스 메시 1개, 충돌체는 고정 몸체 1개에 모음 */
export function MapObjects({ tiles }: MapObjectsProps) {
  const groups = useObjectInstances(tiles);

  return (
    <>
      {groups.flatMap(([type, list]) =>
        MAP_OBJECTS[type].parts.map((part, i) => (
          <PartInstances key={`${type}-${i}`} part={part} list={list} />
        )),
      )}
      <RigidBody type="fixed" colliders={false}>
        {groups.flatMap(([type, list]) => {
          const collider = MAP_OBJECTS[type].collider;
          return collider
            ? list.map((o, i) => (
                <CylinderCollider
                  key={`${type}-${i}`}
                  args={[(collider.height / 2) * o.scale, collider.radius * o.scale]}
                  position={[o.x, o.y + (collider.height / 2) * o.scale, o.z]}
                />
              ))
            : [];
        })}
      </RigidBody>
    </>
  );
}

interface PartInstancesProps {
  part: ObjectPart;
  list: ObjectInstance[];
}

/** 물체 한 부분(줄기·잎 등)을 모든 위치에 한 번에 그림 */
function PartInstances({ part, list }: PartInstancesProps) {
  const meshRef = useRef<InstancedMesh>(null);

  // 인스턴스 위치 행렬 채우기 — 목록이 바뀔 때만
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    list.forEach((o, i) => {
      dummy.position.set(o.x, o.y, o.z);
      dummy.rotation.set(0, o.rot, 0);
      dummy.scale.setScalar(o.scale);
      dummy.translateX(part.offset[0] * o.scale);
      dummy.translateY(part.offset[1] * o.scale);
      dummy.translateZ(part.offset[2] * o.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [list, part]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, list.length]}
      castShadow
      receiveShadow
    >
      {part.shape === "box" && <boxGeometry args={part.args as [number, number, number]} />}
      {part.shape === "cylinder" && (
        <cylinderGeometry args={part.args as [number, number, number, number]} />
      )}
      {part.shape === "cone" && <coneGeometry args={part.args as [number, number, number]} />}
      {part.shape === "sphere" && <sphereGeometry args={part.args as [number, number, number]} />}
      {part.shape === "ico" && <icosahedronGeometry args={part.args as [number, number]} />}
      <meshLambertMaterial color={part.color} />
    </instancedMesh>
  );
}
