"use client";

import ChromaGrid from "@/components/ChromaGrid";

export default function Page() {
  const items = [
    {
      image: "/meridia-logo.svg",
      title: "Meridia",
      subtitle: "A powerful code editor.",
      handle: "meridia.dev",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      handleUrl: "https://meridia.dev",
      url: "/meridia",
    },
    {
      image: "/ink-logo.svg",
      title: "Ink",
      subtitle: "A story writing app.",
      handle: "ink.ridit.space",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      handleUrl: "https://ink.ridit.space",
      url: "/ink",
    },
    {
      image: "https://i.pravatar.cc/300?img=2",
      title: "Pressly",
      subtitle: "A powerful website builder.",
      handle: "pressly.ridit.space",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      handleUrl: "https://pressly.ridit.space",
      url: "/pressly",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F6AB00] pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-employed">
            Projects
          </p>
        </div>
      </div>

      <div className="bg-transparent">
        <ChromaGrid
          items={items}
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
