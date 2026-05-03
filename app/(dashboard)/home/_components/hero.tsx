"use client";

import CountUp from "@/components/CountUp";
import { motion } from "framer-motion";
import { useState } from "react";

export function Hero() {
  const [age, setAge] = useState<number | null>(null);

  return (
    <motion.div
      animate={{
        background: [
          "radial-gradient(ellipse 40% 40% at 50% 150%, #ffe600 0%, #fecc1f 10%, #fde75e 60%, #ffffff 100%)",
          "radial-gradient(ellipse 70% 80% at 50% -10%, #ffe600 0%, #fecc1f 10%, #fde75e 50%, #ffffff 100%)",
        ],
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-screen h-screen relative overflow-hidden mb-5"
    >
      <div className="absolute z-10 flex flex-col bottom-0 w-full">
        <p
          className="font-inter px-4 sm:px-7 py-0 m-0 mb-6 sm:mb-16 bg-linear-to-r from-gray-700 via-yellow-600/60 to-yellow-300/20 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,230,0,0.4)]"
          style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}
        >
          Howdy! I am Ridit
          <br className="sm:hidden md:block" /> Btw i am{" "}
          <CountUp
            from={0}
            to={new Date().getFullYear() - 2011}
            separator=","
            direction="up"
            duration={1}
            className="count-up-text"
            delay={0}
          />{" "}
          How about you?
          <span className="relative ml-1 inline-block w-10 sm:w-12">
            <input
              type="text"
              name="_"
              value={age ?? ""}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="11"
              className="text-gray-700 focus:outline-none w-full bg-transparent"
              style={{ fontSize: "inherit" }}
            />
            <span
              className={`absolute text-gray-700 top-0 left-0 ${age === null && "animate-caret-blink"}`}
            >
              __
            </span>
          </span>
        </p>

        <motion.p
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.3,
          }}
          className="font-sinteca select-none drop-shadow-2xl m-0 leading-none whitespace-nowrap overflow-hidden"
          style={{ fontSize: "clamp(2.5rem, 18vw, 21.98rem)" }}
        >
          Ridit Jangra
        </motion.p>
      </div>
    </motion.div>
  );
}
