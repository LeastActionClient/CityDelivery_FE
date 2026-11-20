import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  FileCheck2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import CustomSelect from '../components/form/CustomSelect.jsx';
import DocumentUpload from '../components/form/DocumentUpload.jsx';
import { ApiError, getRiderConfig, submitRiderApplication } from '../services/api.js';
import {
  RIDER_AVAILABILITY_DAYS,
  RIDER_DOCUMENTS,
  RIDER_GENDERS,
  RIDER_STEPS,
  RIDER_VEHICLE_TYPES,
  RIDER_WORK_TYPES,
  riderFieldError,
} from '../utils/rider.js';

const INITIAL = {
  personalInformation: { fullName: '', dateOfBirth: '', gender: '' },
  contactInformation: { mobile: '', whatsapp: '', email: '', emergencyContactName: '', emergencyContactNumber: '' },
  address: { residentialAddress: '', city: 'Vellore', area: '', pincode: '' },
  drivingInformation: { licenceNumber: '', experience: '' },
  vehicleInformation: {
    ownsVehicle: 'true',
    assistanceRequired: false,
    vehicleType: '',
    registrationNumber: '',
    brand: '',
    model: '',
    insuranceAvailable: false,
  },
  workPreferences: { preferredWorkingArea: '', workType: '', preferredWorkingHours: '', availabilityDays: [] },
  identityVerification: {
    aadhaarConsent: false,
    aadhaarNumber: '',
    panConsent: false,
    panNumber: '',
    additionalNotes: '',
  },
  paymentInformation: {
    submitted: 'false',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',
  },
  consents: { accurate: false, terms: false, processing: false },
  website: '',
};

const DEFAULT_CONFIG = {
  serviceArea: 'Vellore',
  workTypes: RIDER_WORK_TYPES,
  availabilityDays: RIDER_AVAILABILITY_DAYS,
  allowedVehicleTypes: RIDER_VEHICLE_TYPES,
  requirements: { requireInsurance: true, requireAadhaar: false },
};

