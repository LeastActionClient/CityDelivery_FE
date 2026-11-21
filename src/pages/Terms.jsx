import PageHero from '../components/PageHero.jsx';
import SEO, { SITE_URL, breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';

const SECTIONS = [
  { title: '1. Request-based service', text: 'City Delivery Services helps you submit a product and delivery request. A request starts a conversation with our team; it is not an automatic order or a guarantee that an item is available.' },
  { title: '2. Accurate information', text: 'Please provide accurate contact, product, store and delivery details. We may contact you to clarify the request before confirming what can be arranged.' },
  { title: '3. Confirmation before arrangement', text: 'Availability, price, timing and any delivery arrangement are confirmed with you directly. Do not assume that a submitted request has been accepted until our team confirms the next steps.' },
  { title: '4. Images and content', text: 'Only upload product images and information that you are permitted to share. Uploaded images are used to help our team identify the requested product.' },
  { title: '5. Contact', text: 'For questions about these terms, use the Contact page or reach us through the contact details published on this website.' },
];

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms and Conditions | City Delivery Services"
        description="Review the terms and conditions governing the use of City Delivery Services and its delivery request services."
        path="/terms"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({
            path: '/terms',
            name: 'Terms and Conditions',
            description: 'Review the terms and conditions governing the use of City Delivery Services and its delivery request services.',
            breadcrumb: true,
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Terms and Conditions', path: '/terms' }], '/terms'),
        ]}
      />
      <PageHero eyebrow="Legal" title="Terms and Conditions" description="The basic terms for using our request-based delivery service." />
      <section className="pb-24">
        <div className="container-x max-w-4xl space-y-5">
          {SECTIONS.map((section) => (
            <article key={section.title} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8">
              <h2 className="text-2xl font-extrabold text-brand-dark">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-brand-muted">{section.text}</p>
            </article>
          ))}
          <p className="pt-4 text-sm text-brand-muted">Canonical page: {SITE_URL}/terms</p>
        </div>
      </section>
    </>
  );
}
