/**
 * Koi, meandering lazily along the course.
 *
 * Each koi is a follow-the-leader spine: the head swims, every node behind it
 * trails at a fixed spacing, and a stiffness limit per joint keeps the body
 * from folding. On top of that a travelling wave, growing toward the tail,
 * swishes the body as it swims. The silhouette is sampled against that bent
 * spine (distance to it gives how far across the body a point is; arc length
 * gives how far along), so patterns ride along with the bends. Each fish is
 * one of a few classic varieties, painted with a smooth noise field. They
 * leave soft ripples.
 *
 * A tap drops food: a scatter of pellets, each landing with a ripple. Koi
 * within Food range turn and swim over (the closer, the keener), gulping a
 * pellet when their head reaches it; leftovers drift and fade, and a koi with
 * nothing in reach goes back to meandering along the course.
 */
import { SHARED_TUNING, type Animal, type Creature, type Flock } from "../flock";
import type { Pen } from "../renderer";
import { INK_DARK, INK_GLASS, INK_SHIMMER, ink } from "../ink";
import { angleDiff, clamp, hash3, lerp, rand, smoothstep, TAU } from "../math";

const NODES = 14;

interface Koi extends Creature {
  /** Spine, head first: [x0, y0, x1, y1, …]. */
  nodes: Float32Array;
  /** Tail-beat phase. */
  phase: number;
  /** Which pattern: see VARIETIES. */
  variety: number;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  fog: 0.64,
  density: 1.6,
  speed: 1.6,
  spread: 0,
  sway: 0,
  farthest: 0.33,
  farBias: 1.3,
  grip: 2.65,
  separation: 780,
  trail: 4,
  trailFade: 0.4,
  shimmer: 0.35,
  sparkle: 0.08,
  meander: 0.4,
  foodRange: 200,
  tailBeat: 1,
};

type RGB = [number, number, number];
const WHITE: RGB = [244, 240, 230];
const RED: RGB = [222, 66, 40];
const BLACK: RGB = [34, 34, 40];
const GOLD: RGB = [238, 182, 64];
const ORANGE: RGB = [236, 124, 44];
const FIN: RGB = [236, 226, 214];

/** kohaku (red on white), sanke (kohaku + black flecks), showa (black base, red and white), ogon (gold), chagoi (orange). */
const VARIETIES = ["kohaku", "sanke", "showa", "ogon", "chagoi"] as const;

/** Body half-width at s (0 snout → 1 tail tip), as a fraction of length. */
function halfWidth(s: number) {
  if (s < 0.12) return 0.1 * Math.pow(Math.sin(((s / 0.12) * Math.PI) / 2), 0.6);
  if (s < 0.35) return 0.1 + 0.016 * Math.sin(((s - 0.12) / 0.23) * (Math.PI / 2));
  if (s < 0.82) return 0.116 - 0.088 * smoothstep(0.35, 0.82, s);
  // The caudal fin fans out, forked at the end.
  return 0.028 + ((s - 0.82) / 0.18) * 0.1;
}

/** A smooth blotchy field, different per fish. */
function blotch(s: number, a: number, seed: number) {
  return (
    Math.sin(s * 11 + seed) * Math.cos(a * 22 + seed * 1.3) +
    0.6 * Math.sin(s * 23 + a * 15 + seed * 2.1) +
    0.35 * Math.sin(s * 5 - seed * 0.7)
  );
}

/** A food pellet floating on the water. */
interface Pellet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** When it was dropped; it fades and goes after PELLET_LIFE seconds. */
  born: number;
}

const PELLET_LIFE = 14;
const FOOD: RGB = [232, 178, 104];
/** Glossy black eyes with a white glint. */
const EYE: RGB = [14, 12, 16];
const GLINT: RGB = [255, 252, 246];
const pantries = new WeakMap<Flock<Koi>, Pellet[]>();
const pantry = (flock: Flock<Koi>) => {
  let food = pantries.get(flock);
  if (!food) pantries.set(flock, (food = []));
  return food;
};

/** How strongly the last nearestFood() pellet pulls: 1 right beside it, fading to 0 at the edge of range. */
let pull = 0;

