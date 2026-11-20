import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Loader2, Search, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import { ApiError, checkRiderStatus } from '../services/api.js';
import { riderStatusClass } from '../utils/rider.js';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function RiderStatus() {
  const [applicationId, setApplicationId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const check = async (event) => {
    event.preventDefault();
    if (!applicationId.trim() || busy) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await checkRiderStatus(applicationId.trim());
      setResult(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not check your status right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SEO
        title="Check Rider Application Status | City Delivery Services"
        description="Check the status of your City Delivery Services rider application using your Application ID."
        path="/rider/status"
        noindex
      />
      <PageHero
        eyebrow="Application status"
        title="Check your rider application"
        description="Enter the Application ID from your confirmation screen. No login is needed."
      />

      <main className="bg-brand-light px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={check} className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <Field id="applicationId" label="Application ID" required hint="Format: RIDER-YYYYMMDD-XXXXXX">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="applicationId"
                  value={applicationId}
                  onChange={(event) => setApplicationId(event.target.value.toUpperCase())}
                  placeholder="RIDER-20261120-ABC123"
                  className="field font-mono uppercase"
                  autoComplete="off"
                  required
                />
                <button type="submit" disabled={busy} className="btn shrink-0 inline-flex items-center gap-2">
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  {busy ? 'Checking…' : 'Check status'}
                </button>
              </div>
            </Field>
            {error && <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-lg font-extrabold text-brand-dark">{result.applicationId}</div>
                <span className={`rounded-full px-4 py-2 text-sm font-extrabold ${riderStatusClass(result.active ? 'Active' : result.applicationStatus)}`}>{result.active ? 'Active' : result.applicationStatus}</span>
              </div>
              <h2 className="mt-7 text-2xl font-extrabold text-brand-dark">Application update</h2>
              <p className="mt-3 leading-relaxed text-brand-muted">{result.nextSteps}</p>
              {result.active && (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-relaxed text-emerald-900">
                  <CheckCircle2 size={18} className="mr-2 inline-block align-[-3px]" /> Your rider account is active.
                </div>
              )}
              {result.riderId && (
                <div className="mt-5 rounded-2xl bg-brand-yellow/25 p-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">Rider ID</span>
                  <p className="mt-1 font-display text-xl font-extrabold text-brand-dark">{result.riderId}</p>
                </div>
              )}
              {result.documentRequestMessage && (
                <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-relaxed text-violet-900">
                  <strong>Message from our team:</strong> {result.documentRequestMessage}
                </div>
              )}
              {result.rejectionReason && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-relaxed text-red-900">
                  <strong>Reason:</strong> {result.rejectionReason}
                </div>
              )}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-brand-light/70 p-4">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">Submitted</div>
                  <div className="mt-1 font-bold text-brand-dark">{formatDate(result.submittedAt)}</div>
                </div>
                <div className="rounded-2xl bg-brand-light/70 p-4">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">Last updated</div>
                  <div className="mt-1 font-bold text-brand-dark">{formatDate(result.updatedAt)}</div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-6 rounded-3xl bg-white/70 p-6 text-sm leading-relaxed text-brand-muted ring-1 ring-black/5">
            <p className="flex items-center gap-2 font-extrabold text-brand-dark"><ShieldCheck size={18} className="text-brand-green" /> Privacy</p>
            <p className="mt-2">This page shows application status only. It does not display documents, bank details or other private information. Do not share your Application ID publicly.</p>
            <p className="mt-4 flex items-center gap-2 font-extrabold text-brand-dark"><ClipboardList size={18} className="text-brand-green" /> Need help?</p>
            <p className="mt-2">Contact us from the <Link to="/contact" className="font-bold text-brand-green hover:underline">Contact page</Link> and mention your Application ID.</p>
            {result?.applicationStatus === 'Approved' && !result.active && <p className="mt-4 flex items-center gap-2 font-bold text-brand-green"><CheckCircle2 size={17} /> Approval is not activation. You will receive a separate activation update.</p>}
          </div>
        </div>
      </main>
    </>
  );
}
