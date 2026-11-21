import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { SITE_URL, breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import { PROHIBITED_ITEMS_POLICY_VERSION } from '../utils/config.js';

const EFFECTIVE_DATE = '20 November 2026';

const PROHIBITED = [
  {
    title: 'Illegal, stolen or counterfeit goods',
    text: 'Any item that is illegal to possess, purchase, sell or transport in India; stolen property; counterfeit or pirated goods; and items that infringe another person’s rights.',
  },
  {
    title: 'Explosives, weapons and ammunition',
    text: 'Fireworks, flares, detonators, gunpowder, ammunition, firearms, unlicensed weapons, martial-arts weapons and any other weapon that cannot lawfully be carried in a personal parcel.',
  },
  {
    title: 'Flammable and hazardous materials',
    text: 'Petrol, diesel, lighter fluid, paint thinner, solvents, flammable adhesives, gas cylinders, fuel tablets, matches, aerosol cans, corrosive acids, alkalis, pesticides, poisons and toxic chemicals.',
  },
  {
    title: 'Radioactive, infectious and biological material',
    text: 'Radioactive substances, medical or biological waste, used sharps, cultures, samples, pathogens and any material that could contaminate people, vehicles or other parcels.',
  },
  {
    title: 'Narcotics and controlled substances',
    text: 'Illegal drugs, narcotics, controlled substances, prescription medicines without valid authorisation, and any medicine or supplement that is restricted or prohibited by law.',
  },
  {
    title: 'Live animals, humans and plants',
    text: 'Live animals, birds, fish, insects, reptiles, plants with soil, and any living creature or human being. Service-animal arrangements are outside this request service.',
  },
  {
    title: 'Perishable and temperature-controlled goods without approval',
    text: 'Fresh food, frozen food, dairy products, cooked food, flowers and other items that require temperature control, except where we have agreed suitable packaging and handling in advance.',
  },
  {
    title: 'Obscene, hateful or unlawful content',
    text: 'Material that is obscene, hateful, defamatory, promotes violence, or is otherwise unlawful to possess or distribute.',
  },
];

const RESTRICTED = [
  {
    title: 'Alcohol, tobacco and nicotine products',
    text: 'Only where lawful, correctly sealed and handed over to an eligible adult. Age and local rules apply.',
  },
  {
    title: 'Ordinary medicines',
    text: 'Non-hazardous, sealed, labelled and in-date medicines may be accepted when permitted by law. Controlled substances remain prohibited.',
  },
  {
    title: 'Liquids, gels, powders and aerosols',
    text: 'Must be leak-proof, rigidly packed and declared. Hazardous versions remain prohibited.',
  },
  {
    title: 'Electronics and batteries',
    text: 'Electronics with lithium or other batteries must be declared, protected from short-circuiting and packed securely. Damaged or recalled batteries are not accepted.',
  },
  {
    title: 'Fragile, sharp and high-value items',
    text: 'Glassware, ceramics, tools with exposed blades, jewellery, watches, bullion, cash, cheques, passports, licences and important documents require prior agreement and suitable packing.',
  },
  {
    title: 'Oversized or unusually heavy goods',
    text: 'Items must fit ordinary two-wheeler or car transport safely. We may decline anything that cannot be carried safely or legally.',
  },
];

const DUTIES = [
  'I confirm that the parcel contains only permitted items and that my description of the product is accurate.',
  'I confirm that I am legally allowed to hand over the item and that I have any permission, licence or authorisation required for it.',
  'I will pack the item securely so that it does not leak, break, injure a person or damage another parcel.',
  'I will tell our team before collection if an item is fragile, valuable, temperature-sensitive or otherwise needs special handling.',
  'I will not place a prohibited item inside a parcel described as something else.',
  'I understand that City Delivery Services may inspect, refuse, return or stop delivery of any parcel that appears to breach this policy.',
];

export default function ProhibitedItemsPolicy() {
  return (
    <>
      <SEO
        title="Prohibited Items Policy | City Delivery Services"
        description="Read the City Delivery Services prohibited and restricted items policy before submitting a product delivery request in Vellore."
        path="/prohibited-items-policy"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({
            path: '/prohibited-items-policy',
            name: 'Prohibited Items Policy',
            description: 'Prohibited and restricted items policy for City Delivery Services product delivery requests.',
            breadcrumb: true,
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Request a Service', path: '/request' }, { name: 'Prohibited Items Policy', path: '/prohibited-items-policy' }], '/prohibited-items-policy'),
        ]}
      />

      <PageHero
        eyebrow="Delivery policy"
        title="Prohibited Items Policy"
        description="A short, clear declaration of what cannot be sent and what needs prior approval before we arrange a delivery."
      />

      <section className="pb-24">
        <div className="container-x max-w-4xl space-y-6">
          <article className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><ShieldCheck size={24} /></span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">Declaration</p>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-dark">What the checkbox means</h2>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-brand-muted">
              When you tick “I agree that my parcel contains only permitted items” on the request form, you are confirming the declaration below. This policy applies to every product and delivery request submitted through this website. If you are unsure whether an item is allowed, contact us before submitting the request.
            </p>
            <ul className="mt-5 space-y-3">
              {DUTIES.map((duty) => (
                <li key={duty} className="flex items-start gap-3 rounded-2xl bg-brand-light/70 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-green" />
                  <span className="text-sm leading-relaxed text-brand-text">{duty}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-700"><AlertTriangle size={24} /></span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red-600">Do not submit</p>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-dark">Prohibited items</h2>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-brand-muted">
              We do not carry the following items as part of this request service. Do not include them in a parcel, and do not ask our team or a delivery partner to collect them.
            </p>
            <div className="mt-5 space-y-4">
              {PROHIBITED.map((item) => (
                <div key={item.title} className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
                  <h3 className="text-base font-extrabold text-brand-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-900"><FileText size={24} /></span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">Prior approval needed</p>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-dark">Restricted items</h2>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-brand-muted">
              These items are not always prohibited, but they must be declared and agreed before collection or delivery. We may ask for extra packaging, proof of eligibility, or may decline the item.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {RESTRICTED.map((item) => (
                <div key={item.title} className="rounded-2xl bg-brand-light/70 p-5">
                  <h3 className="text-base font-extrabold text-brand-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-4xl bg-brand-dark p-6 text-white shadow-lift sm:p-9">
            <h2 className="text-2xl font-extrabold">Inspection, refusal and false declarations</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              We may inspect a parcel before or at collection. If an item appears prohibited, unsafe, undeclared or unlawfully possessed, we may refuse it, stop the delivery, return it to the sender or contact the appropriate authority where required. A false declaration may also lead us to decline future requests from the same customer.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              This policy does not replace any legal requirement. The sender remains responsible for ensuring that the item, its packaging, its destination and the manner of carriage are lawful.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/request" className="btn btn-lg">Back to request form</Link>
              <Link to="/contact" className="btn btn-lg btn-outline">Contact us</Link>
            </div>
          </article>

          <p className="pt-2 text-sm text-brand-muted">
            Policy version {PROHIBITED_ITEMS_POLICY_VERSION} · Effective {EFFECTIVE_DATE} · Canonical page: {SITE_URL}/prohibited-items-policy
          </p>
        </div>
      </section>
    </>
  );
}
