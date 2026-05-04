"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useEffect, useState } from "react";

const words = "About me now!".split(" ");

const socialItems = [
  { label: "GitHub", link: "https://github.com/ridit-jangra" },
  { label: "X", link: "https://x.com/ridit_jangra" },
  { label: "Insta", link: "https://instagram.com/ridit.jangra" },
];

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
  const back = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full px-4 sm:px-10 lg:px-20 mt-16 sm:mt-24 lg:mt-30">
      <p className="hidden sm:block text-zinc-400 text-lg sm:text-2xl absolute -top-8 sm:-top-10 right-4 sm:right-24 lg:right-90 rotate-3 font-finger-paint">
        also my journey :)
      </p>

      <p
        className="z-10 font-inter text-center select-none drop-shadow-2xl m-0 leading-none mb-12 sm:mb-16 lg:mb-23"
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-[#f3f3f3] p-8 font-inter w-full lg:w-[35%] rounded-3xl sm:rounded-4xl px-8 sm:px-10 pt-12 sm:pt-20 lg:pt-70"
          >
            <p
              className="text-gray-500 font-medium"
              style={{ fontSize: "clamp(0.95rem, 2vw, 1.375rem)" }}
            >
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
            className="bg-[#f3f3f3] w-full lg:w-[65%] rounded-3xl sm:rounded-4xl overflow-hidden relative flex flex-col items-center justify-center p-6 sm:p-10 gap-6 min-h-80 sm:min-h-96"
          >
            <button
              onClick={back}
              className="absolute flex items-center gap-2 top-4 sm:top-6 left-4 sm:left-6 font-finger-paint text-gray-400 hover:text-gray-700 transition-colors text-base sm:text-lg z-10"
            >
              <ArrowLeft size={18} /> back
            </button>
            <button
              onClick={next}
              className="absolute flex items-center gap-2 top-4 sm:top-6 right-4 sm:right-6 font-finger-paint text-gray-400 hover:text-gray-700 transition-colors text-base sm:text-lg z-10"
            >
              next <ArrowRight size={18} />
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
                <div className="bg-white p-4 px-8 sm:px-15 pb-12 relative drop-shadow-2xl">
                  <img
                    src={slides[current].image}
                    alt=""
                    className="w-48 sm:w-72 lg:w-90 h-auto object-cover mb-8 block"
                  />
                  <p className="absolute bottom-3 left-0 mt-4 right-0 text-center px-5 text-black text-sm sm:text-md font-finger-paint">
                    {slides[current].text}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="bg-[#f3f3f3] min-h-[480px] sm:min-h-[680px] lg:h-screen flex items-center justify-center w-full rounded-3xl sm:rounded-4xl p-8 relative overflow-hidden"
        >
          {[
            {
              src: "/meridia.png",
              alt: "meridia-web-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto -rotate-10 -right-[15%] sm:-right-[10%] lg:-right-50 bottom-0 z-1",
              delay: 0,
            },
            {
              src: "/milo.png",
              alt: "milo-web-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto -left-[5%] lg:-left-10 z-1 rotate-10 -bottom-[10%] lg:-bottom-40",
              delay: 0.15,
            },
            {
              src: "/ink.png",
              alt: "ink-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto -right-[15%] lg:-right-50 z-0 rotate-10 top-0",
              delay: 0.3,
            },
            {
              src: "/pressly.png",
              alt: "pressly-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto -right-[30%] lg:-right-100 z-2 -rotate-8 top-[12%] lg:top-50",
              delay: 0.45,
            },
            {
              src: "/portfolio-old.png",
              alt: "portfolio-old-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto left-[25%] lg:left-100 z-2 -rotate-3 -top-[8%] lg:-top-30",
              delay: 1,
            },
            {
              src: "/random-shit.avif",
              alt: "random-shit-:)",
              className:
                "absolute w-[28vw] sm:w-[20vw] lg:w-100 h-auto -left-[2%] lg:-left-10 z-2 -rotate-3 top-[12%] lg:top-50",
              delay: 1.15,
            },
            {
              src: "/portfolio-new.png",
              alt: "portfolio-new-:)",
              className:
                "absolute w-[40vw] sm:w-[30vw] lg:w-150 h-auto left-[38%] lg:left-150 z-2 -rotate-3 -bottom-[2%] lg:-bottom-10",
              delay: 1.3,
            },
            {
              src: "/flying-ig.gif",
              alt: "flying-cat-:)",
              className:
                "absolute w-[55vw] sm:w-[40vw] lg:w-200 h-auto left-0 z-2 -rotate-30 top-10",
              delay: 1.45,
            },
            {
              src: "/joker-its-you.png",
              alt: "joker-its-you-:)",
              className:
                "absolute w-[14vw] sm:w-[10vw] lg:w-50 h-auto left-0 z-2 -rotate-3 top-0",
              delay: 2,
            },
          ].map((img) => (
            <a href="#" key={img.alt}>
              <motion.img
                src={img.src}
                alt={img.alt}
                className={
                  img.className +
                  " hover:scale-110 sm:hover:scale-120 transition-all cursor-pointer"
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

          <div className="relative z-10 px-4">
            <p
              className="font-sinteca text-center select-none leading-none"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
            >
              On a quest to create
              <br /> something beautiful
            </p>
            <p
              className="text-zinc-400 font-finger-paint text-center mt-6 sm:mt-8"
              style={{ fontSize: "clamp(1.1rem, 3vw, 2.25rem)" }}
            >
              for fun ofc :)
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full bg-[#f3f3f3] my-8 sm:my-15 rounded-3xl sm:rounded-4xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 px-4 sm:px-6 py-4 sm:h-20">
        <span className="flex items-center gap-3 sm:gap-4">
          <Send size={28} className="sm:hidden shrink-0" />
          <Send size={38} className="hidden sm:block shrink-0" />
          <a
            href="mailto:riditjangra09@gmail.com"
            className="font-inter font-medium"
            style={{ fontSize: "clamp(1rem, 2.5vw, 2rem)" }}
          >
            riditjangra09@gmail.com
          </a>
        </span>
        <div className="flex items-center gap-3">
          <a href={socialItems[2].link} target="_blank group">
            <img
              src="/instagram.png"
              alt="instagram"
              className="w-10 sm:w-15 h-auto cursor-pointer hover:scale-110 transition-all rotate-2 hover:-translate-y-5 hover:rotate-15"
            />
          </a>
          <a href={socialItems[0].link} target="_blank group">
            <img
              src="/github.png"
              alt="github"
              className="w-10 sm:w-15 h-auto cursor-pointer hover:scale-110 transition-all -rotate-3 hover:-translate-y-5 hover:-rotate-15"
            />
          </a>
          <a href={socialItems[1].link} target="_blank group">
            <img
              src="/twitter.png"
              alt="twitter"
              className="w-10 sm:w-15 h-auto cursor-pointer hover:scale-110 transition-all rotate-15 hover:-translate-y-5 hover:rotate-30"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
