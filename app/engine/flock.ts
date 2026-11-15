/**
 * The shared world every animal lives in: a population that crosses the
 * screen along one course, re-entering upstream once it leaves downstream.
 *
 * Size stands in for distance. Each creature gets a fixed random roll that
 * maps to a depth (0 far → 1 near) through the current tuning; depth scales
 * its size and speed (parallax) and how far it fades into the background.
 * The list stays sorted far → near, so near creatures draw over far ones.
 *
 * What an animal does with that (flap, leap, pulse, scuttle, school) lives in
 * its Animal definition; the helpers here cover the steering they share.
 */
import type { RGB } from "./ink";
import { angleDiff, clamp, rand } from "./math";
import type { Pen } from "./renderer";

export interface Creature {
  id: number;
  /** Fixed per creature; depth is derived from it with the current tuning. */
  roll: number;
  /** 0 far / faded → 1 near / vivid. */
  depth: number;
  /** Size of this creature in px (wingspan, body length…: whatever its shape is measured in). */
  span: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  /** Personal deviation from the course, -1 → 1 (scaled by tuning.spread). */
  bias: number;
  startledUntil: number;
  /** Removed from the flock; anyone holding a reference should let go. */
  gone: boolean;
}

/** Knobs every animal has. Each animal's defaults start from these and add its own. */
export const SHARED_TUNING = {
  // Movement
  /** Individuals per screen, relative to the area-based default. */
  density: 1,
  /** Cross corner to corner (bottom-left → top-right) whatever the screen shape. */
  corner: false,
  /** Course in degrees when not corner to corner: 0 → right, 90 → up. */
  direction: 49,
  speed: 1,
  /** How far the whole stream sways off course, radians. */
  sway: 0.04,
  /** How far each individual's own course can differ from the stream's, radians. */
  spread: 0.06,
  /** Size multiplier. */
  size: 1,
  /** Depth of the farthest individuals (1 = everyone equally near). */
  farthest: 0.45,
  /** >1 puts more of the population far away; <1 brings it close. */
  farBias: 1.6,
  /** How tightly individuals hold their course. */
  grip: 2,
  /** Push between neighbours at the same depth. */
  separation: 300,

  // Look
  /**
   * Turns the animal's colours around the colour wheel, degrees. For trying colours out: each
   * animal's own colour is fixed in its file. (Named hueShift so shifts saved by the old Hue knob
   * don't come back.)
   */
  hueShift: 0,
  /** Strength of the iridescent brightness roll. */
  shimmer: 0.3,
  /** Chance a shimmering cell flashes white; plain ones get a third of it. */
  sparkle: 0.12,
  /** How much the farthest individuals fade into the background. */
  fog: 0.75,
  /** How much they leave in the trail. */
  trail: 1,
  /** How fast the trail fades, per second. */
  trailFade: 1.3,
  /** Grid line strength. */
  grid: 1.05,
  /** ASCII resolution: higher means smaller cells. */
  detail: 1.3,
};

export type SharedTuning = typeof SHARED_TUNING;
export type Tuning = SharedTuning & Record<string, number | boolean>;

/** A slider (or, with toggle, a switch) in the tweak panel; hint explains it in a tooltip. */
export type KnobSpec =
  | { key: string; label: string; min: number; max: number; step: number; hint: string; disabledWhen?: string }
  | { key: string; label: string; toggle: true; hint: string };

export type ControlGroup = [title: string, knobs: KnobSpec[]];

