/**
 * Emerald hawker dragonflies: hover, dart, cruise. Made for dark mode.
 *
 * Each one hangs in the air with a little bob, then shoots off in a straight
 * dart (roughly along the course, but anywhere within a wide cone). After a
 * dart it either stops dead and hovers again or carries on cruising along
 * the course for a few seconds, gently weaving, before hovering or darting
 * again. Hovers vary a lot: mostly brief, now and then a long one. Darts
 * leave a faint glint.
 *
 * Emerald is its colour (the bands down the body, the thorax, the wing
 * roots), with the markings of a real hawker around it: white eyes with black
 * pupils at the front (only on the nearer, bigger ones), a thorax striped bright and dark green, legs tucked
 * beneath, a long thin dark-green abdomen banded emerald with pale joints
 * between segments; and
 * long slender clear wings held straight out (hindwings broader at the base),
 * each with an amber leading edge, a net of warm white veins, a faint dotted
 * membrane, a green tint at the root, a reddish-brown spot near the tip,
 * and a sunlit glint sweeping along it with every beat. From above, the
 * wingbeat is only a flicker: the wings stay spread.
 */
import { SHARED_TUNING, type Animal, type Creature } from "../flock";
import { INK_DARK, INK_GLASS, INK_GLOW, INK_LIT, ink, type RGB } from "../ink";
import { frac, hash3, rand, TAU } from "../math";
import { lineGlyph, type Pen } from "../renderer";

interface Dragonfly extends Creature {
  /** Wingbeat phase. */
  phase: number;
  mode: "hover" | "dart" | "cruise";
  /** When the current hover, dart or cruise ends. */
  until: number;
  /** Direction of the current (or next) dart. */
  aim: number;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  fog: 0.26,
  density: 2.1,
  sway: 0,
  spread: 0,
  farthest: 0.32,
  farBias: 3,
  grip: 5,
  separation: 720,
  trail: 0.6,
  trailFade: 1.2,
  sparkle: 0.18,
  hover: 1.3,
  cruising: 0.5,
  dart: 1.5,
  wingbeat: 1,
};

/** One wing: root (u, v), angle forward of straight out, length, half-width, and extra breadth near the root. */
interface Wing {
  u: number;
  v: number;
  angle: number;
  length: number;
  width: number;
  broad: number;
}

// Long and slender, held straight out; hindwings broader at the base.
const FORE: Wing = { u: 0.11, v: 0.02, angle: 0.08, length: 0.5, width: 0.062, broad: 0 };
const HIND: Wing = { u: 0.06, v: 0.02, angle: -0.05, length: 0.48, width: 0.07, broad: 0.5 };

/** Where a point falls on a wing: s along it (0 root → 1 tip) and x across (-1 trailing → 1 leading). */
const hit = { s: 0, x: 0 };
function onWing(w: Wing, u: number, vw: number) {
  const du = u - w.u;
  const dv = vw - w.v;
  const sa = Math.sin(w.angle);
  const ca = Math.cos(w.angle);
  const s = (du * sa + dv * ca) / w.length;
  if (s < 0 || s > 1) return false;
  const across = du * ca - dv * sa;
  const half = w.width * Math.pow(Math.sin(Math.PI * (0.1 + 0.9 * s)), 0.45) * (1 + w.broad * (1 - s) * (1 - s));
  if (Math.abs(across) > half) return false;
  hit.s = s;
  hit.x = across / half;
  return true;
}

// Emerald is the defining colour (a cool green, well clear of the frogs' yellow-green);
// the rest are a hawker's own markings.
const EMERALD: RGB = [50, 220, 120];
const EYE_WHITE: RGB = [240, 240, 232];
const PUPIL: RGB = [10, 10, 12];
const at = { x: 0, y: 0 };
const THORAX: RGB = [96, 232, 130];
const THORAX_STRIPE: RGB = [28, 70, 44];
const LEGS: RGB = [40, 60, 44];
const ABDOMEN: RGB = [24, 72, 46];
const JOINT: RGB = [200, 255, 220];
const TIP: RGB = [18, 40, 28];
const COSTA: RGB = [236, 168, 70];
const VEIN: RGB = [226, 236, 214];
const ROOT: RGB = [90, 220, 140];
const STIGMA: RGB = [176, 70, 40];
const GLINT: RGB = [255, 255, 255];

