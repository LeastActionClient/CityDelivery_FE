import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppFloat from '../components/WhatsAppFloat.jsx';
import { pageVariants } from '../animations/variants.js';

export default function MainLayout() {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-yellow focus:px-5 focus:py-3 focus:font-bold">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
