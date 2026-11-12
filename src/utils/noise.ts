/** 0~1 해시 — 같은 격자점은 항상 같은 값 */
export const hash2 = (x: number, z: number) => {
  const h = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return h - Math.floor(h);
};

/** 부드러운 값 노이즈 (0~1) — 격자점 값을 매끄럽게 섞어 넓은 얼룩을 만든다 */
export const valueNoise = (x: number, z: number) => {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);
  const top = hash2(ix, iz) + (hash2(ix + 1, iz) - hash2(ix, iz)) * sx;
  const bottom = hash2(ix, iz + 1) + (hash2(ix + 1, iz + 1) - hash2(ix, iz + 1)) * sx;
  return top + (bottom - top) * sz;
};
