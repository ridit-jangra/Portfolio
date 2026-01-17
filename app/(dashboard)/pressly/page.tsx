"use client";

import PixelBlast from "@/components/PixelBlast";
import { GithubIcon, ViewIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-400 py-25 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>
      <div className="flex items-center mt-12 px-4 z-10">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="font-employed text-9xl">Pressly</p>
            <p className="font-mono text-4xl">A powerful website builder.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer bg-black text-white hover:bg-black/80 transition-colors">
              <a
                href="https://github.com/ridit-jangra/Pressly"
                className="flex gap-2"
                target="_blank"
              >
                Github <GithubIcon size={32} />
              </a>
            </div>
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer text-black bg-white hover:bg-white/80 transition-colors">
              <a
                href="https://pressly.ridit.space"
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
