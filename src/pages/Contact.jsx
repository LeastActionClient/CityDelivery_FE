import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertTriangle, Instagram, Facebook, Twitter, MessageCircle, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { breadcrumbSchema } from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import Button from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { submitContactMessage, ApiError } from '../services/api.js';
import { SITE } from '../utils/config.js';

const ICONS = { Instagram, Facebook, X: Twitter, WhatsApp: MessageCircle };
const INITIAL = { name: '', email: '', subject: '', message: '', website: '' };

export default function Contact() {
  const [v, setV] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState('');
  const [formError, setFormError] = useState('');

  const set = (k) => (e) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const cm = (k) => ({ id: k, value: v[k], onChange: set(k), className: `field ${errors[k] ? 'field-error' : ''}`, 'aria-invalid': errors[k] ? true : undefined });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const er = {};
    if (v.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) er.email = 'Please enter a valid email address.';
    if (v.message.trim().length < 10) er.message = 'Please write at least 10 characters.';
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    setFormError('');
    try {
      const res = await submitContactMessage({ name: v.name.trim(), email: v.email.trim(), subject: v.subject.trim(), message: v.message.trim(), website: v.website });
      setDone(res.message);
      setV(INITIAL);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };

  const socials = Object.entries(SITE.social).filter(([, u]) => u);
  const details = [
    SITE.email && { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    SITE.phone && { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone}` },
    SITE.address && { icon: MapPin, label: 'Address', value: SITE.address },
  ].filter(Boolean);

  return (
    <>
      <SEO
        title="Contact City Delivery Services in Vellore"
        description="Contact City Delivery Services in Vellore about a product request, local delivery question, or service information."
        path="/contact"
        structuredData={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact Us', path: '/contact' }])]}
      />
      <PageHero eyebrow="Contact us" title="We would love to hear from you." description="Questions about a request or how the service works? Send us a message and our team will get back to you." />

      <section className="pb-24">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-10">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-green text-white"><CheckCircle2 size={42} /></span>
                    <h2 className="mt-6 text-3xl font-extrabold">Message sent</h2>
                    <p className="mx-auto mt-3 max-w-sm text-brand-muted">{done}</p>
                    <Button className="mt-8" onClick={() => setDone('')}>Send another message</Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="website">Leave empty</label>
                      <input id="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
                    </div>
                    <Field id="name" label="Your name" required error={errors.name}><input {...cm('name')} type="text" autoComplete="name" maxLength={80} /></Field>
                    <Field id="email" label="Email" required error={errors.email}><input {...cm('email')} type="email" autoComplete="email" maxLength={120} /></Field>
                    <div className="sm:col-span-2"><Field id="subject" label="Subject" optional error={errors.subject}><input {...cm('subject')} type="text" maxLength={140} /></Field></div>
                    <div className="sm:col-span-2"><Field id="message" label="Message" required error={errors.message}><textarea {...cm('message')} rows={6} maxLength={2000} placeholder="How can we help?" /></Field></div>
                    {formError && (
                      <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 p-4 font-semibold text-red-700 sm:col-span-2"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{formError}</p>
                    )}
                    <div className="sm:col-span-2">
                      <button type="submit" disabled={sending} className="btn btn-lg w-full sm:w-auto">
                        {sending ? (<><Loader2 size={20} className="animate-spin" /> Sending…</>) : (<>Send message <Send size={18} /></>)}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-5 lg:col-span-5">
            <div className="rounded-4xl bg-brand-dark p-8 text-white">
              <h2 className="text-2xl font-extrabold">Contact details</h2>
              {details.length ? (
                <ul className="mt-6 space-y-5">
                  {details.map((d) => (
                    <li key={d.label} className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark"><d.icon size={22} /></span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">{d.label}</p>
                        {d.href ? <a href={d.href} className="break-all font-semibold hover:text-brand-yellow">{d.value}</a> : <p className="font-semibold">{d.value}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-white/70">Contact details have not been published yet. Please use the form and we will reply by email.</p>
              )}
              {socials.length > 0 && (
                <div className="mt-8 flex gap-3">
                  {socials.map(([name, url]) => {
                    const Icon = ICONS[name];
                    return (
                      <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 transition hover:bg-brand-yellow hover:text-brand-dark"><Icon size={20} /></a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-4xl bg-gradient-to-br from-brand-yellow to-brand-yellow-deep p-8">
              <h3 className="text-2xl font-extrabold text-brand-dark">Looking for a product?</h3>
              <p className="mt-2 text-brand-dark/75">Skip the message and send us a request directly.</p>
              <Button to="/request" className="mt-6">Request a Product <ArrowRight size={18} /></Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
