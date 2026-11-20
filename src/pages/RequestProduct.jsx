import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Package, Truck, MapPin, Store, ArrowDown, Loader2, Send, CheckCircle2, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO, { breadcrumbSchema, businessSchema, webPageSchema, websiteSchema } from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import CustomSelect from '../components/form/CustomSelect.jsx';
import ImageUpload from '../components/form/ImageUpload.jsx';
import Button from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { submitProductRequest, ApiError } from '../services/api.js';
import { CATEGORIES } from '../utils/config.js';

const INITIAL = {
  customerName: '', email: '', phone: '',
  productName: '', productCategory: '', storeName: '', storeLocation: '',
  productDescription: '', quantity: '1', estimatedBudget: '',
  deliveryAddress: '', city: '', postalCode: '', additionalInstructions: '',
  prohibitedItemsAccepted: false,
  website: '', // honeypot — must stay empty
};

const REQUIRED_MSG = {
  customerName: 'Please tell us your name.',
  phone: 'Please enter your mobile number.',
  productName: 'What product do you need?',
  productCategory: 'Please choose a category.',
  deliveryAddress: 'Where should we deliver it?',
  city: 'Please enter the city.',
  postalCode: 'Please enter the postal code.',
};

function validate(v) {
  const e = {};
  const t = (k) => v[k].trim();
  Object.keys(REQUIRED_MSG).forEach((k) => { if (!t(k)) e[k] = REQUIRED_MSG[k]; });
  if (!e.customerName && t('customerName').length < 2) e.customerName = 'Name must be at least 2 characters.';
  if (t('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t('email'))) e.email = 'Please enter a valid email address.';
  if (!e.phone) {
    const digits = t('phone').replace(/\D/g, '');
    if (!/^\+?[\d\s()-]{7,18}$/.test(t('phone')) || digits.length < 7 || digits.length > 15) e.phone = 'Please enter a valid mobile number.';
  }
  if (!e.productName && t('productName').length < 2) e.productName = 'Product name is too short.';
  if (t('storeName') && t('storeName').length < 2) e.storeName = 'Store name is too short.';
  if (t('storeLocation') && t('storeLocation').length < 2) e.storeLocation = 'Store location is too short.';
  if (t('productDescription') && t('productDescription').length < 10) e.productDescription = 'Please add a little more detail (at least 10 characters).';
  if (!e.deliveryAddress && t('deliveryAddress').length < 5) e.deliveryAddress = 'Please enter the full delivery address.';
  if (!e.postalCode && !/^[A-Za-z0-9][A-Za-z0-9\s-]{2,10}$/.test(t('postalCode'))) e.postalCode = 'Please enter a valid postal code.';
  const q = Number(v.quantity);
  if (!Number.isInteger(q) || q < 1 || q > 100) e.quantity = 'Quantity must be between 1 and 100.';
  if (v.estimatedBudget !== '' && (Number.isNaN(Number(v.estimatedBudget)) || Number(v.estimatedBudget) < 0)) e.estimatedBudget = 'Budget must be a positive number.';
  if (!v.prohibitedItemsAccepted) e.prohibitedItemsAccepted = 'Please confirm that your parcel contains only permitted items.';
  return e;
}

const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}-xxxx`).replace(/[^A-Za-z0-9_-]/g, '');

function SectionCard({ icon: Icon, step, title, subtitle, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-4xl bg-white/70 p-6 shadow-soft ring-1 ring-black/5 backdrop-blur sm:p-9"
    >
      <header className="mb-7 flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft"><Icon size={26} /></span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-green">Step {step} of 3</p>
          <h2 className="text-2xl font-extrabold text-brand-dark">{title}</h2>
          <p className="text-sm text-brand-muted">{subtitle}</p>
        </div>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </motion.section>
  );
}

function Success({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const teamOk = result.notifications?.team === 'sent';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="mx-auto max-w-2xl rounded-4xl bg-white p-8 text-center shadow-lift ring-1 ring-black/5 sm:p-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15, stiffness: 260, damping: 16 }}
        className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-green text-white shadow-glow">
        <CheckCircle2 size={52} />
      </motion.div>
      <h2 className="mt-7 text-4xl font-extrabold text-brand-dark">{result.duplicate ? 'We already have it!' : 'Request received!'}</h2>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-brand-muted">{result.message}</p>

      <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-brand-yellow/30 px-6 py-4">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-muted">Request ID</span>
        <span className="font-display text-2xl font-extrabold tracking-wide text-brand-dark">{result.requestId}</span>
        <button type="button" onClick={copy} aria-label="Copy request ID"
          className="grid h-10 w-10 place-items-center rounded-full bg-brand-green text-white transition hover:bg-brand-green-hover">
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>

      {!teamOk && (
        <p className="mx-auto mt-6 flex max-w-md items-start gap-2 rounded-2xl bg-amber-50 p-4 text-left text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          Your request is safely saved. The notification email to our team is being retried automatically — you do not need to submit again.
        </p>
      )}
      {result.notifications?.confirmationEmail === 'failed' && (
        <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">We could not send your confirmation email yet. Please keep the Request ID above.</p>
      )}

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={onReset}>Submit another request</Button>
        <Button to="/" variant="outline">Back to home</Button>
      </div>
    </motion.div>
  );
}

export default function RequestProduct() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState(null);
  // Same key is reused on every retry of the same form => the server never creates duplicates.
  const submissionKey = useRef(newKey());
  const formRef = useRef(null);

  const set = (k) => (e) => {
    const val = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const common = (k) => ({
    id: k,
    value: values[k],
    onChange: set(k),
    className: `field ${errors[k] ? 'field-error' : ''}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
  });

  const focusFirstError = (errs) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (!first) return;
    const el = document.getElementById(first);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => el?.focus({ preventScroll: true }), 350);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setFormError('Please fix the highlighted fields and try again.');
      focusFirstError(errs);
      return;
    }

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (typeof v === 'string') fd.append(k, v.trim());
    });
    fd.append('submissionKey', submissionKey.current);
    fd.append('prohibitedItemsAccepted', values.prohibitedItemsAccepted ? 'true' : 'false');
    if (image) fd.append('productImage', image);

    setSubmitting(true);
    try {
      const res = await submitProductRequest(fd);
      setResult({ ...res.data, message: res.message });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
        focusFirstError(err.fieldErrors);
      }
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues(INITIAL);
    setImage(null);
    setErrors({});
    setFormError('');
    setResult(null);
    submissionKey.current = newKey(); // a brand-new request gets a brand-new key
  };

  return (
    <>
      <SEO
        title="Request Delivery in Vellore | City Delivery Services"
        description="Request local delivery in Vellore by sharing your product, store and delivery details with City Delivery Services."
        path="/request"
        structuredData={[
          businessSchema(),
          websiteSchema(),
          webPageSchema({
            path: '/request',
            name: 'Request a Delivery Service',
            description: 'Request local delivery in Vellore by sharing your product, store and delivery details with City Delivery Services.',
            breadcrumb: true,
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Request a Product', path: '/request' }], '/request'),
        ]}
      />
      <PageHero
        eyebrow="Request a product"
        title="Request a Delivery Service"
        description="Submit your product, store and delivery details. Our team will review your request and contact you with the next steps."
      />

      <section className="relative pb-24">
        <div className="container-x max-w-4xl">
          <AnimatePresence mode="wait">
            {result ? (
              <Success key="ok" result={result} onReset={reset} />
            ) : (
              <motion.form key="form" ref={formRef} onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="space-y-7">
                {/* Honeypot — hidden from people and assistive tech */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
                </div>

                <SectionCard icon={User} step={1} title="About you" subtitle="So we know who to get back to.">
                  <div className="sm:col-span-2">
                    <Field id="customerName" label="Full name" required error={errors.customerName}>
                      <input {...common('customerName')} type="text" autoComplete="name" placeholder="e.g. Priya Raman" maxLength={80} />
                    </Field>
                  </div>
                  <Field id="email" label="Email address" optional error={errors.email}>
                    <input {...common('email')} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={120} />
                  </Field>
                  <Field id="phone" label="Mobile number" required error={errors.phone}>
                    <input {...common('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" maxLength={20} />
                  </Field>
                </SectionCard>

                <SectionCard icon={Package} step={2} title="The product" subtitle="What you want and any helpful details." delay={0.05}>
                  <Field id="productName" label="Product name" required error={errors.productName}>
                    <input {...common('productName')} type="text" placeholder="e.g. Cold-pressed olive oil 1L" maxLength={120} />
                  </Field>
                  <Field id="productCategory" label="Product category" required error={errors.productCategory}>
                    <CustomSelect id="productCategory" value={values.productCategory} onChange={set('productCategory')} options={CATEGORIES} placeholder="Choose a category" invalid={!!errors.productCategory} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="productDescription" label="Product description" optional error={errors.productDescription} hint="Brand, size, colour, flavour — anything that helps us find the right one.">
                      <textarea {...common('productDescription')} rows={4} maxLength={1500} placeholder="Describe the product in as much detail as you can…" />
                    </Field>
                  </div>
                  <Field id="quantity" label="Quantity" required error={errors.quantity}>
                    <input {...common('quantity')} type="number" inputMode="numeric" min={1} max={100} />
                  </Field>
                  <Field id="estimatedBudget" label="Estimated budget" optional error={errors.estimatedBudget} hint="In ₹ — a rough number is fine.">
                    <input {...common('estimatedBudget')} type="number" inputMode="decimal" min={0} placeholder="e.g. 850" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="productImage" label="Product image" optional hint="A photo helps us identify the exact item." error={errors.productImage}>
                      <ImageUpload id="productImage" file={image} onChange={setImage} error={errors.productImage} />
                    </Field>
                  </div>
                </SectionCard>

                <SectionCard icon={Truck} step={3} title="Pickup & Delivery" subtitle="Pickup point and delivery destination in one place." delay={0.05}>
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-dark px-4 py-3 text-white shadow-soft sm:col-span-2 sm:px-5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-dark"><Store size={16} /></span>
                    <span className="text-sm font-extrabold">From</span>
                    <span className="mx-1 flex-1 border-t-2 border-dashed border-white/25" />
                    <Truck size={18} className="shrink-0 text-brand-yellow" />
                    <span className="mx-1 flex-1 border-t-2 border-dashed border-white/25" />
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-green text-white"><MapPin size={16} /></span>
                    <span className="text-sm font-extrabold">To</span>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow/20 via-white to-white p-5 shadow-soft ring-1 ring-brand-yellow/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:col-span-2 sm:p-6">
                    <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-yellow/20 blur-2xl" />
                    <div className="relative flex flex-wrap items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-yellow text-brand-dark shadow-soft"><Store size={22} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-dark">From</p>
                          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-muted ring-1 ring-black/5">Pickup</span>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">Where should we collect it? Optional if you are still deciding.</p>
                      </div>
                      <span className="hidden rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-brand-muted ring-1 ring-black/5 sm:block">Optional</span>
                    </div>
                    <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
                      <Field id="storeName" label="Store name" optional error={errors.storeName}>
                        <input {...common('storeName')} type="text" placeholder="e.g. Fresh Mart" maxLength={120} />
                      </Field>
                      <Field id="storeLocation" label="Store location" optional error={errors.storeLocation} hint="Area, street or landmark.">
                        <input {...common('storeLocation')} type="text" placeholder="e.g. Anna Nagar, near the main roundabout" maxLength={200} />
                      </Field>
                    </div>
                  </div>

                  <div aria-hidden="true" className="relative z-10 -my-1 flex justify-center sm:col-span-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-green shadow-soft ring-1 ring-brand-yellow/40"><ArrowDown size={18} /></span>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green/10 via-white to-white p-5 shadow-soft ring-1 ring-brand-green/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:col-span-2 sm:p-6">
                    <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-green/10 blur-2xl" />
                    <div className="relative flex flex-wrap items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-green text-white shadow-glow"><MapPin size={22} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-dark">To</p>
                          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-muted ring-1 ring-black/5">Delivery</span>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">Where should we deliver it?</p>
                      </div>
                      <span className="hidden rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-brand-green ring-1 ring-black/5 sm:block">Required</span>
                    </div>
                    <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field id="deliveryAddress" label="Delivery address" required error={errors.deliveryAddress}>
                          <textarea {...common('deliveryAddress')} rows={3} maxLength={300} autoComplete="street-address" placeholder="House / flat no., street, area" />
                        </Field>
                      </div>
                      <Field id="city" label="City" required error={errors.city}>
                        <input {...common('city')} type="text" autoComplete="address-level2" placeholder="e.g. Madurai" maxLength={80} />
                      </Field>
                      <Field id="postalCode" label="Postal code" required error={errors.postalCode}>
                        <input {...common('postalCode')} type="text" autoComplete="postal-code" inputMode="text" placeholder="e.g. 625001" maxLength={12} />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field id="additionalInstructions" label="Additional instructions" optional error={errors.additionalInstructions}>
                          <textarea {...common('additionalInstructions')} rows={3} maxLength={600} placeholder="Landmarks, preferred contact time, substitutions you accept…" />
                        </Field>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <Reveal>
                  <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-black/5 sm:p-6">
                    <label htmlFor="prohibitedItemsAccepted" className="flex items-start gap-3">
                      <input
                        id="prohibitedItemsAccepted"
                        type="checkbox"
                        checked={values.prohibitedItemsAccepted}
                        onChange={(event) => {
                          setValues((v) => ({ ...v, prohibitedItemsAccepted: event.target.checked }));
                          if (errors.prohibitedItemsAccepted) setErrors((er) => ({ ...er, prohibitedItemsAccepted: undefined }));
                        }}
                        aria-invalid={errors.prohibitedItemsAccepted ? true : undefined}
                        aria-describedby={errors.prohibitedItemsAccepted ? 'prohibitedItemsAccepted-error' : undefined}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-brand-green"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-relaxed text-brand-dark">
                          I agree that my parcel contains only permitted items. <span className="text-red-500" aria-hidden="true">*</span>
                        </span>
                        <Link to="/prohibited-items-policy" className="mt-1 inline-block text-sm font-bold text-brand-green underline-offset-2 transition hover:text-brand-green-hover hover:underline">
                          Read Prohibited Items Policy
                        </Link>
                      </span>
                    </label>
                    {errors.prohibitedItemsAccepted && (
                      <p id="prohibitedItemsAccepted-error" role="alert" className="mt-2 text-sm font-semibold text-red-600">
                        {errors.prohibitedItemsAccepted}
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {formError && (
                      <motion.div role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-5 flex items-start gap-3 rounded-2xl bg-red-50 p-4 font-semibold text-red-700 ring-1 ring-red-200">
                        <AlertTriangle size={20} className="mt-0.5 shrink-0" /> {formError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col items-center gap-4 rounded-4xl bg-brand-dark p-7 text-center sm:flex-row sm:justify-between sm:text-left mt-10">
                    <p className="flex max-w-md items-start gap-3 text-sm leading-relaxed text-white/70">
                      <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-yellow" />
                      <span>By submitting you agree to be contacted about this request. See our <Link to="/privacy" className="font-bold text-brand-yellow underline-offset-2 hover:underline">Privacy Policy</Link>.</span>
                    </p>
                    <button type="submit" disabled={submitting} className="btn btn-lg w-full shrink-0 sm:w-auto">
                      {submitting ? (<><Loader2 size={20} className="animate-spin" /> Sending…</>) : (<>Submit request <Send size={18} /></>)}
                    </button>
                  </div>
                </Reveal>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
