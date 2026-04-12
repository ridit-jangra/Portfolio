"use client";

import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden">
      <section className="min-h-screen flex items-center justify-center relative bg-[#F6AB00] overflow-hidden px-4">
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: "#8B7BA8",
            top: "-50px",
            left: "-50px",
          }}
        />

        <div
          className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full opacity-40 blur-3xl"
          style={{
            background: "#F5E6D3",
            top: "50%",
            right: "-50px",
          }}
        />

        <div
          className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full opacity-35 blur-3xl"
          style={{
            background: "#6B5B7B",
            bottom: "-50px",
            left: "30%",
          }}
        />

        <div
          className="absolute w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] rounded-full opacity-35 blur-3xl"
          style={{
            background: "#E8A5C4",
            top: "20%",
            left: "40%",
          }}
        />

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
    </div>
  );
}
