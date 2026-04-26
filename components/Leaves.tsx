"use client";

import { motion } from "framer-motion";

type Leaf = {
  id: number;
  src: string;
  size: number;
  left: string;
  delay: number;
  duration: number;
  xPath: number[];
  rotatePath: number[];
};

function generateLeaves(count: number): Leaf[] {
  const images = [
    "/feather.png",
    "/feather-1.png",
    "/feather-2.png",
    "/feather-3.png",
    "/feather-4.png",
    "/feather-5.png",
  ];

  return Array.from({ length: count }).map((_, i) => {
    const size = Math.floor(Math.random() * 40) + 40; // 40–80px

    return {
      id: i,
      src: images[Math.floor(Math.random() * images.length)],
      size,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2,

      xPath: [
        0,
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        0,
      ],

      rotatePath: [0, Math.random() * 200, Math.random() * 400],
    };
  });
}

export function Leaves({ count = 8 }: { count?: number }) {
  const leaves = generateLeaves(count);

  return (
    <>
      {leaves.map((leaf) => (
        <motion.img
          key={leaf.id}
          src={leaf.src}
          alt="leaf"
          width={leaf.size}
          className="absolute top-0 drop-shadow-xl blur-[0.6px]"
          style={{ left: leaf.left }}
          initial={{ opacity: 1, y: 0, x: 0 }}
          animate={{
            opacity: [1, 1, 0],
            y: [0, 700],
            x: leaf.xPath,
            rotate: leaf.rotatePath,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
