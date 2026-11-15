import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ANIMALS } from "./engine";
import type { AnimalEngine, AnimalKey, Tuning } from "./engine";

export type TuningValue = number | boolean;

export interface GlassSettings {
  blur: number;
  refraction: number;
  ripple: number;
  tint: number;
  edge: number;
  radius: number;
  width: number;
}

export const GLASS_DEFAULTS: GlassSettings = {
  blur: 3.5,
  refraction: 40,
  ripple: 0.007,
  tint: 0,
  edge: 0.55,
  radius: 24,
  width: 720,
};

export const STORAGE_PREFIX = "ascii-animals:";
export const tweaksKey = (animal: AnimalKey) => `${STORAGE_PREFIX}tweaks:${animal}`;

interface SavedTweaks {
  tuning?: Partial<Tuning>;
  glass?: Partial<GlassSettings>;
}

function readJSON(key: string): SavedTweaks {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}") as SavedTweaks;
  } catch {
    return {};
  }
}

// Only the values that differ from their defaults are stored.
function diff<T extends object>(current: T, defaults: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(defaults) as (keyof T)[]) {
    if (current[k] !== defaults[k]) out[k] = current[k];
  }
  return out;
}

export interface Tweaks {
  glass: GlassSettings;
  tuning: Tuning;
  setTuning(name: string, value: TuningValue): void;
  setGlassValue(name: keyof GlassSettings, value: number): void;
  resetAll(): void;
  exportJSON(): string;
}

/**
 * Per-animal tuning (lives on the engine) plus the "chat glass" settings (React state),
 * both persisted to localStorage under one key per animal.
 */
export function useTweaks(engine: AnimalEngine | null, animal: AnimalKey): Tweaks {
  const [glass, setGlass] = useState<GlassSettings>(GLASS_DEFAULTS);
  const glassRef = useRef<GlassSettings>(glass);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const key = tweaksKey(animal);
  const defaults = ANIMALS[animal].defaults;

  // Load saved settings whenever the engine or the animal changes.
  useEffect(() => {
    if (!engine) return;
    const saved = readJSON(key);
    for (const [k, v] of Object.entries(saved.tuning ?? {})) {
      if (k in defaults && v !== undefined) engine.set(k, v);
    }
    const g = { ...GLASS_DEFAULTS, ...saved.glass };
    glassRef.current = g;
    setGlass(g);
    rerender();
  }, [engine, animal, key, defaults]);

  const snapshot = (): SavedTweaks => ({
    tuning: diff(engine!.tuning, defaults),
    glass: diff(glassRef.current, GLASS_DEFAULTS),
  });

  const persist = () => {
    try {
      localStorage.setItem(key, JSON.stringify(snapshot()));
    } catch {
      /* storage unavailable */
    }
  };

  const setTuning = useCallback((name: string, value: TuningValue) => {
    if (!engine || engine.tuning[name] === value) return;
    engine.set(name, value);
    try {
      localStorage.setItem(key, JSON.stringify({
        tuning: diff(engine.tuning, defaults),
        glass: diff(glassRef.current, GLASS_DEFAULTS),
      }));
    } catch {
      /* storage unavailable */
    }
    rerender();
  }, [engine, key, defaults]);

  return {
    glass,
    tuning: engine?.tuning ?? defaults,

    setTuning,

    setGlassValue(name, value) {
      const g = { ...glassRef.current, [name]: value };
      glassRef.current = g;
      setGlass(g);
      persist();
    },

    resetAll() {
      for (const k of Object.keys(defaults)) engine!.set(k, defaults[k]);
      glassRef.current = GLASS_DEFAULTS;
      setGlass(GLASS_DEFAULTS);
      try {
        localStorage.removeItem(key);
      } catch {
        /* storage unavailable */
      }
      rerender();
    },

    exportJSON: () => JSON.stringify(snapshot(), null, 2),
  };
}