function newKey() {
  return (crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}-xxxx`).replace(/[^A-Za-z0-9_-]/g, '');
}

function requiredDocs(values, config) {
  const keys = ['profilePhoto', 'licenceFront', 'licenceBack', 'panDocument'];
  const vehicle = values.vehicleInformation;
  if (vehicle.ownsVehicle === 'true') {
    keys.push('vehicleRcFront', 'vehicleRcBack', 'vehiclePhoto');
    if (vehicle.insuranceAvailable || config.requirements.requireInsurance) keys.push('insuranceDocument');
  }
  if (values.identityVerification.aadhaarNumber || config.requirements.requireAadhaar) keys.push('aadhaarDocument');
  return [...new Set(keys)];
}

function validateStep(step, values, config, files) {
  const e = {};
  const t = (group, key) => String(values[group]?.[key] ?? '').trim();
  const validPhone = (value) => /^\+?[\d\s()-]{7,18}$/.test(value) && value.replace(/\D/g, '').length >= 7;

  if (step === 0) {
    if (t('personalInformation', 'fullName').length < 2) e['personalInformation.fullName'] = 'Please enter your full name.';
    if (!validPhone(t('contactInformation', 'mobile'))) e['contactInformation.mobile'] = 'Please enter a valid mobile number.';
    if (t('contactInformation', 'whatsapp') && !validPhone(t('contactInformation', 'whatsapp'))) e['contactInformation.whatsapp'] = 'Please enter a valid WhatsApp number.';
    if (t('contactInformation', 'email') && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t('contactInformation', 'email'))) e['contactInformation.email'] = 'Please enter a valid email address.';
    const dob = new Date(t('personalInformation', 'dateOfBirth'));
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (!t('personalInformation', 'dateOfBirth') || Number.isNaN(age) || age < 18 || age > 80) {
      e['personalInformation.dateOfBirth'] = 'You must be at least 18 years old.';
    }
  }

  if (step === 1) {
    if (t('address', 'residentialAddress').length < 5) e['address.residentialAddress'] = 'Please enter your full residential address.';
    if (t('address', 'city').length < 2) e['address.city'] = 'Please enter your city.';
    if (t('address', 'area').length < 2) e['address.area'] = 'Please enter your area / locality.';
    if (!/^[1-9][0-9]{5}$/.test(t('address', 'pincode'))) e['address.pincode'] = 'Please enter a valid 6-digit pincode.';
    if (t('contactInformation', 'emergencyContactNumber') && !validPhone(t('contactInformation', 'emergencyContactNumber'))) {
      e['contactInformation.emergencyContactNumber'] = 'Please enter a valid emergency number.';
    }
  }

  if (step === 2) {
    if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{3,39}$/.test(t('drivingInformation', 'licenceNumber'))) {
      e['drivingInformation.licenceNumber'] = 'Please enter your driving licence number.';
    }
    if (t('drivingInformation', 'experience').length < 2) e['drivingInformation.experience'] = 'Please tell us your driving experience.';
    const owns = values.vehicleInformation.ownsVehicle === 'true';
    if (!owns && !values.vehicleInformation.assistanceRequired) {
      e['vehicleInformation.assistanceRequired'] = 'Please confirm if you need vehicle assistance.';
    }
    if (owns) {
      if (!config.allowedVehicleTypes.includes(t('vehicleInformation', 'vehicleType'))) e['vehicleInformation.vehicleType'] = 'Please choose an available vehicle type.';
      if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{3,29}$/.test(t('vehicleInformation', 'registrationNumber'))) e['vehicleInformation.registrationNumber'] = 'Please enter the vehicle registration number.';
      if (t('vehicleInformation', 'brand').length < 2) e['vehicleInformation.brand'] = 'Please enter the vehicle brand.';
      if (t('vehicleInformation', 'model').length < 2) e['vehicleInformation.model'] = 'Please enter the vehicle model.';
    }
  }

  if (step === 3) {
    if (t('workPreferences', 'preferredWorkingArea').length < 2) e['workPreferences.preferredWorkingArea'] = 'Please enter your preferred working area.';
    if (!RIDER_WORK_TYPES.includes(t('workPreferences', 'workType'))) e['workPreferences.workType'] = 'Please choose a work type.';
    if (!values.workPreferences.availabilityDays.length) e['workPreferences.availabilityDays'] = 'Please choose at least one day.';
  }

  if (step === 4) {
    const p = values.paymentInformation;
    if (p.submitted === 'true') {
      if (t('paymentInformation', 'accountHolderName').length < 2) e['paymentInformation.accountHolderName'] = 'Please enter the account holder name.';
      if (t('paymentInformation', 'bankName').length < 2) e['paymentInformation.bankName'] = 'Please enter your bank name.';
      if (!/^[0-9]{6,18}$/.test(t('paymentInformation', 'accountNumber'))) e['paymentInformation.accountNumber'] = 'Please enter a valid account number.';
      if (t('paymentInformation', 'confirmAccountNumber') !== t('paymentInformation', 'accountNumber')) e['paymentInformation.confirmAccountNumber'] = 'Account numbers do not match.';
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(t('paymentInformation', 'ifscCode').toUpperCase())) e['paymentInformation.ifscCode'] = 'Please enter a valid IFSC code.';
    }
    if (t('identityVerification', 'aadhaarNumber') && !values.identityVerification.aadhaarConsent) e['identityVerification.aadhaarConsent'] = 'Please consent to Aadhaar verification.';
    const pan = t('identityVerification', 'panNumber').toUpperCase();
    if (!pan) e['identityVerification.panNumber'] = 'Please enter your PAN number.';
    else if (!/^[A-Z0-9]{10}$/.test(pan)) e['identityVerification.panNumber'] = 'Please enter a valid PAN number.';
    if (!values.identityVerification.panConsent) e['identityVerification.panConsent'] = 'Please consent to PAN verification.';
  }

  if (step === 5) {
    for (const key of requiredDocs(values, config)) {
      if (!files[key]) e[`documents.${key}`] = 'Please upload this document.';
    }
    if (!values.consents.accurate) e['consents.accurate'] = 'Please confirm your information is accurate.';
    if (!values.consents.terms) e['consents.terms'] = 'Please agree to the rider terms.';
    if (!values.consents.processing) e['consents.processing'] = 'Please consent to processing your information.';
  }

  return e;
}

function TextField({ id, label, value, onChange, error, type = 'text', placeholder, required, optional, hint }) {
  return (
    <Field id={id} label={label} error={error} required={required} optional={optional} hint={hint}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`field ${error ? 'field-error' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Field>
  );
}

