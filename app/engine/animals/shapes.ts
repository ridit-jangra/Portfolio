/** Small geometry helpers for building silhouettes out of simple pieces. */
import { clamp, hash3 } from "../math";

/** Scratch output of toSegment(): how far along the segment (0–1) the nearest point is. */
export const seg = { t: 0 };

/** Distance from (px, py) to the segment a → b. */
export function toSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const sx = bx - ax;
  const sy = by - ay;
  const t = clamp(((px - ax) * sx + (py - ay) * sy) / (sx * sx + sy * sy || 1), 0, 1);
  seg.t = t;
  return Math.hypot(px - ax - sx * t, py - ay - sy * t);
}

/** Inside the ellipse centred on (cu, cv) with half-axes a (along u) and b (along v)? */
export function inEllipse(u: number, v: number, cu: number, cv: number, a: number, b: number) {
  const x = (u - cu) / a;
  const y = (v - cv) / b;
  return x * x + y * y <= 1;
}

/** Round spots on a jittered grid of `cell`-sized squares, seeded so each animal gets its own. */
export function spotted(u: number, v: number, cell: number, radius: number, seed: number) {
  const gu = u / cell;
  const gv = v / cell;
  const cu = Math.floor(gu);
  const cv = Math.floor(gv);
  const jx = 0.25 + 0.5 * hash3(cu, cv, seed);
  const jy = 0.25 + 0.5 * hash3(cu, cv, seed + 11);
  const r = (radius / cell) * (0.6 + 0.6 * hash3(cu, cv, seed + 23));
  return (gu - cu - jx) ** 2 + (gv - cv - jy) ** 2 < r * r;
}
