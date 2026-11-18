import { motion } from 'framer-motion';
import FloatingShapes from './FloatingShapes.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

/** Header band for inner pages. */
export default function PageHero({ eyebrow, title, description, children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-yellow-soft/60 to-brand-light pb-16 pt-36 sm:pb-20 sm:pt-44">
      <FloatingShapes />
      <motion.div variants={stagger(0.05, 0.1)} initial="hidden" animate="show" className="container-x max-w-4xl text-center">
        {eyebrow && (
          <motion.span variants={fadeUp} className="eyebrow">{eyebrow}</motion.span>
        )}
        <motion.h1 variants={fadeUp} className="mt-6 text-5xl font-extrabold leading-[1.05] text-brand-dark sm:text-6xl">
          {title}
        </motion.h1>
        {description && (
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">
            {description}
          </motion.p>
        )}
        {children && <motion.div variants={fadeUp} className="mt-8">{children}</motion.div>}
      </motion.div>
    </section>
  );
}