export const SHARED_CONTROLS: { movement: KnobSpec[]; look: KnobSpec[] } = {
  movement: [
    { key: "density", label: "Density", min: 0.1, max: 4, step: 0.05, hint: "How many are on screen." },
    { key: "corner", label: "Corner to corner", toggle: true, hint: "Cross from the bottom-left corner to the top-right, whatever the window's shape. Turn off to set Direction yourself." },
    { key: "direction", label: "Direction (°)", min: 0, max: 360, step: 1, disabledWhen: "corner", hint: "Which way they travel, in degrees: 0 is right, 90 is up. Only used when Corner to corner is off." },
    { key: "speed", label: "Speed", min: 0.1, max: 3, step: 0.05, hint: "How fast they travel." },
    { key: "sway", label: "Sway", min: 0, max: 0.6, step: 0.01, hint: "How much the whole group slowly drifts left and right off course. 0 is a dead-straight line." },
    { key: "spread", label: "Spread", min: 0, max: 0.8, step: 0.01, hint: "How far each one's own path can stray from the group's. 0 means everyone keeps exactly the same line." },
    { key: "size", label: "Size", min: 0.3, max: 2.5, step: 0.05, hint: "How big they are." },
    { key: "farthest", label: "Farthest depth", min: 0.1, max: 1, step: 0.01, hint: "How small and faint the farthest ones get. 1 makes them all equally close." },
    { key: "farBias", label: "Far bias", min: 0.3, max: 3, step: 0.05, hint: "How many sit far away versus close. Higher puts more of them in the distance." },
    { key: "grip", label: "Hold course", min: 0.2, max: 5, step: 0.05, hint: "How hard they steer back onto course after drifting. Higher is stricter." },
    { key: "separation", label: "Separation", min: 0, max: 1000, step: 10, hint: "How strongly neighbours keep their distance from each other." },
  ],
  look: [
    { key: "hueShift", label: "Hue shift (°)", min: -180, max: 180, step: 1, hint: "Turns the animal's colour around the colour wheel, in degrees. Find one you like and tell me the number to make it permanent." },
    { key: "shimmer", label: "Shimmer", min: 0, max: 1, step: 0.01, hint: "How much iridescent surfaces roll brighter and darker as the animal turns." },
    { key: "sparkle", label: "Sparkle", min: 0, max: 0.5, step: 0.01, hint: "How often cells flash white, like light catching scales or wings." },
    { key: "fog", label: "Distance fade", min: 0, max: 1, step: 0.01, hint: "How much far-away ones fade into the background." },
    { key: "trail", label: "Trail", min: 0, max: 4, step: 0.05, hint: "How much they leave behind: scales, ripples, footprints or glow." },
    { key: "trailFade", label: "Trail fade", min: 0.05, max: 6, step: 0.05, hint: "How quickly that trail fades. Lower lingers longer." },
    { key: "grid", label: "Grid", min: 0, max: 4, step: 0.05, hint: "How visible the background grid lines are." },
    { key: "detail", label: "ASCII detail", min: 0.5, max: 2, step: 0.05, hint: "ASCII resolution. Higher means smaller characters and finer animals." },
  ],
};

export interface Animal<C extends Creature = Creature> {
  key: string;
  /** Name in the animal choices. */
  label: string;
  /** Its defining colour, for its dot in the animal choices. Every animal has its own. */
  swatch: RGB;
  defaults: Tuning;
  /** This animal's own knobs, shown between Movement and Look. */
  controls: ControlGroup[];
  /** Shared knobs that do nothing for this animal. */
  hide?: (keyof SharedTuning)[];
  /** Screen area per individual at density 1 on a laptop-sized screen (see REFERENCE_SIZE), px². */
  area: number;
  /** Most individuals the flock will hold. */
  max?: number;
  /** Size of the nearest at size 1, relative to the shared base (a fifth of the screen's short side). */
  scale: number;
  /** Cruising speed of the nearest at speed 1, px/s. */
  speed: number;
  /** Trail colour per theme. */
  trail: { light: RGB; dark: RGB };

  /** Add this animal's own fields to a fresh creature. */
  create(c: Creature, flock: Flock<C>): C;
  /** A creature has just been placed at the upstream edge (or anywhere, when seeding). */
  enter?(c: C, flock: Flock<C>): void;
  /** Once per step, before any individual moves. */
  prepare?(flock: Flock<C>, dt: number): void;
  update(c: C, flock: Flock<C>, dt: number): void;
  /** Take the click itself (e.g. dropping food), instead of startling the creatures near it. */
  tap?(x: number, y: number, flock: Flock<C>): void;
  /** React to a click; (dx, dy) points away from it and strength fades 1 → 0 with distance. */
  startle?(c: C, dx: number, dy: number, strength: number, flock: Flock<C>): void;
  /** Draw one creature. */
  draw?(c: C, pen: Pen, flock: Flock<C>): void;
  /** Draw the whole flock at once instead, for animals drawn as a crowd. */
  drawAll?(flock: Flock<C>, pen: Pen): void;
}

