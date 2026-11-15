/**
 * Giant pandas, ambling along the course.
 *
 * Seen from above: a round white head with black ears, black eye patches and a
 * black nose, a plump white body with a black shoulder band, black legs and a
 * little white tail. A panda walks with a rolling, diagonal gait (front-left
 * with back-right, then the other pair), stops for a sit and a chew, and ambles
 * on again. A tap sends the pandas nearby into a surprised waddling run away
 * from it.
 */
import { SHARED_TUNING, type Animal, type Creature } from "../flock";
import { INK_BODY, INK_DARK, ink, type RGB } from "../ink";
import { rand, TAU } from "../math";
import { inEllipse, toSegment } from "./shapes";

interface Panda extends Creature {
  /** Walking (true) or sitting and chewing (false). */
  walking: boolean;
  /** When the current walk or rest ends. */
  until: number;
  /** Leg cycle phase. */
  gait: number;
  /** Head-bob phase while chewing. */
  chew: number;
  /** 0 calm → 1 startled (a quicker stride). */
  alarm: number;
  /** Bolting from a tap: which way, how fast at the start, and when it began. */
  fleeDir: number;
  fleeSpeed: number;
  fleeFrom: number;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  detail: 1.6,
  fog: 0.2,
  density: 1,
  sway: 0.02,
  spread: 0.15,
  farthest: 0.35,
  farBias: 1,
  grip: 2,
  separation: 500,
  trail: 0.9,
  trailFade: 0.5,
  shimmer: 0,
  sparkle: 0,
  amble: 1,
  rest: 1,
  stride: 1,
  scare: 0.8,
};

const FUR: RGB = [240, 237, 228];
/** Fur toward the edges of the body, so the white reads as round. */
const FUR_SHADE: RGB = [206, 203, 194];
const BLACK: RGB = [44, 44, 52];
const BLACK_SOFT: RGB = [62, 62, 72];
const NOSE: RGB = [20, 20, 24];
const EYE_GLINT: RGB = [246, 244, 238];

/** Hip and shoulder positions along the body (u), and how wide the legs sit (v). */
const SHOULDER_U = 0.06;
const HIP_U = -0.17;
const LEG_RADIUS = 0.052;

