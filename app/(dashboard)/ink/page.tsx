"use client";

import PixelSnow from "@/components/PixelSnow";
import { GithubIcon, ViewIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-[#FEEBDC] py-25">
      <div className="absolute inset-0 overflow-hidden">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
        />
      </div>
      <div className="flex items-center mt-12 px-4 z-10">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="font-employed text-9xl">Ink</p>
            <p className="font-mono text-4xl">A story writing app.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer bg-black text-white hover:bg-black/80 transition-colors">
              <a
                href="https://github.com/ridit-jangra/Ink"
                className="flex gap-2"
                target="_blank"
              >
                Github <GithubIcon size={32} />
              </a>
            </div>
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer text-black bg-white hover:bg-white/80 transition-colors">
              <a
                href="https://ink.ridit.space"
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
