/**
 * Candidate looks for animals being redesigned, shown one at a time, full
 * page, on compare.html?animal=<key> (a toggle switches between them): one
 * list per animal. Each candidate is an Animal with its own drawing, usually
 * spread from the real one.
 */
import type { Animal } from "../flock";

export interface Candidate {
  animal: Animal<any>;
  note: string;
}

/** Empty between redesigns; add a set here (e.g. `crabs: CRAB_CANDIDATES`) to compare looks. */
export const CANDIDATES: Record<string, Candidate[]> = {};
