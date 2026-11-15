/**
 * Bioluminescent jellyfish pulsing along the course. Made for dark mode.
 *
 * Swimming is pulse-and-coast: the bell squeezes (narrower and longer), which
 * shoves the jelly forward, then it relaxes and coasts on drag until the next
 * pulse. Each pulse also lights it up: the glow surges as the bell snaps shut
 * and then eases out through the rest of the stroke.
 *
 *   bell       lit from within: brightest at the rim and the crown, with
 *              radial ribs and a dusting of white dots over the top
 *   halo       a faint glow spilling into the water around it
 *   rim        a row of small scalloped lobes all along the margin
 *   oral arms  long frilly ribbons from the middle, twisting as they trail,
 *              with bright ruffled edges around a dim core
 *   tentacles  hair-thin, faint threads, roots toward the middle
 *   snow       glowing specks drifting slowly through the water
 */
import { SHARED_TUNING, type Animal, type Creature, type Flock } from "../flock";
import { INK_GLOW, INK_LIT, ink, type RGB } from "../ink";
import { angleDiff, clamp, frac, hash3, rand, smoothstep, TAU } from "../math";
import type { Pen, Pose } from "../renderer";

export interface Jelly extends Creature {
  /** Pulse phase, radians. */
  phase: number;
  /** 0 relaxed → 1 fully squeezed. */
  squeeze: number;
  /** Smoothed turn rate, so the arms swing out on the outside of a turn. */
  turn: number;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  speed: 1.05,
  sway: 0.04,
  spread: 0.08,
  farthest: 0.3,
  farBias: 1.4,
  grip: 1.4,
  trail: 0.8,
  trailFade: 0.6,
  sparkle: 0.1,
  pulseRate: 1,
  pulsePower: 1,
  pulseGlow: 1,
  tentacles: 1,
};

// Magenta: every animal has its own colour, and blue belongs to the butterflies.
const CROWN: RGB = [255, 168, 230];
const BODY: RGB = [232, 56, 182];
const RIM: RGB = [255, 200, 240];
const LOBES: RGB = [255, 214, 244];
const DOTS: RGB = [255, 240, 250];
const FRILL: RGB = [255, 214, 240];
const CORE: RGB = [204, 56, 172];
const TENTACLE: RGB = [232, 100, 204];
const SNOW: RGB = [255, 170, 226];

/** Screen area per speck of marine snow, px². */
const SNOW_AREA = 6000;

const at = { x: 0, y: 0 };
const bt = { x: 0, y: 0 };
const mix = (a: RGB, b: RGB, f: number): RGB => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

export const jellyfish: Animal<Jelly> = {
  key: "jellyfish",
  label: "Jellyfish",
  swatch: [232, 56, 182],
  defaults: DEFAULTS,
  hide: ["shimmer"],
  controls: [
    ["Swimming", [
      { key: "pulseRate", label: "Pulse rate", min: 0.2, max: 3, step: 0.05, hint: "How often the bell pulses." },
      { key: "pulsePower", label: "Pulse power", min: 0.2, max: 3, step: 0.05, hint: "How far each pulse pushes it forward." },
      { key: "pulseGlow", label: "Pulse glow", min: 0, max: 3, step: 0.05, hint: "How much the bell lights up on each pulse. 0 turns it off." },
      { key: "tentacles", label: "Arm length", min: 0, max: 2.5, step: 0.05, hint: "Length of the frilly arms and the thin tentacles." },
    ]],
  ],
  area: 95000,
  scale: 1.6,
  speed: 55,
  trail: { light: [200, 80, 170], dark: [255, 130, 214] },

  create: (c) => ({ ...c, phase: rand(0, TAU), squeeze: 0, turn: 0 }),

  update(j, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    j.phase += dt * TAU * 0.6 * k.pulseRate * (0.9 + 0.2 * j.roll);
    const p = frac(j.phase / TAU);
    // A quick squeeze, then a slow relax.
    j.squeeze = p < 0.22 ? smoothstep(0, 0.22, p) : 1 - smoothstep(0.22, 1, p);

    // Lazily turn toward the course; jellies can't steer hard.
    const want = flock.heading + j.bias * k.spread;
    const before = j.heading;
    j.heading += clamp(angleDiff(j.heading, want), -0.6 * k.grip * dt, 0.6 * k.grip * dt);
    j.turn += (angleDiff(before, j.heading) / dt - j.turn) * Math.min(1, dt * 3);

    const cruise = flock.cruise(j);
    const acc = flock.begin();
    // Thrust only while squeezing; drag the rest of the time, so it coasts.
    const thrust = p < 0.22 ? 6.2 * cruise * k.pulsePower : 0;
    acc.x += Math.cos(j.heading) * thrust - j.vx * 1.4;
    acc.y += Math.sin(j.heading) * thrust - j.vy * 1.4;
    flock.separate(j, k.separation, 0.5);
    flock.move(j, dt, cruise * 3);
    if (flock.passed(j, j.span * 1.4)) flock.reenter(j);
  },

  startle(j, _dx, _dy, strength, flock) {
    // A hard pulse right now that surges it ahead on the course it's already on (no turning).
    j.phase = Math.floor(j.phase / TAU) * TAU + TAU;
    const boost = 260 * strength * j.depth;
    j.vx += Math.cos(j.heading) * boost;
    j.vy += Math.sin(j.heading) * boost;
    j.startledUntil = flock.time + 0.8;
  },

  drawAll(flock, pen) {
    drawSnow(flock, pen);
    for (const j of flock.creatures) drawJelly(j, pen, flock);
  },
};

