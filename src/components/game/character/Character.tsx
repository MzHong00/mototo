import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import {
  playerPositionRef,
  playerFacingRef,
  playerScreenPos,
  respawnTrigger,
  bossEnterTrigger,
  portalTravelTrigger,
  dashTrigger,
} from "@/stores/worldRefs";
import { KEYS } from "@/utils/keyState";
import { getControlsState } from "@/stores/controlsStore";
import { useGameStore } from "@/stores/gameStore";

import type { RapierRigidBody } from "@react-three/rapier";

const SPEED = 5;
const DASH_SPEED = 24;
const DASH_DURATION_MS = 220;

export function Character() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const shieldMat = useRef<THREE.MeshBasicMaterial>(null);
  const dashUntil = useRef(0);

  const isShielded = useGameStore((s) => s.isShielded);
  const isDead = useGameStore((s) => s.isDead);
  const tickShield = useGameStore((s) => s.tickShield);

  useFrame(({ clock, camera, size }) => {
    const body = bodyRef.current;
    if (!body) return;

    if (respawnTrigger.pending) {
      body.setTranslation({ x: 0, y: 1, z: 0 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      respawnTrigger.pending = false;
    }

    if (bossEnterTrigger.pending) {
      body.setTranslation({ x: 0, y: 2, z: 8 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bossEnterTrigger.pending = false;
    }

    if (portalTravelTrigger.pending) {
      const [px, py, pz] = portalTravelTrigger.spawnPos;
      body.setTranslation({ x: px, y: py, z: pz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      portalTravelTrigger.pending = false;
    }

    if (dashTrigger.pending) {
      dashUntil.current = Date.now() + DASH_DURATION_MS;
      dashTrigger.pending = false;
    }

    // y < -3 낙사 방지
    const pos = body.translation();
    if (pos.y < -3) {
      body.setTranslation({ x: pos.x, y: 2, z: pos.z }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    if (isDead) return;

    const vel = body.linvel();
    const t = body.translation();

    const isDashing = Date.now() < dashUntil.current;

    if (isDashing) {
      const f = playerFacingRef.current;
      body.setLinvel({ x: f.x * DASH_SPEED, y: vel.y, z: f.z * DASH_SPEED }, true);
    } else {
      const b = getControlsState().bindings;
      let vx = 0,
        vz = 0;
      if (KEYS.has(b.moveUp)) vz -= SPEED;
      if (KEYS.has(b.moveDown)) vz += SPEED;
      if (KEYS.has(b.moveLeft)) vx -= SPEED;
      if (KEYS.has(b.moveRight)) vx += SPEED;

      body.setLinvel({ x: vx, y: vel.y, z: vz }, true);

      if (vx !== 0 || vz !== 0) {
        playerFacingRef.current.set(vx, 0, vz).normalize();
        if (meshRef.current) meshRef.current.rotation.y = Math.atan2(vx, vz);
      }
    }

    playerPositionRef.current.set(t.x, t.y, t.z);
    const projected = playerPositionRef.current.clone().project(camera);
    playerScreenPos.x = (projected.x * 0.5 + 0.5) * size.width;
    playerScreenPos.y = (-projected.y * 0.5 + 0.5) * size.height;

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
    <RigidBody
      ref={bodyRef}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]}
      colliders="cuboid"
    >
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
        <meshBasicMaterial
          ref={shieldMat}
          color="#4488FF"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </RigidBody>
  );
}
