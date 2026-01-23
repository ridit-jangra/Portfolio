"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-[200vh] flex flex-col w-full overflow-hidden">
      <section className="min-h-screen flex items-center justify-center relative bg-[#F6AB00] overflow-hidden px-4">
        {/* Blob 1 - Purple */}
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: "#8B7BA8",
            top: "-50px",
            left: "-50px",
          }}
        />

        {/* Blob 2 - Light Beige */}
        <div
          className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full opacity-40 blur-3xl"
          style={{
            background: "#F5E6D3",
            top: "50%",
            right: "-50px",
          }}
        />

        {/* Blob 3 - Deep Purple */}
        <div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full opacity-35 blur-3xl"
          style={{
            background: "#6B5B7B",
            bottom: "-50px",
            left: "30%",
          }}
        />

        {/* Blob 4 - Warm Pink */}
        <div
          className="absolute w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] rounded-full opacity-35 blur-3xl"
          style={{
            background: "#E8A5C4",
            top: "20%",
            left: "40%",
          }}
        />

        {/* Blob 5 - Lavender */}
        <div
          className="absolute w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full opacity-30 blur-3xl"
          style={{
            background: "#C8BADB",
            top: "60%",
            left: "10%",
          }}
        />

        <div className="text-center relative z-10">
          <motion.img
            src="/feather.png"
            alt="feather"
            width={90}
            className="absolute -right-20 sm:-right-100 -top-5 sm:-top-10 drop-shadow-xl blur-[0.6px] w-12 sm:w-16 lg:w-[90px]"
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, 600],
              x: [0, 50, -30, 20, -10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 4, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.img
            src="/feather-1.png"
            alt="feather"
            width={90}
            className="absolute right-20 sm:right-120 top-5 sm:top-10 drop-shadow-xl blur-[0.6px] w-12 sm:w-16 lg:w-[90px]"
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, 650],
              x: [0, -40, 60, -30, 40, 0],
              rotate: [0, -150, -300],
            }}
            transition={{ duration: 4.5, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.img
            src="/feather-3.png"
            alt="feather"
            width={50}
            className="absolute left-40 sm:left-230 top-20 sm:top-110 drop-shadow-xl blur-[0.6px] rotate-320 rotate-y-180 w-8 sm:w-10 lg:w-[50px]"
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, 620],
              x: [0, 30, -50, 35, -20, 0],
              rotate: [0, 200, 400],
            }}
            transition={{ duration: 4.2, delay: 1.1, ease: "easeInOut" }}
          />

          <p className="text-7xl sm:text-9xl md:text-[15rem] lg:text-[20rem] xl:text-[25rem] font-employed select-none drop-shadow-2xl">
            Ridit
          </p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FEEBDC] px-4">
        <p className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] xl:text-[20rem] font-employed select-none text-center">
          Projects
        </p>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 px-4 py-12">
        <p className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[15rem] xl:text-[20rem] font-employed select-none z-10 text-white text-center mb-4 sm:mb-8">
          Meridia
        </p>

        <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-employed select-none text-center z-10 text-white/80 mb-6 sm:mb-12 px-4">
          A Powerful code editor.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="https://github.com/ridit-jangra/Meridia" target="_blank">
            <button className="text-xl sm:text-2xl lg:text-3xl rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white font-medium transition-all font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 z-10 w-full sm:w-auto">
              Github{" "}
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            </button>
          </a>
          <a href="https://meridia.dev" target="_blank">
            <button className="text-xl sm:text-2xl lg:text-3xl bg-white/10 backdrop-blur-3xl border border-white/20 transition-colors font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 rounded-full z-10 text-white/80 w-full sm:w-auto">
              Try now{" "}
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            </button>
          </a>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-indigo-400 px-4 py-12">
        <p className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[15rem] xl:text-[20rem] font-employed select-none z-10 text-white text-center mb-4 sm:mb-8">
          Ink
        </p>

        <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-employed select-none text-center z-10 text-white/80 mb-6 sm:mb-12 px-4">
          A story writing app.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          <a href="https://github.com/ridit-jangra/Ink" target="_blank">
            <button className="text-lg sm:text-xl lg:text-[2.5rem] rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white font-medium transition-all font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 z-10 w-full sm:w-auto">
              Github{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </button>
          </a>
          <a href="https://ink.ridit.space" target="_blank">
            <button className="text-lg sm:text-xl lg:text-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 transition-colors font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 rounded-full z-10 text-white/80 w-full sm:w-auto">
              Try now{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </button>
          </a>
        </div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-emerald-400 px-4 py-12">
        <p className="text-6xl sm:text-8xl md:text-[12rem] lg:text-[15rem] xl:text-[20rem] font-employed select-none z-10 text-white text-center mb-4 sm:mb-8">
          Pressly
        </p>

        <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-employed select-none text-center z-10 text-white/80 mb-6 sm:mb-12 px-4">
          A powerful website builder.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          <a href="https://github.com/ridit-jangra/Pressly" target="_blank">
            <button className="text-lg sm:text-xl lg:text-[2.5rem] rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white font-medium transition-all font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 z-10 w-full sm:w-auto">
              Github{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </button>
          </a>
          <a href="https://pressly.ridit.space" target="_blank">
            <button className="text-lg sm:text-xl lg:text-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 transition-colors font-mono select-none flex items-center justify-center gap-2 px-6 sm:px-8 cursor-pointer py-2 rounded-full z-10 text-white/80 w-full sm:w-auto">
              Try now{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
