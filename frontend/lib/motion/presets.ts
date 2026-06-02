import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
