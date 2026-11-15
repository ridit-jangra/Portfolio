"use client"

import { useEffect, useRef, useState } from "react";
import { AnimalEngine, AnimalKey, } from "./engine";
import { useTweaks } from "./tweaks";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<AnimalEngine | null>(null);
  const animalRef = useRef<AnimalKey>("butterflies");
  const tweaks = useTweaks(engine, "butterflies");
  const { setTuning } = tweaks;

  useEffect(() => {
    const instance = new AnimalEngine(canvasRef.current!, {
      animal: animalRef.current,
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
    setTuning("flutter", 1.2);
    setTuning("flapRate", 0.7);
    setTuning("corner", true);
    setTuning("corner", true);
    setTuning("flutter", 0)
    setTuning("sway", 0);
    setTuning("spread", 0);
    setTuning("separation", 0);
  }, [engine, setTuning]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 h-dvh w-full" />
    </>
  );
}
