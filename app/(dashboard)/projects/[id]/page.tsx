import { GithubIcon, ViewIcon } from "lucide-react";
import { projects } from "../projects";
import PixelBlast from "@/components/PixelBlast";

function invertHex(hex: string): string {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = 255 - parseInt(hex.slice(0, 2), 16);
  const g = 255 - parseInt(hex.slice(2, 4), 16);
  const b = 255 - parseInt(hex.slice(4, 6), 16);

  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((t) => t.name.toLowerCase() === id);
  if (!project) return <div>Not found</div>;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen py-25 relative`}
      style={{ backgroundColor: project.bg }}
    >
      <div className="absolute w-screen h-screen z-10">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color={invertHex(project.bg)}
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>
      <div className="flex items-center mt-12 px-4 z-10">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-9xl">{project.name}</p>
            <p className="font-mono text-4xl">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer bg-black text-white hover:bg-black/80 transition-colors">
              <a href={project.repo} className="flex gap-2" target="_blank">
                Github <GithubIcon size={32} />
              </a>
            </div>
            {project.website && (
              <div className="flex items-center justify-center w-full text-2xl py-4 font-mono rounded-full cursor-pointer text-black bg-white hover:bg-white/80 transition-colors">
                <a
                  href={project.website}
                  className="flex gap-2"
                  target="_blank"
                >
                  View <ViewIcon size={32} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
