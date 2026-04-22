import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, type SkillFX } from "@/stores/gameStore";

const FX_DURATION: Record<SkillFX["type"], number> = {
  slash: 400,
  blast: 600,
  arrow: 450,
  arrow_blast: 700,
  fireball: 550,
  meteor: 900,
  shuriken: 500,
  shuriken_blast: 750,
};

// ── Warrior: 오렌지 호 ─────────────────────────────────────────
function SlashFX({ fx }: { fx: SkillFX }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.slash;
    meshRef.current.scale.setScalar(0.5 + age * 2.5);
    meshRef.current.rotation.y += 0.18;
    matRef.current.opacity = Math.max(0, 1 - age * 1.2);
  });
  return (
    <mesh ref={meshRef} position={[fx.pos[0], 0.5, fx.pos[2]]}>
      <torusGeometry args={[1, 0.08, 6, 24, Math.PI * 1.2]} />
      <meshBasicMaterial
        ref={matRef}
        color="#FF9900"
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Warrior: 회오리 폭발 ───────────────────────────────────────
function BlastFX({ fx }: { fx: SkillFX }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outMat = useRef<THREE.MeshBasicMaterial>(null);
  const inMat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const age = (Date.now() - fx.startTime) / FX_DURATION.blast;
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
        <meshBasicMaterial
          ref={outMat}
          color="#FF3344"
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial ref={inMat} color="#FF6600" transparent />
      </mesh>
    </group>
  );
}

// ── Archer: 화살 ──────────────────────────────────────────────
function ArrowFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const yaw = Math.atan2(dir.x, dir.z);

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.arrow;
    const dist = age * 10;
    groupRef.current.position.set(
      fx.pos[0] + dir.x * dist,
      fx.pos[1] + 0.8,
      fx.pos[2] + dir.z * dist,
    );
    matRef.current.opacity = Math.max(0, 1 - age * 1.4);
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, yaw, 0]}
      position={[fx.pos[0], fx.pos[1] + 0.8, fx.pos[2]]}
    >
      {/* 화살대 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
        <meshStandardMaterial ref={matRef} color="#8B5E3C" transparent />
      </mesh>
      {/* 촉 */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.22, 6]} />
        <meshStandardMaterial color="#AAAAAA" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 깃털 */}
      <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.18, 4]} />
        <meshStandardMaterial color="#DDDDDD" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ── Archer: 폭발 화살 ─────────────────────────────────────────
