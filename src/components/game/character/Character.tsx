import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { playerPositionRef, playerFacingRef, respawnTrigger } from "@/stores/worldRefs";
import { useGameStore } from "@/stores/gameStore";

const SPEED      = 5;
const JUMP_FORCE = 7;
const KEYS       = new Set<string>();

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => KEYS.add(e.code));
  window.addEventListener("keyup", (e) => KEYS.delete(e.code));
}

export function Character() {
  const bodyRef    = useRef<RapierRigidBody>(null);
  const meshRef    = useRef<THREE.Mesh>(null);
  const shieldRef  = useRef<THREE.Mesh>(null);
  const shieldMat  = useRef<THREE.MeshBasicMaterial>(null);
  const isGrounded = useRef(true);

  const isShielded = useGameStore((s) => s.isShielded);
  const isDead     = useGameStore((s) => s.isDead);
  const tickShield = useGameStore((s) => s.tickShield);

  useFrame(({ clock }) => {
    const body = bodyRef.current;
    if (!body) return;

    if (respawnTrigger.pending) {
      body.setTranslation({ x: 0, y: 1, z: 0 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      respawnTrigger.pending = false;
    }

    if (isDead) return;

    const vel = body.linvel();
    const t   = body.translation();
    isGrounded.current = Math.abs(vel.y) < 0.5 && t.y < 1.8;

    if (KEYS.has("Space") && isGrounded.current) {
      body.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
      isGrounded.current = false;
    }

    let vx = 0, vz = 0;
    if (KEYS.has("ArrowUp"))    vz -= SPEED;
    if (KEYS.has("ArrowDown"))  vz += SPEED;
    if (KEYS.has("ArrowLeft"))  vx -= SPEED;
    if (KEYS.has("ArrowRight")) vx += SPEED;

    body.setLinvel({ x: vx, y: vel.y, z: vz }, true);

    if (vx !== 0 || vz !== 0) {
      playerFacingRef.current.set(vx, 0, vz).normalize();
      if (meshRef.current) meshRef.current.rotation.y = Math.atan2(vx, vz);
    }

    playerPositionRef.current.set(t.x, t.y, t.z);

    if (shieldRef.current && shieldMat.current) {
      shieldRef.current.visible = isShielded;
      if (isShielded) {
        const pulse = 0.3 + Math.sin(clock.elapsedTime * 4) * 0.1;
        shieldMat.current.opacity = pulse;
        shieldRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.04);
      }
    }

    tickShield();
  });

  return (
    <RigidBody ref={bodyRef} position={[0, 1, 0]} enabledRotations={[false, false, false]} colliders="cuboid">
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#5BA3FF" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh ref={shieldRef} visible={false}>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshBasicMaterial ref={shieldMat} color="#4488FF" transparent opacity={0.3} side={THREE.BackSide} />
      </mesh>
    </RigidBody>
  );
}
