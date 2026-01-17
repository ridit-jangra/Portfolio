"use client";

import LetterGlitch from "@/components/LetterGlitch";
import Prism from "@/components/Prism";
import { GithubIcon, ViewIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-400 py-25 relative">
      <div className="absolute inset-0 overflow-hidden">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.3}
          glow={1}
        />
      </div>
      <div className="flex items-center mt-12 px-4 z-10">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="font-employed text-9xl">Meridia</p>
            <p className="font-mono text-4xl">A powerful code editor.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer bg-black text-white hover:bg-black/80 transition-colors">
              <a
                href="https://github.com/ridit-jangra/Meridia"
                className="flex gap-2"
                target="_blank"
              >
                Github <GithubIcon size={32} />
              </a>
            </div>
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer text-black bg-white hover:bg-white/80 transition-colors">
              <a
                href="https://meridia.dev"
                className="flex gap-2"
                target="_blank"
              >
                View <ViewIcon size={32} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
