"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Slide direction; defaults to up */
  from?: "up" | "left" | "right" | "none";
};

export function Reveal({ children, delay = 0, className, from = "up" }: RevealProps) {
  const reduce = useReducedMotion();
  const offset = reduce || from === "none" ? {} : from === "up" ? { y: 24 } : from === "left" ? { x: -24 } : { x: 24 };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
