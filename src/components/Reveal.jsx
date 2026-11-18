import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../animations/variants.js';

/** Scroll-triggered reveal. `delay` in seconds. */
export function Reveal({ children, delay = 0, variants = fadeUp, className = '', as = 'div' }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Container that staggers any child using `variants={fadeUp}` (or <StaggerItem>). */
export function Stagger({ children, className = '', delay = 0.05, gap = 0.1 }) {
  return (
    <motion.div
      className={className}
      variants={stagger(delay, gap)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
