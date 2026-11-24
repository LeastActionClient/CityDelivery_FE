import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSignature,
  HelpCircle,
  MapPin,
  Package,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { breadcrumbSchema, businessSchema, faqSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import Button from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { getFranchiseConfig } from '../services/api.js';
import franchisePartnerImage from '../assets/GalleryImages/Gal7.png';
import { SITE } from '../utils/config.js';
import { formatCurrency } from '../utils/franchise.js';

/* ------------------------------------------------------------------ */
/*  IMAGES – swap any of these with your own files in /assets anytime. */
/*  If a remote image fails to load, the local Gal7 image is used.     */
/* ------------------------------------------------------------------ */
const IMG = {
  courier: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80',
  customer: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80',
  bike: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=70',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=70',
  van: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70',
  parcel: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
  map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=70',
  team: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=70',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70',
  shop: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=70',
  handshake: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=70',
  city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=70',
};

const fallbackImage = (e) => {
  if (e.currentTarget.dataset.fallback) return;
  e.currentTarget.dataset.fallback = '1';
  e.currentTarget.src = franchisePartnerImage;
};

function Img({ src, alt, className = '' }) {
  return <img src={src} alt={alt} loading="lazy" onError={fallbackImage} className={className} />;
}

const FAQ = [
  {
    q: 'What does a City Delivery Services franchise partner do?',
    a: 'A franchise partner helps expand local delivery operations in an assigned area. The exact operating scope, responsibilities and territory are confirmed only after review and in a written agreement.',
  },
  {
    q: 'Is the initial payment mandatory?',
    a: 'No. You can submit your application without paying. If you choose to pay, the payment policy shown with your application applies. Submission does not guarantee approval, an agreement, territory or income.',
  },
  {
    q: 'Does applying guarantee approval or income?',
    a: 'No. Submission and payment do not guarantee approval, an agreement, exclusive territory, deliveries or income. Every application is reviewed individually.',
  },
  {
    q: 'Can I pay after submitting the application?',
    a: 'Yes. The initial payment is optional. Save your Application ID and use the status page to pay any time that suits you. Your application stays under review.',
  },
  {
    q: 'What happens after I apply?',
    a: 'Your application starts under review. Our team may contact you for more information, then update the status as approved, rejected, agreement pending or active.',
  },
  {
    q: 'Can I check my application status?',
    a: 'Yes. Save the Application ID shown after submission and use the franchise status page. No login is needed.',
  },
];

const BENEFITS = [
  { icon: MapPin, title: 'Local opportunity', text: 'Tell us the city, district and operating area you want to support.' },
  { icon: ClipboardCheck, title: 'Clear review process', text: 'Every application is reviewed by our team before any next steps are offered.' },
  { icon: Truck, title: 'Delivery operations support', text: 'Discuss local delivery operations, vehicle capacity and office readiness with our team.' },
  { icon: BadgeCheck, title: 'Status transparency', text: 'Track your application using your Application ID at any time.' },
];

const REVIEW_POINTS = [
  { icon: Route, img: IMG.map, title: 'Operating area', text: 'The city, district and local area you propose to support.' },
  { icon: Store, img: IMG.shop, title: 'Office readiness', text: 'Whether you already have a shop or office for local coordination.' },
  { icon: Truck, img: IMG.van, title: 'Vehicle capacity', text: 'How many bikes, cars, lorries or other vehicles you can arrange.' },
  { icon: ClipboardCheck, img: IMG.office, title: 'Business readiness', text: 'Your experience, investment capacity and optional supporting documents.' },
];

const WHO_CAN_APPLY = [
  { img: IMG.shop, title: 'Local shop or office owners', text: 'You have a base to coordinate deliveries and communicate with customers.' },
  { img: IMG.team, title: 'Delivery operations teams', text: 'You can arrange vehicles, riders and day-to-day local delivery processes.' },
  { img: IMG.map, title: 'Area-focused operators', text: 'You understand your locality and want to grow delivery coverage in it.' },
];

const STEPS = [
  { n: '01', icon: FileSignature, title: 'Apply', text: 'Share your details, location and operating capacity.' },
  { n: '02', icon: Wallet, title: 'Initial payment', text: null },
  { n: '03', icon: ClipboardCheck, title: 'Review', text: 'Our team reviews your application and may contact you.' },
  { n: '04', icon: BadgeCheck, title: 'Agreement', text: 'Approved partners move through agreement and activation.' },
];

/* Cards that glide right → left */
const SHOWCASE = [
  { img: IMG.parcel, icon: Package, title: 'Parcel & document delivery', text: 'Local pickups and drop-offs coordinated from your area.' },
  { img: IMG.bike, icon: Bike, title: 'Bike rider network', text: 'Arrange riders for quick, last-mile local deliveries.' },
  { img: IMG.van, icon: Truck, title: 'Vehicle capacity', text: 'Bikes, cars, lorries or other vehicles you can arrange.' },
  { img: IMG.warehouse, icon: Store, title: 'Local coordination hub', text: 'A shop or office base to manage orders and customers.' },
  { img: IMG.map, icon: MapPin, title: 'Area coverage', text: 'Grow delivery coverage across your city and district.' },
  { img: IMG.team, icon: Users, title: 'Team & riders', text: 'Organise people and day-to-day local operations.' },
  { img: IMG.customer, icon: Zap, title: 'Customer support', text: 'Support customers in your area with clear communication.' },
];

const CHIPS = [
  'Local delivery', 'Last-mile coordination', 'Rider management', 'Vehicle planning', 'Office operations',
  'Customer support', 'Area expansion', 'Status tracking', 'Written agreement', 'Individual review',
];

const NEEDS = [
  'Your name, mobile number and email address',
  'State, district, city, PIN code and proposed operating area',
  'Business experience and investment capacity',
  'Office or shop availability and vehicle count',
  'Optional business or address proof documents',
];

const PAGE_CSS = `
@keyframes cds-marquee-rtl { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cds-marquee { display: flex; width: max-content; animation: cds-marquee-rtl var(--cds-speed, 45s) linear infinite; }
.cds-marquee-wrap:hover .cds-marquee { animation-play-state: paused; }
.cds-dots { background-image: radial-gradient(rgba(20,20,20,0.07) 1.2px, transparent 1.2px); background-size: 26px 26px; }
.cds-dots-light { background-image: radial-gradient(rgba(255,255,255,0.08) 1.2px, transparent 1.2px); background-size: 26px 26px; }
@keyframes cds-shine { 0% { transform: translateX(-120%) skewX(-20deg); } 60%, 100% { transform: translateX(260%) skewX(-20deg); } }
.cds-shine::after { content: ''; position: absolute; inset: 0; width: 35%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent); animation: cds-shine 5s ease-in-out infinite; pointer-events: none; }
@keyframes cds-spin-slow { to { transform: rotate(360deg); } }
.cds-spin-slow { animation: cds-spin-slow 40s linear infinite; }
@media (prefers-reduced-motion: reduce) { .cds-marquee, .cds-shine::after, .cds-spin-slow { animation: none; } }
`;

/* ---------- 3D tilt wrapper: card follows the cursor in 3D ---------- */
function Tilt({ children, className = '', max = 8 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 170, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 170, damping: 18 });

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Float({ children, className = '', delay = 0, amount = 10 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

function Marquee({ children, speed = 45, fade = 'from-white' }) {
  return (
    <div className="cds-marquee-wrap relative overflow-hidden py-6" style={{ perspective: '1200px' }}>
      <div className="cds-marquee gap-5 pr-5 sm:gap-6 sm:pr-6" style={{ '--cds-speed': `${speed}s` }}>
        {children}
        {children}
      </div>
      <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r ${fade} to-transparent sm:w-24`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l ${fade} to-transparent sm:w-24`} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, dark = false, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] sm:text-xs ${dark ? 'bg-brand-yellow/15 text-brand-yellow ring-1 ring-brand-yellow/30' : 'bg-brand-yellow/25 text-brand-dark ring-1 ring-brand-yellow/50'}`}>
        <Sparkles size={13} /> {eyebrow}
      </span>
      <h2 className={`mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-white/70' : 'text-brand-muted'}`}>{text}</p>}
    </div>
  );
}

const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-sm font-extrabold text-brand-dark shadow-lift ring-1 ring-brand-dark/5 transition duration-200 hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0';
const darkBtn =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-7 py-3.5 text-sm font-extrabold text-white shadow-lift transition duration-200 hover:-translate-y-0.5 hover:bg-black active:translate-y-0';
const outlineBtn =
  'inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-brand-dark ring-1 ring-brand-dark/15 transition duration-200 hover:-translate-y-0.5 hover:ring-brand-dark/30';

export default function BecomeFranchise() {
  const [config, setConfig] = useState(null);
  const description = `Apply to become a City Delivery Services franchise partner in ${SITE.serviceCity}. Review the process, optional initial payment and status updates before applying.`;
  const feeText = config ? formatCurrency(config.applicationFee, config.currency) : '₹1,000';

  useEffect(() => {
    let active = true;
    getFranchiseConfig()
      .then((response) => { if (active) setConfig(response.data); })
      .catch(() => { if (active) setConfig(null); });
    return () => { active = false; };
  }, []);

  const stats = [
    { icon: Wallet, value: feeText, label: 'Optional initial payment' },
    { icon: ClipboardCheck, value: '4 steps', label: 'Apply to activation' },
    { icon: ShieldCheck, value: 'No login', label: 'Track with Application ID' },
    { icon: BadgeCheck, value: '1-by-1', label: 'Every application reviewed' },
  ];

  return (
    <div className="overflow-x-hidden">
      <style>{PAGE_CSS}</style>
      <SEO
        title="Become a Franchise Partner | City Delivery Services"
        description={description}
        path="/become-a-franchise"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({ path: '/become-a-franchise', name: 'Become a Franchise Partner', description, breadcrumb: true }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Become a Franchise Partner', path: '/become-a-franchise' }], '/become-a-franchise'),
          faqSchema(FAQ),
        ]}
      />

      <PageHero
        eyebrow="Franchise partner"
        title="Grow delivery with City Delivery Services"
        description={`We are accepting franchise partner applications in and around ${SITE.serviceCity}. Review the opportunity, submit your details and track your application.`}
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/franchise/register">Apply now</Button>
          <Button to="/franchise/status" variant="outline">Check application status</Button>
        </div>
      </PageHero>

      {/* ================= INTRO STAGE (SOFT YELLOW → WHITE) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-yellow/20 via-white to-white px-4 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="cds-spin-slow pointer-events-none absolute -right-48 -top-48 h-[32rem] w-[32rem] rounded-full border-[28px] border-dashed border-brand-yellow/25" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-yellow/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTitle
              center={false}
              eyebrow="Your city. Local delivery."
              title="A clear process to build your own delivery base"
              text="We are building a local delivery network. Franchise partners help expand coverage, coordinate local operations and support customers in their area."
            />
            <ul className="mt-7 space-y-3">
              {['Applications are reviewed individually', 'Terms are confirmed in writing', 'Track progress any time with your Application ID'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-bold text-brand-dark sm:text-base">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-dark"><CheckCircle2 size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/franchise/register" className={primaryBtn}>Start application <ArrowRight size={16} /></Link>
              <Link to="/franchise/status" className={outlineBtn}>Check status</Link>
            </div>
          </div>

          {/* 3D photo collage */}
          <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[28rem] sm:max-w-lg" style={{ perspective: '1200px' }}>
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -24 }}
              whileInView={{ opacity: 1, x: 0, rotateY: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute left-0 top-4 h-52 w-52 overflow-hidden rounded-[2rem] bg-white p-1.5 shadow-lift ring-1 ring-brand-dark/10 sm:h-72 sm:w-72"
            >
              <Img src={IMG.handshake} alt="Courier handing over a parcel" className="h-full w-full rounded-[1.6rem] object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -24 }}
              whileInView={{ opacity: 1, x: 0, rotateY: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="absolute bottom-0 right-0 h-52 w-52 overflow-hidden rounded-[2rem] bg-white p-1.5 shadow-lift ring-1 ring-brand-dark/10 sm:h-72 sm:w-72"
            >
              <img src={franchisePartnerImage} alt="Delivery partner supporting local deliveries" className="h-full w-full rounded-[1.6rem] object-cover" loading="lazy" />
            </motion.div>
            <Float className="absolute right-2 top-0 sm:right-8" delay={0.2}>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-extrabold text-brand-dark shadow-lift ring-1 ring-brand-dark/5 sm:px-4 sm:py-3 sm:text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-yellow"><Bike size={15} /></span> Local riders
              </div>
            </Float>
            <Float className="absolute bottom-16 left-0 sm:bottom-24 sm:-left-4" delay={0.8} amount={14}>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-extrabold text-brand-dark shadow-lift ring-1 ring-brand-dark/5 sm:px-4 sm:py-3 sm:text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-yellow"><MapPin size={15} /></span> Your area
              </div>
            </Float>
            <Float className="absolute left-[38%] top-[44%]" delay={1.4} amount={8}>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-dark text-brand-yellow shadow-lift sm:h-16 sm:w-16">
                <Package size={28} />
              </span>
            </Float>
          </div>
        </div>

        {/* stats */}
        <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:mt-20 sm:gap-5 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Tilt max={10} className="cds-shine relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-3xl bg-white p-4 shadow-soft ring-1 ring-brand-dark/5 sm:flex-row sm:items-center sm:p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark sm:h-12 sm:w-12" style={{ transform: 'translateZ(24px)' }}><Icon size={22} /></span>
                <div>
                  <p className="font-display text-xl font-extrabold leading-none text-brand-dark sm:text-2xl">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-muted sm:text-sm">{label}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY PARTNER (CREAM) ================= */}
      <section className="relative overflow-hidden bg-brand-light px-4 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-brand-yellow/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle eyebrow="Why partner with us" title="Opportunity with clear expectations" text="Everything you need to know before you apply — in plain language." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" style={{ perspective: '1200px' }}>
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <motion.div key={title} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Tilt className="group relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ring-brand-dark/5 transition-shadow hover:shadow-lift">
                  <div className="absolute inset-x-0 top-0 h-1 bg-brand-yellow" />
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow/25 text-brand-dark transition group-hover:bg-brand-yellow" style={{ transform: 'translateZ(30px)' }}><Icon size={26} /></span>
                  <h3 className="mt-5 text-lg font-extrabold text-brand-dark sm:text-xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{text}</p>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MOVING CARDS RIGHT → LEFT (WHITE) ================= */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="relative px-4 sm:px-8">
          <SectionTitle eyebrow="What you can support" title="Local delivery, built around your area" text="A glimpse of the day-to-day work franchise partners discuss with our team. Exact scope is confirmed in a written agreement." />
        </div>

        <div className="relative mt-10">
          <Marquee speed={60} fade="from-white">
            {SHOWCASE.map(({ img, icon: Icon, title, text }) => (
              <div
                key={title}
                className="group relative h-80 w-64 shrink-0 overflow-hidden rounded-3xl shadow-lift ring-1 ring-brand-dark/10 transition duration-500 [transform:perspective(900px)_rotateY(-6deg)] hover:[transform:perspective(900px)_rotateY(0deg)_translateY(-8px)] sm:h-96 sm:w-80"
              >
                <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/35 to-transparent" />
                <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft"><Icon size={22} /></span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-lg font-extrabold text-white sm:text-xl">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">{text}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* keyword ribbon */}
        <div className="relative mt-6 border-y border-brand-yellow/50 bg-brand-yellow/30 py-3">
          <Marquee speed={38} fade="from-brand-yellow/30">
            {CHIPS.map((chip) => (
              <span key={chip} className="inline-flex shrink-0 items-center gap-3 text-sm font-extrabold uppercase tracking-wide text-brand-dark sm:text-base">
                <Sparkles size={16} /> {chip}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ================= HOW IT WORKS (SOFT YELLOW) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-yellow/20 to-brand-light px-4 py-16 sm:px-8 sm:py-24">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle eyebrow="How it works" title="From application to activation" />
          <div className="relative mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-4" style={{ perspective: '1200px' }}>
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden h-px border-t-2 border-dashed border-brand-yellow-deep/40 md:block" />
            {STEPS.map(({ n, icon: Icon, title, text }, index) => (
              <motion.div key={n} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12, duration: 0.55 }}>
                <Tilt className="relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ring-brand-dark/5">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft" style={{ transform: 'translateZ(34px)' }}>
                    <Icon size={26} />
                  </span>
                  <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-brand-yellow/50">{n}</span>
                  <h3 className="mt-5 text-lg font-extrabold text-brand-dark sm:text-xl" style={{ transform: 'translateZ(18px)' }}>{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {text || `Optional: pay ${feeText} now or later from the status page.`}
                  </p>
                </Tilt>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-4 text-center text-sm leading-relaxed text-brand-muted ring-1 ring-brand-yellow/40 sm:p-5">
            The initial payment policy ({config?.refundPolicy || 'as shown at payment'}) is displayed before payment. Submission does not guarantee approval, an agreement, exclusive territory or income.
          </p>
        </div>
      </section>

      {/* ================= REVIEW CRITERIA (DARK CONTRAST) ================= */}
      <section className="relative overflow-hidden bg-brand-dark px-4 py-16 sm:px-8 sm:py-24">
        <div className="cds-dots-light pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-yellow/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle dark center={false} eyebrow="Review criteria" title="What our team looks at" text="We review the details you share to understand whether the proposed local setup can support delivery operations. Review does not guarantee approval." />
            <Link to="/franchise/register" className={`${primaryBtn} self-start md:self-auto`}>Start application <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" style={{ perspective: '1200px' }}>
            {REVIEW_POINTS.map(({ icon: Icon, img, title, text }, index) => (
              <motion.div key={title} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Tilt className="group h-full overflow-hidden rounded-3xl bg-white shadow-lift">
                  <div className="relative h-40 overflow-hidden sm:h-44">
                    <Img src={img} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                    <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft" style={{ transform: 'translateZ(30px)' }}><Icon size={22} /></span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-extrabold text-brand-dark sm:text-xl">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">{text}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLEXIBLE PAYMENT (CREAM) ================= */}
      <section className="relative overflow-hidden bg-brand-light px-4 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-yellow/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTitle center={false} eyebrow="Flexible initial payment" title="Apply first. Pay when you are ready." text="The initial payment is optional. Submit your application, save your Application ID and return to the status page whenever you want to complete the payment." />
            <div className="mt-8 space-y-3">
              {['Submit your franchise application', 'Save the Application ID shown afterwards', 'Open the status page and pay any time'].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-dark/5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-yellow text-sm font-extrabold text-brand-dark">0{index + 1}</span>
                  <span className="text-sm font-bold text-brand-dark sm:text-base">{step}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/franchise/status" className={darkBtn}>Open status page <ArrowRight size={16} /></Link>
            </div>
          </div>

          <Reveal>
            <div className="relative" style={{ perspective: '1200px' }}>
              <Float className="absolute -right-2 -top-5 z-10 sm:-right-3 sm:-top-6" delay={0.3}>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-yellow text-2xl font-extrabold text-brand-dark shadow-lift ring-4 ring-white sm:h-16 sm:w-16 sm:text-3xl">₹</span>
              </Float>
              <Tilt max={6} className="cds-shine relative overflow-hidden rounded-[2rem] bg-brand-dark p-7 text-white shadow-lift sm:p-10">
                <Img src={IMG.city} alt="City delivery coverage" className="absolute inset-0 h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/70 to-brand-dark" />
                <div className="relative">
                  <Wallet className="text-brand-yellow" size={38} />
                  <p className="mt-6 font-display text-5xl font-extrabold text-brand-yellow sm:text-6xl" style={{ transform: 'translateZ(30px)' }}>{feeText}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55 sm:text-sm">Optional initial payment</p>
                  <div className="mt-7 space-y-5 border-t border-white/15 pt-7">
                    {[
                      { icon: Clock3, title: 'Pay now or later', text: 'Your Application ID unlocks the payment option on the status page.' },
                      { icon: ShieldCheck, title: 'Secure payment flow', text: 'Payment is handled by the payment provider when online payment is enabled.' },
                      { icon: CheckCircle2, title: 'Review continues', text: 'Your application remains under review whether or not you pay.' },
                    ].map(({ icon: Icon, title, text }) => (
                      <div key={title} className="flex gap-4">
                        <Icon size={21} className="mt-0.5 shrink-0 text-brand-yellow" />
                        <div>
                          <p className="font-extrabold">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/65">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tilt>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= WHO CAN APPLY (WHITE) ================= */}
      <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-8 sm:py-24">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle eyebrow="Who can apply" title="Local operators with a clear plan" text="If you can support local delivery coordination in a defined area, we would like to review your application. Terms are confirmed only after review and in writing." />
          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8" style={{ perspective: '1200px' }}>
            {WHO_CAN_APPLY.map(({ img, title, text }, index) => (
              <motion.div key={title} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
                <Tilt className="group relative h-80 overflow-hidden rounded-3xl text-left shadow-lift ring-1 ring-brand-dark/10 sm:h-96">
                  <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/35 to-transparent" />
                  <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft" style={{ transform: 'translateZ(30px)' }}><BadgeCheck size={22} /></span>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6" style={{ transform: 'translateZ(18px)' }}>
                    <h3 className="text-xl font-extrabold text-white sm:text-2xl">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{text}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEEDS + FAQ (SOFT YELLOW) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-brand-yellow/20 px-4 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-yellow/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionTitle center={false} eyebrow="What you will need" title="Keep these ready" />
            <ul className="mt-7 space-y-3">
              {NEEDS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-dark/5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-yellow/30 text-brand-dark"><Building2 size={17} /></span>
                  <span className="pt-0.5 text-sm font-semibold text-brand-dark sm:text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
            <div className="relative mt-7 hidden h-52 overflow-hidden rounded-3xl shadow-lift ring-1 ring-brand-dark/10 sm:block">
              <Img src={IMG.handshake} alt="Partnership agreement" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 to-transparent" />
              <p className="absolute bottom-5 left-6 max-w-xs font-display text-2xl font-extrabold text-white sm:text-3xl">Terms are confirmed <span className="text-brand-yellow">in writing.</span></p>
            </div>
          </div>
          <div>
            <SectionTitle center={false} eyebrow="Questions" title="Franchise FAQs" />
            <div className="mt-7 space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-dark/5 transition open:ring-brand-yellow sm:p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-brand-dark sm:text-base">
                    <span className="flex items-center gap-3"><HelpCircle size={18} className="shrink-0 text-brand-yellow-deep" />{q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-yellow/30 text-lg leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-brand-yellow/20 px-4 py-16 sm:px-8 sm:py-24">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl" style={{ perspective: '1200px' }}>
          <Tilt max={4} className="relative overflow-hidden rounded-[2rem] bg-brand-dark p-8 text-center text-white shadow-lift sm:p-16">
            <Img src={IMG.city} alt="City skyline" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 to-brand-dark" />
            <div className="relative">
              <Float className="mx-auto w-fit">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-yellow text-brand-dark shadow-lift sm:h-20 sm:w-20">
                  <FileSignature size={32} />
                </span>
              </Float>
              <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">Ready to <span className="text-brand-yellow">apply?</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/75 sm:text-lg">
                Complete the application, review the optional initial payment and save your Application ID to track progress.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/franchise/register" className={primaryBtn}>Start application <ArrowRight size={16} /></Link>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-extrabold text-white ring-1 ring-white/30 transition hover:bg-white/10">
                  Ask a question
                </Link>
              </div>
            </div>
          </Tilt>
        </div>
      </section>
    </div>
  );
}