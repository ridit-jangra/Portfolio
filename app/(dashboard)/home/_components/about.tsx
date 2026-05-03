"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useEffect, useState } from "react";

const words = "About me now!".split(" ");

const slides = [
  {
    image: "/illustrations/adventure.svg",
    text: "Started with a simple HTML page during COVID lockdown.",
    rotate: -3,
  },
  {
    image: "/illustrations/books.svg",
    text: "Learned by doing — books, tutorials, and a lot of breaking things.",
    rotate: 2,
  },
  {
    image: "/illustrations/code-contri.svg",
    text: "Started contributing to open source and building real projects.",
    rotate: -2,
  },
  {
    image: "/illustrations/live-collab.svg",
    text: "Collaborated with developers across the world on cool ideas.",
    rotate: 3,
  },
  {
    image: "/illustrations/github-pro.svg",
    text: "Now shipping Milo, Meridia, and more — all MIT licensed.",
    rotate: -1,
  },
];

export function About() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const back = () => setCurrent((prev) => (prev - 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-screen px-20 mt-30">
      <p className="text-zinc-400 text-2xl absolute -top-10 right-90 rotate-3 font-finger-paint">
        also my journey :)
      </p>
      <p className="z-10 text-[8rem] font-inter text-center select-none drop-shadow-2xl m-0 leading-none mb-23">
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

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-[#f3f3f3] p-8 font-inter text-[22px] w-[35%] rounded-4xl px-10 pt-70"
          >
            <p className="text-gray-500 font-medium">
              My journey as a coder started all the way back in COVID, the first
              thing I coded was a simple HTML page with the help of my sister's
              computer book.
              <br />
              <br />
              Five years later, here i am with Milo, Meridia and tons of more
              projects that you can use or copy (MIT License) to make them yours
              :)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-[#f3f3f3] w-[65%] rounded-4xl overflow-hidden relative flex flex-col items-center justify-center p-10 gap-6 min-h-96"
          >
            <button
              onClick={next}
              className="absolute flex items-center gap-2 top-6 left-6 font-finger-paint text-gray-400 hover:text-gray-700 transition-colors text-lg z-10"
            >
              <ArrowLeft /> back
            </button>
            <button
              onClick={back}
              className="absolute flex items-center gap-2 top-6 right-6 font-finger-paint text-gray-400 hover:text-gray-700 transition-colors text-lg z-10"
            >
              next <ArrowRight />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{
                  opacity: 0,
                  x: 160,
                  rotate: slides[current].rotate + 8,
                }}
                animate={{ opacity: 1, x: 0, rotate: slides[current].rotate }}
                exit={{
                  opacity: 0,
                  x: -160,
                  rotate: slides[current].rotate - 8,
                }}
                transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
                className="flex flex-col items-center"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.13))" }}
              >
                <div className="bg-white p-4 px-15 pb-12 relative drop-shadow-2xl">
                  <img
                    src={slides[current].image}
                    alt=""
                    className="w-90 h-auto object-cover mb-8 block"
                  />

                  <p className="absolute bottom-3 left-0 mt-4 right-0 text-center px-5 text-black text-md font-finger-paint">
                    {slides[current].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-[#f3f3f3] w-[60%] h-20 rounded-4xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-[#f3f3f3] w-[40%] h-20 rounded-4xl"
          />
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="bg-[#f3f3f3] h-screen flex items-center justify-center w-full rounded-4xl p-8 relative overflow-hidden"
        >
          {[
            {
              src: "/meridia.png",
              alt: "meridia-web-:)",
              className:
                "absolute w-200 h-auto -rotate-10 -right-50 bottom-0 z-1",
              delay: 0,
            },
            {
              src: "/milo.png",
              alt: "milo-web-:)",
              className:
                "absolute w-200 h-auto -left-10 z-1 rotate-10 -bottom-40",
              delay: 0.15,
            },
            {
              src: "/ink.png",
              alt: "ink-:)",
              className: "absolute w-200 h-auto -right-50 z-0 rotate-10 top-0",
              delay: 0.3,
            },
            {
              src: "/pressly.png",
              alt: "pressly-:)",
              className:
                "absolute w-200 h-auto -right-100 z-2 -rotate-8 top-50",
              delay: 0.45,
            },
            {
              src: "/portfolio-old.png",
              alt: "portfolio-old-:)",
              className: "absolute w-200 h-auto left-100 z-2 -rotate-3 -top-30",
              delay: 1,
            },
            {
              src: "/random-shit.avif",
              alt: "random-shit-:)",
              className: "absolute w-100 h-auto -left-10 z-2 -rotate-3 top-50",
              delay: 1.15,
            },
            {
              src: "/portfolio-new.png",
              alt: "portfolio-new-:)",
              className:
                "absolute w-150 h-auto left-150 z-2 -rotate-3 -bottom-10",
              delay: 1.3,
            },
            {
              src: "/flying-ig.gif",
              alt: "flying-cat-:)",
              className: "absolute w-200 h-auto left-0 z-2 -rotate-30 top-10",
              delay: 1.45,
            },
            {
              src: "/joker-its-you.png",
              alt: "joker-its-you-:)",
              className: "absolute w-50 h-auto left-0 z-2 -rotate-3 top-0",
              delay: 2,
            },
          ].map((img) => (
            <a href="#" key={img.alt}>
              <motion.img
                src={img.src}
                alt={img.alt}
                className={
                  img.className +
                  " hover:scale-120 transition-all cursor-pointer"
                }
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: img.delay,
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />
            </a>
          ))}

          <div className="relative z-10">
            <p className="text-[5rem] font-sinteca text-center select-none leading-none">
              On a quest to create
              <br /> something beautiful
            </p>
            <p className="text-zinc-400 text-4xl font-finger-paint text-center mt-8">
              for fun ofc :)
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full bg-[#f3f3f3] h-20 my-15 rounded-4xl flex items-center justify-between px-4">
        <span className="flex items-center gap-4">
          <Send size={38} />
          <p className="font-inter font-medium text-[32px]">
            riditjangra09@gmail.com
          </p>
        </span>
        <div className="flex items-center gap-3">
          <img
            src={"/instagram.png"}
            alt="instagram"
            className="w-15 h-auto cursor-pointer hover:scale-110 transition-all rotate-2"
          />
          <img
            src={"/github.png"}
            alt="github"
            className="w-15 h-auto cursor-pointer hover:scale-110 transition-all -rotate-3"
          />
          <img
            src={"/twitter.png"}
            alt="twitter"
            className="w-15 h-auto cursor-pointer hover:scale-110 transition-all rotate-15"
          />
        </div>
      </div>
    </section>
  );
}
