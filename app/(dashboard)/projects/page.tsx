"use client";

import ChromaGrid from "@/components/ChromaGrid";
import { projects } from "./projects";

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-[#F6AB00] pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Projects
          </p>
        </div>
      </div>

      <div className="bg-transparent">
        <ChromaGrid
          items={projects}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        />
      </div>
    </div>
  );
}
