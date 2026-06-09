import { Variants, Transition } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 28 };
export const springFast: Transition = { type: 'spring', stiffness: 500, damping: 30 };
export const smooth: Transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
export const smoothFast: Transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -8, scale: 0.995 },
};

export const pageTransition: Transition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideFromRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};
