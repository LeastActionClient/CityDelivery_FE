import { motion, useScroll, useTransform } from 'framer-motion';

/** Decorative drifting geometry (CSS/SVG only — zero WebGL cost). */
export default function FloatingShapes({ dark = false }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, 60]);
  const tone = dark ? 'bg-brand-yellow/10' : 'bg-brand-yellow/35';

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div style={{ y: y1 }} className={`absolute -left-24 top-24 h-72 w-72 rounded-[42%_58%_60%_40%/50%_40%_60%_50%] ${tone} blur-2xl`} />
      <motion.div style={{ y: y2 }} className={`absolute -right-20 top-1/3 h-96 w-96 rounded-full ${tone} blur-3xl`} />
      <div className="absolute right-[12%] top-24 h-10 w-10 rotate-12 animate-floaty rounded-xl border-4 border-brand-yellow/70" />
      <div className="absolute bottom-24 left-[8%] h-6 w-6 animate-floaty rounded-full bg-brand-green/60 [animation-delay:1.5s]" />
      <div className="absolute left-[45%] top-12 h-8 w-8 animate-spin-slow rounded-md border-2 border-brand-green/40" />
      <div className="grain absolute inset-0 opacity-60" />
    </div>
  );
}
