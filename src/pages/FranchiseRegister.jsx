import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import { ApiError, getFranchiseConfig, submitFranchiseApplication } from '../services/api.js';
import {
  FRANCHISE_DOCUMENTS,
  FRANCHISE_INVESTMENT_CAPACITIES,
  FRANCHISE_VEHICLE_TYPES,
  formatApplicationFee,
  franchiseFieldError,
  vehicleRowsFromCounts,
} from '../utils/franchise.js';

function newSubmissionKey() {
  const random = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '')
    : `${Date.now()}${Math.random().toString(36).slice(2)}`;
  return `franchise_${random}`.slice(0, 64);
}

const EMPTY = {
  fullName: '',
  mobile: '',
  email: '',
  state: '',
  district: '',
  city: '',
  preferredOperatingArea: '',
  pincode: '',
  fullAddress: '',
  businessExperience: '',
  investmentCapacity: '',
  hasOfficeOrShop: '',
  motivation: '',
  accurate: false,
  contactConsent: false,
};

const VEHICLE_COUNT_LABELS = {
  Bike: 'bikes',
  Scooter: 'scooters',
  'Electric Bike': 'electric bikes',
  Car: 'cars',
  'Three Wheeler': 'three wheelers',
  'Pickup Van': 'pickup vans',
  'Delivery Van': 'delivery vans',
  Lorry: 'lorries',
  Other: 'other vehicles',
};

const vehicleCountFieldId = (type) => `vehicle-count-${type.toLowerCase().replace(/\s+/g, '-')}`;

