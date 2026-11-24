import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, Bike, ChevronDown, ShoppingBasket, Shirt, Smartphone, CookingPot, HeartPulse, BookOpen, Gift, Package, Store } from 'lucide-react';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import { NAV_LINKS } from '../utils/config.js';

const REQUEST_SERVICES = [
  { label: 'Groceries', category: 'Groceries', icon: ShoppingBasket },
  { label: 'Fashion & Apparel', category: 'Fashion & Apparel', icon: Shirt },
  { label: 'Electronics', category: 'Electronics', icon: Smartphone },
  { label: 'Home & Kitchen', category: 'Home & Kitchen', icon: CookingPot },
  { label: 'Health & Beauty', category: 'Health & Beauty', icon: HeartPulse },
  { label: 'Books & Stationery', category: 'Books & Stationery', icon: BookOpen },
  { label: 'Gifts', category: 'Gifts', icon: Gift },
  { label: 'Other', category: 'Other', icon: Package },
];

const serviceLink = (category) => `/request?category=${encodeURIComponent(category)}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkCls = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
      isActive ? 'text-brand-dark !font-extrabold' : 'text-black hover:text-brand-dark'
    }`;

  const riderCtaCls = ({ isActive }) =>
    `hidden min-h-[40px] items-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-extrabold text-brand-dark shadow-soft ring-1 ring-brand-yellow-deep/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-yellow-deep hover:text-white sm:inline-flex ${
      isActive ? 'ring-2 ring-brand-dark' : ''
    }`;

  const franchiseCtaCls = ({ isActive }) =>
    `hidden min-h-[40px] items-center gap-2 rounded-full bg-brand-dark px-5 text-sm font-extrabold text-white ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green md:inline-flex ${
      isActive ? 'ring-2 ring-brand-yellow' : ''
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py- transition-all duration-300 sm:px-6 ${
          scrolled ? 'glass shadow-soft' : 'bg-transparent'
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-yellow"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/become-a-rider" className={riderCtaCls}>
            <Bike size={16} /> Become a Rider
          </NavLink>
          <NavLink to="/become-a-franchise" className={franchiseCtaCls}>
            <Store size={16} /> Franchise
          </NavLink>
          <div className="group relative hidden sm:block">
            <Button to="/request" size="sm" magnetic aria-haspopup="menu">
              Request a Service
              <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
            </Button>
            <div className="invisible absolute right-0 top-full z-50 w-72 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div role="menu" aria-label="Request service options" className="rounded-3xl bg-white p-3 shadow-lift ring-1 ring-black/5">
                <p className="px-3 pb-2 pt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-muted">Request a service</p>
                <NavLink to="/request" role="menuitem" className="flex items-center gap-3 rounded-2xl bg-brand-light px-3 py-2.5 text-sm font-extrabold text-brand-dark transition hover:bg-brand-yellow/20">
                  <ArrowRight size={17} className="text-brand-green" /> General request
                </NavLink>
                <div className="my-2 h-px bg-black/5" />
                <div className="grid gap-1">
                  {REQUEST_SERVICES.map(({ label, category, icon: Icon }) => (
                    <NavLink key={category} to={serviceLink(category)} role="menuitem" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-light hover:text-brand-dark">
                      <Icon size={16} className="shrink-0 text-brand-green" /> {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-full bg-brand-dark text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl bg-brand-dark p-4 shadow-lift lg:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `flex min-h-[52px] items-center rounded-2xl px-4 font-display text-xl font-bold ${
                        isActive ? 'bg-brand-yellow text-brand-dark' : 'text-white/90'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <NavLink
              to="/become-a-rider"
              className={({ isActive }) =>
                `mt-3 flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-extrabold text-brand-dark shadow-soft transition ${
                  isActive ? 'bg-brand-yellow-deep text-white' : 'bg-brand-yellow hover:bg-brand-yellow-deep hover:text-white'
                }`
              }
            >
              <Bike size={18} /> Become a Rider <ArrowRight size={17} />
            </NavLink>
            <NavLink
              to="/become-a-franchise"
              className={({ isActive }) =>
                `mt-2 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-extrabold ring-1 transition ${
                  isActive ? 'bg-brand-yellow text-brand-dark ring-brand-yellow' : 'bg-white/10 text-white ring-white/20 hover:bg-white/15'
                }`
              }
            >
              <Store size={18} /> Become a Franchise Partner <ArrowRight size={17} />
            </NavLink>
            <Button to="/request" className="mt-2 w-full" size="lg">
              Request a Service <ArrowRight size={18} />
            </Button>
            <div className="mt-3 rounded-2xl bg-white/5 p-3">
              <p className="px-2 pb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-yellow">Request by service</p>
              <div className="grid grid-cols-2 gap-1">
                {REQUEST_SERVICES.map(({ label, category, icon: Icon }) => (
                  <NavLink key={category} to={serviceLink(category)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white">
                    <Icon size={15} className="shrink-0 text-brand-yellow" /> {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
