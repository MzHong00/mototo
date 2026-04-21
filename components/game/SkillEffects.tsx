"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, type SkillFX } from "@/stores/gameStore";

const SLASH_DURATION = 400;
const BLAST_DURATION = 600;

function SlashFX({ fx }: { fx: SkillFX }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;
    const age = (Date.now() - fx.startTime) / SLASH_DURATION;
    meshRef.current.scale.setScalar(0.5 + age * 2.5);
    meshRef.current.rotation.y += 0.18;
    matRef.current.opacity = Math.max(0, 1 - age * 1.2);
  });

  return (
    <mesh ref={meshRef} position={[fx.pos[0], 0.5, fx.pos[2]]}>
      <torusGeometry args={[1, 0.08, 6, 24, Math.PI * 1.2]} />
      <meshBasicMaterial ref={matRef} color="#FF9900" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function BlastFX({ fx }: { fx: SkillFX }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outMat   = useRef<THREE.MeshBasicMaterial>(null);
  const inMat    = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const age = (Date.now() - fx.startTime) / BLAST_DURATION;
    if (outerRef.current && outMat.current) {
      outerRef.current.scale.setScalar(0.3 + age * 4);
      outMat.current.opacity = Math.max(0, 0.8 - age);
    }
    if (innerRef.current && inMat.current) {
      innerRef.current.scale.setScalar(0.2 + age * 2.5);
      inMat.current.opacity = Math.max(0, 0.5 - age * 0.8);
    }
  });

  return (
    <group position={[fx.pos[0], 0.3, fx.pos[2]]}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1, 0.12, 8, 32]} />
        <meshBasicMaterial ref={outMat} color="#FF3344" transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial ref={inMat} color="#FF6600" transparent />
      </mesh>
    </group>
  );
}

export function SkillEffects() {
  const fxList   = useGameStore((s) => s.fxList);
  const removeFX = useGameStore((s) => s.removeFX);
  const pendingRemoval = useRef(new Set<number>());

  useFrame(() => {
    const now = Date.now();
    fxList.forEach((fx) => {
      const dur = fx.type === "slash" ? SLASH_DURATION : BLAST_DURATION;
      if (now - fx.startTime > dur + 50 && !pendingRemoval.current.has(fx.fxId)) {
        pendingRemoval.current.add(fx.fxId);
        removeFX(fx.fxId);
      }
    });
  });

  return (
    <>
      {fxList.map((fx) =>
        fx.type === "slash"
          ? <SlashFX key={fx.fxId} fx={fx} />
          : <BlastFX key={fx.fxId} fx={fx} />
      )}
    </>
  );
}
