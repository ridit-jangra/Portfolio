"use client";

import { useEffect, useMemo, useRef } from "react";
import { Ascii } from "ascii.rest/react";
import { tajDawn } from "ascii.rest/pieces";

export function Footer() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const coast = useMemo(() => ({
    meta: { ...tajDawn.meta, ground: "#06070c" },
    default: () => {
      const render = tajDawn.default();
      return (time: number, env?: Parameters<ReturnType<typeof tajDawn.default>>[1]) => {
        const frame = render(time, env);
        const amount = progress.current;
        if (amount >= 1) return frame;
        if (amount <= 0) return frame.replace(/[^\n]/g, " ");
        let cell = 0;
        return [...frame].map((glyph) => {
          if (glyph === "\n") return glyph;
          // Fixed grain thresholds assemble the scene as scroll progress increases.
          let hash = Math.imul(++cell, 374761393);
          hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
          const threshold = ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
          const fill = Math.max(0, Math.min(1, (amount - threshold * 0.75) / 0.25));
          return fill === 0 ? " " : fill < 0.5 && glyph !== " " ? "·" : glyph;
        }).join("");
      };
    },
  }), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current) return;
      const top = section.current.getBoundingClientRect().top;
      progress.current = Math.max(0, Math.min(1,
        (window.innerHeight * 0.9 - top) / Math.max(1, window.innerHeight * 0.8)));
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

  return (
    <footer ref={section} className="relative z-10 min-h-[150dvh]" aria-label="Night coast">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        <Ascii piece={coast} label="A lighthouse over a moonlit sea" style={{ width: "100%" }} />
      </div>
    </footer>
  );
}
