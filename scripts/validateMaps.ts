/**
 * 맵 검사 (개발용) — npm run maps:check
 * 모든 맵: 출구 목적지 도착점 존재 · 광장(@)에서 모든 출구·도착점까지 걸어서 도달 가능 · 빌드 시간·삼각형 수
 */
import { EDGES, buildTerrain, tileReader } from "@/utils/terrain";
import { getMapDef, markCenter } from "@/utils/maps";
import { MAP_SPECS } from "@/constants/maps/registry";
import { DUNGEONS } from "@/constants/maps/dungeons";
import { STEP_HEIGHT } from "@/constants/game/movement";

const ids = [
  ...Object.keys(MAP_SPECS),
  ...DUNGEONS.flatMap((d) => d.rooms.map((r) => `${d.id}/${r.id}`)),
];
const errors: string[] = [];

ids.forEach((id) => {
  const t0 = performance.now();
  const map = getMapDef(id);
  const t1 = performance.now();
  const buffers = buildTerrain(map.tiles);
  const t2 = performance.now();
  const { kindAt, cornersAt } = tileReader(map.tiles);
  const width = map.tiles.kinds[0].length;
  const depth = map.tiles.kinds.length;

  // 걸어서 갈 수 있는 칸 (광장에서 출발, 이웃 칸과 맞닿은 변 높이 차가 턱 높이 이하)
  const start = markCenter(map.tiles, "@");
  if (!start) errors.push(`${id}: @ 없음`);
  const seen = new Set<number>();
  const queue: [number, number][] = start ? [[Math.floor(start.x), Math.floor(start.z)]] : [];
  queue.forEach(([x, z]) => seen.add(z * width + x));
  while (queue.length > 0) {
    const [x, z] = queue.shift()!;
    const mine = cornersAt(x, z);
    EDGES.forEach((s) => {
      const nx = x + s.dx;
      const nz = z + s.dz;
      if (nx < 0 || nz < 0 || nx >= width || nz >= depth || seen.has(nz * width + nx)) return;
      const k = kindAt(nx, nz);
      if (k === "w" || k === "x") return;
      const theirs = cornersAt(nx, nz);
      const step = Math.max(
        Math.abs(mine[s.mine[0]] - theirs[s.theirs[0]]),
        Math.abs(mine[s.mine[1]] - theirs[s.theirs[1]]),
      );
      if (step > STEP_HEIGHT) return;
      seen.add(nz * width + nx);
      queue.push([nx, nz]);
    });
  }
  const marks = new Set(map.tiles.marks.join("").replace(/\./g, ""));
  marks.forEach((m) => {
    const c = markCenter(map.tiles, m)!;
    if (!seen.has(Math.floor(c.z) * width + Math.floor(c.x)))
      errors.push(`${id}: '${m}' 도달 불가`);
  });
  map.exits.forEach((e) => {
    if (!marks.has(e.mark)) errors.push(`${id}: 출구 ${e.mark} 표시 없음`);
    const target = getMapDef(e.to.map);
    if (target.id !== e.to.map || !markCenter(target.tiles, e.to.entry))
      errors.push(`${id}: 출구 ${e.mark} → ${e.to.map}:${e.to.entry} 없음`);
  });
  if (id.includes("/")) return;
  const tris = buffers.chunks.reduce((n, c) => n + c.indices.length / 3, 0);
  console.log(
    `${id.padEnd(14)} ${width}x${depth}  설계도 ${(t1 - t0).toFixed(0)}ms  지형 ${(t2 - t1).toFixed(0)}ms  조각 ${buffers.chunks.length}  삼각형 ${tris}  물체 ${map.tiles.objects.length}`,
  );
});

console.log(errors.length ? `\n오류 ${errors.length}\n${errors.join("\n")}` : "\n오류 없음");
if (errors.length) process.exit(1);
