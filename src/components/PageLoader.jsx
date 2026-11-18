import { motion } from 'framer-motion';
import { LogoMark } from './Logo.jsx';

/** Suspense fallback — a rotating package mark with three pulsing dots. */
export default function PageLoader() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-brand-light" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <motion.div animate={{ rotate: [0, -8, 8, 0], y: [0, -8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <LogoMark className="h-16 w-16" />
        </motion.div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-brand-green"
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
