"use client"

import { useEffect, useRef, useState } from "react";
import { AnimalEngine, AnimalKey, } from "./engine";
import { useTweaks } from "./tweaks";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import LiquidGlassFilter from "./components/LiquidGlassFilter";
import "./liquid.css";

const animal: AnimalKey =  "butterflies"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<AnimalEngine | null>(null);
  const animalRef = useRef<AnimalKey>(animal);
  const tweaks = useTweaks(engine, animal);
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
    setTuning("grid", 0);
    setTuning("hueShift", 0);
  }, [engine, setTuning]);

  useEffect(() => {
    if (!engine) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      engine.set("scrollDissolve", Math.max(0, Math.min(1,
        window.scrollY / Math.max(1, window.innerHeight * 0.65))));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [engine]);

  return (
    <>
      <LiquidGlassFilter refraction={tweaks.glass.refraction * 1.5} ripple={tweaks.glass.ripple} />
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-dvh w-full" />
      <main className="stage liquid relative z-10 min-h-[180dvh] text-[#e8ebf7]">
        <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
          <Hero />
        </div>
      </main>
      {/*<Footer />*/}
    </>
  );
}
