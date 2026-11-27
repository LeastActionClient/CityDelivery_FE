import { useEffect } from 'react';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ClipboardList } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppFloat from '../components/WhatsAppFloat.jsx';
import { pageVariants } from '../animations/variants.js';

function MobileRequestFloat() {
  return (
    <motion.div
      className="fixed bottom-5 left-4 z-[60] lg:hidden"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link
        to="/request"
        aria-label="Request a Service"
        className="flex items-center gap-2.5 rounded-full bg-brand-dark py-2 pl-2 pr-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(17,23,19,.35)] ring-1 ring-white/15"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-dark">
          <ClipboardList size={18} />
        </span>
        <span className="whitespace-nowrap">Request a Service</span>
        <ArrowUpRight size={16} className="shrink-0 text-brand-yellow" />
      </Link>
    </motion.div>
  );
}

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
      <MobileRequestFloat />
      <WhatsAppFloat />
    </div>
  );
}
