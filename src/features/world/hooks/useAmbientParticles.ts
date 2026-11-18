import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3,
} from "three";

import { playerPosition } from "@/lib/runtime/frameState";
import { hash2 } from "@/utils/noise";
import {
  PARTICLE_FRAGMENT,
  PARTICLE_MOTION,
  PARTICLE_PIXEL_SCALE,
  PARTICLE_VERTEX,
} from "@/features/world/constants/particles";

import type { Points } from "three";
import type { MoodParticles } from "@/features/world/types/mood";

const ALWAYS_VISIBLE = new Sphere(new Vector3(), Infinity); // 위치는 셰이더가 정하므로 화면 밖 잘라내기 끔

/**
 * 맵 분위기 입자(꽃가루·반딧불·낙엽·안개) — 점 하나 = 입자 하나, 움직임은 셰이더에서.
 * 매 프레임 CPU는 시간과 플레이어 위치만 넘긴다 (입자 수와 상관없이 가벼움)
 */
export function useAmbientParticles(particles: MoodParticles) {
  const pointsRef = useRef<Points>(null); // 그려진 점 메시 — 매 프레임 셰이더 값 갱신용
  const pixelHeight = useThree((s) => s.size.height * s.viewport.dpr); // 화면 높이 (실제 픽셀)

  // 상자 안 고정 시작 위치 (0~1) + 입자마다 다른 흔들림 씨앗
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const seeds = Array.from({ length: particles.count }, (_, i) => hash2(i * 1.37, i * 0.71));
    const positions = Array.from({ length: particles.count }, (_, i) => [
      hash2(i * 3.1, 7.7),
      hash2(i * 1.9, 2.3),
      hash2(i * 2.7, 5.1),
    ]).flat();
    g.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    g.setAttribute("aSeed", new BufferAttribute(new Float32Array(seeds), 1));
    g.boundingSphere = ALWAYS_VISIBLE;
    return g;
  }, [particles.count]);

  // 입자 종류별 움직임·모양을 셰이더 값으로
  const material = useMemo(() => {
    const m = PARTICLE_MOTION[particles.kind];
    return new ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: m.isGlowing ? AdditiveBlending : NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uCenter: { value: new Vector3() },
        uBox: { value: new Vector3(...m.box) },
        uFall: { value: m.fall },
        uDrift: { value: new Vector2(...m.drift) },
        uSway: { value: m.sway },
        uSwayRate: { value: m.swayRate },
        uBlink: { value: m.blink },
        uSpin: { value: m.spin },
        uSize: { value: particles.size },
        uScale: { value: 0 },
        uColor: { value: new Color(particles.color) },
        uOpacity: { value: m.opacity },
        uStretch: { value: m.stretch },
        uSoftness: { value: m.softness },
      },
    });
  }, [particles]);

  // 맵을 떠나면 GPU 자원 정리
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // 시간·중심(플레이어 + 띄움 높이)·화면 크기만 갱신
  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const u = (points.material as ShaderMaterial).uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uScale.value = pixelHeight * PARTICLE_PIXEL_SCALE;
    (u.uCenter.value as Vector3)
      .copy(playerPosition.current)
      .setY(playerPosition.current.y + PARTICLE_MOTION[particles.kind].lift);
  });

  return { pointsRef, geometry, material };
}