/** The glow's surge on each pulse: quick to light as the bell snaps shut, then easing out. */
function pulseGlow(j: Jelly) {
  const p = frac(j.phase / TAU);
  return p < 0.16 ? smoothstep(0, 0.16, p) : Math.exp(-(p - 0.16) * 4.5);
}

function drawJelly(j: Jelly, pen: Pen, flock: Flock<Jelly>) {
  const k = flock.tuning as typeof DEFAULTS;
  const S = j.span;
  const sq = j.squeeze;
  const t = pen.t;
  const pose: Pose = { x: j.x, y: j.y, heading: j.heading, span: S, depth: j.depth, id: j.id };
  const len = k.tentacles;
  const base = pen.fogFor(j.depth);
  const a = 0.32 * (1 + 0.14 * sq);
  const b = 0.3 * (1 - 0.2 * sq);
  const u0 = -0.04;
  const sway = clamp(-j.turn * 0.5, -0.5, 0.5);
  const flash = pulseGlow(j) * k.pulseGlow;

  // Hair-thin tentacles: faint threads, roots toward the middle of the rim.
  for (let n = 0; n < 8; n++) {
    const v0 = (n / 7 - 0.5) * 2 * b * 0.6;
    let pu = u0 - 0.02;
    let pv = v0;
    const segs = 14;
    const length = 1.5 * len * (0.75 + 0.35 * hash3(j.id, n, 4));
    for (let i = 1; i <= segs; i++) {
      const f = i / segs;
      const u = u0 - 0.02 - f * length * (1 - 0.12 * sq);
      const v = v0 * (1 - 0.3 * f) + 0.04 * Math.sin(j.phase - f * 3.5 + n * 1.3) * f + sway * f * f * 0.4;
      pen.toWorld(pose, pu, pv, at);
      pen.toWorld(pose, u, v, bt);
      pen.line(at.x, at.y, bt.x, bt.y, TENTACLE, j.depth, undefined, Math.min(0.95, base + 0.45 + 0.35 * f));
      pu = u;
      pv = v;
    }
  }

  // Oral arms: frilly ribbons that twist as they trail, bright ruffled edges around a dim core.
  for (let n = 0; n < 4; n++) {
    const v0 = (n / 3 - 0.5) * 0.11;
    const segs = 26;
    const length = 1.05 * len * (0.8 + 0.3 * hash3(j.id, n, 7));
    for (let i = 1; i <= segs; i++) {
      const f = i / segs;
      const u = u0 - f * length;
      const v = v0 * (1 - 0.4 * f) + 0.05 * Math.sin(j.phase * 0.9 - f * 4.5 + n * 1.7) * f + sway * f * 0.25;
      // The twist: the ribbon's width swings through zero and back as it spirals.
      const w = 0.055 * (1 - 0.5 * f) * Math.cos(f * 9 + n * 1.3 + t * 0.6);
      const fog = Math.min(0.95, base + 0.3 * f);
      pen.toWorld(pose, u, v, at);
      pen.dot(at.x, at.y, i % 3 ? ":" : "|", CORE, j.depth, Math.min(0.95, fog + 0.15));
      for (const side of [-1, 1]) {
        pen.toWorld(pose, u, v + w * side, at);
        pen.dot(at.x, at.y, "{}~§"[(i + n + (side > 0 ? 1 : 0)) % 4], FRILL, j.depth, fog);
      }
    }
    pen.toWorld(pose, u0 - length, v0, at);
    pen.shed(at.x, at.y, 0.015 * j.depth);
  }

  // A faint halo where the glow spills into the water, brighter and wider while the pulse glows.
  const out = pen.ink;
  const h = 1.3 * (1 + 0.18 * flash);
  pen.shape(pose, 0.32 * h + 0.1, (u, v) => {
    const r = Math.hypot((u - u0) / (a * h), v / (b * h));
    return r < 1 && u > u0 - 0.08 && ink(out, ...RIM, INK_GLOW, ".");
  }, { fog: clamp(base + 0.55 - 0.3 * flash, 0, 0.95) });

  // The bell, lit from within.
  pen.shape(pose, 0.42, (u, v) => {
    const du = (u - u0) / a;
    const dv = v / b;
    const r2 = du * du + dv * dv;
    const margin = u0 - 0.04 * dv * dv;
    if (r2 > 1 || u < margin) {
      // A row of scalloped lobes hanging just off the margin.
      if (Math.abs(dv) > 1 || u > margin || u < margin - 0.04) return false;
      const lobe = 0.04 * Math.sin(frac((dv + 1) * 5.5) * Math.PI);
      return u > margin - lobe && ink(out, ...LOBES, INK_LIT, "o");
    }
    const r = Math.sqrt(r2);
    if (r > 0.88) return ink(out, ...RIM, INK_LIT, ":;");
    const th = Math.atan2(dv, du);
    // A dusting of white dots over the top of the dome.
    if (du > 0.3) {
      const gu = Math.round(du * 11);
      const gv = Math.round(dv * 13);
      const near = Math.hypot(du * 11 - gu, dv * 13 - gv) < 0.32;
      if (near && hash3(gu, gv, j.id) > 0.45) return ink(out, ...DOTS, INK_LIT, ".'");
    }
    // Radial ribs, brighter toward the rim.
    if (r > 0.35 && frac((th / Math.PI) * 6) < 0.1) return ink(out, ...RIM, INK_LIT, "|");
    // Glow: brightest at the crown and toward the rim, a little dimmer in the middle.
    const glow = 0.75 + 0.25 * Math.max(clamp(du, 0, 1), r * r);
    const c = mix(BODY, CROWN, clamp(du, 0, 1) * 0.8);
    return ink(out, c[0] * glow, c[1] * glow, c[2] * glow, INK_LIT, " .");
  }, { light: (0.92 + 0.18 * sq) * (1 + 0.6 * flash) });
}

/** Marine snow: glowing specks that drift slowly up through the water and twinkle. */
function drawSnow(flock: Flock<Jelly>, pen: Pen) {
  const { width: W, height: H } = flock;
  const n = Math.round((W * H) / SNOW_AREA);
  const t = pen.t;
  for (let i = 0; i < n; i++) {
    const rise = 3 + 9 * hash3(i, 3, 1);
    const x = hash3(i, 1, 1) * W + Math.sin(t * 0.25 + i) * 6;
    const y = (((hash3(i, 2, 1) * H - t * rise) % H) + H) % H;
    const twinkle = 0.5 + 0.5 * Math.sin(t * (0.8 + 1.6 * hash3(i, 4, 1)) + i);
    const big = hash3(i, 5, 1) > 0.92;
    pen.dot(x, y, big ? "*" : ".", SNOW, 1, Math.min(0.95, 0.35 + 0.5 * (1 - twinkle) + (big ? 0 : 0.15)));
  }
}
