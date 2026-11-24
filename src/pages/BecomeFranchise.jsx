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
  courier: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=70',
  bike: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=70',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=70',
  van: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70',
  parcel: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=70',
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
  { img: IMG.courier, icon: Package, title: 'Parcel & document delivery', text: 'Local pickups and drop-offs coordinated from your area.' },
  { img: IMG.bike, icon: Bike, title: 'Bike rider network', text: 'Arrange riders for quick, last-mile local deliveries.' },
  { img: IMG.van, icon: Truck, title: 'Vehicle capacity', text: 'Bikes, cars, lorries or other vehicles you can arrange.' },
  { img: IMG.warehouse, icon: Store, title: 'Local coordination hub', text: 'A shop or office base to manage orders and customers.' },
  { img: IMG.map, icon: MapPin, title: 'Area coverage', text: 'Grow delivery coverage across your city and district.' },
  { img: IMG.team, icon: Users, title: 'Team & riders', text: 'Organise people and day-to-day local operations.' },
  { img: IMG.parcel, icon: Zap, title: 'Customer support', text: 'Support customers in your area with clear communication.' },
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
.cds-dots { background-image: radial-gradient(rgba(20,20,20,0.13) 1.4px, transparent 1.4px); background-size: 24px 24px; }
.cds-dots-light { background-image: radial-gradient(rgba(255,255,255,0.10) 1.4px, transparent 1.4px); background-size: 24px 24px; }
.cds-stripes { background-image: repeating-linear-gradient(135deg, rgba(20,20,20,0.06) 0 14px, transparent 14px 28px); }
@keyframes cds-shine { 0% { transform: translateX(-120%) skewX(-20deg); } 60%, 100% { transform: translateX(260%) skewX(-20deg); } }
.cds-shine::after { content: ''; position: absolute; inset: 0; width: 40%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent); animation: cds-shine 4.5s ease-in-out infinite; pointer-events: none; }
@keyframes cds-spin-slow { to { transform: rotate(360deg); } }
.cds-spin-slow { animation: cds-spin-slow 28s linear infinite; }
@media (prefers-reduced-motion: reduce) { .cds-marquee, .cds-shine::after, .cds-spin-slow { animation: none; } }
`;

/* ---------- 3D tilt wrapper: card follows the cursor in 3D ---------- */
function Tilt({ children, className = '', max = 10 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 16 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 16 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Float({ children, className = '', delay = 0, amount = 12 }) {
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

function Marquee({ children, speed = 45, fade = 'from-brand-yellow' }) {
  return (
    <div className="cds-marquee-wrap relative overflow-hidden py-6" style={{ perspective: '1200px' }}>
      <div className="cds-marquee gap-6 pr-6" style={{ '--cds-speed': `${speed}s` }}>
        {children}
        {children}
      </div>
      <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r ${fade} to-transparent sm:w-28`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l ${fade} to-transparent sm:w-28`} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, dark = false, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] ${dark ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-dark text-brand-yellow'}`}>
        <Sparkles size={14} /> {eyebrow}
      </span>
      <h2 className={`mt-5 text-4xl font-extrabold leading-tight sm:text-5xl ${dark ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
      {text && <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-brand-dark/70'}`}>{text}</p>}
    </div>
  );
}

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
    <>
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

      {/* ================= 3D HERO STAGE (YELLOW) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-yellow via-brand-yellow to-brand-yellow-deep px-4 pb-24 pt-16 sm:px-8">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="cds-spin-slow pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border-[40px] border-dashed border-brand-dark/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle
              center={false}
              eyebrow="Your city. Local delivery."
              title="A clear process to build your own delivery base"
              text="We are building a local delivery network. Franchise partners help expand coverage, coordinate local operations and support customers in their area."
            />
            <ul className="mt-7 space-y-3">
              {['Applications are reviewed individually', 'Terms are confirmed in writing', 'Track progress any time with your Application ID'].map((t) => (
                <li key={t} className="flex items-center gap-3 font-bold text-brand-dark">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-dark text-brand-yellow"><CheckCircle2 size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/franchise/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark px-7 py-4 text-sm font-extrabold text-brand-yellow shadow-[0_6px_0_0_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                Start application <ArrowRight size={16} />
              </Link>
              <Link to="/franchise/status" className="inline-flex items-center justify-center rounded-full bg-white/60 px-7 py-4 text-sm font-extrabold text-brand-dark ring-2 ring-brand-dark transition hover:bg-white">
                Check status
              </Link>
            </div>
          </div>

          {/* 3D stacked photo cards */}
          <div className="relative mx-auto h-[26rem] w-full max-w-lg sm:h-[30rem]" style={{ perspective: '1200px' }}>
            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: -30 }}
              whileInView={{ opacity: 1, x: 0, rotateY: -12 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute left-0 top-6 h-64 w-64 overflow-hidden rounded-4xl shadow-[14px_18px_0_0_rgba(20,20,20,0.9)] ring-4 ring-brand-dark sm:h-72 sm:w-72"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Img src={IMG.courier} alt="Courier handing over a parcel" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: -30 }}
              whileInView={{ opacity: 1, x: 0, rotateY: -12 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="absolute bottom-0 right-0 h-64 w-64 overflow-hidden rounded-4xl shadow-[14px_18px_0_0_rgba(20,20,20,0.9)] ring-4 ring-brand-dark sm:h-72 sm:w-72"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img src={franchisePartnerImage} alt="Delivery partner supporting local deliveries" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
            <Float className="absolute right-4 top-0 sm:right-10" delay={0.2}>
              <div className="flex items-center gap-2 rounded-2xl bg-brand-dark px-4 py-3 text-sm font-extrabold text-brand-yellow shadow-lift">
                <Bike size={18} /> Local riders
              </div>
            </Float>
            <Float className="absolute bottom-24 left-0 sm:-left-6" delay={0.8} amount={16}>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-dark shadow-lift ring-2 ring-brand-dark">
                <MapPin size={18} /> Your area
              </div>
            </Float>
            <Float className="absolute left-1/3 top-1/2" delay={1.4} amount={10}>
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-dark text-brand-yellow shadow-lift">
                <Package size={30} />
              </span>
            </Float>
          </div>
        </div>

        {/* stats */}
        <div className="relative mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Tilt max={14} className="cds-shine relative flex items-center gap-3 overflow-hidden rounded-3xl bg-brand-dark p-4 text-white shadow-[0_8px_0_0_rgba(0,0,0,0.35)] sm:p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark" style={{ transform: 'translateZ(30px)' }}><Icon size={24} /></span>
                <div>
                  <p className="font-display text-xl font-extrabold leading-none text-brand-yellow sm:text-2xl">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-white/65 sm:text-sm">{label}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY PARTNER (DARK) ================= */}
      <section className="relative overflow-hidden bg-brand-dark px-4 py-24 sm:px-8">
        <div className="cds-dots-light pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-yellow/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-yellow/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle dark eyebrow="Why partner with us" title="Opportunity with clear expectations" text="Everything you need to know before you apply — in plain language." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1200px' }}>
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Tilt className="h-full rounded-4xl bg-gradient-to-br from-brand-yellow to-brand-yellow-deep p-6 text-brand-dark shadow-[0_10px_0_0_rgba(255,255,255,0.12)]">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-dark text-brand-yellow shadow-lift" style={{ transform: 'translateZ(40px)' }}><Icon size={26} /></span>
                  <h3 className="mt-5 text-xl font-extrabold" style={{ transform: 'translateZ(25px)' }}>{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-brand-dark/75">{text}</p>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MOVING CARDS RIGHT → LEFT (YELLOW) ================= */}
      <section className="relative overflow-hidden bg-brand-yellow py-24">
        <div className="cds-stripes pointer-events-none absolute inset-0" />
        <div className="relative px-4 sm:px-8">
          <SectionTitle eyebrow="What you can support" title="Local delivery, built around your area" text="A glimpse of the day-to-day work franchise partners discuss with our team. Exact scope is confirmed in a written agreement." />
        </div>

        <div className="relative mt-10">
          <Marquee speed={60} fade="from-brand-yellow">
            {SHOWCASE.map(({ img, icon: Icon, title, text }) => (
              <div
                key={title}
                className="group relative h-96 w-72 shrink-0 overflow-hidden rounded-4xl shadow-[10px_12px_0_0_rgba(20,20,20,0.9)] ring-4 ring-brand-dark transition duration-500 [transform:perspective(900px)_rotateY(-8deg)] hover:[transform:perspective(900px)_rotateY(0deg)_translateY(-10px)] sm:w-80"
              >
                <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
                <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-lift"><Icon size={24} /></span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{text}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* tilted ribbon */}
        <div className="relative mt-10 -rotate-2 bg-brand-dark py-4 shadow-lift">
          <Marquee speed={35} fade="from-brand-dark">
            {CHIPS.map((chip) => (
              <span key={chip} className="inline-flex shrink-0 items-center gap-3 text-lg font-extrabold uppercase tracking-wide text-brand-yellow">
                <Sparkles size={18} /> {chip}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ================= HOW IT WORKS (CREAM + YELLOW) ================= */}
      <section className="relative overflow-hidden bg-brand-light px-4 py-24 sm:px-8">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-yellow/50 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle eyebrow="How it works" title="From application to activation" />
          <div className="relative mt-16 grid gap-6 md:grid-cols-4" style={{ perspective: '1200px' }}>
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-14 hidden h-1 rounded-full bg-brand-dark/20 md:block" />
            {STEPS.map(({ n, icon: Icon, title, text }, index) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: 70, rotateY: 25 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.14, duration: 0.6 }}
              >
                <Tilt className="relative h-full rounded-4xl bg-white p-6 text-brand-dark shadow-[0_10px_0_0_rgba(20,20,20,0.9)] ring-4 ring-brand-dark">
                  <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-yellow text-brand-dark shadow-[0_5px_0_0_rgba(20,20,20,0.9)] ring-2 ring-brand-dark" style={{ transform: 'translateZ(45px)' }}>
                    <Icon size={28} />
                  </span>
                  <span className="absolute right-5 top-4 font-display text-6xl font-extrabold text-brand-yellow">{n}</span>
                  <h3 className="mt-6 text-xl font-extrabold" style={{ transform: 'translateZ(25px)' }}>{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-brand-dark/70">
                    {text || `Optional: pay ${feeText} now or later from the status page.`}
                  </p>
                </Tilt>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-3xl rounded-3xl bg-brand-dark p-5 text-center text-sm leading-relaxed text-white/80 shadow-lift">
            The initial payment policy ({config?.refundPolicy || 'as shown at payment'}) is displayed before payment. Submission does not guarantee approval, an agreement, exclusive territory or income.
          </p>
        </div>
      </section>

      {/* ================= REVIEW CRITERIA (DARK) ================= */}
      <section className="relative overflow-hidden bg-brand-dark px-4 py-24 sm:px-8">
        <div className="cds-dots-light pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-yellow/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle dark center={false} eyebrow="Review criteria" title="What our team looks at" text="We review the details you share to understand whether the proposed local setup can support delivery operations. Review does not guarantee approval." />
            <Button to="/franchise/register">Start application</Button>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1200px' }}>
            {REVIEW_POINTS.map(({ icon: Icon, img, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <Tilt className="group h-full overflow-hidden rounded-4xl bg-brand-yellow text-brand-dark shadow-[0_10px_0_0_rgba(255,255,255,0.14)]">
                  <div className="relative h-44 overflow-hidden">
                    <Img src={img} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-yellow via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-dark text-brand-yellow shadow-lift" style={{ transform: 'translateZ(40px)' }}><Icon size={22} /></span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-brand-dark/75">{text}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLEXIBLE PAYMENT (YELLOW) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-yellow via-brand-yellow to-brand-yellow-deep px-4 py-24 sm:px-8">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle center={false} eyebrow="Flexible initial payment" title="Apply first. Pay when you are ready." text="The initial payment is optional. Submit your application, save your Application ID and return to the status page whenever you want to complete the payment." />
            <div className="mt-8 space-y-4">
              {['Submit your franchise application', 'Save the Application ID shown afterwards', 'Open the status page and pay any time'].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_0_0_rgba(20,20,20,0.9)] ring-2 ring-brand-dark"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-dark text-sm font-extrabold text-brand-yellow">0{index + 1}</span>
                  <span className="font-extrabold text-brand-dark">{step}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-9">
              <Link to="/franchise/status" className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-7 py-4 text-sm font-extrabold text-brand-yellow shadow-[0_6px_0_0_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                Open status page <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <Reveal>
            <div className="relative" style={{ perspective: '1200px' }}>
              <Float className="absolute -right-3 -top-6 z-10" delay={0.3}>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-3xl font-extrabold text-brand-dark shadow-lift ring-4 ring-brand-dark">₹</span>
              </Float>
              <Tilt max={8} className="cds-shine relative overflow-hidden rounded-4xl bg-brand-dark p-8 text-white shadow-[14px_16px_0_0_rgba(20,20,20,0.35)] sm:p-10">
                <Img src={IMG.city} alt="City delivery coverage" className="absolute inset-0 h-full w-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/70 to-brand-dark" />
                <div className="relative">
                  <Wallet className="text-brand-yellow" size={42} />
                  <p className="mt-8 font-display text-6xl font-extrabold text-brand-yellow" style={{ transform: 'translateZ(40px)' }}>{feeText}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white/55">Optional initial payment</p>
                  <div className="mt-8 space-y-5 border-t border-white/15 pt-8">
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

      {/* ================= WHO CAN APPLY (CREAM) ================= */}
      <section className="relative overflow-hidden bg-brand-light px-4 py-24 sm:px-8">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <SectionTitle eyebrow="Who can apply" title="Local operators with a clear plan" text="If you can support local delivery coordination in a defined area, we would like to review your application. Terms are confirmed only after review and in writing." />
          <div className="mt-14 grid gap-8 md:grid-cols-3" style={{ perspective: '1200px' }}>
            {WHO_CAN_APPLY.map(({ img, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.14 }}
              >
                <Tilt className="group relative h-96 overflow-hidden rounded-4xl text-left shadow-[10px_12px_0_0_rgba(20,20,20,0.9)] ring-4 ring-brand-dark">
                  <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/55 to-transparent" />
                  <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-lift" style={{ transform: 'translateZ(40px)' }}><BadgeCheck size={24} /></span>
                  <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(25px)' }}>
                    <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{text}</p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEEDS + FAQ (DARK) ================= */}
      <section className="relative overflow-hidden bg-brand-dark px-4 py-24 sm:px-8">
        <div className="cds-dots-light pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle dark center={false} eyebrow="What you will need" title="Keep these ready" />
            <ul className="mt-8 space-y-3">
              {NEEDS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl bg-brand-yellow p-4 text-brand-dark shadow-[0_5px_0_0_rgba(255,255,255,0.14)]"
                >
                  <Building2 size={20} className="mt-0.5 shrink-0" />
                  <span className="font-bold">{item}</span>
                </motion.li>
              ))}
            </ul>
            <div className="relative mt-8 hidden h-56 overflow-hidden rounded-4xl shadow-[10px_12px_0_0_rgba(255,214,10,0.35)] ring-4 ring-brand-yellow sm:block">
              <Img src={IMG.handshake} alt="Partnership agreement" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-transparent" />
              <p className="absolute bottom-6 left-6 max-w-xs font-display text-3xl font-extrabold text-brand-yellow">Terms are confirmed in writing.</p>
            </div>
          </div>
          <div>
            <SectionTitle dark center={false} eyebrow="Questions" title="Franchise FAQs" />
            <div className="mt-8 space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition open:bg-brand-yellow open:text-brand-dark">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-white group-open:text-brand-dark">
                    <span className="flex items-center gap-3"><HelpCircle size={18} className="shrink-0 text-brand-yellow group-open:text-brand-dark" />{q}</span>
                    <span className="text-2xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-white/70 group-open:text-brand-dark/80">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA (YELLOW) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-yellow to-brand-yellow-deep px-4 py-24 sm:px-8">
        <div className="cds-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl" style={{ perspective: '1200px' }}>
          <Tilt max={5} className="relative overflow-hidden rounded-4xl bg-brand-dark p-10 text-center text-white shadow-[14px_16px_0_0_rgba(20,20,20,0.35)] sm:p-16">
            <Img src={IMG.city} alt="City skyline" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 to-brand-dark" />
            <div className="relative">
              <Float className="mx-auto w-fit">
                <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-yellow text-brand-dark shadow-[0_6px_0_0_rgba(255,255,255,0.2)]">
                  <FileSignature size={36} />
                </span>
              </Float>
              <h2 className="mt-7 text-4xl font-extrabold sm:text-6xl">Ready to <span className="text-brand-yellow">apply?</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
                Complete the application, review the optional initial payment and save your Application ID to track progress.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/franchise/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-8 py-4 text-sm font-extrabold text-brand-dark shadow-[0_6px_0_0_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                  Start application <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold text-white ring-2 ring-white/40 transition hover:bg-white/10">
                  Ask a question
                </Link>
              </div>
            </div>
          </Tilt>
        </div>
      </section>
    </>
  );
}