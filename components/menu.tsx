"use client";

import { Github, Instagram, Twitter, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export function Menu() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    {
      label: "Projects",
      ariaLabel: "Learn about our projects",
      link: "/projects",
    },
  ];

  const socialItems = [
    { label: "GitHub", link: "https://github.com/ridit-jangra" },
    { label: "X", link: "https://x.com/ridit_jangra" },
    { label: "Insta", link: "https://instagram.com/" },
  ];

  return (
    <div className="fixed z-50 w-full flex items-center justify-between h-12 sm:h-16 px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center relative gap-2 sm:gap-4">
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              aria-label={item.ariaLabel}
              className="text-base lg:text-lg font-medium hover:underline transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 sm:w-10 sm:h-10 gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-black transition-all"
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-black transition-all"
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-black transition-all"
          />
        </button>

        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={
            isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }
          }
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-0 right-0 w-full h-screen bg-[#FEEBDC] flex flex-col items-center justify-center gap-8 z-40"
        >
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              aria-label={item.ariaLabel}
              className="text-3xl sm:text-4xl font-employed hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="hidden sm:block relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mt-8 sm:mt-10 lg:mt-12"
        style={{ rotate }}
      >
        <motion.span className="absolute w-0.5 h-10 sm:h-12 lg:h-14 bg-black left-1/2 -translate-x-1/2"></motion.span>
        <motion.span className="absolute w-0.5 h-10 sm:h-12 lg:h-14 bg-black left-1/2 -translate-x-1/2 rotate-55 origin-center"></motion.span>
        <motion.span className="absolute w-0.5 h-10 sm:h-12 lg:h-14 bg-black left-1/2 -translate-x-1/2 -rotate-55 origin-center"></motion.span>
      </motion.div>

      <div className="flex items-center relative gap-2 sm:gap-4">
        <a
          href={socialItems[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base lg:text-lg font-medium hover:underline transition-all"
        >
          <Github
            size={30}
            className="hover:fill-[#22262A] transition-colors"
          />
        </a>
        <a
          href={socialItems[1].link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base lg:text-lg font-medium hover:underline transition-all "
        >
          <Twitter
            size={30}
            className="hover:fill-[#24A4F2] transition-colors"
          />
        </a>
        <a
          href={socialItems[2].link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base lg:text-lg font-medium hover:underline transition-all"
        >
          <Instagram
            size={30}
            className="hover:fill-[#F3486D] transition-colors"
          />
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-[200vh]">
      <Menu />
      <div className="h-screen flex items-center justify-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
          Scroll Down
        </h1>
      </div>
      <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
          Keep Scrolling
        </h1>
      </div>
    </div>
  );
}