/** The nearest pellet within `range` px of this koi's head, if any. */
function nearestFood(f: Koi, flock: Flock<Koi>, range: number) {
  let best: Pellet | null = null;
  let bestD = range;
  for (const p of pantry(flock)) {
    const d = Math.hypot(p.x - f.x, p.y - f.y);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  pull = best ? 1 - bestD / range : 0;
  return best;
}

export const koi: Animal<Koi> = {
  key: "koi",
  label: "Koi",
  // The dot in the top bar: yellow, so it doesn't look like the crab's.
  swatch: [244, 196, 44],
  defaults: DEFAULTS,
  controls: [
    ["Swimming", [
      { key: "meander", label: "Meander", min: 0, max: 3, step: 0.05, hint: "How much they weave in lazy S-curves." },
      { key: "tailBeat", label: "Tail beat", min: 0.2, max: 3, step: 0.05, hint: "How fast and wide the tail swishes." },
    ]],
    ["Feeding", [
      { key: "foodRange", label: "Food range", min: 0, max: 500, step: 10, hint: "How close a koi has to be to notice food you drop. The closer it is, the harder it turns and the faster it swims over." },
    ]],
  ],
  area: 75000,
  scale: 1.15,
  speed: 50,
  trail: { light: [90, 140, 190], dark: [110, 170, 220] },

  create: (c) => ({
    ...c,
    nodes: new Float32Array(NODES * 2),
    phase: rand(0, TAU),
    variety: Math.floor(hash3(c.id, 7, 3) * VARIETIES.length),
  }),

  /** Lay the spine out straight behind the head. */
  enter(f) {
    const seg = f.span / (NODES - 1);
    for (let k = 0; k < NODES; k++) {
      f.nodes[k * 2] = f.x - Math.cos(f.heading) * seg * k;
      f.nodes[k * 2 + 1] = f.y - Math.sin(f.heading) * seg * k;
    }
  },

  /** Pellets drift slowly on the surface and fade away if nobody eats them. */
  prepare(flock, dt) {
    const food = pantry(flock);
    for (const p of food) {
      p.vx *= Math.exp(-dt * 0.8);
      p.vy *= Math.exp(-dt * 0.8);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    const t = flock.time;
    for (let i = food.length - 1; i >= 0; i--) if (t - food[i].born > PELLET_LIFE) food.splice(i, 1);
  },

  /** A tap drops a scatter of food pellets, each landing with a ripple. */
  tap(x, y, flock) {
    const food = pantry(flock);
    const n = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      const r = 70 * Math.sqrt(Math.random());
      const p = { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: Math.cos(a) * rand(4, 14), vy: Math.sin(a) * rand(4, 14), born: flock.time };
      food.push(p);
      flock.events.push({ x: p.x, y: p.y, radius: 1, amount: 0.5 });
    }
    if (food.length > 60) food.splice(0, food.length - 60);
  },

  update(f, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    const t = flock.time;
    // Food nearby? Head for it: the closer it is, the harder the turn and the faster the swim.
    const meal = nearestFood(f, flock, k.foodRange);
    const hunger = meal ? 0.25 + 0.75 * pull : 0;
    // Otherwise lazy S-curves around the course, and a slow turn rate.
    let want = meal ? Math.atan2(meal.y - f.y, meal.x - f.x) : flock.heading + f.bias * k.spread + k.meander * 0.6 * Math.sin(t * 0.35 + f.id * 1.7);
    const acc = flock.begin();
    flock.separate(f, k.separation, 0.5);
    if (acc.x || acc.y) {
      const cruise = flock.cruise(f);
      want = Math.atan2(Math.sin(want) * cruise + acc.y * 0.3, Math.cos(want) * cruise + acc.x * 0.3);
    }
    const turn = lerp(0.9 * k.grip, 2.6, hunger) * dt;
    f.heading += clamp(angleDiff(f.heading, want), -turn, turn);
    const speed = flock.cruise(f) * lerp(0.85 + 0.25 * Math.sin(t * 0.5 + f.id), 1.8, hunger);
    f.vx = Math.cos(f.heading) * speed;
    f.vy = Math.sin(f.heading) * speed;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    f.phase += dt * (2 + speed / 25) * k.tailBeat;

    // Follow-the-leader spine with a stiffness limit per joint.
    const n = f.nodes;
    const seg = f.span / (NODES - 1);
    n[0] = f.x;
    n[1] = f.y;
    let prev = f.heading + Math.PI;
    for (let i = 1; i < NODES; i++) {
      let a = Math.atan2(n[i * 2 + 1] - n[i * 2 - 1], n[i * 2] - n[i * 2 - 2]);
      a = prev + clamp(angleDiff(prev, a), -0.22, 0.22);
      n[i * 2] = n[i * 2 - 2] + Math.cos(a) * seg;
      n[i * 2 + 1] = n[i * 2 - 1] + Math.sin(a) * seg;
      prev = a;
    }
    // Gulp: the head reaches a pellet.
    if (meal && Math.hypot(meal.x - f.x, meal.y - f.y) < f.span * 0.1 + 6) {
      const food = pantry(flock);
      food.splice(food.indexOf(meal), 1);
      flock.events.push({ x: meal.x, y: meal.y, radius: 1, amount: 0.7 });
    }
    if (flock.passed(f, f.span * 1.3)) flock.reenter(f);
  },


  drawAll(flock, pen) {
    // Food first, so a koi swimming over a pellet covers it.
    drawFood(flock, pen);
    for (const f of flock.creatures) drawKoi(f, pen, flock);
  },
};

/** Food pellets on the water, fading out over their last moments. */
function drawFood(flock: Flock<Koi>, pen: Pen) {
  const t = flock.time;
  for (const p of pantry(flock)) {
    const age = (t - p.born) / PELLET_LIFE;
    pen.dot(p.x, p.y, age < 0.7 ? "o" : ".", FOOD, 1, Math.min(0.9, Math.max(0, age - 0.5) * 1.6));
  }
}

/** Draw one koi: body and pattern along the bent spine, see-through fins, a forked tail, glossy eyes on the bigger ones. */
function drawKoi(f: Koi, pen: Pen, flock: Flock<Koi>) {
  const k = flock.tuning as typeof DEFAULTS;
  const L = f.span;
  const n = f.nodes;
  const out = pen.ink;
  const variety = VARIETIES[f.variety];
  const seed = f.id * 1.37;
  // On paper, pure white vanishes: use a pearly grey there so the white still reads.
  const white: RGB = pen.theme === "light" ? [222, 217, 206] : WHITE;
  const fin: RGB = pen.theme === "light" ? [206, 196, 182] : FIN;

  // The rendered spine: the sim spine plus a travelling wave that grows toward the tail.
  const spine = new Float32Array(NODES * 2);
  const arc = new Float32Array(NODES);
  for (let i = 0; i < NODES; i++) {
    const s = i / (NODES - 1);
    const a = Math.max(0, i - 1);
    const b = Math.min(NODES - 1, i + 1);
    let tx = n[a * 2] - n[b * 2];
    let ty = n[a * 2 + 1] - n[b * 2 + 1];
    const tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    const off = L * 0.06 * Math.pow(s, 1.6) * Math.sin(f.phase - s * 4.5) * Math.min(1.5, k.tailBeat);
    spine[i * 2] = n[i * 2] - ty * off;
    spine[i * 2 + 1] = n[i * 2 + 1] + tx * off;
    if (i > 0) arc[i] = arc[i - 1] + Math.hypot(spine[i * 2] - spine[i * 2 - 2], spine[i * 2 + 1] - spine[i * 2 - 1]);
  }
  const total = arc[NODES - 1] || 1;
  const mid = (NODES / 2) | 0;
  const pose = { x: spine[mid * 2], y: spine[mid * 2 + 1], heading: f.heading, span: L, depth: f.depth, id: f.id };
  const finBeat = 0.8 + 0.2 * Math.sin(f.phase * 0.7);

  pen.shape(pose, 0.72, (_u, _v, px, py) => {
    // Nearest point on the spine: how far along (s) and across (a, signed) the body.
    let best = Infinity;
    let s = 0;
    let a = 0;
    // How far past the tail tip the point lies (fractions of length), if it does.
    let past = 0;
    for (let i = 0; i < NODES - 1; i++) {
      const ax = spine[i * 2];
      const ay = spine[i * 2 + 1];
      const sx = spine[i * 2 + 2] - ax;
      const sy = spine[i * 2 + 3] - ay;
      const len2 = sx * sx + sy * sy || 1;
      const raw = ((px - ax) * sx + (py - ay) * sy) / len2;
      const q = clamp(raw, 0, 1);
      const sl = Math.sqrt(len2);
      if (i === NODES - 2 && raw > 1) {
        // Beyond the tip: measure across from the tip's own line, not as distance to the tip point.
        const across = Math.abs(sx * (py - ay) - sy * (px - ax)) / sl;
        if (across * across < best) {
          best = across * across;
          s = 1;
          past = ((raw - 1) * sl) / L;
          a = (across / L) * (sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1);
        }
        continue;
      }
      const d2 = (px - ax - sx * q) ** 2 + (py - ay - sy * q) ** 2;
      if (d2 < best) {
        best = d2;
        s = (arc[i] + q * sl) / total;
        a = (Math.sqrt(d2) / L) * (sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1);
        past = 0;
      }
    }
    const aa = Math.abs(a);
    const w = halfWidth(s);
    out.au = s;
    out.av = a;

    // Nothing reaches past the tail tip.
    if (past > 0) return false;

    // Pectoral fins at the shoulders, pelvic fins further back: see-through.
    const pect = s > 0.17 && s < 0.34 && aa < w + 0.1 * finBeat * Math.sin(((s - 0.17) / 0.17) * Math.PI);
    const pelvic = s > 0.48 && s < 0.6 && aa < w + 0.05 * Math.sin(((s - 0.48) / 0.12) * Math.PI);
    if (aa > w) return (pect || pelvic) && ink(out, ...fin, INK_GLASS, "-=");
    if (s > 0.82) {
      // A shallow V-notch at the very end of a forked tail.
      if (s > 0.93 && aa < ((s - 0.93) / 0.07) * 0.06) return false;
      return ink(out, ...fin, INK_GLASS, s > 0.9 ? "/\\" : "=");
    }

    const patch = blotch(s, a, seed) > 0.25;
    const across = aa / w;
    switch (variety) {
      case "kohaku":
        return patch && s < 0.8 ? ink(out, ...RED) : ink(out, ...white);
      case "sanke":
        if (hash3(Math.round(s * 30), Math.round(a * 60), f.id) > 0.9 && s > 0.15) return ink(out, ...BLACK, INK_DARK);
        return patch && s < 0.8 ? ink(out, ...RED) : ink(out, ...white);
      case "showa":
        if (blotch(s, a, seed + 4) > 0.55) return ink(out, ...white);
        return patch ? ink(out, ...RED) : ink(out, ...BLACK, INK_DARK, "%#");
      case "ogon":
        return ink(out, ...GOLD, INK_SHIMMER);
      default:
        // Chagoi.
        return ink(out, ORANGE[0] * (1 - 0.15 * across), ORANGE[1] * (1 - 0.15 * across), ORANGE[2], INK_SHIMMER);
    }
  });

  // Eyes: one glossy black cell each with a white glint, on the head just inside the outline, so
  // they always show and always match. Only on koi big enough for the two to sit in cells of their
  // own; smaller ones go without.
  const across = halfWidth(0.09) * 0.55 * L;
  if (2 * across >= pen.cw) {
    const along = 0.09 * total;
    let i = 0;
    while (i < NODES - 2 && arc[i + 1] < along) i++;
    const sl = arc[i + 1] - arc[i] || 1;
    const q = (along - arc[i]) / sl;
    const dx = (spine[i * 2 + 2] - spine[i * 2]) / sl;
    const dy = (spine[i * 2 + 3] - spine[i * 2 + 1]) / sl;
    const hx = spine[i * 2] + dx * q * sl;
    const hy = spine[i * 2 + 1] + dy * q * sl;
    for (const side of [-1, 1]) pen.spot(hx - dy * across * side, hy + dx * across * side, "●", GLINT, EYE, f.depth);
  }

  // Soft ripples off the tail.
  pen.shed(spine[(NODES - 2) * 2], spine[(NODES - 2) * 2 + 1], 0.02 * f.depth);
}
