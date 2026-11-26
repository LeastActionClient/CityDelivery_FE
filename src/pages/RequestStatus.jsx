import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ClipboardList, Loader2, Search, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import { ApiError, getRequestStatus } from '../services/api.js';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function requestStatusClass(status) {
  return {
    Pending: 'bg-amber-100 text-amber-900',
    Reviewing: 'bg-blue-100 text-blue-900',
    Contacted: 'bg-violet-100 text-violet-900',
    Completed: 'bg-emerald-100 text-emerald-900',
    Cancelled: 'bg-red-100 text-red-900',
  }[status] || 'bg-brand-light text-brand-dark';
}

export default function RequestStatus() {
  const [params, setParams] = useSearchParams();
  const paramId = (params.get('requestId') || '').toUpperCase();
  const [requestId, setRequestId] = useState(paramId);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadStatus = async (id) => {
    const response = await getRequestStatus(id);
    setResult(response.data);
  };

  useEffect(() => {
    if (!paramId) return;
    setRequestId(paramId);
    let active = true;
    setBusy(true);
    setError('');
    setResult(null);
    (async () => {
      try {
        const response = await getRequestStatus(paramId);
        if (active) setResult(response.data);
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : 'Could not check your status right now. Please try again.');
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, [paramId]);

  const check = async (event) => {
    event.preventDefault();
    const id = requestId.trim().toUpperCase();
    if (!id || busy) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      await loadStatus(id);
      setParams({ requestId: id });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not check your status right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SEO
        title="Check Request Status | City Delivery Services"
        description="Check the status of your City Delivery Services product request using your Request ID."
        path="/request/status"
        noindex
      />
      <PageHero
        eyebrow="Request status"
        title="Check your request"
        description="Enter the Request ID from your confirmation screen or email. No login is needed."
      />

      <main className="bg-brand-light px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={check} className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <Field id="requestId" label="Request ID" required hint="Format: CDS-YYYYMMDD-XXXXXX">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="requestId"
                  value={requestId}
                  onChange={(event) => setRequestId(event.target.value.toUpperCase())}
                  placeholder="CDS-20261126-ABC123"
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
                <div className="font-mono text-lg font-extrabold text-brand-dark">{result.requestId}</div>
                <span className={`rounded-full px-4 py-2 text-sm font-extrabold ${requestStatusClass(result.status)}`}>{result.status}</span>
              </div>
              <h2 className="mt-7 text-2xl font-extrabold text-brand-dark">Request update</h2>
              <p className="mt-3 leading-relaxed text-brand-muted">{result.nextSteps || 'Our team is handling your request. We will contact you with the next steps.'}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-brand-light/70 p-4">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">Submitted</div>
                  <div className="mt-1 font-bold text-brand-dark">{formatDate(result.createdAt)}</div>
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
            <p className="mt-2">This page shows request status only. It does not display your contact details, address, product image or other private information. Do not share your Request ID publicly.</p>
            <p className="mt-2">Requests saved on this device are listed on the <Link to="/request/history" className="font-bold text-brand-green hover:underline">My Requests page</Link>.</p>
            <p className="mt-4 flex items-center gap-2 font-extrabold text-brand-dark"><ClipboardList size={18} className="text-brand-green" /> Need help?</p>
            <p className="mt-2">Contact us from the <Link to="/contact" className="font-bold text-brand-green hover:underline">Contact page</Link> and mention your Request ID.</p>
          </div>
        </div>
      </main>
    </>
  );
}
