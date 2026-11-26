import {
  Target,
  Eye,
  Smile,
  Compass,
  ArrowRight,
  ClipboardList,
  PhoneCall,
  PackageCheck,
  Truck,
  ShieldCheck,
  Clock,
  MapPin,
  Store,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  XCircle,
  MailCheck,
  UserRound,
} from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import heroVisual from '../assets/image.png';
import SEO, { breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';

/* ------------------------------------------------------------------ data */

const BLOCKS = [
  { icon: Target, title: 'Our mission', text: 'To make asking for the products you love as simple as filling in a short form — with clear communication at every step.' },
  { icon: Eye, title: 'Our vision', text: 'A city where getting what you need from the stores you trust never feels like a chore.' },
  { icon: Smile, title: 'Customer convenience', text: 'No accounts, no apps, no long queues. Tell us the product, the store and your address, and we take it from there.' },
  { icon: Compass, title: 'Our service approach', text: 'Every request is reviewed by a person who contacts you directly to confirm the details. We tell you what is possible — and what is not.' },
];

const KEYWORDS = [
  'Local pickup',
  'Doorstep delivery',
  'Human-reviewed requests',
  'No accounts needed',
  'Unique request ID',
  'Confirmation email',
  'Made for Vellore',
  'Clear communication',
];

const JOURNEY = [
  { icon: ClipboardList, step: '01', title: 'You send a request', text: 'Fill in a short form with the product, the store and your delivery address. It takes a couple of minutes.' },
  { icon: MailCheck, step: '02', title: 'You get a request ID', text: 'Your request receives a unique ID and a confirmation email, so you always know it reached us.' },
  { icon: UserRound, step: '03', title: 'A person reviews it', text: 'A member of our team reads your request and checks whether it can be arranged.' },
  { icon: PhoneCall, step: '04', title: 'We contact you', text: 'We call or message you to confirm the details before anything is arranged. No surprises.' },
  { icon: Truck, step: '05', title: 'We arrange the delivery', text: 'Once everything is agreed, our rider takes care of the pickup and brings it to your door.' },
  { icon: PackageCheck, step: '06', title: 'You receive it', text: 'Your product arrives, and you can reach us any time if something needs attention.' },
];

const PROMISES = [
  { icon: ShieldCheck, title: 'Honest by default', text: 'If something cannot be done, we say so up front instead of leaving you waiting.' },
  { icon: Clock, title: 'Respect for your time', text: 'A short form, a clear reply, and no repeated explanations.' },
  { icon: MapPin, title: 'Rooted locally', text: 'We are built around Vellore and the stores people here already trust.' },
  { icon: Store, title: 'Your store, your choice', text: 'You decide where the product comes from. We simply make the trip for you.' },
  { icon: HeartHandshake, title: 'A real conversation', text: 'Every request is followed by a real person, not an automated dead end.' },
  { icon: Sparkles, title: 'Simple to use', text: 'No sign-up, no app to install, no learning curve.' },
];

const CAN = [
  'Pick up a product you name from a store you choose',
  'Deliver it to the address you give us',
  'Confirm every detail with you before arranging anything',
  'Keep you informed with a request ID and email',
];

const CANNOT = [
  'Arrange items covered by our prohibited items policy',
  'Promise a request is possible before it has been reviewed',
  'Start a delivery without confirming details with you',
];

/* ---------------------------------------------------------- local styles */

const STYLES = `
  .ab-marquee { overflow: hidden; }
  .ab-track { display: flex; width: max-content; will-change: transform; }
  .ab-rtl { animation: ab-rtl var(--ab-speed, 40s) linear infinite; }
  .ab-marquee:hover .ab-track { animation-play-state: paused; }
  @keyframes ab-rtl { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  .ab-stage { perspective: 1400px; }
  .ab-card3d {
    transform: rotateY(-10deg) rotateX(3deg);
    transform-style: preserve-3d;
    transition: transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s ease;
    box-shadow: 0 30px 50px -24px rgba(0,0,0,.45), 0 8px 0 -2px rgba(0,0,0,.22);
  }
  .ab-card3d:hover { transform: rotateY(0deg) rotateX(0deg) translateY(-12px) translateZ(20px); box-shadow: 0 44px 60px -26px rgba(0,0,0,.5), 0 8px 0 -2px rgba(0,0,0,.22); }
  .ab-card3d .ab-pop { transform: translateZ(38px); }

  .ab-rail { scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .ab-rail::-webkit-scrollbar { display: none; }
  .ab-snap { scroll-snap-align: center; }

  .ab-float { animation: ab-float 6s ease-in-out infinite; }
  .ab-float-b { animation: ab-float 7.5s ease-in-out infinite reverse; }
  @keyframes ab-float {
    0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
    50% { transform: translateY(-14px) rotate(calc(var(--r, 0deg) + 2deg)); }
  }

  .ab-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ab-rtl, .ab-float, .ab-float-b { animation: none; }
    .ab-card3d, .ab-card3d:hover { transform: none; }
  }
`;

/* ------------------------------------------------------------ components */

/** Right-to-left infinite marquee. Content is duplicated so the loop is seamless. */
function MarqueeRTL({ children, speed = 40, className = '' }) {
  return (
    <div className={`ab-marquee ${className}`} style={{ '--ab-speed': `${speed}s` }}>
      <div className="ab-track ab-rtl">
        <div className="flex shrink-0 items-center gap-5 pr-5">{children}</div>
        <div className="flex shrink-0 items-center gap-5 pr-5" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export default function About() {
  return (
    <>
      <style>{STYLES}</style>

      <SEO
        title="About City Delivery Services | Local Delivery in Vellore"
        description="Learn about City Delivery Services and our mission to make local product pickup and delivery more convenient in Vellore."
        path="/about"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({
            path: '/about',
            name: 'About City Delivery Services',
            description: 'Learn about City Delivery Services and our mission to make local product pickup and delivery more convenient in Vellore.',
            breadcrumb: true,
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }], '/about'),
        ]}
      />

      <PageHero
        eyebrow="About us"
        title="Convenience, made personal."
        description="City Delivery Services is a request-based service: you tell us what you need and where it is from, and our team works with you on the next steps."
      />

      {/* ---------------------------------------------------- who we are */}
      <section className="pb-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight text-brand-dark sm:text-5xl">A simple idea, carefully run.</h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-muted">
              Finding a specific product from a specific store takes time. City Delivery Services exists to take that effort off your plate. You submit a request with the product, the store and your delivery details; our team receives it instantly and gets in touch.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-brand-muted">
              We keep the process honest and human: every request gets a unique ID, a confirmation email and a real conversation before anything is arranged.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="ab-stage relative mx-auto aspect-square w-full max-w-md">
              {/* floating accent chips */}
              <span
                className="ab-float absolute -left-4 top-8 z-20 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-brand-dark shadow-lift sm:flex"
                style={{ '--r': '-6deg' }}
              >
                <MailCheck size={18} className="text-brand-green" /> Confirmation email
              </span>
              <span
                className="ab-float-b absolute -right-4 bottom-10 z-20 hidden items-center gap-2 rounded-2xl bg-brand-dark px-4 py-3 text-sm font-bold text-white shadow-lift sm:flex"
                style={{ '--r': '5deg' }}
              >
                <UserRound size={18} className="text-brand-yellow" /> Real person follow-up
              </span>

              <div className="absolute inset-0 rotate-6 rounded-[3rem] bg-brand-yellow" />
              <div className="absolute inset-0 -rotate-3 rounded-[3rem] bg-brand-green/90" />
              <div className="absolute inset-0 overflow-hidden rounded-[3rem] bg-brand-yellow shadow-lift">
                <img
                  src={heroVisual}
                  alt="City Delivery Services courier delivering products around the city"
                  className="h-full w-full object-cover"
                  decoding="async"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------- right-to-left keyword marquee */}
      <section aria-hidden="true" className="-rotate-1 bg-brand-yellow py-5 shadow-lift">
        <MarqueeRTL speed={34}>
          {KEYWORDS.map((k) => (
            <span key={k} className="flex items-center gap-5 whitespace-nowrap text-xl font-extrabold uppercase tracking-wide text-brand-dark sm:text-2xl">
              {k}
              <Sparkles size={22} className="text-brand-green" />
            </span>
          ))}
        </MarqueeRTL>
      </section>

      {/* ----------------------------------------- four ideas (3D tilt) */}
      <section className="bg-brand-dark py-24 text-white">
        <div className="container-x">
          <SectionHeading dark eyebrow="What guides us" title="Built around four ideas" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2">
            {BLOCKS.map((b) => (
              <StaggerItem key={b.title}>
                <TiltCard className="glass-dark h-full rounded-4xl p-8">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-brand-dark">
                    <b.icon size={26} />
                  </span>
                  <h3 className="mt-6 text-2xl font-extrabold">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/70">{b.text}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------- journey: horizontal 3D scroll rail */}
      <section className="overflow-hidden py-24">
        <div className="container-x">
          <SectionHeading eyebrow="How a request travels" title="From your form to your front door" />
          <p className="mt-4 hidden items-center gap-2 text-sm font-semibold text-brand-muted sm:flex">
            <ArrowRight size={16} /> Scroll sideways to follow the journey
          </p>
        </div>

        <div className="ab-stage mt-12">
          <div className="ab-rail flex gap-6 overflow-x-auto px-6 pb-12 pt-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))]">
            {JOURNEY.map((s) => (
              <article
                key={s.step}
                className="ab-card3d ab-snap relative w-[17.5rem] shrink-0 rounded-4xl border border-black/5 bg-white p-7 sm:w-80"
              >
                <span className="pointer-events-none absolute right-5 top-3 select-none text-7xl font-black text-brand-yellow/60">
                  {s.step}
                </span>
                <span className="ab-pop grid h-14 w-14 place-items-center rounded-2xl bg-brand-dark text-brand-yellow shadow-lift">
                  <s.icon size={26} />
                </span>
                <h3 className="mt-6 text-xl font-extrabold text-brand-dark">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-muted">{s.text}</p>
              </article>
            ))}
            <div className="w-6 shrink-0 sm:w-24" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ---------------------------- promises: right-to-left auto rail */}
      <section className="relative overflow-hidden bg-brand-dark py-24 text-white">
        <div className="ab-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative">
          <div className="container-x">
            <SectionHeading dark eyebrow="Our promises" title="What you can count on" />
          </div>

          <div className="ab-stage mt-14">
            <MarqueeRTL speed={55} className="py-10">
              {PROMISES.map((p) => (
                <article
                  key={p.title}
                  className="ab-card3d glass-dark w-72 shrink-0 whitespace-normal rounded-4xl p-7 sm:w-80"
                >
                  <span className="ab-pop grid h-12 w-12 place-items-center rounded-2xl bg-brand-yellow text-brand-dark">
                    <p.icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/70">{p.text}</p>
                </article>
              ))}
            </MarqueeRTL>
          </div>
        </div>
      </section>

      {/* -------------------------------- what we do / do not do (honest) */}
      <section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Being upfront" title="What we do — and what we don't" />
          <div className="ab-stage mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="ab-card3d h-full rounded-4xl bg-brand-yellow p-8 sm:p-10">
                <h3 className="ab-pop text-2xl font-extrabold text-brand-dark">We can help with</h3>
                <ul className="mt-6 space-y-4">
                  {CAN.map((c) => (
                    <li key={c} className="flex items-start gap-3 font-semibold text-brand-dark">
                      <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-brand-green" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="ab-card3d h-full rounded-4xl bg-brand-dark p-8 text-white sm:p-10" style={{ transform: 'rotateY(10deg) rotateX(3deg)' }}>
                <h3 className="ab-pop text-2xl font-extrabold">We won't</h3>
                <ul className="mt-6 space-y-4">
                  {CANNOT.map((c) => (
                    <li key={c} className="flex items-start gap-3 font-semibold text-white/85">
                      <XCircle size={22} className="mt-0.5 shrink-0 text-brand-yellow" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden py-24 text-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="ab-float absolute left-[8%] top-16 h-24 w-24 rounded-3xl bg-brand-yellow/80 shadow-lift" style={{ '--r': '12deg' }} />
          <span className="ab-float-b absolute right-[10%] top-24 h-16 w-16 rounded-2xl bg-brand-green/80 shadow-lift" style={{ '--r': '-10deg' }} />
          <span className="ab-float absolute bottom-12 right-[22%] h-20 w-20 rounded-full bg-brand-yellow/70 shadow-lift" />
          <span className="ab-float-b absolute bottom-16 left-[18%] h-14 w-14 rounded-full bg-brand-dark/80 shadow-lift" />
        </div>

        <Reveal className="container-x relative">
          <h2 className="text-4xl font-extrabold text-brand-dark sm:text-5xl">Let us know what you need.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-muted">
            A short form is all it takes. We will review it and get back to you personally.
          </p>
          <div className="mt-8">
            <Button to="/request" size="lg" magnetic>
              Request a Service <ArrowRight size={20} />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}