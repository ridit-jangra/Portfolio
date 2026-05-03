"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Milo",
    initial: "M",
    description:
      "Milo is your cat buddy that codes with you, builds with you, ships with you and talks with you.",
    image: "/milo.png",
    link: "#",
  },
  {
    name: "Meridia (Archieved)",
    initial: "M",
    description: "Archived.",
    image: "/meridia.png",
    link: "#",
  },
  {
    name: "Ink",
    initial: "I",
    description: "One place to store, edit and view your stories!",
    image: "/ink.png",
    link: "#",
  },
  {
    name: "Portfolio",
    initial: "P",
    description: "My portfolio. You are looking it rn!",
    image: "/portfolio-new.png",
    link: "#",
  },
];

const words = "My latest projects!".split(" ");

export function Work() {
  return (
    <section className="relative w-full px-4 sm:px-10 lg:px-20 mt-24 sm:mt-48 lg:mt-80">
      <p className="hidden sm:block text-zinc-400 text-lg sm:text-2xl absolute -top-8 sm:-top-10 right-4 sm:right-24 lg:right-90 rotate-3 font-finger-paint">
        from 2025 till today!
      </p>

      <p
        className="z-10 font-inter font-medium text-center select-none drop-shadow-2xl m-0 leading-none mb-12 sm:mb-16 lg:mb-23"
        style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.15,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="inline-block mr-3 sm:mr-6 lg:mr-8"
          >
            {word}
          </motion.span>
        ))}
      </p>

      <div className="flex flex-col gap-4 sm:gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.1,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative bg-[#f3f3f3] rounded-3xl sm:rounded-4xl w-full p-5 sm:p-8 **:font-inter group cursor-pointer"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl sm:rounded-4xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 50% at 100% -5%, #ffe600 0%, #fecc1f 30%, #fef9c3 70%, transparent 100%)",
              }}
            />

            <div className="flex items-center justify-between z-100 pr-10 sm:pr-0">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <span className="shrink-0 bg-black rounded-md text-white flex items-center justify-center px-2 py-1 text-xl sm:text-3xl lg:text-4xl">
                  {project.initial}
                </span>
                <p
                  className="font-medium leading-none truncate"
                  style={{ fontSize: "clamp(1.4rem, 4vw, 3.75rem)" }}
                >
                  {project.name}
                </p>
              </div>
              <a
                href={project.link}
                className="shrink-0 ml-2 sm:absolute sm:right-8 transition-transform duration-200 group-hover:-translate-y-2 sm:group-hover:-translate-y-3 group-hover:translate-x-2 sm:group-hover:translate-x-3"
              >
                <ArrowUpRight size={32} className="sm:hidden" />
                <ArrowUpRight size={50} className="hidden sm:block" />
              </a>
            </div>

            <div className="mt-4 sm:my-5 relative">
              <p
                className="font-medium text-[#6b7280] w-full sm:max-w-[60%] lg:max-w-[45%]"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1.5rem)" }}
              >
                {project.description}
              </p>
              <img
                src={project.image}
                alt={project.name}
                className="rounded-xl mt-6 sm:mt-10 w-full object-cover"
              />
            </div>
          </motion.div>
        ))}

        <span className="text-lg sm:text-2xl font-inter font-medium">
          Much more!! on{" "}
          <a
            href="https://github.com/ridit-jangra"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline"
          >
            github
          </a>
        </span>
      </div>
    </section>
  );
}
