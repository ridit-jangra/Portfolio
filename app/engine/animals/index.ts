import type { Animal } from "../flock";
import { butterflies } from "./butterflies";
import { crabs } from "./crabs";
import { cranes } from "./cranes";
import { dragonflies } from "./dragonflies";
import { frogs } from "./frogs";
import { jellyfish } from "./jellyfish";
import { koi } from "./koi";

/** Every animal, in the order the choices show them. */
export const ANIMALS = {
  butterflies,
  koi,
  jellyfish,
  dragonflies,
  frogs,
  cranes,
  crabs,
} satisfies Record<string, Animal>;

export type AnimalKey = keyof typeof ANIMALS;

export const ANIMAL_KEYS = Object.keys(ANIMALS) as AnimalKey[];