function ArrowBlastFX({ fx }: { fx: SkillFX }) {
  const arrowRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const arrowMat = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const yaw = Math.atan2(dir.x, dir.z);
  const TRAVEL = FX_DURATION.arrow_blast * 0.55;

  useFrame(() => {
    const now = Date.now();
    const elapsed = now - fx.startTime;
    const age = elapsed / FX_DURATION.arrow_blast;

    if (elapsed < TRAVEL) {
      const t = elapsed / TRAVEL;
      const dist = t * 7;
      if (arrowRef.current) {
        arrowRef.current.visible = true;
        arrowRef.current.position.set(
          fx.pos[0] + dir.x * dist,
          fx.pos[1] + 0.8,
          fx.pos[2] + dir.z * dist,
        );
      }
      if (arrowMat.current) arrowMat.current.opacity = 1;
    } else {
      if (arrowRef.current) arrowRef.current.visible = false;
      const blastAge = (elapsed - TRAVEL) / (FX_DURATION.arrow_blast - TRAVEL);
      if (ringRef.current && ringMat.current) {
        ringRef.current.scale.setScalar(0.5 + blastAge * 5);
        ringMat.current.opacity = Math.max(0, 1 - blastAge * 1.1);
      }
    }
    if (ringMat.current && elapsed >= TRAVEL) {
      // handled above
    } else if (ringMat.current) {
      ringMat.current.opacity = 0;
    }
    void age;
  });

  return (
    <>
      <group
        ref={arrowRef}
        rotation={[0, yaw, 0]}
        position={[fx.pos[0], fx.pos[1] + 0.8, fx.pos[2]]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
          <meshStandardMaterial ref={arrowMat} color="#8B5E3C" transparent />
        </mesh>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.22, 6]} />
          <meshStandardMaterial
            color="#FF6600"
            emissive="#FF3300"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
      <mesh
        ref={ringRef}
        position={[fx.pos[0] + dir.x * 7, 0.3, fx.pos[2] + dir.z * 7]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1, 0.15, 8, 32]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#FF6600"
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// ── Mage: 파이어볼 ────────────────────────────────────────────
function FireballFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();

  useFrame(() => {
    if (!groupRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.fireball;
    const dist = age * 9;
    groupRef.current.position.set(
      fx.pos[0] + dir.x * dist,
      fx.pos[1] + 1.0,
      fx.pos[2] + dir.z * dist,
    );
    groupRef.current.rotation.y += 0.12;
    if (coreMat.current) {
      coreMat.current.emissiveIntensity = 1.5 - age;
      coreMat.current.opacity = Math.max(0, 1 - age * 1.3);
    }
    if (glowMat.current) {
      glowMat.current.opacity = Math.max(0, 0.4 - age * 0.5);
    }
  });

  return (
    <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 1.0, fx.pos[2]]}>
      {/* 코어 */}
      <mesh>
        <sphereGeometry args={[0.22, 12, 8]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#FF4400"
          emissive="#FF2200"
          emissiveIntensity={1.5}
          transparent
        />
      </mesh>
      {/* 글로우 */}
      <mesh>
        <sphereGeometry args={[0.45, 8, 6]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#FF8800"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ── Mage: 메테오 ──────────────────────────────────────────────
const METEOR_COUNT = 6;
const METEOR_OFFSETS = Array.from({ length: METEOR_COUNT }, (_, i) => ({
  dx: (Math.random() - 0.5) * 4,
  dz: (Math.random() - 0.5) * 4,
  delay: i * 80,
}));

function MeteorFX({ fx }: { fx: SkillFX }) {
  const refs = Array.from({ length: METEOR_COUNT }, () =>
    useRef<THREE.Mesh>(null),
  );
  const mats = Array.from({ length: METEOR_COUNT }, () =>
    useRef<THREE.MeshStandardMaterial>(null),
  );

  useFrame(() => {
    const elapsed = Date.now() - fx.startTime;
    METEOR_OFFSETS.forEach(({ dx, dz, delay }, i) => {
      const mesh = refs[i].current;
      const mat = mats[i].current;
      if (!mesh || !mat) return;
      const t = Math.max(0, elapsed - delay);
      const age = t / (FX_DURATION.meteor - delay);
      if (age <= 0) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      const startY = 8;
      mesh.position.set(
        fx.pos[0] + dx,
        Math.max(0.3, fx.pos[1] + startY * (1 - age)),
        fx.pos[2] + dz,
      );
      mat.emissiveIntensity = 1 + age * 2;
      mat.opacity = age < 0.8 ? 1 : Math.max(0, 1 - (age - 0.8) * 5);
    });
  });

  return (
    <>
      {METEOR_OFFSETS.map((_, i) => (
        <mesh key={i} ref={refs[i]} visible={false}>
          <sphereGeometry args={[0.28, 8, 6]} />
          <meshStandardMaterial
            ref={mats[i]}
            color="#FF5500"
            emissive="#FF2200"
            emissiveIntensity={1}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

// ── Rogue: 표창 ───────────────────────────────────────────────
function ShurikenFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;
    const age = (Date.now() - fx.startTime) / FX_DURATION.shuriken;
    const dist = age * 11;
    groupRef.current.position.set(
      fx.pos[0] + dir.x * dist,
      fx.pos[1] + 0.9,
      fx.pos[2] + dir.z * dist,
    );
    groupRef.current.rotation.y += 0.25;
    matRef.current.opacity = Math.max(0, 1 - age * 1.3);
  });

  return (
    <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.08]} />
          <meshStandardMaterial
            ref={i === 0 ? matRef : undefined}
            color="#CCCCEE"
            metalness={0.9}
            roughness={0.1}
            transparent
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#8888FF" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

// ── Rogue: 표창 폭발탄 ────────────────────────────────────────
function ShurikenBlastFX({ fx }: { fx: SkillFX }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const starMat = useRef<THREE.MeshStandardMaterial>(null);
  const dir = new THREE.Vector3(fx.dir[0], 0, fx.dir[2]).normalize();
  const TRAVEL = FX_DURATION.shuriken_blast * 0.5;

  useFrame(() => {
    const elapsed = Date.now() - fx.startTime;
    if (elapsed < TRAVEL) {
      const t = elapsed / TRAVEL;
      if (groupRef.current) {
        groupRef.current.visible = true;
        groupRef.current.position.set(
          fx.pos[0] + dir.x * t * 8,
          fx.pos[1] + 0.9,
          fx.pos[2] + dir.z * t * 8,
        );
        groupRef.current.rotation.y += 0.3;
      }
    } else {
      if (groupRef.current) groupRef.current.visible = false;
      const blastAge =
        (elapsed - TRAVEL) / (FX_DURATION.shuriken_blast - TRAVEL);
      if (ringRef.current && ringMat.current) {
        ringRef.current.scale.setScalar(0.4 + blastAge * 4.5);
        ringMat.current.opacity = Math.max(0, 1 - blastAge * 1.1);
      }
    }
  });

  return (
    <>
      <group ref={groupRef} position={[fx.pos[0], fx.pos[1] + 0.9, fx.pos[2]]}>
        {[0, Math.PI / 2].map((rot, i) => (
          <mesh key={i} rotation={[0, rot, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.08]} />
            <meshStandardMaterial
              ref={i === 0 ? starMat : undefined}
              color="#CCCCEE"
              metalness={0.9}
              roughness={0.1}
              transparent
            />
          </mesh>
        ))}
      </group>
      <mesh
        ref={ringRef}
        position={[fx.pos[0] + dir.x * 8, 0.3, fx.pos[2] + dir.z * 8]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1, 0.12, 8, 32]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#8888FF"
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// ── 렌더러 ────────────────────────────────────────────────────
const FX_MAP: Record<SkillFX["type"], React.ComponentType<{ fx: SkillFX }>> = {
  slash: SlashFX,
  blast: BlastFX,
  arrow: ArrowFX,
  arrow_blast: ArrowBlastFX,
  fireball: FireballFX,
  meteor: MeteorFX,
  shuriken: ShurikenFX,
  shuriken_blast: ShurikenBlastFX,
};

export function SkillEffects() {
  const fxList = useGameStore((s) => s.fxList);
  const removeFX = useGameStore((s) => s.removeFX);
  const pendingRemoval = useRef(new Set<number>());

  useFrame(() => {
    const now = Date.now();
    fxList.forEach((fx) => {
      const dur = FX_DURATION[fx.type];
      if (
        now - fx.startTime > dur + 50 &&
        !pendingRemoval.current.has(fx.fxId)
      ) {
        pendingRemoval.current.add(fx.fxId);
        removeFX(fx.fxId);
      }
    });
  });

  return (
    <>
      {fxList.map((fx) => {
        const Comp = FX_MAP[fx.type];
        return <Comp key={fx.fxId} fx={fx} />;
      })}
    </>
  );
}
