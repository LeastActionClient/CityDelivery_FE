import { Target, Eye, Smile, Compass, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import heroVisual from '../assets/image.png';
import SEO, { breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';

const BLOCKS = [
  { icon: Target, title: 'Our mission', text: 'To make asking for the products you love as simple as filling in a short form — with clear communication at every step.' },
  { icon: Eye, title: 'Our vision', text: 'A city where getting what you need from the stores you trust never feels like a chore.' },
  { icon: Smile, title: 'Customer convenience', text: 'No accounts, no apps, no long queues. Tell us the product, the store and your address, and we take it from there.' },
  { icon: Compass, title: 'Our service approach', text: 'Every request is reviewed by a person who contacts you directly to confirm the details. We tell you what is possible — and what is not.' },
];

export default function About() {
  return (
    <>
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
      <PageHero eyebrow="About us" title="Convenience, made personal." description="City Delivery Services is a request-based service: you tell us what you need and where it is from, and our team works with you on the next steps." />

      <section className="pb-24">
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
            <div className="relative mx-auto aspect-square w-full max-w-md">
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

      <section className="bg-brand-dark py-24 text-white">
        <div className="container-x">
          <SectionHeading dark eyebrow="What guides us" title="Built around four ideas" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2">
            {BLOCKS.map((b) => (
              <StaggerItem key={b.title}>
                <TiltCard className="glass-dark h-full rounded-4xl p-8">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><b.icon size={26} /></span>
                  <h3 className="mt-6 text-2xl font-extrabold">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/70">{b.text}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 text-center">
        <Reveal className="container-x">
          <h2 className="text-4xl font-extrabold text-brand-dark sm:text-5xl">Let us know what you need.</h2>
          <div className="mt-8"><Button to="/request" size="lg" magnetic>Request a Service <ArrowRight size={20} /></Button></div>
        </Reveal>
      </section>
    </>
  );
}
