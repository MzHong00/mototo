import type { ParticleKind } from "@/features/world/types/mood";

/** 입자 움직임 — 플레이어 주변 상자(box) 안에서 흘러가다 반대편에서 다시 나타남 */
export interface ParticleMotion {
  box: [number, number, number]; // 상자 크기 (m)
  lift: number; // 상자 가운데가 플레이어보다 높은 정도 (m)
  fall: number; // 떨어지는 속도 (m/s, 음수면 떠오름)
  drift: [number, number]; // 바람 (x, z m/s)
  sway: number; // 흔들림 폭 (m)
  swayRate: number; // 흔들림 빠르기
  blink: number; // 깜빡임 빠르기 (0이면 안 깜빡)
  stretch: number; // 모양 길쭉함 (1 = 동그라미, 클수록 잎 모양)
  spin: number; // 도는 빠르기
  softness: number; // 가장자리 흐림 (0 또렷 ~ 1 흐림)
  opacity: number;
  isGlowing: boolean; // 더하기 섞기(빛남)
}

export const PARTICLE_MOTION: Record<ParticleKind, ParticleMotion> = {
  // 햇살 속 꽃가루·먼지
  motes: {
    box: [36, 9, 36],
    lift: 3,
    fall: 0.05,
    drift: [0.15, 0.05],
    sway: 0.5,
    swayRate: 0.5,
    blink: 0,
    stretch: 1,
    spin: 0,
    softness: 1,
    opacity: 0.7,
    isGlowing: true,
  },
};

export const PARTICLE_PIXEL_SCALE = 1.2; // 1m 입자가 1m 거리에서 화면 높이의 몇 배 px인지 (시야각 45° 기준)

// 입자 셰이더 — 위치 계산을 전부 GPU에서 (매 프레임 CPU는 시간·중심만 넘김)
export const PARTICLE_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uCenter;
  uniform vec3 uBox;
  uniform float uFall;
  uniform vec2 uDrift;
  uniform float uSway;
  uniform float uSwayRate;
  uniform float uBlink;
  uniform float uSpin;
  uniform float uSize;
  uniform float uScale;
  varying float vAlpha;
  varying float vAngle;
  void main() {
    float ph = aSeed * 6.2831;
    vec3 p = position * uBox;
    p.y -= uFall * uTime;
    p.xz += uDrift * uTime;
    p.x += sin(uTime * uSwayRate + ph) * uSway;
    p.z += cos(uTime * uSwayRate * 0.8 + ph * 1.7) * uSway;
    p.y += sin(uTime * uSwayRate * 0.6 + ph * 2.3) * uSway * 0.3;
    vec3 rel = mod(p - uCenter + uBox * 0.5, uBox) - uBox * 0.5; // 플레이어 주변 상자 안으로 감싸기
    vec4 mv = viewMatrix * vec4(uCenter + rel, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale / -mv.z;
    vec3 edge = abs(rel) / uBox * 2.0; // 상자 가장자리에선 서서히 사라짐 (튀어나오는 느낌 없게)
    vAlpha = (1.0 - smoothstep(0.7, 1.0, max(edge.x, edge.z))) * (1.0 - smoothstep(0.7, 1.0, edge.y));
    if (uBlink > 0.0) vAlpha *= max(0.0, sin(uTime * uBlink + ph * 7.0));
    vAngle = ph + uTime * uSpin * (aSeed - 0.5) * 2.0;
  }
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uStretch;
  uniform float uSoftness;
  varying float vAlpha;
  varying float vAngle;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float c = cos(vAngle);
    float s = sin(vAngle);
    q = mat2(c, -s, s, c) * q;
    q.y *= uStretch;
    float a = 1.0 - smoothstep(1.0 - uSoftness, 1.0, length(q) * 2.0);
    if (a <= 0.0) discard;
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;
