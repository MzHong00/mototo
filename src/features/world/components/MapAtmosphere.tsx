import { SunLight } from "@/features/world/components/SunLight";
import { useAmbientParticles } from "@/features/world/hooks/useAmbientParticles";

import type { MapMood, MoodParticles } from "@/features/world/types/mood";

interface MapAtmosphereProps {
  mood: MapMood;
}

/** 맵 분위기 — 하늘색·안개·하늘빛·해(달)·떠다니는 입자 */
export function MapAtmosphere({ mood }: MapAtmosphereProps) {
  return (
    <>
      <color attach="background" args={[mood.sky]} />
      <fog attach="fog" args={[mood.fog.color, mood.fog.near, mood.fog.far]} />
      <hemisphereLight args={[mood.hemi.sky, mood.hemi.ground, mood.hemi.intensity]} />
      <SunLight sun={mood.sun} />
      {mood.particles && <AmbientParticles particles={mood.particles} />}
    </>
  );
}

interface AmbientParticlesProps {
  particles: MoodParticles;
}

/** 플레이어 주변에 떠다니는 입자 (점 메시 1개) */
function AmbientParticles({ particles }: AmbientParticlesProps) {
  const { pointsRef, geometry, material } = useAmbientParticles(particles);

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
