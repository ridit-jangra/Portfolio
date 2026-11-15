/**
 * What a sampled point is made of. Shape functions write an Ink; the pen
 * turns it into a cell: a block of colour with a glyph on top, or a bare glyph.
 */

export type RGB = [number, number, number];

/** Ordinary skin, scales or feathers: a block of colour with a sparse-to-dense glyph. */
export const INK_SCALE = 0;
/** Dark veins, margins, patches: a block with a dense glyph. */
export const INK_DARK = 1;
/** Small bright dots: margin spots, eyes, pupils. */
export const INK_SPOT = 2;
/** Iridescent: brightness rolls across it as the animal turns, and it sparkles more. */
export const INK_SHIMMER = 3;
/** See-through: a faint block that mostly lets the background show, with a glyph in full colour. */
export const INK_GLASS = 4;
/** Light without substance: a bare glyph, no block. */
export const INK_GLOW = 5;
/** Fuzzy bodies: a block with a heavy glyph. */
export const INK_BODY = 6;
/** Lit from within: a deep block of the colour with a bright, nearly white glyph. Made for glowing on dark. */
export const INK_LIT = 7;

export interface Ink {
  r: number;
  g: number;
  b: number;
  kind: number;
  /** Glyphs to use instead of the kind's own set; null for the default. */
  glyphs: string | null;
  /**
   * Body-anchored coordinates (fractions of span) that seed the glyph texture
   * and shimmer, so they ride along with the animal. The pen presets them to
   * the sample's (u, v); bendy animals overwrite them with their own.
   */
  au: number;
  av: number;
}

/** Fill in an Ink. Returns true, so a sampler can `return ink(...)` on a hit. */
export function ink(out: Ink, r: number, g: number, b: number, kind = INK_SCALE, glyphs: string | null = null): true {
  out.r = r;
  out.g = g;
  out.b = b;
  out.kind = kind;
  out.glyphs = glyphs;
  return true;
}