export const pandas: Animal<Panda> = {
  key: "pandas",
  label: "Panda",
  swatch: [244, 240, 224],
  defaults: DEFAULTS,
  controls: [
    [
      "Ambling",
      [
        { key: "amble", label: "Walk length", min: 0.2, max: 4, step: 0.05, hint: "How long each walk lasts before a sit-down." },
        { key: "rest", label: "Rest length", min: 0, max: 4, step: 0.05, hint: "How long they sit and chew between walks. 0 means they never stop." },
        { key: "stride", label: "Stride", min: 0.2, max: 3, step: 0.05, hint: "How fast the legs step for the same speed: low is long, lumbering steps." },
        { key: "scare", label: "Scare", min: 0, max: 3, step: 0.05, hint: "How fast and far pandas run when you tap near them. 0 and they don't mind." },
      ],
    ],
  ],
  area: 150000,
  scale: 1.1,
  speed: 42,
  trail: { light: [150, 150, 136], dark: [150, 158, 140] },

  create: (c) => ({
    ...c,
    walking: true,
    until: 0,
    gait: rand(0, TAU),
    chew: rand(0, TAU),
    alarm: 0,
    fleeDir: 0,
    fleeSpeed: 0,
    fleeFrom: 0,
  }),

  enter(c, flock) {
    // Mixed up on arrival, so a crowd isn't all walking or all sitting at once.
    c.walking = Math.random() < 0.75;
    c.until = flock.time + rand(0.5, 4);
  },

  update(c, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    const t = flock.time;
    if (t >= c.until) {
      c.walking = !c.walking || k.rest <= 0;
      c.until = t + (c.walking ? rand(2.5, 6) * k.amble : rand(1.5, 5) * k.rest);
    }
    const cruise = flock.cruise(c);
    const course = flock.heading + c.bias * k.spread;
    const fleeing = t < c.startledUntil;
    // Bolting: run away from the tap, easing back down as it calms.
    const calm = fleeing ? (t - c.fleeFrom) / (c.startledUntil - c.fleeFrom) : 1;
    flock.begin();
    if (fleeing) flock.steer(c, c.fleeDir, Math.max(cruise, c.fleeSpeed * (1 - calm * calm)), 6);
    else flock.steer(c, course, c.walking ? cruise : 0, k.grip * 1.5);
    flock.separate(c);
    const speed = flock.move(c, dt, fleeing ? Math.max(cruise * 2, c.fleeSpeed) : cruise * 1.4);
    if (flock.passed(c)) flock.reenter(c);

    if (speed > 3) flock.face(c, dt, fleeing ? 7 : 2.5);
    // One full leg cycle covers about a third of the panda's length.
    c.gait += (dt * speed * k.stride * TAU) / Math.max(8, c.span * 0.32) * (1 + 0.4 * c.alarm);
    c.chew += dt * (c.walking ? 0 : 7);
    c.alarm = Math.max(0, c.alarm - dt * 0.8);
  },

  startle(c, dx, dy, strength, flock) {
    const k = flock.tuning as typeof DEFAULTS;
    if (k.scare <= 0) return;
    // Away from the tap, a little scattered so a cluster fans out.
    c.fleeDir = Math.atan2(dy, dx) + rand(-0.3, 0.3);
    c.fleeSpeed = flock.cruise(c) * (2 + 2.5 * strength) * k.scare;
    c.fleeFrom = flock.time;
    c.startledUntil = flock.time + (0.9 + 1.2 * strength) * Math.sqrt(k.scare);
    c.vx = Math.cos(c.fleeDir) * c.fleeSpeed;
    c.vy = Math.sin(c.fleeDir) * c.fleeSpeed;
    c.walking = true;
    c.until = c.startledUntil + rand(0.5, 2);
    c.alarm = 1;
  },

  draw(c, pen) {
    const S = c.span;
    const out = pen.ink;
    const at = { x: 0, y: 0 };
    const sway = c.walking || c.alarm > 0 ? 0.07 * Math.sin(c.gait) : 0;
    const pose = { x: c.x, y: c.y, heading: c.heading + sway, span: S, depth: c.depth, id: c.id };

    // Chewing bobs the head; walking keeps it level.
    const bob = c.walking ? 0 : 0.012 * Math.sin(c.chew);
    const headU = 0.2 + bob;

    // Each leg is a capsule from its root on the body to a paw that swings forward and back.
    // Diagonal pairs step together: front-left with back-right, then the other pair.
    const legs: { rootU: number; rootV: number; pawU: number; pawV: number }[] = [];
    for (const side of [-1, 1]) {
      for (const front of [true, false]) {
        const ph = c.gait + (front ? 0 : Math.PI) + (side > 0 ? Math.PI : 0);
        const lift = Math.max(0, Math.sin(ph));
        const rootU = front ? SHOULDER_U : HIP_U;
        const swing = c.walking || c.alarm > 0 ? 0.06 * Math.cos(ph) : 0;
        const pawU = rootU + (front ? 0.04 : 0.0) + swing;
        const pawV = (0.27 + 0.012 * lift) * side;
        legs.push({ rootU, rootV: 0.14 * side, pawU, pawV });
        // A footprint each time a paw comes down.
        if (c.walking && lift < 0.05 && Math.cos(ph) > 0.9) {
          pen.toWorld(pose, pawU, pawV, at);
          pen.shed(at.x, at.y, 0.1 * c.depth);
        }
      }
    }

    pen.shape(pose, 0.52, (u, v) => {
      const av = Math.abs(v);

      // Nose, then eye patches, then ears: the small black features on the face.
      if (inEllipse(u, av, headU + 0.125, 0, 0.02, 0.028)) return ink(out, ...NOSE, INK_DARK);
      // Eye patches tilt out and down from the eyes, like teardrops.
      if (inEllipse(u, av, headU + 0.045, 0.066, 0.036, 0.03)) return ink(out, ...BLACK, INK_DARK);
      if (inEllipse(u, av, headU - 0.045, 0.118, 0.048, 0.048)) return ink(out, ...BLACK, INK_DARK);

      // Head: a wide round white face.
      const head = ((u - headU) / 0.14) ** 2 + (av / 0.15) ** 2;
      if (head <= 1) return ink(out, ...(head > 0.72 ? FUR_SHADE : FUR), INK_BODY);

      // Legs, black, over the edge of the body.
      for (const leg of legs) {
        const side = Math.sign(leg.pawV);
        if (v * side > 0 && toSegment(u, av, leg.rootU, Math.abs(leg.rootV), leg.pawU, Math.abs(leg.pawV)) < LEG_RADIUS) {
          return ink(out, ...BLACK_SOFT, INK_DARK);
        }
      }

      // Body: a plump white oval with a black band across the shoulders.
      const body = ((u + 0.07) / 0.25) ** 2 + (av / 0.2) ** 2;
      if (body <= 1) {
        if (u > 0.0 && u < 0.115 && body < 0.95) return ink(out, ...BLACK, INK_DARK);
        return ink(out, ...(body > 0.7 ? FUR_SHADE : FUR), INK_BODY);
      }

      // A short round tail.
      if (inEllipse(u, av, -0.325, 0, 0.032, 0.04)) return ink(out, ...FUR, INK_BODY);
      return false;
    });

    // Ears sit on top of the head's back edge: a round black cell on each side.
    const earV = 0.14;
    for (const side of [-1, 1]) {
      pen.toWorld(pose, headU - 0.075, earV * side, at);
      pen.spot(at.x, at.y, "●", BLACK_SOFT, BLACK, c.depth);
    }
    // Eyes: one small bright dot in each patch, kept about a cell apart so small pandas still get two.
    const eyeV = Math.min(0.1, Math.max(0.04, (pen.cw * 0.55) / S));
    for (const side of [-1, 1]) {
      pen.toWorld(pose, headU + 0.045, eyeV * side, at);
      pen.spot(at.x, at.y, "•", EYE_GLINT, BLACK, c.depth);
    }
  },
};
