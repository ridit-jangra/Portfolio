/**
 * Blue morpho butterflies on migration.
 *
 * Wings are seen from above. Each lobe (forewing, hindwing) is a fan in polar
 * coordinates around its root on the body, so an outline is just a radius per
 * angle, and the paint gets a point in lobe space (t across the fan, r from
 * root to margin): margins are high r, spots repeat across t. Raised wings
 * are foreshortened across the body, so the sampler unfolds v by how open
 * the wings are before testing the outline; that one division is the flap.
 *
 * Flight: hold the course, plus a flutter (a random walk that decays back to
 * zero), a thrust pulse on every downstroke, and now and then a glide with
 * the wings held flat.
 */
import { SHARED_TUNING, type Animal, type Creature } from "../flock";
import { INK_BODY, INK_DARK, INK_SHIMMER, INK_SPOT, ink } from "../ink";
import { clamp, frac, rand, TAU } from "../math";

interface Lobe {
  /** Angle range in radians: 0 points straight out sideways, positive sweeps toward the head. */
  from: number;
  to: number;
  /** Longest radius, as a fraction of wingspan. */
  reach: number;
  /** Where across [from, to] (0–1) the reach peaks. */
  peak: number;
  /** <1 gives a blunt, rounded fan; >1 a pointed one. */
  round: number;
  /** Depth of a wavy (scalloped) margin; 0 for a smooth edge. */
  scallop: number;
}

const FORE: Lobe = { from: -0.3, to: 1.0, reach: 0.56, peak: 0.55, round: 0.5, scallop: 0 };
const HIND: Lobe = { from: -1.45, to: 0.15, reach: 0.44, peak: 0.48, round: 0.42, scallop: 0.04 };
/** Where each wing pair joins the body, as a fraction of span ahead of the centre. */
const FORE_ROOT = 0.06;
const HIND_ROOT = -0.02;
const BODY: [number, number, number] = [30, 30, 42];
const FLAP_HZ = 2.6;
const GLIDE = 0.35;
const FLUTTER = 1.3;

/** Lobe radius at angle phi, or 0 outside its fan. */
function lobeReach(l: Lobe, phi: number, t = (phi - l.from) / (l.to - l.from)) {
  if (t <= 0 || t >= 1) return 0;
  const s = t < l.peak ? (t / l.peak) * 0.5 : 0.5 + ((t - l.peak) / (1 - l.peak)) * 0.5;
  const R = l.reach * Math.pow(Math.sin(Math.PI * s), l.round);
  return l.scallop ? R * (1 - l.scallop * (0.5 + 0.5 * Math.cos(t * Math.PI * 14))) : R;
}

/** Body half-width at u (fraction of span, + toward the head): round head, thorax, tapering abdomen. */
function bodyHalfWidth(u: number) {
  if (u > 0.17 || u < -0.32) return 0;
  if (u > 0.11) return Math.sqrt(Math.max(0, 0.03 * 0.03 - (u - 0.14) ** 2));
  if (u > -0.04) return 0.034;
  return 0.03 * (1 - 0.6 * ((-0.04 - u) / 0.28));
}

/** Where a point falls in a lobe, or null outside it. */
const lobe = { t: 0, r: 0 };
function inLobe(l: Lobe, du: number, vw: number) {
  const phi = Math.atan2(du, vw);
  const t = (phi - l.from) / (l.to - l.from);
  const R = lobeReach(l, phi, t);
  const r = Math.hypot(du, vw);
  if (r > R) return false;
  lobe.t = t;
  lobe.r = r / R;
  return true;
}

interface Butterfly extends Creature {
  /** Wingbeat phase. */
  phase: number;
  /** How flat the wings are seen from above: ~0.1 raised together → 1 spread open. */
  open: number;
  /** 0 flapping → 1 gliding. */
  glide: number;
  glideUntil: number;
  flutterX: number;
  flutterY: number;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  density: 1.05,
  speed: 1.05,
  sway: 0,
  spread: 0,
  size: 1.25,
  farthest: 0.18,
  farBias: 1.7,
  grip: 5,
  separation: 700,
  trail: 1.55,
  trailFade: 0.15,
  flutter: 0,
  glide: 2.75,
  flapRate: 1,
};

