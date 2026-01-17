"use client";

import { Github } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Menu() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const menuItems = [
    { url: "/home", title: "Home" },
    { url: "/projects", title: "Projects" },
  ];

  const socialItems = [
    {
      title: "github",
      icon: Github,
      url: "https://github.com/ridit-jangra",
    },
  ];

  const handleNavigate = (url: string) => {
    // router.push(url);
    console.log("Navigate to:", url);
  };

  return (
    <div className="fixed z-10 w-full flex items-center justify-between h-12 p-2">
      <ul className="flex items-center gap-2">
        {menuItems.map((v, i) => (
          <motion.li
            key={i}
            onClick={() => handleNavigate(v.url)}
            className="cursor-pointer font-sans"
            whileHover={{ textDecoration: "underline" }}
          >
            {v.title.toUpperCase()}
          </motion.li>
        ))}
      </ul>

      <motion.div className="relative w-14 h-14 mt-12" style={{ rotate }}>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2"></motion.span>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2 rotate-55 origin-center"></motion.span>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2 -rotate-55 origin-center"></motion.span>
      </motion.div>

      <ul className="flex items-center gap-2">
        {socialItems.map((v, i) => (
          <a href={v.url} target="_blank" key={i} rel="noopener noreferrer">
            <li className="flex gap-1 items-center cursor-pointer">
              <v.icon size={25} />
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-[200vh]">
      <Menu />
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold">Scroll Down</h1>
      </div>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-6xl font-bold">Keep Scrolling</h1>
      </div>
    </div>
  );
}
