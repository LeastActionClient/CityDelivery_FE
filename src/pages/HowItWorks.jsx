import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ClipboardList, Store, Send, BellRing, PhoneCall, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { breadcrumbSchema } from '../components/SEO.jsx';
import Button from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';

const STEPS = [
  { icon: ClipboardList, title: 'Tell us what product you need', text: 'Give the product a name, choose a category and describe it — brand, size, colour. Add a photo if it helps.' },
  { icon: Store, title: 'Share the store information', text: 'Tell us the store name and where it is located so we know exactly where to look.' },
  { icon: Send, title: 'Submit your request', text: 'Add your delivery address and contact details, then press submit. You instantly receive a unique Request ID.' },
  { icon: BellRing, title: 'Our team receives your request', text: 'Your request is saved and our team is notified with every detail you provided. If you add an email address, you get a confirmation email too.' },
  { icon: PhoneCall, title: 'Our team contacts you with the next steps', text: 'A team member reviews the request and reaches out to confirm details, availability and what happens next.' },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <>
      <SEO
        title="How City Delivery Services Works | Vellore Requests"
        description="See how to submit a product and store delivery request in Vellore, from entering details to receiving confirmation from our team."
        path="/how-it-works"
        structuredData={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'How It Works', path: '/how-it-works' }])]}
      />
      <PageHero eyebrow="How it works" title="From idea to inbox in five steps." description="A clear, honest process. Submitting a request starts the conversation — our team confirms everything with you directly." />

      <section className="pb-24">
        <div ref={ref} className="container-x relative max-w-4xl">
          <div className="absolute bottom-0 left-7 top-0 w-1 rounded-full bg-brand-yellow/40 md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
            <motion.div style={{ scaleY: progress, transformOrigin: 'top' }} className="h-full w-full rounded-full bg-brand-green" />
          </div>

          <ol className="space-y-12 md:space-y-20">
            {STEPS.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.title} className="relative pl-20 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                  <span className="absolute left-0 top-0 z-10 grid h-14 w-14 place-items-center rounded-2xl bg-brand-dark font-display text-xl font-extrabold text-brand-yellow shadow-lift md:left-1/2 md:-translate-x-1/2">{i + 1}</span>
                  <Reveal className={`${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}>
                    <div className="rounded-4xl bg-white p-7 shadow-soft ring-1 ring-black/5">
                      <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-brand-dark ${right ? '' : 'md:ml-auto'}`}><s.icon size={26} /></span>
                      <h2 className="mt-5 text-2xl font-extrabold text-brand-dark">{s.title}</h2>
                      <p className="mt-3 leading-relaxed text-brand-muted">{s.text}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          <Reveal className="mt-20 text-center">
            <p className="mx-auto max-w-xl text-brand-muted">Please note: a submitted request is not an automatic order. Availability, pricing and timing are confirmed by our team.</p>
            <div className="mt-8"><Button to="/request" size="lg" magnetic>Start your request <ArrowRight size={20} /></Button></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