export const dragonflies: Animal<Dragonfly> = {
  key: "dragonflies",
  label: "Dragonfly",
  swatch: EMERALD,
  defaults: DEFAULTS,
  hide: ["shimmer"],
  controls: [
    ["Flight", [
      { key: "hover", label: "Hover time", min: 0.1, max: 4, step: 0.05, hint: "How long they hang in place, on average. Each hover varies a lot: mostly brief, now and then a long one." },
      { key: "cruising", label: "Cruising", min: 0, max: 1, step: 0.01, hint: "How often they fly on along the course for a few seconds instead of stopping to hover. Higher means fewer hovers." },
      { key: "dart", label: "Dart speed", min: 0.2, max: 3, step: 0.05, hint: "How fast each dart is." },
      { key: "wingbeat", label: "Wingbeat", min: 0.2, max: 2, step: 0.05, hint: "How fast the wings flicker." },
    ]],
  ],
  // Big, with few far away, so a wing is several cells across: room for the vein net.
  area: 150000,
  scale: 2.1,
  speed: 70,
  trail: { light: [40, 160, 100], dark: [140, 255, 190] },

  create: (c) => ({ ...c, phase: rand(0, TAU), mode: "hover" as const, until: 0, aim: 0 }),

  enter(d, flock) {
    d.mode = "hover";
    d.until = flock.time + rand(0, 0.6);
    d.aim = flock.course;
  },

  update(d, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    const t = flock.time;
    const cruise = flock.cruise(d);
    if (t >= d.until) {
      // Hover → dart. Dart → cruise or hover. Cruise → hover, or now and then straight into a dart.
      const from = d.mode;
      const next = from === "hover" ? "dart" : from === "dart" ? (Math.random() < k.cruising ? "cruise" : "hover") : Math.random() < 0.35 ? "dart" : "hover";
      d.mode = next;
      if (next === "dart") {
        d.until = t + rand(0.15, 0.45);
        // Straight out of a cruise, dart on roughly the way it's already heading.
        if (from === "cruise") d.aim = d.heading + rand(-0.4, 0.4) * (k.spread + 0.2);
      } else if (next === "cruise") {
        d.until = t + rand(1.2, 4.5);
        d.aim = flock.heading + d.bias * k.spread + rand(-0.5, 0.5) * k.spread;
      } else {
        // Mostly brief hovers, now and then a long one.
        d.until = t + Math.min(3, Math.max(0.15, -Math.log(1 - Math.random()) * 0.7)) * k.hover;
        // Pick the next dart now, so it can turn to face it while hovering.
        d.aim = flock.heading + d.bias * k.spread * 0.5 + rand(-1, 1) * k.spread * 1.6;
      }
    }

    const acc = flock.begin();
    if (d.mode === "dart") {
      // Drift forward fast enough that hovering plus darting still covers the course.
      flock.steer(d, d.aim, cruise * 4 * k.dart, 10);
    } else if (d.mode === "cruise") {
      // Fly on along the course, the aim weaving gently.
      d.aim += rand(-1, 1) * dt * 1.2;
      d.aim += (flock.heading + d.bias * k.spread - d.aim) * Math.min(1, dt * 0.8);
      flock.steer(d, d.aim, cruise * 1.8, 3);
    } else {
      // Hold position with a slow drift and a little bob.
      flock.steer(d, flock.heading, cruise * 0.25, 4 * k.grip);
      acc.x += Math.cos(t * 3 + d.id) * 40;
      acc.y += Math.sin(t * 4.3 + d.id * 2) * 40;
    }
    flock.separate(d);
    flock.move(d, dt, cruise * 4.5 * k.dart);
    if (flock.passed(d)) flock.reenter(d);

    // Face the dart; cruising, face the way it's flying; hovering, swing round to face the next dart.
    if (d.mode === "cruise") flock.face(d, dt, 4);
    else flock.face(d, dt, d.mode === "dart" ? 14 : 2.5, d.aim);
    d.phase += dt * TAU * 7 * k.wingbeat;
  },

  startle(d, _dx, _dy, strength, flock) {
    // A dart straight ahead along its course, whichever side the tap came from.
    d.mode = "dart";
    d.aim = flock.heading + d.bias * (flock.tuning.spread as number);
    d.until = flock.time + 0.25 + 0.3 * strength;
    d.startledUntil = d.until;
  },

  draw: (d, pen) => drawDragonfly(d, pen),
};