export const butterflies: Animal<Butterfly> = {
  key: "butterflies",
  label: "Butterfly",
  swatch: [50, 135, 255],
  defaults: DEFAULTS,
  controls: [
    ["Flight", [
      { key: "flutter", label: "Flutter", min: 0, max: 3, step: 0.05, hint: "How much their path zigzags." },
      { key: "glide", label: "Glide", min: 0, max: 4, step: 0.05, hint: "How often they stop flapping and glide with wings held flat." },
      { key: "flapRate", label: "Flap rate", min: 0.2, max: 3, step: 0.05, hint: "How fast their wings beat." },
    ]],
  ],
  area: 48000,
  scale: 1,
  speed: 90,
  trail: { light: [70, 118, 226], dark: [96, 156, 255] },

  create: (c) => ({ ...c, phase: rand(0, TAU), open: 1, glide: 0, glideUntil: 0, flutterX: 0, flutterY: 0 }),

  enter(b) {
    b.flutterX = 0;
    b.flutterY = 0;
  },

  update(b, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    const t = flock.time;
    const cruise = flock.cruise(b);
    const acc = flock.begin();
    flock.steer(b, flock.heading + b.bias * k.spread, cruise, k.grip);

    // Flutter: a random walk that keeps decaying back to zero, so the path
    // zigzags without drifting. Gliding calms it; distance shrinks it.
    const kick = Math.sqrt(dt) * 520 * FLUTTER * k.flutter * (1 - 0.8 * b.glide) * (0.5 + 0.5 * b.depth);
    b.flutterX += -b.flutterX * 3 * dt + (Math.random() * 2 - 1) * kick;
    b.flutterY += -b.flutterY * 3 * dt + (Math.random() * 2 - 1) * kick;
    acc.x += b.flutterX;
    acc.y += b.flutterY;

    // Every downstroke shoves the butterfly forward a little.
    const down = Math.max(0, -Math.sin(b.phase)) * (1 - b.glide);
    acc.x += Math.cos(b.heading) * down * cruise * 1.4;
    acc.y += Math.sin(b.heading) * down * cruise * 1.4;

    flock.separate(b);
    const speed = flock.move(b, dt, cruise * 2.2);
    if (flock.passed(b)) flock.reenter(b);
    if (speed > 12) flock.face(b, dt);

    if (b.glide < 0.5 && t > b.glideUntil && speed > cruise * 0.5 && Math.random() < GLIDE * k.glide * dt) {
      b.glideUntil = t + rand(0.5, 1.4);
    }
    b.glide += ((t < b.glideUntil ? 1 : 0) - b.glide) * Math.min(1, dt * 6);
    const urgency = clamp(speed / (cruise * 2), 0, 1);
    b.phase += dt * TAU * FLAP_HZ * k.flapRate * (0.8 + 0.6 * urgency) * (1 - 0.9 * b.glide);
    const beat = Math.pow(0.5 + 0.5 * Math.cos(b.phase), 0.8);
    b.open = 0.1 + 0.9 * (beat * (1 - b.glide) + 0.96 * b.glide);
  },

  startle(b, dx, dy, strength, flock) {
    const k = strength * 420 * b.depth;
    b.vx += dx * k;
    b.vy += dy * k;
    b.startledUntil = flock.time + rand(0.6, 1.2);
    b.glideUntil = 0;
  },

  draw(b, pen) {
    const S = b.span;
    const open = Math.max(0.08, b.open);
    const ink$ = pen.ink;
    // The body yaws a touch with each beat.
    const pose = { x: b.x, y: b.y, heading: b.heading + 0.06 * Math.sin(b.phase), span: S, depth: b.depth, id: b.id };
    const minBody = pen.cw * 0.4;

    pen.shape(pose, 0.75, (u, v) => {
      const av = Math.abs(v);
      const bw = bodyHalfWidth(u);
      if (bw > 0 && av * S <= Math.max(bw * S, minBody)) {
        ink(ink$, ...BODY, INK_BODY);
        return true;
      }
      const vw = av / open;
      let part: number;
      if (inLobe(FORE, u - FORE_ROOT, vw)) part = 0;
      else if (inLobe(HIND, u - HIND_ROOT, vw)) part = 1;
      else return false;
      const { t, r } = lobe;
      // Black margin with white spots on the forewing, dark roots and leading edge, shimmering blue.
      if (r > 0.86) {
        if (part === 0 && r < 0.95 && Math.abs(frac(t * 5) - 0.5) < 0.14) ink(ink$, 236, 240, 255, INK_SPOT);
        else ink(ink$, 22, 28, 62, INK_DARK);
      } else if (r < 0.08) ink(ink$, 26, 44, 110, INK_DARK);
      else if (part === 0 && t > 0.9) ink(ink$, 30, 50, 120, INK_DARK);
      else ink(ink$, 50 + 70 * r, 135 + 60 * r, 255, INK_SHIMMER);
      return true;
    }, { light: 0.6 + 0.4 * b.open, tilt: b.open * 3 });

    // Feelers with clubbed tips.
    const sway = 0.012 * Math.sin(pen.t * 3 + b.id);
    for (const side of [-1, 1]) {
      pen.lineBody(pose, 0.16, 0.012 * side, 0.37 + sway, (0.12 + sway) * side, pen.contrast, S > 120 ? "o" : undefined);
    }

    // Downstrokes shed scales from the forewing tips.
    const stroke = Math.max(0, -Math.sin(b.phase)) * (1 - b.glide);
    const phi = FORE.from + (FORE.to - FORE.from) * FORE.peak;
    const tipU = FORE_ROOT + Math.sin(phi) * FORE.reach * 0.95;
    const tipV = Math.cos(phi) * FORE.reach * 0.95 * b.open;
    const at = { x: 0, y: 0 };
    for (const side of [-1, 1]) {
      pen.toWorld(pose, tipU, tipV * side, at);
      pen.shed(at.x, at.y, (0.02 + 0.1 * stroke) * b.depth);
    }
  },
};
