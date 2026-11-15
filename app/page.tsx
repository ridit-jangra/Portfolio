"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Ascii } from "ascii.rest/react";
import { AnimalEngine, AnimalKey } from "./engine";
import { useTweaks } from "./tweaks";
import * as dissolve from "./components/greeting-dissolve";
import { projects } from "./projects";
import LiquidGlassFilter from "./components/LiquidGlassFilter";
import "./liquid.css";

const animal: AnimalKey = "butterflies";

const BUTTERFLY_TUNING = {
  size: 1.9, speed: 0.8, density: 1.5, flutter: 0, flapRate: 0.7, corner: true,
  sway: 0, spread: 0, separation: 0, grid: 0, hueShift: 0,
};
// Cranes get the same tweaks, except hueShift so they keep their own colours.
const CRANE_TUNING = Object.fromEntries(
  Object.entries(BUTTERFLY_TUNING).filter(([key]) => key !== "hueShift"),
);

// One fixed screen. A scroll / swipe / key press plays a timed transition (no page scroll):
// 0 → 0.5 dissolves the hello + butterflies, 0.5 → 1 un-dissolves the cranes.
const TRANSITION_MS = 2600;
// The projects shown on the cranes screen, in order. Scroll / swipe / arrows step through them;
// each name is drawn top-left with the same dissolve piece as the hello.
const SHOWN = ["Meridia", "Milo", "Pixl", "Ink", "EcliSystems"].map((n) => projects.find((p) => p.name === n)!);
const SWITCH_MS = 1100; // dissolve out → swap → un-dissolve in
const WORDS = [
  "hello", "hola", "ciao", "salut", "namaste", "ni hao", "marhaba",
  "nomoskar", "ola", "halo", "adaab", "privet", "hallo", "konnichiwa", "how far",
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const nameEl = useRef<HTMLDivElement>(null);
  const descEl = useRef<HTMLParagraphElement>(null);
  const previewEl = useRef<HTMLDivElement>(null);
  const actionsEl = useRef<HTMLElement>(null);
  const nameBox = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const nameProgress = useRef(1); // 1 = dissolved; un-dissolves with the cranes
  const [engine, setEngine] = useState<AnimalEngine | null>(null);
  const animalRef = useRef<AnimalKey>(animal);
  const shownRef = useRef<AnimalKey>(animal);
  const helloProgress = useRef(0); // read by the hello dissolve piece each frame
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
    setTuning("flutter", 0);
    setTuning("flapRate", 0.7);
    setTuning("corner", true);
    setTuning("sway", 0);
    setTuning("spread", 0);
    setTuning("separation", 0);
    setTuning("grid", 0);
    setTuning("hueShift", 0);
  }, [engine, setTuning]);

  // Transition driver: t eases toward the target screen (0 = hello, 1 = cranes); reversible mid-way.
  useEffect(() => {
    if (!engine) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let t = 0, target = 0, frame = 0, last = 0;
    let sw = 0, swTo = 0, swapped = false; // project switch: 0 = idle, 0..1 = dissolve out (<.5) then in

    const apply = () => {
      const out = Math.min(1, t / 0.5);
      const back = Math.min(1, Math.max(0, (t - 0.5) / 0.5));
      const level = out * (1 - back);
      // Swap species while the field is fully dissolved.
      const want: AnimalKey = t > 0.5 ? "cranes" : "butterflies";
      if (want !== shownRef.current) {
        shownRef.current = want;
        engine.setAnimal(want, { ...(want === "butterflies" ? BUTTERFLY_TUNING : CRANE_TUNING), scrollDissolve: level });
      }
      engine.set("scrollDissolve", level);
      helloProgress.current = out;
      if (box.current) {
        // the glass box belongs to the cranes screen: it fades in with them
        box.current.style.opacity = String(back);
        box.current.style.visibility = back > 0 ? "visible" : "hidden";
      }
      const swOut = sw === 0 ? 0 : sw < 0.5 ? sw / 0.5 : (1 - sw) / 0.5; // 1 while a project is fully dissolved
      const fade = 1 - swOut;
      nameProgress.current = Math.max(1 - back, swOut);
      if (nameEl.current) nameEl.current.style.visibility = back > 0 ? "visible" : "hidden";
      const late = String(Math.max(0, (back - 0.7) / 0.3) * fade); // preview + buttons appear last
      if (previewEl.current) previewEl.current.style.opacity = late;
      if (actionsEl.current) actionsEl.current.style.setProperty("--last", late);
      nameEl.current?.style.setProperty("--vis", String(back * fade));
      if (descEl.current) descEl.current.style.opacity = String(Math.max(0, (back - 0.5) * 2) * fade); // fades in once the name has formed
      if (surface.current) {
        surface.current.style.backdropFilter = out >= 1 ? "none" : "";
        surface.current.style.visibility = out >= 1 ? "hidden" : "visible";
      }
    };
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const step = dt / TRANSITION_MS;
      t = target > t ? Math.min(target, t + step) : Math.max(target, t - step);
      if (sw > 0) {
        sw += dt / SWITCH_MS;
        if (sw >= 0.5 && !swapped) { swapped = true; indexRef.current = swTo; setIndex(swTo); }
        if (sw >= 1) sw = 0;
      }
      apply();
      frame = t === target && sw === 0 ? 0 : requestAnimationFrame(tick);
    };
    const run = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); } };
    const setTarget = (to: 0 | 1) => {
      target = to;
      if (reduce.matches) { t = to; apply(); return; }
      run();
    };
    const switchTo = (n: number) => {
      swTo = n; swapped = false;
      if (reduce.matches) { indexRef.current = n; setIndex(n); return; }
      sw = 0.0001;
      run();
    };
    // dir 1 = forward (hello → cranes → next project), -1 = back
    const go = (dir: 1 | -1) => {
      if (sw > 0) return; // mid project switch
      const idx = indexRef.current;
      if (dir === 1) {
        if (target === 0) setTarget(1);
        else if (t === 1 && idx < SHOWN.length - 1) switchTo(idx + 1);
      } else if (target === 1) {
        if (idx === 0) setTarget(0);
        else if (t === 1) switchTo(idx - 1);
      }
    };

    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaY) > 4) go(e.deltaY > 0 ? 1 : -1); };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      const d = touchY - e.touches[0].clientY;
      if (Math.abs(d) > 24) { go(d > 0 ? 1 : -1); touchY = e.touches[0].clientY; }
    };
    const onKey = (e: KeyboardEvent) => {
      // TUI keybinds on the cranes screen: g → GitHub, l → live demo
      const project = SHOWN[indexRef.current];
      if (!e.metaKey && !e.ctrlKey && !e.altKey && Number(actionsEl.current?.style.getPropertyValue("--last")) > 0.9) {
        if (e.key === "g" && project.repo) window.open(project.repo, "_blank", "noreferrer");
        if (e.key === "l" && project.website) window.open(project.website, "_blank", "noreferrer");
      }
      if (["ArrowDown", "PageDown", " ", "End"].includes(e.key)) go(1);
      else if (["ArrowUp", "PageUp", "Home"].includes(e.key)) go(-1);
    };
    // Pre-warm the cranes (sprites, flock, first draw) while the canvas is fully dissolved,
    // so the mid-transition swap has no first-time hitch.
    let warm1 = 0, warm2 = 0;
    engine.setAnimal("cranes", { ...CRANE_TUNING, scrollDissolve: 1 });
    warm1 = requestAnimationFrame(() => {
      warm2 = requestAnimationFrame(() => {
        engine.setAnimal("butterflies", { ...BUTTERFLY_TUNING, scrollDissolve: 1 });
        apply();
      });
    });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(warm1);
      cancelAnimationFrame(warm2);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [engine]);

  const project = SHOWN[index];
  const links = [project.repo, project.website].filter(Boolean);
  const helloPiece = useMemo(() => ({
    meta: dissolve.meta,
    default: (options: Parameters<typeof dissolve.default>[0]) =>
      dissolve.default({ ...options, scrollProgress: () => helloProgress.current }),
  }), []);
  useEffect(() => {
    // Size the name box to the letters' ink so its halo hugs them. The piece draws a frame after
    // mount, so retry until it has real width; never apply a tiny width (it would clip the name).
    let raf = 0, tries = 0;
    const fit = () => {
      const box = nameBox.current, pre = box?.firstElementChild as HTMLElement | null;
      if (!box) return;
      // width of one monospace cell, from the pre's own font (its text may be trimmed, so don't measure the box)
      let cell = 0;
      if (pre) {
        const cs = getComputedStyle(pre);
        const ctx = document.createElement("canvas").getContext("2d");
        if (ctx) { ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; cell = ctx.measureText("M").width; }
      }
      const w = cell * dissolve.meta.cols;
      if (w < 50) {
        box.style.width = "";
        if (tries++ < 120) raf = requestAnimationFrame(fit);
        return;
      }
      box.style.width = `${(w * dissolve.wordCols(project.name)) / dissolve.meta.cols}px`;
    };
    tries = 0;
    fit();
    const onResize = () => { tries = 0; cancelAnimationFrame(raf); fit(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [project.name]);

  const helloOptions = useMemo(() => ({ words: WORDS }), []);
  const namePiece = useMemo(() => ({
    meta: dissolve.meta,
    default: (options: Parameters<typeof dissolve.default>[0]) =>
      dissolve.default({ ...options, scrollProgress: () => nameProgress.current, align: "start" }),
  }), []);
  const nameOptions = useMemo(() => ({ words: [project.name.toLowerCase()] }), [project.name]);

  return (
    <>
      <LiquidGlassFilter refraction={tweaks.glass.refraction * 1.5} ripple={tweaks.glass.ripple} />
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 h-dvh w-full" />
      <main className="stage liquid fixed inset-0 z-10 flex h-dvh items-center justify-center overflow-hidden text-[#e8ebf7]">
        <div ref={surface} className="glass h-min w-min select-none p-0">
          <Ascii piece={helloPiece} style={{ fontSize: "clamp(4px, 1.25vw, 20px)", lineHeight: 1.2, margin: 0 }} options={helloOptions} />
        </div>
        <div
          ref={box}
          aria-hidden="true"
          className="glass glass-box"
          style={{ opacity: 0, visibility: "hidden" }}
        />
        <div ref={nameEl} className="pointer-events-none absolute inset-0 flex flex-col p-4 select-none" style={{ visibility: "hidden" }} aria-label={project.name}>
          {/* header: name + description share one halo that hugs the letters */}
          <div className="relative isolate w-fit">
            <div className="text-halo" style={{ opacity: "var(--vis, 0)" }} aria-hidden="true" />
            {/* the piece's frame is 13 rows but the letters fill ~8, so crop the empty rows below */}
            <div ref={nameBox} style={{ ["--fs" as string]: "clamp(3px, 0.85vw, 14px)", fontSize: "var(--fs)", height: "calc(var(--fs) * 1.2 * 9.5)", overflow: "hidden" }}>
              {/* keyed so each project gets a fresh piece that un-dissolves into its own name */}
              <Ascii key={project.name} piece={namePiece} style={{ fontSize: "var(--fs)", lineHeight: 1.2, margin: 0 }} options={nameOptions} />
            </div>
            <p
              ref={descEl}
              className="m-0 mt-1 max-w-[min(110ch,70vw)] text-[12px] leading-relaxed text-white/65"
              style={{ fontFamily: "var(--font-jetbrains), ui-monospace, monospace", opacity: 0 }}
            >
              {project.description}
            </p>
          </div>
          {/* every preview is mounted so switching never waits on an image load */}
          <div
            ref={previewEl}
            className={`relative -mx-4 mt-4 min-h-0 flex-1 overflow-hidden ${links.length ? "" : "-mb-4"}`} /* bleeds past the 1rem padding: edge to edge */
            style={{ opacity: 0 }}
          >
            {SHOWN.map((p, i) => p.image && (
              <Image key={p.name} src={p.image} alt={`${p.name} preview`} fill sizes="100vw" priority className="object-cover object-top-left" style={{ opacity: i === index ? 1 : 0 }} />
            ))}
          </div>
          {links.length > 0 && (
            <nav ref={actionsEl} className="pointer-events-auto -mx-4 -mb-4 mt-3 grid text-[13px]" style={{ gridTemplateColumns: `repeat(${links.length}, 1fr)`, fontFamily: "var(--font-jetbrains), ui-monospace, monospace" }}>
              {project.repo && (
                <a className="btn-tui relative isolate block" href={project.repo} target="_blank" rel="noreferrer">
                  <span className="text-halo" aria-hidden="true" />
                  <span className="btn-tui-label"><span>[</span><span>g  GitHub</span><span>]</span></span>
                </a>
              )}
              {project.website && (
                <a className="btn-tui relative isolate block" href={project.website} target="_blank" rel="noreferrer">
                  <span className="text-halo" aria-hidden="true" />
                  <span className="btn-tui-label"><span>[</span><span>l  Live Demo</span><span>]</span></span>
                </a>
              )}
            </nav>
          )}
        </div>
      </main>
    </>
  );
}