export default function FranchiseRegister() {
  const [form, setForm] = useState(EMPTY);
  const [vehicleCounts, setVehicleCounts] = useState(() => Object.fromEntries(FRANCHISE_VEHICLE_TYPES.map((type) => [type, ''])));
  const [otherVehicle, setOtherVehicle] = useState('');
  const [files, setFiles] = useState({});
  const [config, setConfig] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getFranchiseConfig()
      .then((response) => { if (active) setConfig(response.data); })
      .catch((err) => { if (active) setError(err.message || 'Could not load the initial payment amount right now.'); });
    return () => { active = false; };
  }, []);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', [`consents.${name}`]: '' }));
  };

  const setFile = (key, file) => {
    setFiles((current) => ({ ...current, [key]: file }));
  };

  const setVehicleCount = (type, value) => {
    setVehicleCounts((current) => ({ ...current, [type]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    setErrors({});
    try {
      if (Number(vehicleCounts.Other) > 0 && !otherVehicle.trim()) {
        setError('Please describe the other vehicle type.');
        return;
      }
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'accurate') data.append('consents.accurate', value ? 'true' : 'false');
        else if (key === 'contactConsent') data.append('consents.contact', value ? 'true' : 'false');
        else data.append(key, value ?? '');
      });
      const vehicleTypes = config?.vehicleTypes || FRANCHISE_VEHICLE_TYPES;
      const vehicleRows = vehicleRowsFromCounts(vehicleCounts, otherVehicle, vehicleTypes);
      vehicleRows.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([key, value]) => data.append(`vehicles.${rowIndex}.${key}`, value ?? ''));
      });
      data.append('numberOfVehicles', String(vehicleRows.reduce((sum, row) => sum + (Number(row.count) || 0), 0)));
      data.append('submissionKey', newSubmissionKey());
      Object.entries(files).forEach(([key, file]) => { if (file) data.append(key, file); });

      const response = await submitFranchiseApplication(data);
      setResult(response.data);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setErrors(err.fieldErrors);
        setError(err.message || 'Please fix the highlighted fields.');
      } else {
        setError(err.message || 'Could not submit your application right now. Your details are still in the form.');
      }
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <>
        <SEO title="Application Received | City Delivery Services" description="Your franchise application was received." path="/franchise/register" noindex />
        <PageHero eyebrow="Application received" title="Thank you for applying" description="Your franchise application has been saved." />
        <main className="bg-brand-light px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-2xl rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <CheckCircle2 className="text-brand-green" size={42} />
            <h2 className="mt-5 text-2xl font-extrabold text-brand-dark">Save your Application ID</h2>
            <p className="mt-2 font-mono text-xl font-extrabold text-brand-dark">{result.applicationId}</p>
            <p className="mt-5 leading-relaxed text-brand-muted">{result.message}</p>
            <div className="mt-6 rounded-2xl bg-brand-light/70 p-4">
              <p className="text-sm font-semibold text-brand-muted">Initial payment is optional. Our team will share the simple payment steps after you apply.</p>
              <p className="mt-2 text-xs font-semibold text-brand-muted">Save your Application ID and use the status page to check payment status.</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to={`/franchise/status?applicationId=${encodeURIComponent(result.applicationId)}`} className="btn inline-flex items-center justify-center gap-2">
                Check application status
              </Link>
              <Link to="/become-a-franchise" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-brand-dark ring-1 ring-black/10 hover:bg-brand-light">
                Back to franchise details
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Apply as a Franchise Partner | City Delivery Services"
        description="Apply to become a City Delivery Services franchise partner and track your application status."
        path="/franchise/register"
        noindex
      />
      <PageHero
        eyebrow="Franchise application"
        title="Become a franchise partner"
        description="Share your details and proposed operating area. Review the optional fee and refund policy before applying."
      />

      <main className="bg-brand-light px-4 pb-24 sm:px-8">
        <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
          {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <h2 className="text-2xl font-extrabold text-brand-dark">Your details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full name" required error={franchiseFieldError(errors, 'fullName')}>
                <input id="fullName" className="field" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} autoComplete="name" required />
              </Field>
              <Field id="mobile" label="Mobile number" required error={franchiseFieldError(errors, 'mobile')}>
                <input id="mobile" className="field" value={form.mobile} onChange={(e) => setField('mobile', e.target.value)} inputMode="tel" autoComplete="tel" required />
              </Field>
              <Field id="email" label="Email address" required error={franchiseFieldError(errors, 'email')}>
                <input id="email" type="email" className="field" value={form.email} onChange={(e) => setField('email', e.target.value)} autoComplete="email" required />
              </Field>
            </div>
          </section>

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <h2 className="text-2xl font-extrabold text-brand-dark">Proposed operating area</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="state" label="State" required error={franchiseFieldError(errors, 'state')}>
                <input id="state" className="field" value={form.state} onChange={(e) => setField('state', e.target.value)} required />
              </Field>
              <Field id="district" label="District" required error={franchiseFieldError(errors, 'district')}>
                <input id="district" className="field" value={form.district} onChange={(e) => setField('district', e.target.value)} required />
              </Field>
              <Field id="city" label="City / town" required error={franchiseFieldError(errors, 'city')}>
                <input id="city" className="field" value={form.city} onChange={(e) => setField('city', e.target.value)} required />
              </Field>
              <Field id="preferredOperatingArea" label="Preferred operating area" required error={franchiseFieldError(errors, 'preferredOperatingArea')}>
                <input id="preferredOperatingArea" className="field" value={form.preferredOperatingArea} onChange={(e) => setField('preferredOperatingArea', e.target.value)} required />
              </Field>
              <Field id="pincode" label="PIN code" required error={franchiseFieldError(errors, 'pincode')}>
                <input id="pincode" className="field" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} inputMode="numeric" maxLength={6} required />
              </Field>
              <div className="sm:col-span-2">
                <Field id="fullAddress" label="Full address" required error={franchiseFieldError(errors, 'fullAddress')}>
                  <textarea id="fullAddress" className="field min-h-[96px] resize-y" value={form.fullAddress} onChange={(e) => setField('fullAddress', e.target.value)} required />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <h2 className="text-2xl font-extrabold text-brand-dark">Business details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="businessExperience" label="Business experience" optional error={franchiseFieldError(errors, 'businessExperience')}>
                  <textarea id="businessExperience" className="field min-h-[96px] resize-y" value={form.businessExperience} onChange={(e) => setField('businessExperience', e.target.value)} />
                </Field>
              </div>
              <Field id="investmentCapacity" label="Investment capacity" required error={franchiseFieldError(errors, 'investmentCapacity')}>
                <select id="investmentCapacity" className="field" value={form.investmentCapacity} onChange={(e) => setField('investmentCapacity', e.target.value)} required>
                  <option value="">Choose one</option>
                  {FRANCHISE_INVESTMENT_CAPACITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
              <Field id="hasOfficeOrShop" label="Do you have an office or shop?" required error={franchiseFieldError(errors, 'hasOfficeOrShop')}>
                <select id="hasOfficeOrShop" className="field" value={form.hasOfficeOrShop} onChange={(e) => setField('hasOfficeOrShop', e.target.value)} required>
                  <option value="">Choose one</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field id="motivation" label="Why do you want to become a franchise partner?" optional error={franchiseFieldError(errors, 'motivation')}>
                  <textarea id="motivation" className="field min-h-[120px] resize-y" value={form.motivation} onChange={(e) => setField('motivation', e.target.value)} />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <h2 className="text-2xl font-extrabold text-brand-dark">Vehicle details</h2>
            <p className="mt-2 text-sm text-brand-muted">Enter how many vehicles you have or plan to use. Example: 2 bikes, 1 car, 1 lorry.</p>
            {franchiseFieldError(errors, 'vehicles') && <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{franchiseFieldError(errors, 'vehicles')}</p>}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(config?.vehicleTypes || FRANCHISE_VEHICLE_TYPES).map((type) => (
                <Field key={type} id={vehicleCountFieldId(type)} label={`Number of ${VEHICLE_COUNT_LABELS[type] || `${type.toLowerCase()}s`}`} optional>
                  <input
                    id={vehicleCountFieldId(type)}
                    type="number"
                    min="0"
                    max="1000"
                    className="field"
                    value={vehicleCounts[type] ?? ''}
                    onChange={(event) => setVehicleCount(type, event.target.value)}
                    placeholder="0"
                  />
                </Field>
              ))}
              {(config?.vehicleTypes || FRANCHISE_VEHICLE_TYPES).includes('Other') && Number(vehicleCounts.Other) > 0 && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <Field id="vehicle-other" label="Describe other vehicle type" required>
                    <input id="vehicle-other" className="field" value={otherVehicle} onChange={(event) => setOtherVehicle(event.target.value)} maxLength={80} required />
                  </Field>
                </div>
              )}
            </div>
            <p className="mt-5 rounded-2xl bg-brand-light/70 p-4 text-sm font-bold text-brand-dark">
              Total vehicles: {Object.values(vehicleCounts).reduce((sum, value) => sum + (Number(value) || 0), 0)}
            </p>
          </section>

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <h2 className="text-2xl font-extrabold text-brand-dark">Supporting documents</h2>
            <p className="mt-2 text-sm text-brand-muted">Optional. JPG, PNG, WebP or PDF up to 5 MB each.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {FRANCHISE_DOCUMENTS.map((doc) => (
                <Field key={doc.key} id={doc.key} label={doc.label} optional hint={doc.hint} error={franchiseFieldError(errors, doc.key)}>
                  <input
                    id={doc.key}
                    type="file"
                    accept={doc.accept}
                    onChange={(e) => setFile(doc.key, e.target.files?.[0] || null)}
                    className="field file:mr-3 file:rounded-full file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-sm file:font-bold"
                  />
                </Field>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold text-brand-muted">
              Initial payment (optional): {formatApplicationFee(config?.applicationFee ?? 1000, config?.currency || 'INR')}
            </p>
          </section>

          <section className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-light/70 p-4">
              <input type="checkbox" checked={form.accurate} onChange={(e) => setField('accurate', e.target.checked)} className="mt-1 h-5 w-5 accent-brand-green" />
              <span className="text-sm font-semibold text-brand-text">I confirm that the information provided is accurate and belongs to me.</span>
            </label>
            {franchiseFieldError(errors, 'consents.accurate') && <p role="alert" className="mt-2 text-sm font-semibold text-red-600">{franchiseFieldError(errors, 'consents.accurate')}</p>}
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-light/70 p-4">
              <input type="checkbox" checked={form.contactConsent} onChange={(e) => setField('contactConsent', e.target.checked)} className="mt-1 h-5 w-5 accent-brand-green" />
              <span className="text-sm font-semibold text-brand-text">I agree to be contacted about my franchise application and understand that submission does not guarantee approval, territory or income.</span>
            </label>
            {franchiseFieldError(errors, 'consents.contact') && <p role="alert" className="mt-2 text-sm font-semibold text-red-600">{franchiseFieldError(errors, 'consents.contact')}</p>}

            <button type="submit" disabled={busy} className="btn mt-7 inline-flex w-full items-center justify-center gap-2">
              {busy && <Loader2 size={18} className="animate-spin" />}
              {busy ? 'Submitting…' : 'Submit application'}
            </button>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-brand-muted">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> The initial payment is optional and handled separately. No card or bank details are stored on this website.
            </p>
          </section>
        </form>
      </main>
    </>
  );
}