export interface WorldEvent {
  x: number;
  y: number;
  /** In cells. */
  radius: number;
  amount: number;
}

const STARTLE_RADIUS = 240;
/**
 * Size of the nearest individuals (before an animal's own scale) on a laptop-sized screen, about
 * 800px on the short side, px. Populations are tuned at this size; smaller screens draw everyone
 * smaller and spawn more to cover the same share of the screen.
 */
const REFERENCE_SIZE = 160;

export class Flock<C extends Creature = Creature> {
  width = 0;
  height = 0;
  time = 0;
  creatures: C[] = [];
  events: WorldEvent[] = [];
  /** Size of the nearest individuals at size 1, px. */
  base = 120;
  /** Scratch acceleration the steering helpers add into. */
  readonly acc = { x: 0, y: 0 };

  private nextId = 1;

  /** count pins the population, overriding tuning.density. */
  constructor(readonly animal: Animal<C>, readonly tuning: Tuning, private count?: number) {}

  resize(width: number, height: number) {
    const first = this.width === 0;
    this.width = width;
    this.height = height;
    this.base = clamp(Math.min(width, height) * 0.2, 80, 190) * this.animal.scale;
    if (first) this.populate(true);
  }

  /** Course in radians (screen space, y down). */
  get course() {
    const k = this.tuning;
    return k.corner ? Math.atan2(-this.height, this.width) : (-k.direction * Math.PI) / 180;
  }

  /** The course with the whole stream's slow sway applied. */
  get heading() {
    const t = this.time;
    return this.course + this.tuning.sway * (Math.sin(t * 0.13) + 0.5 * Math.sin(t * 0.31 + 1.7));
  }

  /**
   * How many to keep on screen. By how much of the screen they cover, not by raw area: on a small
   * screen each one draws smaller (see base), so more of them spawn to make up for it, and a phone
   * looks as lively as a laptop. `area` is screen area per individual at the reference size.
   */
  get target() {
    const { width: W, height: H, animal } = this;
    const shrink = (this.base / animal.scale / REFERENCE_SIZE) ** 2;
    return this.count ?? clamp(Math.round(((W * H) / (animal.area * shrink)) * this.tuning.density), 1, animal.max ?? 200);
  }

  depthOf(roll: number) {
    const k = this.tuning;
    return k.farthest + (1 - k.farthest) * Math.pow(roll, k.farBias);
  }

  /** Parallax: far individuals cover less screen per second. */
  cruise(c: Creature) {
    return this.animal.speed * (0.55 + 0.45 * c.depth) * this.tuning.speed;
  }

