import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCanHover, usePrefersReducedMotion } from '../hooks/useEnvironment.js';

/** Subtle magnetic pull toward the cursor. Disabled on touch devices and for reduced motion. */
export default function Magnetic({ children, strength = 0.25, className = 'inline-block' }) {
  const ref = useRef(null);
  const canHover = useCanHover();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (!canHover || reduced) return <span className={className}>{children}</span>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset} className={className}>
      {children}
    </motion.span>
  );
}
