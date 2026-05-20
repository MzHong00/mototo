import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SHIELD_OFFSET: [number, number, number] = [0, 0, 0.1];

interface WeaponProps {
  charScene: THREE.Group;
  weaponPath: string;
  boneName: string;
}

// GLB 무기를 캐릭터 스켈레톤 본에 명령형으로 부착. R3F 안에서 null 반환.
export function Weapon({ charScene, weaponPath, boneName }: WeaponProps) {
  const { scene: weaponScene } = useGLTF(weaponPath);

  useEffect(() => {
    const bone = charScene.getObjectByName(boneName);
    if (!bone) return;
    const clone = weaponScene.clone(true);
    clone.position.set(...SHIELD_OFFSET);
    bone.add(clone);
    return () => {
      bone.remove(clone);
    };
  }, [charScene, weaponScene, boneName]);

  return null;
}