function Checkbox({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-light/70 p-4">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="mt-1 h-5 w-5 shrink-0 accent-brand-green" />
      <span className="text-sm font-semibold leading-relaxed text-brand-text">{label}</span>
    </label>
  );
}

function Success({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-2xl rounded-4xl bg-white p-8 text-center shadow-lift ring-1 ring-black/5 sm:p-12">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-green text-white shadow-glow"><CheckCircle2 size={52} /></div>
      <h2 className="mt-7 text-4xl font-extrabold text-brand-dark">{result.duplicate ? 'Application already received' : 'Application received'}</h2>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-brand-muted">{result.message}</p>
      <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-brand-yellow/30 px-6 py-4">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-muted">Application ID</span>
        <span className="font-display text-2xl font-extrabold tracking-wide text-brand-dark">{result.applicationId}</span>
        <button type="button" onClick={copy} aria-label="Copy application ID" className="grid h-10 w-10 place-items-center rounded-full bg-brand-green text-white transition hover:bg-brand-green-hover">
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>
      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-brand-light/70 p-4 text-sm leading-relaxed text-brand-muted">
        Save this ID to check your status. Submission is not approval or an offer of work.
      </div>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/rider/status" className="btn">Check application status</Link>
        {!result.duplicate && <button type="button" onClick={onReset} className="btn btn-outline">Submit another application</button>}
      </div>
    </motion.div>
  );
}

