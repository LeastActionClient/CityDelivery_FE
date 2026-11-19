import { motion } from 'framer-motion';
import logo from '../assets/Logo.png';

/** Suspense fallback — the brand logo with a gentle pulse. */
export default function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-light" role="status" aria-live="polite">
      <motion.img
        src={logo}
        alt=""
        width={669}
        height={373}
        fetchpriority="high"
        className="h-20 w-auto select-none object-contain sm:h-24"
        animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
