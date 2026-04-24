export const SLASH_RANGE = 2.8;
export const BLAST_RANGE = 4.5;
export const PROJECTILE_HIT_RADIUS = 0.85;

export const PROJECTILE_PARAMS = {
  arrow: { maxDist: 10, durationMs: 450 },
  fireball: { maxDist: 9, durationMs: 550 },
  shuriken: { maxDist: 11, durationMs: 500 },
} as const;

export const BLAST_PROJECTILE_PARAMS = {
  arrow_blast: { blastDist: 7, travelMs: 700 * 0.55, blastRadius: 2.5 },
  shuriken_blast: { blastDist: 8, travelMs: 750 * 0.5, blastRadius: 2.5 },
} as const;