export default function RiderRegister() {
  const [values, setValues] = useState(INITIAL);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [configError, setConfigError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState(null);
  const submissionKey = useRef(newKey());

  useEffect(() => {
    getRiderConfig()
      .then((response) => setConfig({ ...DEFAULT_CONFIG, ...response.data }))
      .catch(() => setConfigError('Using the default rider requirements. Our team will confirm the available options.'));
  }, []);

  const docs = useMemo(() => requiredDocs(values, config), [values, config]);

  const set = (group) => (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setValues((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
    setErrors((current) => ({ ...current, [`${group}.${key}`]: undefined }));
  };
  const setCheck = (group, key) => (event) => {
    setValues((current) => ({ ...current, [group]: { ...current[group], [key]: event.target.checked } }));
    setErrors((current) => ({ ...current, [`${group}.${key}`]: undefined }));
  };
  const toggleDay = (day) => () => {
    setValues((current) => {
      const list = current.workPreferences.availabilityDays;
      return {
        ...current,
        workPreferences: {
          ...current.workPreferences,
          availabilityDays: list.includes(day) ? list.filter((item) => item !== day) : [...list, day],
        },
      };
    });
    setErrors((current) => ({ ...current, 'workPreferences.availabilityDays': undefined }));
  };
  const setFile = (key) => (file) => {
    setFiles((current) => ({ ...current, [key]: file }));
    setErrors((current) => ({ ...current, [`documents.${key}`]: undefined }));
  };

  const next = () => {
    const stepErrors = validateStep(step, values, config, files);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) {
      setFormError('Please fix the highlighted fields to continue.');
      return;
    }
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((current) => current + 1);
  };

  const back = () => {
    setFormError('');
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const appendGroup = (formData, group) => {
    Object.entries(values[group] || {}).forEach(([key, value]) => {
      if (key === 'confirmAccountNumber') return;
      if (Array.isArray(value)) {
        if (!value.length) formData.append(`${group}.${key}`, '');
        value.forEach((item) => formData.append(`${group}.${key}`, item));
      } else {
        formData.append(`${group}.${key}`, String(value));
      }
    });
  };

  const submit = async () => {
    const stepErrors = validateStep(5, values, config, files);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) {
      setFormError('Please fix the highlighted fields and try again.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    const formData = new FormData();
    ['personalInformation', 'contactInformation', 'address', 'drivingInformation', 'vehicleInformation', 'workPreferences', 'identityVerification', 'paymentInformation', 'consents']
      .forEach((group) => appendGroup(formData, group));
    Object.entries(files).forEach(([key, file]) => { if (file) formData.append(key, file); });
    formData.append('website', values.website);
    formData.append('submissionKey', submissionKey.current);
    try {
      const response = await submitRiderApplication(formData);
      setResult(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      setFormError(err.message || 'Could not submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const select = (group, key, options, placeholder) => (
    <CustomSelect
      id={`${group}.${key}`}
      value={values[group][key]}
      onChange={set(group)(key)}
      options={options}
      placeholder={placeholder}
      invalid={Boolean(errors[`${group}.${key}`])}
    />
  );

  if (result) {
    return (
      <>
        <SEO title="Application Received | City Delivery Services" description="Your rider application has been received." path="/rider/register" noindex />
        <main className="min-h-screen bg-brand-light px-4 py-24 sm:px-8"><Success result={result} onReset={() => { setValues(INITIAL); setFiles({}); setStep(0); submissionKey.current = newKey(); setResult(null); }} /></main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Rider Application | City Delivery Services"
        description="Apply to become a delivery rider with City Delivery Services in Vellore."
        path="/rider/register"
        noindex
      />
      <PageHero eyebrow="Rider application" title="Apply to ride with us" description="Tell us about yourself. You can review every section before you submit." />
      <main className="bg-brand-light px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-4xl bg-white p-5 shadow-soft ring-1 ring-black/5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {RIDER_STEPS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => index < step && setStep(index)}
                  disabled={index > step}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    index === step ? 'bg-brand-dark text-brand-yellow' : index < step ? 'bg-brand-yellow/40 text-brand-dark' : 'bg-brand-light text-brand-muted/70'
                  } ${index < step ? 'cursor-pointer' : ''}`}
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-brand-light">
              <motion.div className="h-full rounded-full bg-brand-green" animate={{ width: `${((step + 1) / RIDER_STEPS.length) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="mt-8">
                {step === 0 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="personalInformation.fullName" label="Full name" required value={values.personalInformation.fullName} onChange={set('personalInformation')('fullName')} error={riderFieldError(errors, 'personalInformation.fullName')} placeholder="As on your ID" />
                    <TextField id="personalInformation.dateOfBirth" label="Date of birth" type="date" required value={values.personalInformation.dateOfBirth} onChange={set('personalInformation')('dateOfBirth')} error={riderFieldError(errors, 'personalInformation.dateOfBirth')} />
                    <Field id="personalInformation.gender" label="Gender" optional error={riderFieldError(errors, 'personalInformation.gender')}>
                      {select('personalInformation', 'gender', RIDER_GENDERS, 'Prefer not to say')}
                    </Field>
                    <TextField id="contactInformation.mobile" label="Mobile number" required value={values.contactInformation.mobile} onChange={set('contactInformation')('mobile')} error={riderFieldError(errors, 'contactInformation.mobile')} placeholder="10-digit mobile number" />
                    <TextField id="contactInformation.whatsapp" label="WhatsApp number" optional value={values.contactInformation.whatsapp} onChange={set('contactInformation')('whatsapp')} error={riderFieldError(errors, 'contactInformation.whatsapp')} />
                    <TextField id="contactInformation.email" label="Email address" type="email" optional value={values.contactInformation.email} onChange={set('contactInformation')('email')} error={riderFieldError(errors, 'contactInformation.email')} hint="Recommended — status updates are emailed to this address." />
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="address.residentialAddress" label="Residential address" required value={values.address.residentialAddress} onChange={set('address')('residentialAddress')} error={riderFieldError(errors, 'address.residentialAddress')} placeholder="House no., street, landmark" />
                    <TextField id="address.city" label="City" required value={values.address.city} onChange={set('address')('city')} error={riderFieldError(errors, 'address.city')} />
                    <TextField id="address.area" label="Area / locality" required value={values.address.area} onChange={set('address')('area')} error={riderFieldError(errors, 'address.area')} />
                    <TextField id="address.pincode" label="Pincode" required value={values.address.pincode} onChange={set('address')('pincode')} error={riderFieldError(errors, 'address.pincode')} placeholder="632009" />
                    <TextField id="contactInformation.emergencyContactName" label="Emergency contact name" optional value={values.contactInformation.emergencyContactName} onChange={set('contactInformation')('emergencyContactName')} error={riderFieldError(errors, 'contactInformation.emergencyContactName')} />
                    <TextField id="contactInformation.emergencyContactNumber" label="Emergency contact number" optional value={values.contactInformation.emergencyContactNumber} onChange={set('contactInformation')('emergencyContactNumber')} error={riderFieldError(errors, 'contactInformation.emergencyContactNumber')} />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="drivingInformation.licenceNumber" label="Driving licence number" required value={values.drivingInformation.licenceNumber} onChange={set('drivingInformation')('licenceNumber')} error={riderFieldError(errors, 'drivingInformation.licenceNumber')} />
                    <TextField id="drivingInformation.experience" label="Driving experience" required value={values.drivingInformation.experience} onChange={set('drivingInformation')('experience')} error={riderFieldError(errors, 'drivingInformation.experience')} placeholder="e.g. 3 years" />
                    <Field id="vehicleInformation.ownsVehicle" label="Do you own a vehicle?" required error={riderFieldError(errors, 'vehicleInformation.ownsVehicle')}>
                      <div className="mt-2 flex gap-3">
                        {[['true', 'Yes'], ['false', 'No — I need assistance']].map(([value, label]) => (
                          <button key={value} type="button" onClick={() => set('vehicleInformation')('ownsVehicle')(value)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold ring-1 transition ${values.vehicleInformation.ownsVehicle === value ? 'bg-brand-green text-white ring-brand-green' : 'bg-white text-brand-dark ring-black/10'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </Field>
                    {values.vehicleInformation.ownsVehicle === 'false' ? (
                      <div className="sm:col-span-2">
                        <Checkbox id="assistance" checked={values.vehicleInformation.assistanceRequired} onChange={setCheck('vehicleInformation', 'assistanceRequired')} label="I confirm I would like information about vehicle assistance options." />
                        {riderFieldError(errors, 'vehicleInformation.assistanceRequired') && <p role="alert" className="mt-1.5 text-sm font-semibold text-red-600">{riderFieldError(errors, 'vehicleInformation.assistanceRequired')}</p>}
                      </div>
                    ) : (
                      <>
                        <Field id="vehicleInformation.vehicleType" label="Vehicle type" required error={riderFieldError(errors, 'vehicleInformation.vehicleType')}>
                          {select('vehicleInformation', 'vehicleType', config.allowedVehicleTypes, 'Choose vehicle type')}
                        </Field>
                        <TextField id="vehicleInformation.registrationNumber" label="Registration number" required value={values.vehicleInformation.registrationNumber} onChange={set('vehicleInformation')('registrationNumber')} error={riderFieldError(errors, 'vehicleInformation.registrationNumber')} />
                        <TextField id="vehicleInformation.brand" label="Brand" required value={values.vehicleInformation.brand} onChange={set('vehicleInformation')('brand')} error={riderFieldError(errors, 'vehicleInformation.brand')} />
                        <TextField id="vehicleInformation.model" label="Model" required value={values.vehicleInformation.model} onChange={set('vehicleInformation')('model')} error={riderFieldError(errors, 'vehicleInformation.model')} />
                        <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                          <Checkbox id="insuranceAvailable" checked={values.vehicleInformation.insuranceAvailable} onChange={setCheck('vehicleInformation', 'insuranceAvailable')} label="Vehicle insurance is available" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="workPreferences.preferredWorkingArea" label="Preferred working area" required value={values.workPreferences.preferredWorkingArea} onChange={set('workPreferences')('preferredWorkingArea')} error={riderFieldError(errors, 'workPreferences.preferredWorkingArea')} placeholder="e.g. Sathuvachari, Vellore" />
                    <Field id="workPreferences.workType" label="Preferred work type" required error={riderFieldError(errors, 'workPreferences.workType')}>
                      {select('workPreferences', 'workType', config.workTypes, 'Choose work type')}
                    </Field>
                    <TextField id="workPreferences.preferredWorkingHours" label="Preferred working hours" optional value={values.workPreferences.preferredWorkingHours} onChange={set('workPreferences')('preferredWorkingHours')} error={riderFieldError(errors, 'workPreferences.preferredWorkingHours')} placeholder="e.g. 9 am – 6 pm" />
                    <div className="sm:col-span-2">
                      <p className="field-label">Available days <span className="ml-1 text-red-500">*</span></p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {config.availabilityDays.map((day) => (
                          <button key={day} type="button" onClick={toggleDay(day)}
                            className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${values.workPreferences.availabilityDays.includes(day) ? 'bg-brand-green text-white ring-brand-green' : 'bg-white text-brand-dark ring-black/10'}`}>
                            {day}
                          </button>
                        ))}
                      </div>
                      {riderFieldError(errors, 'workPreferences.availabilityDays') && <p role="alert" className="mt-1.5 text-sm font-semibold text-red-600">{riderFieldError(errors, 'workPreferences.availabilityDays')}</p>}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="identityVerification.aadhaarNumber" label="Aadhaar number" optional error={riderFieldError(errors, 'identityVerification.aadhaarNumber')}>
                      <input id="identityVerification.aadhaarNumber" className={`field ${errors['identityVerification.aadhaarNumber'] ? 'field-error' : ''}`} value={values.identityVerification.aadhaarNumber} onChange={set('identityVerification')('aadhaarNumber')} placeholder="Only if you want to provide it" />
                    </Field>
                    <Field id="identityVerification.panNumber" label="PAN number" required error={riderFieldError(errors, 'identityVerification.panNumber')}>
                      <input id="identityVerification.panNumber" className={`field ${errors['identityVerification.panNumber'] ? 'field-error' : ''}`} value={values.identityVerification.panNumber} onChange={set('identityVerification')('panNumber')} placeholder="10-character PAN" maxLength={10} />
                    </Field>
                    <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                      <Checkbox id="aadhaarConsent" checked={values.identityVerification.aadhaarConsent} onChange={setCheck('identityVerification', 'aadhaarConsent')} label="I consent to Aadhaar verification for this application." />
                      <Checkbox id="panConsent" checked={values.identityVerification.panConsent} onChange={setCheck('identityVerification', 'panConsent')} label="I consent to PAN verification for this application. *" />
                    </div>
                    <TextField id="identityVerification.additionalNotes" label="Additional verification notes" optional value={values.identityVerification.additionalNotes} onChange={set('identityVerification')('additionalNotes')} error={riderFieldError(errors, 'identityVerification.additionalNotes')} />
                    <Field id="paymentInformation.submitted" label="Bank details" required hint="Share now, or after approval.">
                      <div className="mt-2 flex gap-3">
                        {[['false', 'After approval'], ['true', 'Submit now']].map(([value, label]) => (
                          <button key={value} type="button" onClick={() => set('paymentInformation')('submitted')(value)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold ring-1 transition ${values.paymentInformation.submitted === value ? 'bg-brand-green text-white ring-brand-green' : 'bg-white text-brand-dark ring-black/10'}`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </Field>
                    {values.paymentInformation.submitted === 'true' && (
                      <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
                        <TextField id="paymentInformation.accountHolderName" label="Account holder name" required value={values.paymentInformation.accountHolderName} onChange={set('paymentInformation')('accountHolderName')} error={riderFieldError(errors, 'paymentInformation.accountHolderName')} />
                        <TextField id="paymentInformation.bankName" label="Bank name" required value={values.paymentInformation.bankName} onChange={set('paymentInformation')('bankName')} error={riderFieldError(errors, 'paymentInformation.bankName')} />
                        <TextField id="paymentInformation.accountNumber" label="Account number" required value={values.paymentInformation.accountNumber} onChange={set('paymentInformation')('accountNumber')} error={riderFieldError(errors, 'paymentInformation.accountNumber')} />
                        <TextField id="paymentInformation.confirmAccountNumber" label="Confirm account number" required value={values.paymentInformation.confirmAccountNumber} onChange={set('paymentInformation')('confirmAccountNumber')} error={riderFieldError(errors, 'paymentInformation.confirmAccountNumber')} />
                        <TextField id="paymentInformation.ifscCode" label="IFSC code" required value={values.paymentInformation.ifscCode} onChange={set('paymentInformation')('ifscCode')} error={riderFieldError(errors, 'paymentInformation.ifscCode')} />
                        <TextField id="paymentInformation.upiId" label="UPI ID" optional value={values.paymentInformation.upiId} onChange={set('paymentInformation')('upiId')} error={riderFieldError(errors, 'paymentInformation.upiId')} />
                      </div>
                    )}
                  </div>
                )}

                {step === 5 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {RIDER_DOCUMENTS.filter((doc) => docs.includes(doc.key) || !doc.when).map((doc) => (
                      <div key={doc.key} className={doc.key === 'profilePhoto' ? 'sm:col-span-2' : ''}>
                        <DocumentUpload
                          id={doc.key}
                          label={doc.label}
                          hint={doc.hint}
                          required={docs.includes(doc.key)}
                          accept={doc.accept}
                          file={files[doc.key]}
                          onChange={setFile(doc.key)}
                          error={riderFieldError(errors, `documents.${doc.key}`)}
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2 grid gap-3">
                      <Checkbox id="consentAccurate" checked={values.consents.accurate} onChange={setCheck('consents', 'accurate')} label="I confirm that the information and documents provided are accurate." />
                      <Checkbox id="consentTerms" checked={values.consents.terms} onChange={setCheck('consents', 'terms')} label="I agree to the rider terms and understand that submission is not approval or an offer of work." />
                      <Checkbox id="consentProcessing" checked={values.consents.processing} onChange={setCheck('consents', 'processing')} label="I consent to City Delivery Services processing my details for rider onboarding." />
                    </div>
                    <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                      {['consents.accurate', 'consents.terms', 'consents.processing'].map((key) => riderFieldError(errors, key) && (
                        <p key={key} role="alert" className="text-sm font-semibold text-red-600">{riderFieldError(errors, key)}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {configError && <p className="mt-6 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">{configError}</p>}
            {formError && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{formError}</p>}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={back} disabled={step === 0 || submitting} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-brand-dark transition hover:bg-brand-light disabled:opacity-40">
                <ArrowLeft size={17} /> Back
              </button>
              {step < RIDER_STEPS.length - 1 ? (
                <button type="button" onClick={next} className="btn inline-flex items-center gap-2">
                  Continue <ArrowRight size={17} />
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={submitting} className="btn inline-flex items-center gap-2">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <FileCheck2 size={18} />}
                  {submitting ? 'Submitting…' : 'Submit application'}
                </button>
              )}
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-brand-muted">
              <ShieldCheck size={15} /> Your documents are stored privately and used only for rider onboarding.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
