import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { SITE } from '../utils/config.js';

const UPDATED = 'November 2026';

const SECTIONS = [
  {
    title: '1. Information we collect',
    body: [
      'When you submit a product request we collect the details you enter: your name, optional email address and mobile number; the product name, category, optional store name, store location and description, quantity and optional estimated budget; and your delivery address, city, postal code and any additional instructions.',
      'If you choose to attach a product image, we collect that image. When you use the contact form we collect your name, email address, optional subject and your message.',
    ],
  },
  {
    title: '2. How we use product request information',
    body: [
      'We use this information only to review and respond to your request — for example to contact you, confirm details and arrange next steps. Every request is given a unique Request ID so we and you can refer to it.',
    ],
  },
  {
    title: '3. Email communication',
    body: [
      'After you submit a request we send a confirmation email to the address you provide, and we send a notification email containing your request details to our team. We may also reply to you by email or phone about your request or contact message.',
      'We do not use the details you provide for a product request to send unrelated marketing emails.',
    ],
  },
  {
    title: '4. Data storage',
    body: [
      'Request and contact details are stored in a database operated for this service. Uploaded product images are stored with a third-party image hosting provider (Cloudinary) so our team can view them. Email is sent through an SMTP email service configured by the business.',
      'We keep this information for as long as it is needed to handle your request and for the business’s record-keeping, after which it may be deleted.',
    ],
  },
  {
    title: '5. Data protection',
    body: [
      'We take reasonable technical steps to protect your information, including validating and sanitising submitted data, limiting the types and size of uploaded files, rate-limiting submissions, restricting access to administrative functions and keeping service credentials out of the website code.',
      'No method of transmission or storage is completely secure, so we cannot guarantee absolute security. We do not claim any formal security certification or regulatory compliance.',
    ],
  },
  {
    title: '6. Sharing',
    body: [
      'We do not sell your personal information. It is accessible to our team and to the service providers mentioned above (database, image hosting and email delivery) only to the extent needed to operate the service, or where we are required to disclose it by law.',
    ],
  },
  {
    title: '7. Your choices',
    body: [
      'You can ask us to correct or delete the information associated with your request by contacting us and quoting your Request ID.',
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description={`Last updated: ${UPDATED}`} />
      <section className="pb-24">
        <div className="container-x max-w-3xl">
          <div className="rounded-4xl bg-white p-7 shadow-soft ring-1 ring-black/5 sm:p-12">
            <p className="text-lg leading-relaxed text-brand-muted">
              This policy explains what information City Delivery Services collects through this website, why we collect it and how it is handled.
            </p>
            {SECTIONS.map((s) => (
              <section key={s.title} className="mt-10">
                <h2 className="text-2xl font-extrabold text-brand-dark">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-3 leading-relaxed text-brand-muted">{p}</p>
                ))}
              </section>
            ))}
            <section className="mt-10 rounded-3xl bg-brand-yellow/25 p-6">
              <h2 className="text-2xl font-extrabold text-brand-dark">8. Privacy questions</h2>
              <p className="mt-3 leading-relaxed text-brand-text">
                For any privacy concern, {SITE.email ? (<>email us at <a className="font-bold text-brand-green underline" href={`mailto:${SITE.email}`}>{SITE.email}</a> or </>) : null}use the <Link to="/contact" className="font-bold text-brand-green underline">contact form</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
