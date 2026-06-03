"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, staggerContainer } from "@/lib/motion/presets";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
};

export function MotionReveal({ children, className, stagger = false }: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={stagger ? staggerContainer : fadeUp}
    >
      {children}
    </motion.div>
  );
}
