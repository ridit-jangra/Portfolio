"use client";

import LetterGlitch from "@/components/LetterGlitch";
import Lightning from "@/components/Lightning";
import LightPillar from "@/components/LightPillar";
import PixelBlast from "@/components/PixelBlast";
import PixelSnow from "@/components/PixelSnow";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Page() {
  const projectsRef = useRef(null);
  const meridiaRef = useRef(null);

  const { scrollYProgress: projectsScroll } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: meridiaScroll } = useScroll({
    target: meridiaRef,
    offset: ["start end", "end start"],
  });

  const yParallaxProjects = useTransform(projectsScroll, [0, 1], [0, -200]);
  const scaleProgressProjects = useTransform(
    projectsScroll,
    [0, 0.5],
    [0.8, 1.2],
  );

  const yParallaxMeridia = useTransform(meridiaScroll, [0, 1], [0, -200]);
  const scaleProgressMeridia = useTransform(
    meridiaScroll,
    [0, 0.5],
    [0.8, 1.2],
  );

  return (
    <div className="min-h-[200vh] flex flex-col max-w-screen overflow-hidden">
      <section className="h-screen flex items-center justify-center relative bg-[#F6AB00]">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <motion.img
            src="/feather.png"
            alt="feather"
            width={90}
            className="absolute -right-100 -top-10 drop-shadow-xl blur-[0.6px]"
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
            className="absolute right-120 top-10 drop-shadow-xl blur-[0.6px]"
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
            className="absolute left-230 top-110 drop-shadow-xl blur-[0.6px] rotate-320 rotate-y-180"
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, 620],
              x: [0, 30, -50, 35, -20, 0],
              rotate: [0, 200, 400],
            }}
            transition={{ duration: 4.2, delay: 1.1, ease: "easeInOut" }}
          />

          <motion.p
            className="text-[25rem] font-employed select-none drop-shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Ridit
          </motion.p>
        </motion.div>
      </section>

      <section
        ref={projectsRef}
        className="h-screen flex items-center justify-center relative overflow-hidden bg-[#FEEBDC]"
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: yParallaxProjects }}
        />

        <motion.p
          className="text-[20rem] font-employed select-none"
          style={{
            y: yParallaxProjects,
            scale: scaleProgressProjects,
          }}
        >
          Projects
        </motion.p>
      </section>

      <section
        ref={meridiaRef}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <LetterGlitch
            glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
          />
        </div>

        <motion.p
          className="text-[20rem] font-employed select-none z-10 text-white"
          style={{
            y: yParallaxMeridia,
            // scale: scaleProgressMeridia,
          }}
        >
          Meridia
        </motion.p>

        <motion.p
          className="text-[6rem] font-employed select-none text-center z-10 text-white/80"
          style={{
            y: yParallaxMeridia,
            scale: scaleProgressMeridia,
          }}
        >
          A Powerful code editor.
        </motion.p>
      </section>

      <section
        ref={meridiaRef}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-indigo-400"
      >
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

        <motion.p
          className="text-[20rem] font-employed select-none z-10 text-white"
          style={{
            y: yParallaxMeridia,
          }}
        >
          Ink
        </motion.p>

        <motion.p
          className="text-[6rem] font-employed select-none text-center z-10 text-white/80"
          style={{
            y: yParallaxMeridia,
            scale: scaleProgressMeridia,
          }}
        >
          A story writing app.
        </motion.p>
      </section>

      <section
        ref={meridiaRef}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-emerald-400"
      >
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

        <motion.p
          className="text-[20rem] font-employed select-none z-10 text-white"
          style={{
            y: yParallaxMeridia,
          }}
        >
          Pressly
        </motion.p>

        <motion.p
          className="text-[6rem] font-employed select-none text-center z-10 text-white/80"
          style={{
            y: yParallaxMeridia,
            scale: scaleProgressMeridia,
          }}
        >
          A powerful website builder.
        </motion.p>
      </section>
    </div>
  );
}
