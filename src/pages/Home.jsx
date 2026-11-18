import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Store, Send, BellRing, PhoneCall, MousePointerClick, ShieldCheck, Zap, HeartHandshake, Truck, Play, Bike } from 'lucide-react';
import Button from '../components/Button.jsx';
import FloatingShapes from '../components/FloatingShapes.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import Counter from '../components/Counter.jsx';
import FAQ from '../components/FAQ.jsx';
// Put the image at src/assets/hero-visual.png
import heroVisual from '../assets/image.png';
import responsiveHeroBackground from '../assets/resposiveImage.png';

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
  { q: 'How do I request a product?', a: 'Open the Request a Product page, fill in your details, the product and store information and your delivery address, then submit. You will see a confirmation with your Request ID right away.' },
  { q: 'What happens after I submit?', a: 'Your request is saved and our team is notified by email. You also get a confirmation email. A team member will then contact you with the next steps.' },
  { q: 'Is delivery automatic?', a: 'No. Submitting a request does not place an automatic order. Our team reviews each request and confirms availability, price and timing with you directly.' },
  { q: 'Can I upload a photo of the product?', a: 'Yes — an optional JPG, PNG or WebP image up to 5 MB can be attached to help us identify the exact item.' },
  { q: 'What if my confirmation email does not arrive?', a: 'Your request is already saved once you see the success screen. Check your spam folder and keep your Request ID; our system also retries failed emails automatically.' },
  { q: 'How can I contact you?', a: 'Use the contact form on the Contact page. Any email, phone or address details shown there are provided by the business.' },
];

