"use client";

import { Github } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import StaggeredMenu from "./StaggeredMenu";

export function Menu() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const router = useRouter();

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
  ];

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  return (
    <div className="fixed z-10 w-full flex items-center justify-between h-12 p-2">
      <span
        className="font-employed text-4xl cursor-pointer hover:underline"
        onClick={() => handleNavigate("/home")}
      >
        Ridit
      </span>

      <motion.div className="relative w-14 h-14 mt-12" style={{ rotate }}>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2"></motion.span>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2 rotate-55 origin-center"></motion.span>
        <motion.span className="absolute w-0.5 h-14 bg-black left-1/2 -translate-x-1/2 -rotate-55 origin-center"></motion.span>
      </motion.div>

      <div className="flex items-center relative gap-2">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={["#FEEBDC", "oklch(67.3% 0.182 276.935)"]}
          accentColor="oklch(55% 0.22 15)"
          isFixed
        />
      </div>
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
