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
    <div className="min-h-screen w-full bg-[#F6AB00] pt-24 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-7xl font-employed">Projects</p>
        </div>
      </div>
      <div className="bg-transparent mt-12">
        <ChromaGrid
          items={items}
          radius={300}
          damping={1}
          fadeOut={1}
          ease="power3.out"
          className="grid grid-cols-4"
        />
      </div>
    </div>
  );
}