const FEATURES = [
  { icon: Zap, title: 'Easy Request', text: 'Tell us what you need' },
  { icon: Store, title: 'Any Store', text: 'From your preferred store' },
  { icon: Bike, title: 'Timely Support', text: "We'll get in touch quickly" },
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
      <div className="pointer-events-none absolute inset-x-0 top-10 z-0 h-full sm:top-20 lg:hidden" aria-hidden="true">
        <img src={responsiveHeroBackground} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-white/10" />
      </div>

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
            initial={{ opacity: 0, scale: 0.94, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
            className="hv-img relative block w-full select-none"
          />
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
          Tell us what you need and where you want it from. City Delivery Services makes requesting your favourite products{' '}
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
            className="hv-btn inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white lg:h-[4.1vw] lg:gap-[0.9vw] lg:rounded-[1.1vw] lg:px-[2.3vw] lg:py-0 lg:text-[1.35vw]"
            style={{ background: 'linear-gradient(180deg,#19A23E,#0F8A2F)', boxShadow: '0 6px 0 #0A6B22,0 16px 26px rgba(15,138,47,.4),inset 0 2px 0 rgba(255,255,255,.3)' }}
          >
            Request a Product <ArrowRight className="h-5 w-5 lg:h-[1.5vw] lg:w-[1.5vw]" />
          </Link>
          <Link
            to="/how-it-works"
            className="hv-btn hv-btn-alt inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[#FFE9A0] bg-white px-8 py-4 text-lg font-bold text-[#16161A] lg:h-[4.1vw] lg:gap-[0.9vw] lg:rounded-[1.1vw] lg:px-[2.3vw] lg:py-0 lg:text-[1.35vw]"
            style={{ boxShadow: '0 6px 0 #F3D56B,0 16px 24px rgba(0,0,0,.08)' }}
          >
            How It Works <Play className="h-5 w-5 lg:h-[1.4vw] lg:w-[1.4vw]" />
          </Link>
        </motion.div>

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
    </section>
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
<section id="stats" className="st pb-24 sm:pb-32">
      <style>{`
        .st-card{transform-style:preserve-3d;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .25s ease-out,box-shadow .3s;box-shadow:0 8px 0 rgba(176,108,0,.45),0 24px 38px rgba(120,70,0,.28),inset 0 2px 0 rgba(255,255,255,.75)}
        .st-card:hover{box-shadow:0 8px 0 rgba(176,108,0,.5),0 34px 54px rgba(120,70,0,.35),inset 0 2px 0 rgba(255,255,255,.85)}
        .st-glare{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.65),transparent 60%)}
        .st-card:hover .st-glare{opacity:1}
        .st-icon{transform:translateZ(55px);animation:st-float 4.8s ease-in-out infinite}
        .st-num{transform:translateZ(70px)}
        .st-label{transform:translateZ(30px)}
        .st-shimmer{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit}
        .st-shimmer::after{content:"";position:absolute;top:-20%;bottom:-20%;width:30%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.45),transparent);animation:st-sweep 6s ease-in-out infinite}
        .st-orb{animation:st-orb 8s ease-in-out infinite}
        .st-ring{animation:st-spin 20s linear infinite}
        @keyframes st-float{0%,100%{transform:translateZ(55px) translateY(0) rotate(-4deg)}50%{transform:translateZ(55px) translateY(-9px) rotate(4deg)}}
        @keyframes st-sweep{0%{left:-40%}60%,100%{left:130%}}
        @keyframes st-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(28px,-24px) scale(1.15)}}
        @keyframes st-spin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){.st *{animation:none!important;transition:none!important}}
      `}</style>

      <div className="container-x mt-20">
        <motion.div
          initial={{ opacity: 0, y: 70, rotateX: 25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          style={{ transformPerspective: 1200, background: 'linear-gradient(135deg,#FFD84D 0%,#FFC928 50%,#F5B000 100%)', boxShadow: '0 12px 0 #D99A00,0 40px 70px -20px rgba(150,90,0,.5),inset 0 3px 0 rgba(255,255,255,.55)' }}
          className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14"
        >
          {/* animated background */}
          <span className="st-shimmer" aria-hidden="true" />
          <span className="st-orb pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/35 blur-3xl" aria-hidden="true" />
          <span className="st-orb pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[#0F8A2F]/25 blur-3xl" style={{ animationDelay: '-4s' }} aria-hidden="true" />
          <span className="st-ring pointer-events-none absolute -right-24 -top-24 hidden h-72 w-72 rounded-full border-2 border-dashed border-white/50 md:block" aria-hidden="true" />

          <div className="relative grid gap-8 sm:grid-cols-3" style={{ perspective: '1200px' }}>
            {[
              { icon: ClipboardList, value: 3, suffix: ' sections', label: 'To fill in: you, the product, delivery' },
              { icon: Send, value: 5, suffix: ' steps', label: 'From request to our reply' },
              { icon: ShieldCheck, value: 1, suffix: ' unique ID', label: 'Issued for every request' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 50, rotateY: i === 0 ? -35 : i === 2 ? 35 : 0, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 70, damping: 13, delay: 0.2 + i * 0.15 }}
                style={{ transformPerspective: 1000 }}
              >
                <div
                  className="st-card relative h-full overflow-hidden rounded-3xl bg-white/35 px-6 py-8 text-center ring-1 ring-white/70 backdrop-blur-sm"
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
                  <span className="st-glare" aria-hidden="true" />

                  <span
                    className="st-icon mx-auto grid h-14 w-14 place-items-center rounded-2xl text-[#FFC928]"
                    style={{ animationDelay: `${i * 0.6}s`, background: 'linear-gradient(145deg,#2c2c34,#111115)', boxShadow: '0 6px 0 #050507,0 16px 24px rgba(0,0,0,.3),inset 0 2px 0 rgba(255,255,255,.18)' }}
                  >
                    <s.icon size={26} strokeWidth={2.2} />
                  </span>

                  {/* counts up once when scrolled into view */}
                  <div className="st-num mt-6 text-5xl font-black text-[#16161A] sm:text-6xl" style={{ textShadow: '0 2px 0 rgba(255,255,255,.7),0 8px 16px rgba(120,70,0,.3)' }}>
                    <motion.span
                      onViewportEnter={(entry) => {
                        const el = entry && entry.target;
                        if (!el || el.dataset.done) return;
                        el.dataset.done = '1';
                        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = String(s.value); return; }
                        const t0 = performance.now();
                        const tick = (t) => {
                          const p = Math.min((t - t0) / 1400, 1);
                          el.textContent = String(Math.round(s.value * (1 - Math.pow(1 - p, 3))));
                          if (p < 1) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                      }}
                      viewport={{ once: true }}
                    >
                      {s.value}
                    </motion.span>
                    <span className="text-3xl sm:text-4xl">{s.suffix}</span>
                  </div>

                  <p className="st-label mx-auto mt-3 max-w-[16rem] font-semibold text-[#16161A]/75">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="relative mt-10 text-center text-xs font-bold uppercase tracking-widest text-[#16161A]/55">
            These figures describe how the service works. They are not performance statistics.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-3 pb-24 sm:px-6 sm:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-brand-dark px-6 py-20 text-center text-white sm:px-16 sm:py-28">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-yellow/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-green/40 blur-3xl" aria-hidden="true" />
        <Reveal>
          <Zap className="mx-auto text-brand-yellow" size={40} />
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">Ready to request your product?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">It takes a couple of minutes. Tell us the product and the store, and we will take it from there.</p>
          <div className="mt-9"><Button to="/request" size="lg" magnetic>Request a Product <ArrowRight size={20} /></Button></div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Why />
      <ProcessIllustration />
      <Stats />
      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <SectionHeading eyebrow="FAQ" title="Questions, answered." />
          <div className="mt-12"><FAQ items={FAQS} /></div>
        </div>
      </section>
      <CTA />
    </>
  );
}
