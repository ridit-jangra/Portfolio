"use client";

import { useEffect, useMemo, useRef } from "react";
import { Ascii } from "ascii.rest/react";
import * as dissolve from "./greeting-dissolve";

export function Hero() {
  const progress = useRef(0);
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      progress.current = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.65)));
      if (surface.current) {
        surface.current.style.backdropFilter = progress.current >= 1 ? "none" : "";
        surface.current.style.visibility = progress.current >= 1 ? "hidden" : "visible";
      }
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
  }, []);
  const scrollDissolve = useMemo(() => ({
    meta: dissolve.meta,
    default: (options: Parameters<typeof dissolve.default>[0]) =>
      dissolve.default({ ...options, scrollProgress: () => progress.current }),
  }), []);
  const options = useMemo(() => ({ words: [
    "hello", "hola", "ciao", "salut", "namaste", "ni hao", "marhaba",
    "nomoskar", "ola", "halo", "adaab", "privet", "hallo", "konnichiwa", "how far",
  ] }), []);
  return <>
      <div ref={surface} className="glass h-min w-min p-0 select-none">
        <Ascii piece={scrollDissolve} style={{ fontSize: "clamp(4px, 1.25vw, 20px)", lineHeight: 1.2, margin: 0 }} options={options} />
      </div>
  </>
}
