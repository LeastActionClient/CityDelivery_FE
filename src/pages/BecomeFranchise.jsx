import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const MARQUEE_CSS = `
@keyframes cds-marquee-rtl { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cds-marquee { display: flex; width: max-content; animation: cds-marquee-rtl var(--cds-speed, 45s) linear infinite; }
.cds-marquee-wrap:hover .cds-marquee { animation-play-state: paused; }
.cds-grid-bg { background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 22px 22px; }
@media (prefers-reduced-motion: reduce) { .cds-marquee { animation: none; } }
`;

function Marquee({ children, speed = 45 }) {
  return (
    <div className="cds-marquee-wrap relative overflow-hidden">
      <div className="cds-marquee gap-5 pr-5" style={{ '--cds-speed': `${speed}s` }}>
        {children}
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-dark to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-dark to-transparent sm:w-28" />
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
      <style>{MARQUEE_CSS}</style>
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

      {/* ---------- STATS BAND ---------- */}
      <section className="bg-brand-yellow px-4 py-8 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 rounded-3xl bg-brand-dark/95 p-4 text-white shadow-lift sm:p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Icon size={22} /></span>
              <div>
                <p className="font-display text-xl font-extrabold leading-none sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs font-semibold text-white/60 sm:text-sm">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- WHY PARTNER ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-black px-4 py-20 text-white sm:px-8">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative col-span-2 flex min-h-[300px] flex-col justify-end overflow-hidden rounded-4xl bg-brand-dark p-8 shadow-lift ring-1 ring-white/10">
                <img src={franchisePartnerImage} alt="Delivery partner supporting local deliveries" className="absolute inset-0 h-full w-full object-cover object-center" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-dark/10" />
                <div className="relative z-10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Store size={24} /></span>
                  <p className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Your city. Local delivery. A clear process.</p>
                  <p className="mt-3 text-sm font-semibold text-white/70">Applications are reviewed individually. Terms are confirmed in writing.</p>
                </div>
              </div>
              <div className="relative h-44 overflow-hidden rounded-3xl ring-1 ring-white/10">
                <Img src={IMG.courier} alt="Courier handing over a parcel" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
              </div>
              <div className="relative h-44 overflow-hidden rounded-3xl ring-1 ring-white/10">
                <Img src={IMG.bike} alt="Delivery rider on a bike" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
              </div>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow text-brand-yellow">Why partner with us</p>
            <h2 className="mt-4 text-4xl font-extrabold">Opportunity with clear expectations</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              We are building a local delivery network. Franchise partners help expand coverage, coordinate local operations and support customers in their area.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10 backdrop-blur"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Icon size={22} /></span>
                  <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MOVING CARDS (RIGHT → LEFT) ---------- */}
      <section className="relative overflow-hidden bg-brand-dark py-20">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-8">
          <p className="eyebrow text-brand-yellow">What you can support</p>
          <h2 className="mt-4 text-4xl font-extrabold text-white">Local delivery, built around your area</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
            A glimpse of the day-to-day work franchise partners discuss with our team. Exact scope is confirmed in a written agreement.
          </p>
        </div>

        <div className="relative mt-12">
          <Marquee speed={55}>
            {SHOWCASE.map(({ img, icon: Icon, title, text }) => (
              <div key={title} className="group relative h-80 w-72 shrink-0 overflow-hidden rounded-4xl shadow-lift ring-1 ring-white/10 sm:w-80">
                <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Icon size={22} /></span>
                  <h3 className="mt-3 text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{text}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="relative mt-6">
          <Marquee speed={38}>
            {CHIPS.map((chip) => (
              <span key={chip} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/15">
                <Sparkles size={16} className="text-brand-yellow" />
                {chip}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-yellow via-brand-yellow to-brand-yellow-deep px-4 py-20 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="eyebrow text-center text-brand-dark/70">How it works</p>
          <h2 className="mt-4 text-center text-4xl font-extrabold text-brand-dark">From application to activation</h2>
          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-0.5 bg-brand-dark/20 md:block" />
            {STEPS.map(({ n, icon: Icon, title, text }, index) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="relative rounded-3xl bg-brand-dark p-6 text-white shadow-lift"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft"><Icon size={26} /></span>
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-white/10">{n}</span>
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {text || `Optional: pay ${feeText} now or later from the status page.`}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 rounded-3xl bg-brand-dark/90 p-5 text-center text-sm leading-relaxed text-white/75 ring-1 ring-black/10">
            The initial payment policy ({config?.refundPolicy || 'as shown at payment'}) is displayed before payment. Submission does not guarantee approval, an agreement, exclusive territory or income.
          </p>
        </div>
      </section>

      {/* ---------- REVIEW CRITERIA ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-[#10211c] to-brand-dark px-4 py-20 sm:px-8">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-brand-yellow">Review criteria</p>
              <h2 className="mt-4 text-4xl font-extrabold text-white">What our team looks at</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
                We review the details you share to understand whether the proposed local setup can support delivery operations. Review does not guarantee approval.
              </p>
            </div>
            <Button to="/franchise/register">Start application</Button>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEW_POINTS.map(({ icon: Icon, img, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-3xl bg-white/[0.06] ring-1 ring-white/10"
              >
                <div className="relative h-40 overflow-hidden">
                  <Img src={img} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
                  <span className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Icon size={22} /></span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FLEXIBLE PAYMENT ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green via-brand-green to-brand-dark px-4 py-20 sm:px-8">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-white">
            <p className="eyebrow text-brand-yellow">Flexible initial payment</p>
            <h2 className="mt-4 text-4xl font-extrabold">Apply first. Pay when you are ready.</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              The initial payment is optional. Submit your application, save your Application ID and return to the status page whenever you want to complete the payment.
            </p>
            <div className="mt-8 space-y-4">
              {[
                'Submit your franchise application',
                'Save the Application ID shown afterwards',
                'Open the status page and pay any time',
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-yellow text-sm font-extrabold text-brand-dark">0{index + 1}</span>
                  <span className="pt-1.5 font-bold">{step}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8">
              <Button to="/franchise/status" variant="outline">Open status page</Button>
            </div>
          </div>
          <Reveal>
            <div className="relative overflow-hidden rounded-4xl bg-brand-dark p-8 text-white shadow-lift ring-1 ring-white/10 sm:p-10">
              <Img src={IMG.city} alt="City delivery coverage" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 to-brand-dark" />
              <div className="relative">
                <Wallet className="text-brand-yellow" size={42} />
                <p className="mt-8 font-display text-6xl font-extrabold">{feeText}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">Optional initial payment</p>
                <div className="mt-8 space-y-5 border-t border-white/10 pt-8">
                  {[
                    { icon: Clock3, title: 'Pay now or later', text: 'Your Application ID unlocks the payment option on the status page.' },
                    { icon: ShieldCheck, title: 'Secure payment flow', text: 'Payment is handled by the payment provider when online payment is enabled.' },
                    { icon: CheckCircle2, title: 'Review continues', text: 'Your application remains under review whether or not you pay.' },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-4">
                      <Icon size={21} className="mt-0.5 shrink-0 text-brand-yellow" />
                      <div>
                        <p className="font-extrabold">{title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- WHO CAN APPLY ---------- */}
      <section className="relative overflow-hidden bg-brand-dark px-4 py-20 sm:px-8">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="eyebrow text-brand-yellow">Who can apply</p>
          <h2 className="mt-4 text-4xl font-extrabold text-white">Local operators with a clear plan</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            If you can support local delivery coordination in a defined area, we would like to review your application. Terms are confirmed only after review and in writing.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHO_CAN_APPLY.map(({ img, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="group relative h-80 overflow-hidden rounded-4xl text-left shadow-lift ring-1 ring-white/10"
              >
                <Img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/10" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <BadgeCheck size={28} className="text-brand-yellow" />
                  <h3 className="mt-3 text-xl font-extrabold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- NEEDS + FAQ ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#10211c] via-brand-dark to-black px-4 py-20 sm:px-8">
        <div className="cds-grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-yellow/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brand-yellow">What you will need</p>
            <h2 className="mt-4 text-4xl font-extrabold text-white">Keep these ready</h2>
            <ul className="mt-7 space-y-3">
              {NEEDS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-2xl bg-white/[0.07] p-4 text-white ring-1 ring-white/10"
                >
                  <Building2 size={19} className="mt-0.5 shrink-0 text-brand-yellow" />
                  <span className="font-semibold">{item}</span>
                </motion.li>
              ))}
            </ul>
            <div className="relative mt-8 hidden h-52 overflow-hidden rounded-3xl ring-1 ring-white/10 sm:block">
              <Img src={IMG.handshake} alt="Partnership agreement" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
              <p className="absolute bottom-5 left-6 max-w-xs font-display text-2xl font-extrabold text-white">Terms are confirmed in writing.</p>
            </div>
          </div>
          <div>
            <p className="eyebrow text-brand-yellow">Questions</p>
            <h2 className="mt-4 text-4xl font-extrabold text-white">Franchise FAQs</h2>
            <div className="mt-7 space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10 transition open:bg-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-white">
                    <span className="flex items-center gap-3"><HelpCircle size={18} className="shrink-0 text-brand-yellow" />{q}</span>
                    <span className="text-xl text-brand-yellow transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="relative overflow-hidden px-4 py-24 text-center text-white sm:px-8">
        <Img src={IMG.city} alt="City skyline" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand-dark/90 to-brand-green/80" />
        <div className="relative">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-yellow text-brand-dark shadow-lift">
            <FileSignature size={32} />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">Ready to apply?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Complete the application, review the optional initial payment and save your Application ID to track progress.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/franchise/register">Start application</Button>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10"
            >
              Ask a question <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}