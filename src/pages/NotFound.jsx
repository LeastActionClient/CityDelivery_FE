import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import FloatingShapes from '../components/FloatingShapes.jsx';
import { LogoMark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-5 pt-24 text-center">
      <FloatingShapes />
      <div>
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, -4, 4, 0] }} transition={{ duration: 5, repeat: Infinity }} className="mx-auto w-fit">
          <LogoMark className="h-28 w-28" />
        </motion.div>
        <h1 className="mt-8 text-7xl font-extrabold text-brand-dark sm:text-8xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-brand-muted">This page seems to have gone missing in transit.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/">Back to home</Button>
          <Button to="/request" variant="outline">Request a Product</Button>
        </div>
      </div>
    </section>
  );
}
