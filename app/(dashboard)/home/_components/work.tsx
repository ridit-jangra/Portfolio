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
    <section className="relative w-screen px-20 mt-80">
      <p className="text-zinc-400 text-2xl absolute -top-10 right-90 rotate-3 font-finger-paint">
        from 2025 till today!
      </p>
      <p className="z-10 text-[8rem] font-inter font-medium text-center select-none drop-shadow-2xl m-0 leading-none mb-23">
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
            className="inline-block mr-8"
          >
            {word}
          </motion.span>
        ))}
      </p>

      <div className="flex flex-col gap-6">
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
            className="relative bg-[#f3f3f3] rounded-4xl w-full p-8 **:font-inter group cursor-pointer"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-4xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 50% at 100% -5%, #ffe600 0%, #fecc1f 30%, #fef9c3 70%, transparent 100%)",
              }}
            />
            <div className="flex items-center justify-between z-100">
              <div className="flex items-center gap-4">
                <span className="bg-black rounded-md text-white text-4xl flex items-center justify-center px-2 py-1">
                  {project.initial}
                </span>
                <p className="font-medium text-6xl">{project.name}</p>
              </div>
              <a
                href={project.link}
                className="absolute right-8 transition-transform duration-200 group-hover:-translate-y-3 group-hover:translate-x-3"
              >
                <ArrowUpRight size={50} />
              </a>
            </div>
            <div className="my-5 relative">
              <p className="font-medium text-[24px] max-w-[45%] text-[#6b7280]">
                {project.description}
              </p>
              <img
                src={project.image}
                alt={project.name}
                className="rounded-xl mt-10"
              />
            </div>
          </motion.div>
        ))}
        <span className="text-2xl font-inter font-medium">
          Much more!! in{" "}
          <a
            href="https://github.com/ridit-jangra"
            target="blank"
            className="text-indigo-400 hover:underline"
          >
            github
          </a>
        </span>
      </div>
    </section>
  );
}
