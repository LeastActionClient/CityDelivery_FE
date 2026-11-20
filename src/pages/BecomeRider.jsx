import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bike,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  IdCard,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { breadcrumbSchema, businessSchema, faqSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import Button from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';
import riderHero from '../assets/image.png';

const FAQ = [
  { q: 'Who can apply to become a rider?', a: 'Applicants must be at least 18 years old, hold a valid driving licence, and be available for local work in Vellore. You can apply with your own vehicle or ask about available assistance options.' },
  { q: 'Does submitting an application mean approval?', a: 'No. Submission only means we have received your details and documents. Our team reviews every application before approval, and approval does not automatically activate deliveries.' },
  { q: 'Which documents are needed?', a: 'A profile photo, both sides of your driving licence, PAN proof and, if you own a vehicle, its RC and vehicle photo. Insurance and identity proof may be required depending on your application. PUC documents are not collected.' },
  { q: 'Do I have to share bank details immediately?', a: 'No. You can submit bank details with the application or after approval. Bank information is kept separate from ordinary admin views and is only accessible with a dedicated sensitive-data key.' },
  { q: 'How do I check my application status?', a: 'After submitting, save the Application ID shown on the confirmation screen and use the Check Status page. If you provided an email address, status updates are also emailed to you.' },
  { q: 'Is a rider app available?', a: 'Not yet. This website currently supports applications, status checks and onboarding. Delivery assignment and tracking tools are not enabled.' },
];

const FEATURES = [
  { icon: ClipboardCheck, title: 'Simple application', text: 'Complete the form in clear steps and upload documents from your phone or computer.' },
  { icon: ShieldCheck, title: 'Private document handling', text: 'Documents are stored privately and bank or identity details are restricted.' },
  { icon: MapPin, title: 'Local work in Vellore', text: 'Tell us the areas and hours you prefer so our team can review your fit.' },
  { icon: CheckCircle2, title: 'Clear status updates', text: 'Use your Application ID to see where your application stands.' },
];

export default function BecomeRider() {
  const description = 'Apply to become a delivery rider with City Delivery Services in Vellore. Review requirements, submit documents and track your application status.';
  return (
    <>
      <SEO
        title="Become a Rider | City Delivery Services"
        description={description}
        path="/become-a-rider"
        image={`https://www.citydeliveryservices.com${riderHero}`}
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({ path: '/become-a-rider', name: 'Become a Rider', description, breadcrumb: true }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Become a Rider', path: '/become-a-rider' }], '/become-a-rider'),
          faqSchema(FAQ),
        ]}
      />
      <PageHero
        eyebrow="Rider onboarding"
        title="Ride with City Delivery Services"
        description="We are accepting rider applications in Vellore. Submit your details, track your status and complete onboarding if approved."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/rider/register">Apply now</Button>
          <Button to="/rider/status" variant="outline">Check application status</Button>
        </div>
      </PageHero>

      <section className="bg-white px-4 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img src={riderHero} alt="Delivery rider with a scooter" className="w-full rounded-4xl shadow-lift ring-1 ring-black/5" />
          </Reveal>
          <div>
            <p className="eyebrow">Who can apply</p>
            <h2 className="mt-4 text-4xl font-extrabold text-brand-dark">Built for local riders</h2>
            <p className="mt-5 text-lg leading-relaxed text-brand-muted">
              We review each application individually. You must be at least 18, hold a valid driving licence and be available for local work in Vellore. Vehicle options and requirements are confirmed by our team.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl bg-brand-light/70 p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><Icon size={22} /></span>
                  <h3 className="mt-4 text-lg font-extrabold text-brand-dark">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-light px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center">How it works</p>
          <h2 className="mt-4 text-center text-4xl font-extrabold text-brand-dark">From application to activation</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              ['01', 'Apply', 'Fill the multi-step form and upload your documents.'],
              ['02', 'Review', 'Our team reviews your details and may request more documents.'],
              ['03', 'Approval', 'Approved applicants receive a Rider ID by email.'],
              ['04', 'Activation', 'An administrator activates the account separately when onboarding is complete.'],
            ].map(([number, title, text], index) => (
              <motion.div key={number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5">
                <span className="font-display text-3xl font-extrabold text-brand-yellow-deep">{number}</span>
                <h3 className="mt-3 text-xl font-extrabold text-brand-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Documents</p>
            <h2 className="mt-4 text-4xl font-extrabold text-brand-dark">What to keep ready</h2>
            <ul className="mt-7 space-y-3 text-brand-text">
              {['Profile photo', 'Driving licence — front and back', 'PAN number and PAN proof', 'Vehicle RC — front and back, if you own a vehicle', 'Vehicle photo and insurance where applicable', 'Identity or bank proof — only if provided or requested'].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-brand-light/70 p-4">
                  <FileText size={19} className="mt-0.5 shrink-0 text-brand-green" />
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 text-4xl font-extrabold text-brand-dark">Rider FAQs</h2>
            <div className="mt-7 space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group rounded-3xl bg-brand-light/70 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-brand-dark">
                    {q}
                    <span className="text-brand-green transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-16 text-center text-white sm:px-8">
        <Bike className="mx-auto text-brand-yellow" size={42} />
        <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Ready to apply?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/65">Have your documents ready. You can save your Application ID and check your status at any time.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/rider/register">Start application</Button>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10">
            <IdCard size={17} className="mr-2" /> Ask a question
          </Link>
        </div>
      </section>
    </>
  );
}
