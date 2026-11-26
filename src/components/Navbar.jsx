import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bike,
  ChevronDown,
  CookingPot,
  FileText,
  Gift,
  HeartPulse,
  History,
  Menu,
  Package,
  Search,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
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
  { label: 'Documents', category: 'Documents', icon: FileText },
  { label: 'Other', category: 'Other', icon: Package },
];

const serviceLink = (category) => `/request?category=${encodeURIComponent(category)}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  /* thin scroll-progress line at the bottom of the bar */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });

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
    `relative rounded-full px-4 py-2 text-[15px] font-bold transition-all duration-200 ${
      isActive ? 'text-brand-dark' : 'text-brand-dark/70 hover:-translate-y-0.5 hover:text-brand-dark'
    }`;

  /* 3D "pressable" pill buttons */
  const riderCtaCls = ({ isActive }) =>
    `hidden min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-b from-brand-yellow to-brand-yellow-deep px-5 text-sm font-extrabold text-brand-dark shadow-[0_4px_0_0_rgba(20,20,20,0.85)] ring-1 ring-brand-dark/80 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(20,20,20,0.85)] active:translate-y-1 active:shadow-[0_0_0_0_rgba(20,20,20,0.85)] sm:inline-flex ${
      isActive ? 'ring-2 ring-brand-dark' : ''
    }`;

  const franchiseCtaCls = ({ isActive }) =>
    `hidden min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-b from-brand-dark to-black px-5 text-sm font-extrabold text-brand-yellow shadow-[0_4px_0_0_rgba(255,214,10,0.55)] ring-1 ring-white/10 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(255,214,10,0.55)] active:translate-y-1 active:shadow-none md:inline-flex ${
      isActive ? 'ring-2 ring-brand-yellow' : ''
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`relative mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'bg-white/90 shadow-[0_14px_40px_-12px_rgba(20,20,20,0.35),0_4px_0_0_rgba(255,214,10,0.9)] ring-1 ring-brand-dark/10 backdrop-blur-xl'
            : 'bg-transparent shadow-none ring-0 backdrop-blur-none'
        }`}
      >
        {/* top highlight for a glossy 3D edge */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <Logo />

        <nav className="hidden items-center gap-1 rounded-full bg-brand-dark/[0.04] p-1 ring-1 ring-brand-dark/5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-brand-yellow to-brand-yellow-deep shadow-[0_3px_0_0_rgba(20,20,20,0.85)] ring-1 ring-brand-dark/70"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <NavLink to="/become-a-rider" className={riderCtaCls}>
            <Bike size={16} /> Become a Rider
          </NavLink>
          <NavLink to="/become-a-franchise" className={franchiseCtaCls}>
            <Store size={16} /> Franchise
          </NavLink>

          {/* Request a Service mega dropdown */}
          <div className="group relative hidden sm:block">
            <Button to="/request" size="sm" magnetic aria-haspopup="menu">
              Request a Service
              <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
            </Button>
            <div className="invisible absolute right-0 top-full z-[70] w-[22rem] translate-y-2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div
                role="menu"
                aria-label="Request service options"
                className="relative overflow-hidden rounded-4xl bg-white p-3 shadow-[0_30px_60px_-20px_rgba(20,20,20,0.45),0_8px_0_0_rgba(255,214,10,0.95)] ring-1 ring-brand-dark/10"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-yellow/30 blur-2xl" />
                <NavLink
                  to="/request"
                  role="menuitem"
                  className="group/item relative flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-black px-4 py-3.5 text-white shadow-[0_4px_0_0_rgba(255,214,10,0.7)] transition hover:-translate-y-0.5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Sparkles size={18} /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-extrabold">General request</span>
                    <span className="block text-xs font-medium text-white/60">Tell us what you need delivered</span>
                  </span>
                  <ArrowRight size={17} className="text-brand-yellow transition-transform group-hover/item:translate-x-1" />
                </NavLink>
                <NavLink
                  to="/request/status"
                  role="menuitem"
                  className="mt-2 flex items-center gap-3 rounded-2xl bg-brand-light px-4 py-3 text-sm font-bold text-brand-dark ring-1 ring-brand-dark/5 transition hover:bg-brand-yellow"
                >
                  <Search size={18} /> Check request status
                </NavLink>
                <NavLink
                  to="/request/history"
                  role="menuitem"
                  className="mt-2 flex items-center gap-3 rounded-2xl bg-brand-light px-4 py-3 text-sm font-bold text-brand-dark ring-1 ring-brand-dark/5 transition hover:bg-brand-yellow"
                >
                  <History size={18} /> My requests
                </NavLink>

                <p className="px-2 pb-2 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-muted">Request by service</p>
                <div className="grid grid-cols-2 gap-2">
                  {REQUEST_SERVICES.map(({ label, category, icon: Icon }) => (
                    <NavLink
                      key={category}
                      to={serviceLink(category)}
                      role="menuitem"
                      className="group/tile flex items-center gap-2.5 rounded-2xl bg-brand-light px-3 py-2.5 text-[13px] font-bold text-brand-dark ring-1 ring-brand-dark/5 transition-all duration-200 hover:-translate-y-1 hover:bg-brand-yellow hover:shadow-[0_5px_0_0_rgba(20,20,20,0.85)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-brand-dark shadow-soft transition group-hover/tile:bg-brand-dark group-hover/tile:text-brand-yellow">
                        <Icon size={16} />
                      </span>
                      <span className="leading-tight">{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-b from-brand-dark to-black text-brand-yellow shadow-[0_4px_0_0_rgba(255,214,10,0.6)] transition active:translate-y-1 active:shadow-none lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="pointer-events-none absolute inset-x-6 bottom-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-brand-yellow via-brand-yellow-deep to-brand-dark"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="relative mx-auto mt-3 max-h-[calc(100vh-6rem)] max-w-7xl overflow-y-auto rounded-4xl bg-gradient-to-b from-brand-dark to-black p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6),0_6px_0_0_rgba(255,214,10,0.8)] ring-1 ring-white/10 lg:hidden"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-yellow/25 blur-3xl" />
            <ul className="relative flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `flex min-h-[52px] items-center justify-between rounded-2xl px-4 font-display text-xl font-bold transition ${
                        isActive
                          ? 'bg-gradient-to-b from-brand-yellow to-brand-yellow-deep text-brand-dark shadow-[0_4px_0_0_rgba(255,255,255,0.18)]'
                          : 'text-white/90 hover:bg-white/5'
                      }`
                    }
                  >
                    {l.label}
                    <ArrowRight size={18} className="opacity-60" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="relative mt-4 grid gap-2">
              <NavLink
                to="/become-a-rider"
                className={({ isActive }) =>
                  `flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-extrabold text-brand-dark shadow-[0_5px_0_0_rgba(255,255,255,0.2)] transition active:translate-y-1 active:shadow-none ${
                    isActive ? 'bg-brand-yellow-deep' : 'bg-gradient-to-b from-brand-yellow to-brand-yellow-deep'
                  }`
                }
              >
                <Bike size={18} /> Become a Rider <ArrowRight size={17} />
              </NavLink>
              <NavLink
                to="/become-a-franchise"
                className={({ isActive }) =>
                  `flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-extrabold ring-1 transition ${
                    isActive ? 'bg-brand-yellow text-brand-dark ring-brand-yellow' : 'bg-white/10 text-white ring-white/20 hover:bg-white/15'
                  }`
                }
              >
                <Store size={18} /> Become a Franchise Partner <ArrowRight size={17} />
              </NavLink>
              <Button to="/request" className="w-full" size="lg">
                Request a Service <ArrowRight size={18} />
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/request/status"
                  className={({ isActive }) =>
                    `flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-3 text-sm font-extrabold transition ${
                      isActive ? 'bg-brand-yellow text-brand-dark' : 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15'
                    }`
                  }
                >
                  <Search size={17} /> Request Status
                </NavLink>
                <NavLink
                  to="/request/history"
                  className={({ isActive }) =>
                    `flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-3 text-sm font-extrabold transition ${
                      isActive ? 'bg-brand-yellow text-brand-dark' : 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15'
                    }`
                  }
                >
                  <History size={17} /> My Requests
                </NavLink>
              </div>
            </div>

            <div className="relative mt-4 rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <p className="px-2 pb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-yellow">Request by service</p>
              <div className="grid grid-cols-2 gap-2">
                {REQUEST_SERVICES.map(({ label, category, icon: Icon }) => (
                  <NavLink
                    key={category}
                    to={serviceLink(category)}
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-brand-yellow hover:text-brand-dark"
                  >
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