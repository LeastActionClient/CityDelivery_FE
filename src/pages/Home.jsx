import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Store, Send, BellRing, PhoneCall, MousePointerClick, ShieldCheck, Zap, HeartHandshake, Truck, Play, Bike, Star, Quote, Check } from 'lucide-react';
import Button from '../components/Button.jsx';
import FloatingShapes from '../components/FloatingShapes.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import Counter from '../components/Counter.jsx';
import FAQ from '../components/FAQ.jsx';
import SEO, { businessSchema, faqSchema, serviceSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import heroVisual from '../assets/image.png';
import responsiveHeroBackground from '../assets/resposiveImage.png';
import { GALLERY_ITEMS } from '../utils/gallery.js';

const GREEN = '#0F8A2F';
const DARK = '#16161A';

const STEPS = [
  { icon: ClipboardList, title: 'Tell us the product', text: 'Name it, describe it, add a photo if you have one.' },
  { icon: Store, title: 'Share the store', text: 'Tell us which store it is from and where to find it.' },
  { icon: Send, title: 'Submit your request', text: 'Add your delivery details and send it in one go.' },
  { icon: BellRing, title: 'Our team is notified', text: 'Your request lands straight in our inbox.' },
  { icon: PhoneCall, title: 'We contact you', text: 'We reach out with the next steps and confirm details.' },
];

const WHY = [
  { icon: MousePointerClick, title: 'Simple by design', text: 'One short form. No account, no app, no clutter.' },
  { icon: Store, title: 'Your store, your pick', text: 'You choose the product and the store — we work from your request.' },
  { icon: ShieldCheck, title: 'Clear communication', text: 'Every request gets a unique ID and a confirmation email.' },
  { icon: HeartHandshake, title: 'A real team', text: 'People review each request and contact you personally.' },
];

const STATS = [
  { value: 3, suffix: ' sections', label: 'To fill in: you, the product, delivery' },
  { value: 5, suffix: ' steps', label: 'From request to our reply' },
  { value: 1, suffix: ' unique ID', label: 'Issued for every request' },
];

const FAQS = [
  { q: 'How do I request a service?', a: 'Open the Request a Service page, fill in your details, the product and store information and your delivery address, then submit. You will see a confirmation with your Request ID right away.' },
  { q: 'What happens after I submit?', a: 'Your request is saved and our team is notified by email. You also get a confirmation email. A team member will then contact you with the next steps.' },
  { q: 'Is delivery automatic?', a: 'No. Submitting a request does not place an automatic order. Our team reviews each request and confirms availability, price and timing with you directly.' },
  { q: 'Can I upload a photo of the product?', a: 'Yes — an optional JPG, PNG or WebP image up to 5 MB can be attached to help us identify the exact item.' },
  { q: 'What if my confirmation email does not arrive?', a: 'Your request is already saved once you see the success screen. Check your spam folder and keep your Request ID; our system also retries failed emails automatically.' },
  { q: 'How can I contact you?', a: 'Use the contact form on the Contact page. Any email, phone or address details shown there are provided by the business.' },
];

const REVIEWS = [
  { name: 'Ananya R.', area: 'Vellore', tag: 'Groceries', quote: 'I sent the store name and a photo of what I needed. Someone called me the same evening and everything was sorted.' },
  { name: 'Karthik M.', area: 'Katpadi', tag: 'Medicines', quote: 'Needed medicine for my mother urgently. The team confirmed availability first and kept me updated the whole way.' },
  { name: 'Divya S.', area: 'Vellore', tag: 'Gifts', quote: 'A birthday gift had to reach my friend across town. It arrived on time and in perfect condition.' },
  { name: 'Rahul P.', area: 'Bagayam', tag: 'Electronics', quote: 'I was skeptical about requesting a product online, but the process was simple and the updates were genuinely useful.' },
  { name: 'Meera K.', area: 'Sathyavedu', tag: 'Fashion', quote: 'They picked up the exact pair of shoes from the store I mentioned. No running around, no guesswork.' },
  { name: 'Vignesh T.', area: 'Vellore', tag: 'Daily needs', quote: 'Clear communication from start to finish. I always knew who to contact and what was happening with my request.' },
];

const FEATURES = [
  { icon: Zap, title: 'Easy Request', text: 'Tell us what you need' },
  { icon: Store, title: 'Any Store', text: 'From your preferred store' },
  { icon: Bike, title: 'Timely Support', text: "We'll get in touch quickly" },
];

const HERO_BRAND = 'City Delivery Services';

const MARQUEE_ITEMS = [
  { icon: Truck, text: 'Doorstep Delivery' },
  { icon: Store, text: 'Groceries & Daily Needs' },
  { icon: HeartHandshake, text: 'Medicines & Health' },
  { icon: Send, text: 'Gifts & Surprises' },
  { icon: Bike, text: 'Shoes & Fashion' },
  { icon: Zap, text: 'Electronics & Gadgets' },
  { icon: ShieldCheck, text: 'Any Store, Any Product' },
  { icon: BellRing, text: 'On Time, Every Time' },
];

function Hero() {
  const fade = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });
  const mask = 'linear-gradient(to right, transparent 0%, #000 6%), linear-gradient(to bottom, transparent 0%, #000 4%)';
  // Desktop (lg+) sizes are in vw so the hero scales exactly like the reference design (1672 x 941).
  return (
    // Paste this <section> as the return value of your Hero component.
// Needs: motion (framer-motion), Link (react-router-dom), Truck, ArrowRight, Play, Zap, Store, Bike (lucide-react)
// and the import: import heroVisual from '../assets/hero-visual.webp';
<section
      id="home"
      className="hv relative overflow-hidden pt-28 sm:pt-32 lg:h-[56.28vw] lg:pt-0"
      style={{ background: 'radial-gradient(48vw 34vw at 14% 42%, #FEF1C4 0%, rgba(254,241,196,0) 70%), radial-gradient(12vw 9vw at 2% 100%, rgba(95,150,25,.85) 0%, rgba(95,150,25,0) 100%), linear-gradient(135deg,#FEE88F 0%,#FEDD74 50%,#FED45D 100%)' }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--px', '0');
        e.currentTarget.style.setProperty('--py', '0');
      }}
    >
      <style>{`
        .hv-tilt{transform-style:preserve-3d;transform:perspective(1400px) rotateY(calc(var(--px,0) * 9deg)) rotateX(calc(var(--py,0) * -7deg)) translate3d(calc(var(--px,0) * -14px),calc(var(--py,0) * -10px),0);transition:transform .35s ease-out}
        .hv-bob{animation:hv-bob 6s ease-in-out infinite}
        .hv-glow{animation:hv-glow 4.5s ease-in-out infinite}
        .hv-p{animation:hv-drift linear infinite}
        .hv-icon{animation:hv-icon 4.5s ease-in-out infinite}
        .hv-btn{transition:transform .15s,box-shadow .15s;animation:hv-btn-float 3.2s ease-in-out infinite;will-change:transform}
        .hv-btn-alt{animation-delay:-1.6s}
        .hv-btn:hover{transform:translateY(-3px)}
        .hv-btn:hover,.hv-btn:focus-visible{animation-play-state:paused}
        .hv-btn:active{transform:translateY(3px)}
        .hv-feat{transition:transform .3s;transform-style:preserve-3d}
        .hv-feat:hover{transform:perspective(500px) rotateY(10deg) translateY(-4px)}
        .hv-dots{background-image:radial-gradient(rgba(90,70,10,.2) 1px,transparent 1px);background-size:26px 26px;-webkit-mask-image:linear-gradient(to right,transparent 35%,#000 78%);mask-image:linear-gradient(to right,transparent 35%,#000 78%)}
        @media (max-width:1023px){.hv-dots{-webkit-mask-image:linear-gradient(to bottom,transparent 6%,#000 42%,transparent 94%);mask-image:linear-gradient(to bottom,transparent 6%,#000 42%,transparent 94%)}}
        .hv-bg{animation:hv-bg 18s ease-in-out infinite alternate}
        .hv-orb{animation:hv-orb 8s ease-in-out infinite}
        .hv-chip{transform:translateZ(var(--z,40px));animation:hv-chip 5s ease-in-out infinite;animation-delay:var(--d,0s)}
        .hv-live{animation:hv-live 2s ease-in-out infinite}
        .hv-btn{position:relative;overflow:hidden}
        .hv-btn::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.3) 50%,transparent 65%);transform:translateX(-120%);animation:hv-sheen 5s ease-in-out infinite}
        .hv-btn:hover::after,.hv-btn:focus-visible::after{animation-play-state:paused}
        .hv-scroll{animation:hv-scroll 2s ease-in-out infinite}
        @keyframes hv-bg{from{transform:scale(1)}to{transform:scale(1.06)}}
        @keyframes hv-orb{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.14)}}
        @keyframes hv-chip{0%,100%{transform:translateZ(var(--z,40px)) translateY(0)}50%{transform:translateZ(var(--z,40px)) translateY(-9px)}}
        @keyframes hv-live{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.82)}}
        @keyframes hv-sheen{0%,55%{transform:translateX(-120%)}75%,100%{transform:translateX(120%)}}
        @keyframes hv-scroll{0%{transform:translateY(-100%)}100%{transform:translateY(250%)}}
        .hv-img{-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 24%);mask-image:linear-gradient(to bottom,transparent 0%,#000 24%)}
        @media (min-width:1024px){.hv-img{-webkit-mask-image:linear-gradient(to right,transparent 0%,#000 6%),linear-gradient(to bottom,transparent 0%,#000 4%);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent 0%,#000 6%),linear-gradient(to bottom,transparent 0%,#000 4%);mask-composite:intersect}}
        @keyframes hv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.1%)}}
        @keyframes hv-glow{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.95;transform:scale(1.08)}}
        @keyframes hv-drift{0%{transform:translate3d(0,0,0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translate3d(-9vw,-5vw,0) scale(1.2);opacity:0}}
        @keyframes hv-icon{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-5px) rotate(-6deg)}}
        @keyframes hv-btn-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @media (prefers-reduced-motion:reduce){.hv *{animation:none!important;transition:none!important}.hv-tilt{transform:none!important}}
      `}</style>

      {/* Full-bleed hero artwork on responsive screens */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full sm:top-20 lg:hidden" aria-hidden="true">
        <img src={responsiveHeroBackground} alt="" className="hv-bg h-full w-full object-cover object-center" fetchpriority="high" decoding="async" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(254,232,143,.72) 0%,rgba(254,232,143,.18) 34%,rgba(254,241,196,.22) 58%,rgba(254,241,196,.88) 100%)' }} />
      </div>

      {/* depth layers */}
      <div className="hv-dots pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
      <span className="hv-orb pointer-events-none absolute -right-16 top-[5%] h-40 w-40 rounded-full bg-white/50 blur-3xl sm:h-56 sm:w-56 lg:right-[6%] lg:h-64 lg:w-64" aria-hidden="true" />
      <span className="hv-orb pointer-events-none absolute -left-16 bottom-[24%] h-40 w-40 rounded-full bg-[#0F8A2F]/20 blur-3xl sm:h-52 sm:w-52 lg:bottom-[2%] lg:left-auto lg:right-[28%] lg:h-56 lg:w-56" style={{ animationDelay: '-3s' }} aria-hidden="true" />

      {/* drifting sparkles */}
      {[
        { l: '48%', t: '62%', s: 10, d: 5, o: 0 },
        { l: '62%', t: '78%', s: 7, d: 6.5, o: -2 },
        { l: '78%', t: '70%', s: 12, d: 7, o: -4 },
        { l: '90%', t: '55%', s: 8, d: 5.5, o: -1 },
        { l: '55%', t: '25%', s: 6, d: 8, o: -3 },
      ].map((p, i) => (
        <span key={i} className="hv-p pointer-events-none absolute hidden rounded-full bg-white/90 shadow-[0_0_14px_rgba(255,255,255,.9)] lg:block" style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.o}s` }} aria-hidden="true" />
      ))}

      {/* Illustration (image) with 3D mouse parallax */}
      <div className="hv-tilt pointer-events-none absolute bottom-0 left-1/2 -ml-[62.5%] hidden w-[125%] max-w-none sm:left-auto sm:right-0 sm:ml-0 sm:w-[90%] lg:top-[9.78%] lg:block lg:w-[60.05%]">
        <span className="hv-glow pointer-events-none absolute left-[22%] top-[18%] h-[60%] w-[55%] rounded-full bg-[#FFF3A8] blur-3xl" style={{ transform: 'translateZ(-60px)' }} aria-hidden="true" />
        <div className="hv-bob">
          <motion.img
            src={heroVisual}
            alt="City Delivery Services courier on a yellow scooter with groceries, headphones, shoes, medicine and gifts"
            draggable="false"
            fetchpriority="high"
            decoding="async"
            initial={{ opacity: 0, scale: 0.94, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
            className="hv-img relative block w-full select-none"
          />
        </div>

        {/* floating service cards */}
        <div className="hv-chip pointer-events-none absolute left-[7%] top-[13%] hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_18px_35px_-12px_rgba(60,50,0,.35)] backdrop-blur-md lg:flex" style={{ '--z': '70px', '--d': '-.5s' }}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E7F6EA] text-[#0F8A2F]"><Store className="h-5 w-5" /></span>
          <span className="text-left">
            <span className="block text-sm font-extrabold text-[#16161A]">Groceries &amp; daily needs</span>
            <span className="block text-[11px] font-medium text-[#7a7a73]">From your favourite store</span>
          </span>
        </div>

        <div className="hv-chip pointer-events-none absolute right-[1%] top-[40%] hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_18px_35px_-12px_rgba(60,50,0,.35)] backdrop-blur-md lg:flex" style={{ '--z': '100px', '--d': '-2s' }}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF3C4] text-[#8a6400]"><HeartHandshake className="h-5 w-5" /></span>
          <span className="text-left">
            <span className="block text-sm font-extrabold text-[#16161A]">Medicines &amp; health</span>
            <span className="block text-[11px] font-medium text-[#7a7a73]">When you need it most</span>
          </span>
        </div>

        <div className="hv-chip pointer-events-none absolute bottom-[13%] left-[16%] hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-[0_18px_35px_-12px_rgba(60,50,0,.35)] backdrop-blur-md lg:flex" style={{ '--z': '55px', '--d': '-3.5s' }}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E7F6EA] text-[#0F8A2F]"><Send className="h-5 w-5" /></span>
          <span className="text-left">
            <span className="block text-sm font-extrabold text-[#16161A]">Gifts &amp; surprises</span>
            <span className="block text-[11px] font-medium text-[#7a7a73]">Delivered with a smile</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pb-[92vw] sm:px-10 sm:pb-[62vw] lg:absolute lg:left-[4.8vw] lg:top-[9.4vw] lg:w-[46vw] lg:p-0" style={{ perspective: '1000px' }}>
        <motion.span
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="inline-flex items-center gap-3 rounded-full bg-[#FFEFA3]/90 px-5 py-2.5 text-base font-bold text-[#16161A] shadow-sm lg:gap-[0.7vw] lg:px-[1.3vw] lg:py-[0.65vw] lg:text-[0.98vw]"
        >
          <span className="hv-live h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F8A2F]" />
          <Truck className="hv-icon h-5 w-5 lg:h-[1.4vw] lg:w-[1.4vw]" /> Product Request &amp; Delivery Service
        </motion.span>

        <h1 className="mt-6 text-[2.9rem] font-extrabold leading-[1] tracking-[-0.03em] text-[#16161A] sm:text-7xl lg:mt-[1.9vw] lg:text-[5.15vw] lg:leading-[0.93]">
          {['Your Product.', 'Your Store.'].map((line, i) => (
            <motion.span
              key={line}
              className="block origin-top-left"
              initial={{ opacity: 0, rotateX: -70, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.15 + i * 0.15 }}
              style={{ transformPerspective: 900 }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="relative block origin-top-left italic text-[#0F8A2F]"
            initial={{ opacity: 0, rotateX: -70, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.45 }}
            style={{ transformPerspective: 900 }}
          >
            <span className="relative inline-block">
              Delivered with Ease.
              <svg className="absolute -bottom-2 left-0 w-full lg:-bottom-[0.9vw]" viewBox="0 0 400 12" fill="none" aria-hidden="true">
                <motion.path d="M4 7C90 3 150 9 240 6S340 3 396 6" stroke="#0F8A2F" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.9 }} />
              </svg>
            </span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 max-w-lg text-lg leading-relaxed text-[#5b5a55] sm:text-xl lg:mt-[2.2vw] lg:max-w-[40vw] lg:text-[1.45vw] lg:leading-[1.38]"
        >
          Tell us what you need and where you want it from. {' '}
          <strong className="font-bold text-[#16161A]">simple and convenient.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-7 flex flex-col gap-4 sm:flex-row lg:mt-[1.7vw] lg:gap-[1.4vw]"
        >
          <Link
            to="/request"
            className="hv-btn inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white sm:w-auto lg:h-[4.1vw] lg:gap-[0.9vw] lg:rounded-[1.1vw] lg:px-[2.3vw] lg:py-0 lg:text-[1.35vw]"
            style={{ background: 'linear-gradient(180deg,#19A23E,#0F8A2F)', boxShadow: '0 6px 0 #0A6B22,0 16px 26px rgba(15,138,47,.4),inset 0 2px 0 rgba(255,255,255,.3)' }}
          >
            Request a Service <ArrowRight className="h-5 w-5 lg:h-[1.5vw] lg:w-[1.5vw]" />
          </Link>
          <Link
            to="/how-it-works"
            className="hv-btn hv-btn-alt inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#FFE9A0] bg-white px-8 py-4 text-lg font-bold text-[#16161A] sm:w-auto lg:h-[4.1vw] lg:gap-[0.9vw] lg:rounded-[1.1vw] lg:px-[2.3vw] lg:py-0 lg:text-[1.35vw]"
            style={{ boxShadow: '0 6px 0 #F3D56B,0 16px 24px rgba(0,0,0,.08)' }}
          >
            How It Works <Play className="h-5 w-5 lg:h-[1.4vw] lg:w-[1.4vw]" />
          </Link>
        </motion.div>

        <div className="mt-7 flex flex-wrap gap-2.5 lg:hidden">
          {[
            { icon: Store, label: 'Groceries', delay: '-.4s' },
            { icon: HeartHandshake, label: 'Medicines', delay: '-1.6s' },
            { icon: Send, label: 'Gifts', delay: '-2.8s' },
          ].map(({ icon: Icon, label, delay }) => (
            <span
              key={label}
              className="hv-chip inline-flex items-center gap-2 rounded-full border border-[#E8B93A]/70 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#16161A] shadow-sm backdrop-blur-sm sm:text-sm"
              style={{ '--d': delay, '--z': '0px' }}
            >
              <Icon className="h-4 w-4 text-[#0F8A2F]" /> {label}
            </span>
          ))}
        </div>

        <ul className="mt-9 hidden flex-wrap items-stretch gap-y-6 lg:mt-[3vw] lg:flex lg:flex-nowrap">
          {[
            { icon: Zap, title: 'Easy Request', text: 'Tell us what you need' },
            { icon: Store, title: 'Any Store', text: 'From your preferred store' },
            { icon: Bike, title: 'Timely Support', text: "We'll get in touch quickly" },
          ].map((f, i) => (
            <motion.li
              key={f.title}
              initial={{ opacity: 0, y: 30, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.95 + i * 0.12 }}
              className={`hv-feat flex flex-col pr-6 lg:pr-[1.7vw] ${i > 0 ? 'border-l border-[#E8B93A]/60 pl-6 lg:pl-[1.7vw]' : ''} ${i === 0 ? 'lg:pl-[0.8vw]' : ''}`}
            >
              <span
                className="hv-icon grid h-12 w-12 place-items-center rounded-full text-[#16161A] lg:h-[2.85vw] lg:w-[2.85vw]"
                style={{ animationDelay: `${i * 0.7}s`, background: 'linear-gradient(180deg,#FFD24A,#FFB700)', boxShadow: '0 4px 0 #D99A00,0 10px 16px rgba(180,120,0,.3),inset 0 2px 0 rgba(255,255,255,.5)' }}
              >
                <f.icon strokeWidth={2.4} className="h-5 w-5 lg:h-[1.3vw] lg:w-[1.3vw]" />
              </span>
              <strong className="mt-3 text-lg text-[#16161A] lg:mt-[0.7vw] lg:text-[1.2vw]">{f.title}</strong>
              <span className="text-sm text-[#6b6a64] lg:text-[0.85vw]">{f.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 whitespace-nowrap text-center font-display text-[clamp(1.6rem,6vw,5.5rem)] font-black uppercase tracking-[0.08em] drop-shadow-[0_4px_0_rgba(255,255,255,.7),0_8px_16px_rgba(17,23,19,.2)] lg:hidden"
        aria-label={HERO_BRAND}
      >
        {HERO_BRAND.split('').map((letter, i) => (
          <motion.span
            key={`${letter}-${i}`}
            className="inline-block"
            aria-hidden="true"
            animate={{ y: [0, -18, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.22, 1, 0.36, 1], delay: i * 0.13 }}
            style={{ color: '#16161A', textShadow: '0 3px 0 #FFC928, 0 7px 12px rgba(17,23,19,.2)' }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#6b5a20] lg:flex" aria-hidden="true">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Explore</span>
        <span className="relative h-10 w-[2px] overflow-hidden rounded-full bg-[#0F8A2F]/25">
          <span className="hv-scroll absolute left-0 top-0 h-4 w-full rounded-full bg-[#0F8A2F]" />
        </span>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div
      className="mq relative overflow-hidden border-y border-[#FFC928]/40 text-white"
      style={{ background: 'linear-gradient(90deg,#0A6E25 0%,#0F8A2F 50%,#0A6E25 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(0,0,0,.25)' }}
      aria-label="What we can deliver"
    >
      <style>{`
        .mq::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,transparent 35%,rgba(255,255,255,.08) 50%,transparent 65%);background-size:220% 100%;animation:mq-sheen 10s linear infinite}
        .mq-mask{-webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent)}
        .mq-track{animation:mq-scroll 38s linear infinite;will-change:transform}
        .mq:hover .mq-track{animation-play-state:paused}
        .mq-item{display:inline-flex;align-items:center;gap:.7rem;padding:.15rem 1.7rem;transition:opacity .25s,transform .25s;text-shadow:0 1px 0 rgba(0,0,0,.3)}
        .mq-item svg{color:#FFE08A;transition:transform .25s}
        .mq:hover .mq-item{opacity:.45}
        .mq:hover .mq-item:hover{opacity:1;transform:translateY(-2px)}
        .mq-item:hover svg{transform:scale(1.12) rotate(-6deg)}
        @keyframes mq-scroll{to{transform:translateX(-50%)}}
        @keyframes mq-sheen{to{background-position:-220% 0}}
        @media (prefers-reduced-motion:reduce){
          .mq-track,.mq::before{animation:none!important}
          .mq-item,.mq-item svg{transition:none!important}
          .mq-mask{-webkit-mask-image:none;mask-image:none;overflow-x:auto}
        }
      `}</style>
      <div className="mq-mask relative">
        <div className="mq-track flex w-max items-center py-5">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map(({ icon: Icon, text }) => (
                <Fragment key={text}>
                  <span className="mq-item">
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    <span className="whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.17em] sm:text-[15px]">{text}</span>
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#FFC928]" aria-hidden="true" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    // Paste this <section> as the return value of your HowItWorks component.
// Needs only: motion (framer-motion) and ClipboardList, Store, Send, BellRing, PhoneCall (lucide-react).
<section id="how-it-works" className="hiw relative overflow-hidden py-24 sm:py-32" style={{ background: 'linear-gradient(180deg,#FFF6D6 0%,#FFFFFF 60%)' }}>
      <style>{`
        .hiw-card{transform-style:preserve-3d;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .25s ease-out,box-shadow .3s}
        .hiw-card:hover{box-shadow:0 40px 70px -20px rgba(180,120,0,.45),0 0 0 2px rgba(255,201,40,.8)}
        .hiw-shine{position:absolute;inset:0;border-radius:inherit;pointer-events:none;overflow:hidden}
        .hiw-shine::after{content:"";position:absolute;inset:-20%;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.75) 50%,transparent 65%);transform:translateX(-130%);transition:transform .9s}
        .hiw-card:hover .hiw-shine::after{transform:translateX(130%)}
        .hiw-icon{transform:translateZ(60px);animation:hiw-float 4.5s ease-in-out infinite}
        .hiw-num{transform:translateZ(85px)}
        .hiw-text{transform:translateZ(35px)}
        @keyframes hiw-float{0%,100%{transform:translateZ(60px) translateY(0) rotate(-4deg)}50%{transform:translateZ(60px) translateY(-9px) rotate(4deg)}}
        @keyframes hiw-travel{0%{left:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:calc(100% - 14px);opacity:0}}
        @keyframes hiw-dash{to{background-position:24px 0}}
        @keyframes hiw-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.12)}}
        @keyframes hiw-pulse{0%{box-shadow:0 0 0 0 rgba(15,138,47,.5)}100%{box-shadow:0 0 0 18px rgba(15,138,47,0)}}
        .hiw-line{background-image:repeating-linear-gradient(90deg,#E0A800 0 12px,transparent 12px 24px);animation:hiw-dash 1s linear infinite}
        .hiw-dot{animation:hiw-travel 4.5s linear infinite,hiw-pulse 1.2s ease-out infinite}
        .hiw-orb{animation:hiw-orb 9s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.hiw *{animation:none!important;transition:none!important}}
      `}</style>

      {/* floating background orbs */}
      <div className="hiw-orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FFC928]/30 blur-3xl" aria-hidden="true" />
      <div className="hiw-orb pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#0F8A2F]/15 blur-3xl" style={{ animationDelay: '-4s' }} aria-hidden="true" />

      <div className="container-x relative">
        {/* heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC928]/30 px-4 py-1.5 text-sm font-bold text-[#16161A]">
            <span className="h-2 w-2 rounded-full bg-[#0F8A2F]" /> How it works
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#16161A] sm:text-5xl">Five steps. One short form.</h2>
          <p className="mt-4 text-lg text-[#5b5a55]">From your idea to our team's inbox in a couple of minutes.</p>
        </motion.div>

        {/* steps */}
        <div className="relative mt-20">
          {/* animated connector (desktop) */}
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-[3.4rem] hidden h-[3px] lg:block" aria-hidden="true">
            <div className="hiw-line h-full w-full rounded-full opacity-70" />
            <span className="hiw-dot absolute -top-[5px] h-[13px] w-[13px] rounded-full bg-[#0F8A2F]" />
          </div>

          <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {[
              { icon: ClipboardList, title: 'Tell us the product', text: 'Name it, describe it, add a photo if you have one.' },
              { icon: Store, title: 'Share the store', text: 'Tell us which store it is from and where to find it.' },
              { icon: Send, title: 'Submit your request', text: 'Add your delivery details and send it in one go.' },
              { icon: BellRing, title: 'Our team is notified', text: 'Your request lands straight in our inbox.' },
              { icon: PhoneCall, title: 'We contact you', text: 'We reach out with the next steps and confirm details.' },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 70, rotateX: -40 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 70, damping: 14, delay: i * 0.14 }}
                style={{ transformPerspective: 1000 }}
              >
                <div
                  className="hiw-card relative h-full rounded-[1.75rem] bg-gradient-to-br from-white to-[#FFF4CC] p-6 pt-7 shadow-[0_25px_50px_-20px_rgba(120,80,0,.35)] ring-1 ring-[#FFC928]/40"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 20}deg`);
                    el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 20}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rx', '0deg');
                    e.currentTarget.style.setProperty('--ry', '0deg');
                  }}
                >
                  <span className="hiw-shine" aria-hidden="true" />

                  {/* big 3D step number */}
                  <span
                    className="hiw-num absolute right-5 top-3 select-none text-6xl font-black leading-none text-[#FFC928]"
                    style={{ textShadow: '0 1px 0 #E0A800,0 2px 0 #E0A800,0 3px 0 #E0A800,0 4px 0 #E0A800,0 5px 0 #E0A800,0 12px 18px rgba(0,0,0,.25)' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>

                  {/* 3D icon block */}
                  <span
                    className="hiw-icon relative grid h-16 w-16 place-items-center rounded-2xl text-[#FFC928]"
                    style={{ animationDelay: `${i * 0.5}s`, background: 'linear-gradient(145deg,#2c2c34,#111115)', boxShadow: '0 6px 0 #050507,0 14px 0 -2px rgba(0,0,0,.15),0 22px 30px rgba(0,0,0,.35),inset 0 2px 0 rgba(255,255,255,.18)' }}
                  >
                    <s.icon size={28} strokeWidth={2.2} />
                  </span>

                  <div className="hiw-text mt-8">
                    <h3 className="text-lg font-extrabold text-[#16161A]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5b5a55]">{s.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="gal relative overflow-hidden py-24 sm:py-32" style={{ background: 'linear-gradient(180deg,#FFFFFF 0%,#FFF6D6 100%)' }}>
      <style>{`
        .gal-item{position:relative;overflow:hidden;border-radius:1.25rem;background:linear-gradient(135deg,#FFE88F,#FED45D);box-shadow:0 22px 40px -18px rgba(120,80,0,.4);transition:transform .35s ease,box-shadow .35s ease}
        @media (min-width:640px){.gal-item{border-radius:1.5rem}}
        .gal-item:hover{transform:translateY(-6px);box-shadow:0 34px 60px -20px rgba(180,120,0,.55),0 0 0 3px rgba(255,201,40,.85)}
        .gal-img{width:100%;height:100%;object-fit:cover;object-position:var(--o,50% 50%);transform:scale(var(--z,1));transform-origin:var(--o,50% 50%);transition:transform .8s ease}
        .gal-item:hover .gal-img{transform:scale(calc(var(--z,1) * 1.08))}
        .gal-cap{position:absolute;inset:auto 0 0 0;padding:2.5rem 1.1rem 1rem;background:linear-gradient(to top,rgba(22,22,26,.85),rgba(22,22,26,0));transform:translateY(32%);opacity:.92;transition:transform .4s ease,opacity .4s ease}
        .gal-item:hover .gal-cap{transform:translateY(0);opacity:1}
        .gal-shine{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit}
        .gal-shine::after{content:"";position:absolute;inset:-20%;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.55) 50%,transparent 62%);transform:translateX(-130%);transition:transform .9s}
        .gal-item:hover .gal-shine::after{transform:translateX(130%)}
        @keyframes gal-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,35px) scale(1.12)}}
        .gal-orb{animation:gal-orb 9s ease-in-out infinite}
        @media (hover:none){.gal-cap{transform:translateY(0)}}
        @media (prefers-reduced-motion:reduce){.gal *{animation:none!important;transition:none!important}}
      `}</style>

      <div className="gal-orb pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#FFC928]/30 blur-3xl" aria-hidden="true" />
      <div className="gal-orb pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#0F8A2F]/15 blur-3xl" style={{ animationDelay: '-4s' }} aria-hidden="true" />

      <div className="container-x relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC928]/30 px-4 py-1.5 text-sm font-bold text-[#16161A]">
            <span className="h-2 w-2 rounded-full bg-[#0F8A2F]" /> Our gallery
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#16161A] sm:text-5xl">
            City Delivery Services, <span className="italic text-[#0F8A2F]">in pictures.</span>
          </h2>
          <p className="mt-4 text-lg text-[#5b5a55]">A glimpse of the products, stores and everyday moments we help bring to your door.</p>
        </motion.div>

        <div className="mt-12 grid grid-flow-dense auto-rows-[140px] grid-cols-2 gap-3 sm:mt-16 sm:auto-rows-[200px] sm:gap-4 md:auto-rows-[190px] md:grid-cols-4 md:gap-5 lg:auto-rows-[220px]">
          {GALLERY_ITEMS.map((g, i) => (
            <motion.figure
              key={`${g.title}-${i}`}
              initial={{ opacity: 0, y: 50, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 15, delay: (i % 4) * 0.1 }}
              className={`gal-item m-0 ${g.span}`}
            >
              <img src={g.src} alt={`${g.title} — ${HERO_BRAND}`} loading="lazy" decoding="async" draggable="false" className="gal-img select-none" style={{ '--z': g.zoom, '--o': g.origin }} />
              <span className="gal-shine" aria-hidden="true" />
              <figcaption className="gal-cap">
                <strong className="block text-sm font-extrabold text-white sm:text-base">{g.title}</strong>
                <span className="mt-0.5 block text-xs text-white/80 sm:text-sm">{g.text}</span>
              </figcaption>
              <Link
                to={`/gallery/${g.slug}`}
                aria-label={`View details: ${g.title}`}
                className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
              />
            </motion.figure>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-14 text-center">
          <Link
            to="/request"
            className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white transition-transform hover:-translate-y-1 active:translate-y-1"
            style={{ background: 'linear-gradient(180deg,#19A23E,#0F8A2F)', boxShadow: '0 6px 0 #0A6B22,0 16px 26px rgba(15,138,47,.4),inset 0 2px 0 rgba(255,255,255,.3)' }}
          >
            Request a Service <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Why() {
  return (
    // Paste this <section> as the return value of your Why component.
// Needs only: motion (framer-motion) and MousePointerClick, Store, ShieldCheck, HeartHandshake (lucide-react).
<section id="why-choose-us" className="why relative overflow-hidden bg-[#16161A] py-24 text-white sm:py-32">
      <style>{`
        .why-card{transform-style:preserve-3d;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .25s ease-out,box-shadow .3s,border-color .3s;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px)}
        .why-card:hover{border-color:rgba(255,201,40,.65);box-shadow:0 35px 70px -25px rgba(255,201,40,.35),0 0 40px -10px rgba(255,201,40,.25)}
        .why-glare{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(255,201,40,.22),transparent 60%)}
        .why-card:hover .why-glare{opacity:1}
        .why-icon{transform:translateZ(55px);animation:why-float 5s ease-in-out infinite}
        .why-text{transform:translateZ(30px)}
        .why-ghost{transform:translateZ(15px)}
        @keyframes why-float{0%,100%{transform:translateZ(55px) translateY(0) rotate(3deg)}50%{transform:translateZ(55px) translateY(-9px) rotate(-3deg)}}
        @keyframes why-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(1.15)}}
        @keyframes why-spin{to{transform:rotate(360deg)}}
        @keyframes why-grid{to{background-position:48px 48px}}
        .why-grid{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px;animation:why-grid 8s linear infinite;-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%);mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%)}
        .why-orb{animation:why-orb 10s ease-in-out infinite}
        .why-ring{animation:why-spin 22s linear infinite}
        @media (prefers-reduced-motion:reduce){.why *{animation:none!important;transition:none!important}}
      `}</style>

      {/* animated background */}
      <div className="why-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="why-orb pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#FFC928]/20 blur-3xl" aria-hidden="true" />
      <div className="why-orb pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[#0F8A2F]/30 blur-3xl" style={{ animationDelay: '-5s' }} aria-hidden="true" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        {/* heading */}
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative lg:col-span-5">
          <div className="why-ring pointer-events-none absolute -left-10 -top-10 hidden h-40 w-40 rounded-full border-2 border-dashed border-[#FFC928]/30 lg:block" aria-hidden="true" />
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC928]/15 px-4 py-1.5 text-sm font-bold text-[#FFC928] ring-1 ring-[#FFC928]/30">
            <span className="h-2 w-2 rounded-full bg-[#FFC928]" /> Why choose us
          </span>
          <h2 className="relative mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Less hassle. <span className="text-[#FFC928]">More clarity.</span>
          </h2>
          <p className="relative mt-5 max-w-md text-lg leading-relaxed text-white/65">
            We built the request experience around what customers actually need: a clear form, a clear confirmation and a clear next step.
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7" style={{ perspective: '1200px' }}>
          {[
            { icon: MousePointerClick, title: 'Simple by design', text: 'One short form. No account, no app, no clutter.' },
            { icon: Store, title: 'Your store, your pick', text: 'You choose the product and the store — we work from your request.' },
            { icon: ShieldCheck, title: 'Clear communication', text: 'Every request gets a unique ID and a confirmation email.' },
            { icon: HeartHandshake, title: 'A real team', text: 'People review each request and contact you personally.' },
          ].map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 60, rotateY: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 70, damping: 14, delay: i * 0.12 }}
              style={{ transformPerspective: 1000 }}
            >
              <div
                className="why-card relative h-full overflow-hidden rounded-3xl p-7"
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  const px = (e.clientX - r.left) / r.width;
                  const py = (e.clientY - r.top) / r.height;
                  el.style.setProperty('--ry', `${(px - 0.5) * 18}deg`);
                  el.style.setProperty('--rx', `${-(py - 0.5) * 18}deg`);
                  el.style.setProperty('--mx', `${px * 100}%`);
                  el.style.setProperty('--my', `${py * 100}%`);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--rx', '0deg');
                  e.currentTarget.style.setProperty('--ry', '0deg');
                }}
              >
                <span className="why-glare" aria-hidden="true" />
                {/* ghost number for depth */}
                <span className="why-ghost pointer-events-none absolute -bottom-6 right-3 select-none text-[7rem] font-black leading-none text-white/[0.04]" aria-hidden="true">{i + 1}</span>

                <span
                  className="why-icon relative grid h-14 w-14 place-items-center rounded-2xl text-[#16161A]"
                  style={{ animationDelay: `${i * 0.6}s`, background: 'linear-gradient(145deg,#FFE066,#FFC928)', boxShadow: '0 6px 0 #B98600,0 14px 0 -2px rgba(0,0,0,.2),0 22px 30px rgba(255,201,40,.25),inset 0 2px 0 rgba(255,255,255,.55)' }}
                >
                  <w.icon size={26} strokeWidth={2.3} />
                </span>

                <div className="why-text relative mt-8">
                  <h3 className="text-xl font-bold">{w.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{w.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessIllustration() {
  const nodes = [
    { icon: ClipboardList, label: 'You request' },
    { icon: BellRing, label: 'Team notified' },
    { icon: PhoneCall, label: 'We contact you' },
  ];
  return (
   // Paste this <section> as the return value of your ProcessIllustration component.
// Needs only: motion (framer-motion) and ClipboardList, BellRing, PhoneCall (lucide-react).
<section id="request-journey" className="rj relative overflow-hidden py-24 sm:py-32" style={{ background: 'linear-gradient(180deg,#FFFFFF 0%,#FFF6D6 100%)' }}>
      <style>{`
        .rj-node{transform-style:preserve-3d;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .25s ease-out}
        .rj-cube{transform:translateZ(60px);animation:rj-float 5s ease-in-out infinite}
        .rj-label{transform:translateZ(30px)}
        .rj-badge{transform:translateZ(90px)}
        @keyframes rj-float{0%,100%{transform:translateZ(60px) translateY(0) rotate(-3deg)}50%{transform:translateZ(60px) translateY(-12px) rotate(3deg)}}
        @keyframes rj-pulse{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.6);opacity:0}}
        @keyframes rj-spin{to{transform:rotate(360deg)}}
        @keyframes rj-travel{0%{left:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{left:calc(100% - 16px);opacity:0}}
        @keyframes rj-dash{to{background-position:24px 0}}
        @keyframes rj-dashv{to{background-position:0 24px}}
        @keyframes rj-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(35px,-30px) scale(1.12)}}
        .rj-pulse{animation:rj-pulse 2.6s ease-out infinite}
        .rj-ring{animation:rj-spin 18s linear infinite}
        .rj-line{background-image:repeating-linear-gradient(90deg,#E0A800 0 12px,transparent 12px 24px);animation:rj-dash 1s linear infinite}
        .rj-vline{background-image:repeating-linear-gradient(180deg,#E0A800 0 12px,transparent 12px 24px);animation:rj-dashv 1s linear infinite}
        .rj-dot{animation:rj-travel 4s linear 2.2s infinite}
        .rj-orb{animation:rj-orb 9s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.rj *{animation:none!important;transition:none!important}}
      `}</style>

      <div className="rj-orb pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[#FFC928]/30 blur-3xl" aria-hidden="true" />
      <div className="rj-orb pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-[#0F8A2F]/15 blur-3xl" style={{ animationDelay: '-4s' }} aria-hidden="true" />

      <div className="container-x relative">
        {/* heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC928]/30 px-4 py-1.5 text-sm font-bold text-[#16161A]">
            <span className="h-2 w-2 rounded-full bg-[#0F8A2F]" /> The request journey
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#16161A] sm:text-5xl">What happens to your request</h2>
          <p className="mt-4 text-lg text-[#5b5a55]">A transparent path from the moment you press submit.</p>
        </motion.div>

        {/* journey */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          {/* desktop connector: dashed track + green fill + travelling dot */}
          <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-16 hidden h-1 md:block" aria-hidden="true">
            <div className="rj-line h-full w-full rounded-full opacity-60" />
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-[#0F8A2F]" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }} />
            <span className="rj-dot absolute -top-[6px] h-4 w-4 rounded-full bg-white shadow-[0_0_0_4px_#0F8A2F,0_0_18px_#0F8A2F]" />
          </div>
          {/* mobile connector */}
          <div className="rj-vline pointer-events-none absolute bottom-24 left-1/2 top-24 w-1 -translate-x-1/2 rounded-full opacity-60 md:hidden" aria-hidden="true" />

          <div className="relative grid gap-16 md:grid-cols-3 md:gap-6">
            {[
              { icon: ClipboardList, label: 'You request' },
              { icon: BellRing, label: 'Team notified' },
              { icon: PhoneCall, label: 'We contact you' },
            ].map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 60, scale: 0.7, rotateX: -35 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 80, damping: 13, delay: i * 0.35 }}
                style={{ transformPerspective: 1000 }}
              >
                <div
                  className="rj-node flex flex-col items-center text-center"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 24}deg`);
                    el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 24}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rx', '0deg');
                    e.currentTarget.style.setProperty('--ry', '0deg');
                  }}
                >
                  <div className="relative grid h-32 w-32 place-items-center" style={{ transformStyle: 'preserve-3d' }}>
                    {/* pulse + spinning dashed ring */}
                    <span className="rj-pulse absolute inset-2 rounded-[2rem] bg-[#FFC928]/50" style={{ animationDelay: `${i * 0.8}s` }} aria-hidden="true" />
                    <span className="rj-ring absolute -inset-3 rounded-[2.4rem] border-2 border-dashed border-[#E0A800]/60" aria-hidden="true" />

                    {/* 3D cube */}
                    <span
                      className="rj-cube relative grid h-28 w-28 place-items-center rounded-[2rem] text-[#16161A]"
                      style={{ animationDelay: `${i * 0.6}s`, background: 'linear-gradient(145deg,#FFE066,#FFC928)', boxShadow: '0 9px 0 #B98600,0 18px 0 -3px rgba(0,0,0,.15),0 30px 40px rgba(180,120,0,.35),inset 0 3px 0 rgba(255,255,255,.6)' }}
                    >
                      <n.icon size={46} strokeWidth={2.2} />
                    </span>

                    {/* completion check, pops in after the line reaches it */}
                    <motion.span
                      className="rj-badge absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full bg-[#0F8A2F] text-white shadow-[0_6px_14px_rgba(15,138,47,.5)] ring-4 ring-white"
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.5 + i * 0.9 }}
                      aria-hidden="true"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    </motion.span>
                  </div>

                  <div className="rj-label mt-10">
                    <span className="inline-block rounded-full bg-[#16161A] px-3 py-1 text-xs font-bold text-[#FFC928]">Step {i + 1}</span>
                    <h3 className="mt-3 text-xl font-extrabold text-[#16161A]">{n.label}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    // Paste this <section> as the return value of your Stats component.
// Needs only: motion (framer-motion) and ClipboardList, Send, ShieldCheck (lucide-react).
<div></div>
  );
}

function CTA() {
  return (
    <section className="px-3 pb-24 sm:px-6 sm:pb-32">
      <style>{`
        .cta-panel{background:radial-gradient(60% 90% at 8% 0%,rgba(255,201,40,.16),transparent 65%),radial-gradient(55% 80% at 100% 100%,rgba(15,138,47,.5),transparent 70%),#111713}
        .cta-grid{background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:44px 44px;-webkit-mask-image:radial-gradient(circle at 72% 50%,#000 5%,transparent 72%);mask-image:radial-gradient(circle at 72% 50%,#000 5%,transparent 72%)}
        .cta-orbit{transform:translate(-50%,-50%);animation:cta-spin 30s linear infinite}
        .cta-card{transform:translate(-50%,-50%);animation:cta-bob 6s ease-in-out infinite}
        .cta-badge{animation:cta-badge 5s ease-in-out infinite}
        .cta-dot{animation:cta-pulse 2s ease-out infinite}
        @keyframes cta-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes cta-bob{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-12px)}}
        @keyframes cta-badge{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes cta-pulse{0%{box-shadow:0 0 0 0 rgba(255,201,40,.6)}100%{box-shadow:0 0 0 12px rgba(255,201,40,0)}}
        @media (prefers-reduced-motion:reduce){.cta-orbit,.cta-card,.cta-badge,.cta-dot{animation:none!important}}
      `}</style>
      <div className="cta-panel relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-20 text-white sm:px-12 sm:py-24 lg:px-16">
        <div className="cta-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#FFC928]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#0F8A2F]/30 blur-3xl" aria-hidden="true" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFE08A] backdrop-blur">
              <span className="cta-dot h-2 w-2 rounded-full bg-[#FFC928]" /> Quick &amp; simple
            </span>
            <h2 className="mt-7 max-w-xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Ready to request <span className="italic text-[#FFC928]">your service?</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">It takes a couple of minutes. Tell us the product and the store, and we will take it from there.</p>
            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/75">
              {['No sign-up needed', 'We confirm by phone', 'Request ID included'].map((point) => (
                <li key={point} className="inline-flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFC928]/20 text-[#FFC928]"><Check className="h-3 w-3" strokeWidth={3} /></span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Button to="/request" size="lg" magnetic>Request a Service <ArrowRight size={20} /></Button>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 underline-offset-4 transition hover:text-[#FFC928] hover:underline">
                See how it works <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="relative mx-auto h-[330px] w-full max-w-md sm:h-[380px]" aria-hidden="true">
            <span className="cta-orbit absolute left-1/2 top-1/2 h-[290px] w-[290px] rounded-full border border-dashed border-white/20 sm:h-[350px] sm:w-[350px]" />
            <span className="cta-orbit absolute left-1/2 top-1/2 h-[210px] w-[210px] rounded-full border border-white/10" style={{ animationDirection: 'reverse', animationDuration: '19s' }} />
            <span className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC928]/20 blur-3xl" />

            <div className="absolute left-1/2 top-1/2 w-[250px] rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:w-[292px]" style={{ transform: 'translate(-50%,-50%) rotate(-10deg)' }} />
            <div className="absolute left-1/2 top-1/2 w-[250px] rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:w-[292px]" style={{ transform: 'translate(-50%,-50%) rotate(7deg)' }} />

            <div className="cta-card absolute left-1/2 top-1/2 w-[260px] rounded-3xl bg-white p-5 text-[#16161A] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] sm:w-[310px] sm:p-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0F8A2F] text-white"><ClipboardList className="h-4 w-4" /></span>
                  <span className="text-sm font-extrabold">New request</span>
                </div>
                <span className="rounded-full bg-[#FFF3C4] px-2.5 py-1 text-[9px] font-bold text-[#8a6400]">STEP 1 OF 3</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  { icon: Zap, label: 'Product', value: 'What you need' },
                  { icon: Store, label: 'Store', value: 'Where to pick it up' },
                  { icon: Truck, label: 'Delivery', value: 'Where it should go' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl bg-[#F6F7F4] p-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#0F8A2F] shadow-sm"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-[#8a8a83]">{label}</span>
                      <span className="block truncate text-xs font-semibold">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0F8A2F] py-3 text-xs font-bold text-white shadow-[0_4px_0_#0A6B22]">
                Submit request <ArrowRight className="h-4 w-4" />
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#7a7a73]"><ShieldCheck className="h-3 w-3 text-[#0F8A2F]" /> Request ID sent instantly</p>
            </div>

            <div className="cta-badge absolute -right-1 top-6 flex items-center gap-2 rounded-full bg-[#FFC928] px-4 py-2 text-xs font-bold text-[#16161A] shadow-lg sm:right-0"><PhoneCall className="h-4 w-4" /> We'll call you</div>
            <div className="cta-badge absolute bottom-6 -left-1 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0F8A2F] shadow-lg sm:left-0" style={{ animationDelay: '-2.5s' }}><ShieldCheck className="h-4 w-4" /> No sign-up needed</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-22" style={{ background: 'linear-gradient(180deg,#FFFFFF 0%,#F4F9F3 50%,#FFFFFF 100%)' }}>
      <style>{`
        .rv-mask{-webkit-mask-image:linear-gradient(to right,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(to right,transparent,#000 5%,#000 95%,transparent)}
        .rv-track{animation:rv-scroll 48s linear infinite;will-change:transform}
        .rv:hover .rv-track,.rv:hover .rv-float{animation-play-state:paused}
        .rv-float{animation:rv-float 7s ease-in-out infinite;animation-delay:calc(var(--i,0) * -.6s)}
        .rv-card{transform:perspective(1000px) rotateY(var(--tilt,0deg)) translateZ(0);transform-style:preserve-3d;transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s;will-change:transform}
        .rv-card:hover{transform:perspective(1000px) rotateY(0deg) translateY(-12px) translateZ(20px) scale(1.02);box-shadow:0 35px 60px -22px rgba(16,24,20,.35)}
        .rv-pop{transform:translateZ(35px)}
        @keyframes rv-scroll{to{transform:translateX(-50%)}}
        @keyframes rv-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @media (prefers-reduced-motion:reduce){
          .rv-track,.rv-float{animation:none!important}
          .rv-card,.rv-pop{transform:none!important;transition:none!important}
          .rv-mask{-webkit-mask-image:none;mask-image:none;overflow-x:auto}
        }
      `}</style>

      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#FFC928]/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-[#0F8A2F]/10 blur-3xl" aria-hidden="true" />

      <div className="container-x">
        <SectionHeading eyebrow="Reviews" title="Kind words from our customers." description="Real requests, real people, and deliveries handled with care." />
      </div>

      <div className="rv-mask relative mt-14" aria-label="Customer reviews">
        <div className="rv-track flex w-max py-6">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6" aria-hidden={copy === 1}>
              {REVIEWS.map((review, i) => (
                <div key={`${copy}-${review.name}`} className="rv-float" style={{ '--i': i }}>
                  <article
                    className="rv-card relative flex min-h-[268px] w-[290px] flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-[0_18px_50px_-20px_rgba(16,24,20,.25)] sm:w-[350px]"
                    style={{ '--tilt': i % 2 ? '-6deg' : '6deg' }}
                  >
                    <span className="absolute left-8 right-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-[#FFC928] via-[#0F8A2F] to-[#FFC928]" aria-hidden="true" />
                    <Quote className="absolute right-6 top-6 h-12 w-12 text-[#FFC928]/25" strokeWidth={1.5} aria-hidden="true" />
                    <div className="rv-pop flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, s) => <Star key={s} className="h-4 w-4 fill-[#FFC928] text-[#FFC928]" />)}
                    </div>
                    <p className="rv-pop mt-5 flex-1 text-[15px] leading-relaxed text-[#4b4b46]">“{review.quote}”</p>
                    <div className="rv-pop mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                        style={{ background: i % 2 ? 'linear-gradient(135deg,#B47A00,#FFC928)' : 'linear-gradient(135deg,#0A6E25,#0F8A2F)' }}
                      >
                        {review.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-bold text-[#16161A]">{review.name}</p>
                        <p className="truncate text-xs text-[#7a7a73]">{review.area} · {review.tag}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimationKey((key) => key + 1));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Fragment key={animationKey}>
      <SEO
        title="City Delivery Services in Vellore | Reliable Local Delivery"
        description="Looking for convenient local delivery in Vellore? City Delivery Services helps customers connect with stores and arrange delivery of everyday products."
        path="/"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({
            path: '/',
            name: 'City Delivery Services in Vellore',
            description: 'Looking for convenient local delivery in Vellore? City Delivery Services helps customers connect with stores and arrange delivery of everyday products.',
          }),
          serviceSchema(),
          faqSchema(FAQS),
        ]}
      />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Gallery />
      <Why />
      <ProcessIllustration />
      <Stats />
      <section className="pb-24 sm:pb-32 mt-10">
        <div className="container-x">
          <SectionHeading eyebrow="FAQ" title="Questions, answered." />
          <div className="mt-12"><FAQ items={FAQS} /></div>
        </div>
      </section>
      <Reviews />
      <CTA />
    </Fragment>
  );
}