  /** Click: everything nearby reacts, then rejoins the stream (or the animal takes the tap itself). */
  startle(x: number, y: number) {
    if (this.animal.tap) {
      this.animal.tap(x, y, this);
      return;
    }
    this.events.push({ x, y, radius: 6, amount: 1.4 });
    for (const c of this.creatures) {
      const dx = c.x - x;
      const dy = c.y - y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > STARTLE_RADIUS) continue;
      const strength = 1 - d / STARTLE_RADIUS;
      if (this.animal.startle) {
        this.animal.startle(c, dx / d, dy / d, strength, this);
      } else {
        const k = strength * 420 * c.depth;
        c.vx += (dx / d) * k;
        c.vy += (dy / d) * k;
        c.startledUntil = this.time + rand(0.6, 1.2);
      }
    }
  }

  step(dt: number) {
    this.time += dt;
    this.populate(false);
    for (const c of this.creatures) {
      c.depth = this.depthOf(c.roll);
      c.span = this.base * c.depth * this.tuning.size;
    }
    this.animal.prepare?.(this, dt);
    for (const c of this.creatures) this.animal.update(c, this, dt);
  }

  /** Add or remove individuals until the population matches the tuning. */
  private populate(scatter: boolean) {
    const target = this.target;
    while (this.creatures.length > target) {
      const [c] = this.creatures.splice(Math.floor(Math.random() * this.creatures.length), 1);
      c.gone = true;
    }
    while (this.creatures.length < target) {
      const c = this.spawn();
      if (scatter || Math.random() < 0.5) {
        // Seeding (or growing the flock): drop it in anywhere so the screen fills at once.
        c.x = rand(0, this.width);
        c.y = rand(0, this.height);
        this.animal.enter?.(c, this);
      }
      this.insert(c);
    }
  }

  /** Keep farther individuals first so the near ones draw over them. */
  insert(c: C) {
    const at = this.creatures.findIndex((o) => o.roll > c.roll);
    this.creatures.splice(at < 0 ? this.creatures.length : at, 0, c);
  }

  private spawn(): C {
    const base: Creature = {
      id: this.nextId++,
      roll: Math.random(),
      depth: 1,
      span: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      heading: 0,
      bias: 0,
      startledUntil: 0,
      gone: false,
    };
    base.depth = this.depthOf(base.roll);
    base.span = this.base * base.depth * this.tuning.size;
    const c = this.animal.create(base, this);
    this.reenter(c);
    return c;
  }

  /** Bring a creature back in from the upstream edges, spread evenly across the flow. */
  reenter(c: C) {
    const { width: W, height: H, course } = this;
    const m = c.span * 0.6;
    const cos = Math.cos(course);
    const sin = Math.sin(course);
    // Upstream edges: the side the stream comes from, weighted by how much of it crosses each.
    const sideways = H * Math.abs(cos);
    const vertical = W * Math.abs(sin);
    if (Math.random() * (sideways + vertical) < sideways) {
      c.x = cos >= 0 ? -m : W + m;
      c.y = rand(0, H);
    } else {
      c.x = rand(0, W);
      c.y = sin <= 0 ? H + m : -m;
    }
    const cruise = this.cruise(c);
    c.heading = course;
    c.vx = cos * cruise;
    c.vy = sin * cruise;
    c.bias = rand(-1, 1);
    this.animal.enter?.(c, this);
  }

  /** Past the downstream edges (done crossing), or lost far off any edge. */
  passed(c: Creature, margin = c.span) {
    const { width: W, height: H, course } = this;
    const cos = Math.cos(course);
    const sin = Math.sin(course);
    const out =
      (cos > 0.05 && c.x > W + margin) || (cos < -0.05 && c.x < -margin) ||
      (sin < -0.05 && c.y < -margin) || (sin > 0.05 && c.y > H + margin);
    const lost = c.x < -3 * margin || c.x > W + 3 * margin || c.y < -3 * margin || c.y > H + 3 * margin;
    return out || lost;
  }

  // ── steering helpers: each adds into this.acc ─────────────────────

  /** Clear the scratch acceleration. */
  begin() {
    this.acc.x = 0;
    this.acc.y = 0;
    return this.acc;
  }

  /** Pull the velocity toward `speed` along `dir`, as hard as `grip`. */
  steer(c: Creature, dir: number, speed: number, grip: number) {
    this.acc.x += (Math.cos(dir) * speed - c.vx) * grip;
    this.acc.y += (Math.sin(dir) * speed - c.vy) * grip;
  }

  /** Push away from neighbours at about the same depth, within `range` × their combined size. */
  separate(c: Creature, strength = this.tuning.separation, range = 0.42) {
    if (strength <= 0) return;
    for (const o of this.creatures) {
      if (o === c || Math.abs(o.depth - c.depth) > 0.18) continue;
      const ox = c.x - o.x;
      const oy = c.y - o.y;
      const d = Math.hypot(ox, oy);
      const r = (c.span + o.span) * range;
      if (d < r && d > 1e-3) {
        const w = (1 - d / r) * strength;
        this.acc.x += (ox / d) * w;
        this.acc.y += (oy / d) * w;
      }
    }
  }

  /** Apply this.acc, cap the speed (startled creatures may go faster), move. Returns the speed. */
  move(c: Creature, dt: number, max: number) {
    c.vx += this.acc.x * dt;
    c.vy += this.acc.y * dt;
    let speed = Math.hypot(c.vx, c.vy);
    const cap = max + (this.time < c.startledUntil ? 300 : 0);
    if (speed > cap) {
      c.vx *= cap / speed;
      c.vy *= cap / speed;
      speed = cap;
    }
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    return speed;
  }

  /** Turn to face the direction of travel, at most `rate` rad/s. */
  face(c: Creature, dt: number, rate = 7, angle = Math.atan2(c.vy, c.vx)) {
    const turn = rate * dt;
    c.heading += clamp(angleDiff(c.heading, angle), -turn, turn);
  }
}
