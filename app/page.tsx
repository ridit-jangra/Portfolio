"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { Ascii } from "ascii.rest/react";
import { AnimalEngine, AnimalKey } from "./engine";
import { useTweaks } from "./tweaks";
import * as dissolve from "./components/greeting-dissolve";
import LiquidGlassFilter from "./components/LiquidGlassFilter";
import "./liquid.css";

const animal: AnimalKey = "butterflies";

const WORDS = [
  "hello", "hola", "ciao", "salut", "namaste", "ni hao", "marhaba",
  "nomoskar", "ola", "halo", "adaab", "privet", "hallo", "konnichiwa", "how far",
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<AnimalEngine | null>(null);
  const tweaks = useTweaks(engine, animal);
  const { setTuning } = tweaks;

  useEffect(() => {
    const instance = new AnimalEngine(canvasRef.current!, {
      animal,
      count: undefined,
      theme: "dark",
    });
    setEngine(instance);
    return () => {
      instance.destroy();
      setEngine(null);
    };
  }, []);

  useEffect(() => {
    if (!engine) return;
    setTuning("size", 1.9);
    setTuning("speed", 0.8);
    setTuning("density", 1.5);
    setTuning("flutter", 0);
    setTuning("flapRate", 0.7);
    setTuning("corner", true);
    setTuning("sway", 0);
    setTuning("spread", 0);
    setTuning("separation", 0);
    setTuning("grid", 0);
    setTuning("hueShift", 0);
  }, [engine, setTuning]);

  const helloPiece = useMemo(() => ({
    meta: dissolve.meta,
    default: (options: Parameters<typeof dissolve.default>[0]) =>
      dissolve.default({ ...options, scrollProgress: () => 0 }),
  }), []);
  const helloOptions = useMemo(() => ({ words: WORDS }), []);

  return (
    <>
      <LiquidGlassFilter refraction={tweaks.glass.refraction * 1.5} ripple={tweaks.glass.ripple} />
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-dvh w-full" />
      <main className="stage liquid fixed inset-0 z-10 flex h-dvh items-center justify-center overflow-hidden text-[#e8ebf7]">
        <div className="glass h-min w-min select-none p-0">
          <Ascii piece={helloPiece} style={{ fontSize: "clamp(4px, 1.25vw, 20px)", lineHeight: 1.2, margin: 0 }} options={helloOptions} />
        </div>
      </main>
    </>
  );
}