function drawDragonfly(d: Dragonfly, pen: Pen) {
  const S = d.span;
  const pose = { x: d.x, y: d.y, heading: d.heading, span: S, depth: d.depth, id: d.id };
  const out = pen.ink;
  // Fore and hind pairs beat out of step, but stay mostly spread.
  const openFore = 0.86 + 0.14 * Math.cos(d.phase);
  const openHind = 0.86 + 0.14 * Math.cos(d.phase + 1.7);
  const minBody = pen.cw * 0.38;
  // Where along the wings the glint is right now: it sweeps root → tip once a beat.
  const glintAt = frac(d.phase / TAU);
  const tick = Math.floor(pen.t * 24);

  // Legs tucked under the thorax, drawn first so the body covers their roots.
  for (const side of [-1, 1]) {
    pen.lineBody(pose, 0.14, 0.03 * side, 0.2, 0.07 * side, LEGS);
    pen.lineBody(pose, 0.1, 0.03 * side, 0.12, 0.08 * side, LEGS);
  }

  pen.shape(pose, 0.74, (u, v) => {
    const av = Math.abs(v);
    // Thorax, striped on the diagonal.
    const tu = (u - 0.12) / 0.07;
    const tv = av / 0.046;
    if (tu * tu + tv * tv <= 1) return ink(out, ...(frac((u + av) * 22) < 0.5 ? THORAX : THORAX_STRIPE), INK_LIT, "#8");
    // Long thin dark-green abdomen, banded emerald at every segment with a pale joint, darkest at the tip.
    if (u < 0.06 && u > -0.74) {
      const half = Math.max(0.017 - 0.006 * ((0.06 - u) / 0.8), minBody / S);
      if (av <= half) {
        if (u < -0.66) return ink(out, ...TIP, INK_DARK);
        const seg = frac(u * 20);
        if (seg < 0.1) return ink(out, ...JOINT, INK_LIT, "-");
        return seg < 0.45 ? ink(out, ...EMERALD, INK_LIT, "=") : ink(out, ...ABDOMEN, INK_LIT, ":=");
      }
    }
    // Wings: veins only, mostly clear.
    for (const [w, open] of [[FORE, openFore], [HIND, openHind]] as const) {
      if (!onWing(w, u, av / open)) continue;
      const side = v >= 0 ? 1 : -1;
      // Glyphs that run along the wing, and across it, on screen.
      const along = lineGlyph(d.heading + Math.atan2(side * Math.cos(w.angle), Math.sin(w.angle)));
      const across = lineGlyph(d.heading + Math.atan2(-side * Math.sin(w.angle), Math.cos(w.angle)));
      const { s, x } = hit;
      // The reddish-brown spot near the tip, on the leading edge.
      if (s > 0.82 && s < 0.9 && x > 0.35) return ink(out, ...STIGMA, INK_LIT, "#");
      // The leading-edge vein: an amber line.
      if (x > 0.72) return ink(out, ...COSTA, INK_GLOW, along);
      // A sunlit glint sweeping along the wing with each beat.
      if (Math.abs(s - glintAt) < 0.05 && hash3(Math.round(u * 60), Math.round(v * 60), tick) > 0.45) {
        return ink(out, ...GLINT, INK_GLOW, "*+");
      }
      // The vein net: lengthwise veins and cross veins.
      const lengthwise = Math.abs(x + 0.15) < 0.09 || Math.abs(x - 0.35) < 0.07 || x < -0.85 || s > 0.97;
      const cross = frac(s * 9) < 0.09;
      if (lengthwise) return ink(out, ...VEIN, INK_GLOW, cross ? "+" : along);
      if (cross) return ink(out, ...VEIN, INK_GLOW, across);
      // A green tint at the root, then just a faint dotted membrane.
      if (s < 0.18) return ink(out, ...ROOT, INK_GLASS, ".");
      return hash3(Math.round(u * 50), Math.round(v * 50), d.id) > 0.6 && ink(out, ...VEIN, INK_GLOW, ".");
    }
    return false;
  }, { light: 0.92 + 0.08 * openFore });

  // Eyes: one white cell each with a solid black pupil, so they always show and always match.
  // Only on dragonflies big enough for the two to sit in cells of their own; smaller ones go without.
  if (0.068 * S >= pen.cw) {
    for (const side of [-1, 1]) {
      pen.toWorld(pose, 0.2, 0.034 * side, at);
      pen.spot(at.x, at.y, "●", PUPIL, EYE_WHITE, d.depth);
    }
  }

  if (d.mode === "dart") pen.shed(d.x, d.y, 0.06 * d.depth);
}
