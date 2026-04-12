import { GithubIcon, ViewIcon } from "lucide-react";
import { projects } from "../projects";

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
      className={`flex flex-col items-center justify-center min-h-screen py-25 relative opacity-80`}
      style={{ backgroundColor: project.bg }}
    >
      <div className="flex items-center mt-12 px-4 z-10">
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="font-employed text-9xl">{project.name}</p>
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
