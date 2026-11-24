import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ClipboardList, CreditCard, Loader2, Search, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SEO from '../components/SEO.jsx';
import Field from '../components/form/Field.jsx';
import { ApiError, checkFranchiseStatus, createFranchisePaymentOrder, verifyFranchisePayment } from '../services/api.js';
import { openCashfreeCheckout } from '../utils/cashfree.js';
import { franchiseStatusClass, formatCurrency } from '../utils/franchise.js';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function FranchiseStatus() {
  const [params, setParams] = useSearchParams();
  const paramId = params.get('applicationId') || '';
  const paramPayment = params.get('payment') || '';
  const [applicationId, setApplicationId] = useState(() => paramId.toUpperCase());
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);

  const loadStatus = async (id) => {
    const response = await checkFranchiseStatus(id);
    setResult(response.data);
  };

  useEffect(() => {
    const id = paramId.toUpperCase();
    if (!id) return;
    setApplicationId(id);
    let active = true;
    setBusy(true);
    setError('');
    setNotice('');
    (async () => {
      if (paramPayment === 'return') {
        try {
          await verifyFranchisePayment(id);
          if (active) setNotice('Payment verification was checked with the payment provider. Your latest status is shown below.');
        } catch (err) {
          if (active) {
            setNotice(`Payment verification could not be completed right now: ${err instanceof ApiError ? err.message : 'please try again'}. The latest saved status is shown below.`);
          }
        }
      }
      try {
        const response = await checkFranchiseStatus(id);
        if (active) setResult(response.data);
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : 'Could not check your status right now. Please try again.');
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, [paramId, paramPayment]);

  const check = async (event) => {
    event.preventDefault();
    if (!applicationId.trim() || busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    setResult(null);
    try {
      await loadStatus(applicationId.trim());
      setParams({ applicationId: applicationId.trim() });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not check your status right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const startPayment = async () => {
    if (!result?.applicationId || paying) return;
    setPaying(true);
    setError('');
    try {
      const response = await createFranchisePaymentOrder(result.applicationId);
      if (response.data?.alreadyPaid) {
        setNotice('Initial payment has already been recorded.');
        await loadStatus(result.applicationId);
        return;
      }
      if (response.data?.paymentSessionId) {
        await openCashfreeCheckout({
          paymentSessionId: response.data.paymentSessionId,
          environment: response.data.environment,
        });
        return;
      }
      setNotice('Payment could not start right now. Please try again.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not start payment right now. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <SEO
        title="Check Franchise Application Status | City Delivery Services"
        description="Check the status of your City Delivery Services franchise application using your Application ID."
        path="/franchise/status"
        noindex
      />
      <PageHero
        eyebrow="Application status"
        title="Check your franchise application"
        description="Enter the Application ID from your confirmation screen. No login is needed."
      />

      <main className="bg-brand-light px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={check} className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
            <Field id="applicationId" label="Application ID" required hint="Format: FRANCH-YYYYMMDD-XXXXXX">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="applicationId"
                  value={applicationId}
                  onChange={(event) => setApplicationId(event.target.value.toUpperCase())}
                  placeholder="FRANCH-20261123-ABC123"
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
            {notice && <p className="mt-4 rounded-2xl bg-sky-50 p-3 text-sm font-semibold text-sky-900">{notice}</p>}
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-lg font-extrabold text-brand-dark">{result.applicationId}</div>
                <span className={`rounded-full px-4 py-2 text-sm font-extrabold ${franchiseStatusClass(result.applicationStatus)}`}>{result.applicationStatus}</span>
              </div>
              <h2 className="mt-7 text-2xl font-extrabold text-brand-dark">Application update</h2>
              <p className="mt-3 leading-relaxed text-brand-muted">{result.nextSteps}</p>

              {result.payment && (
                <div className="mt-5 rounded-2xl bg-brand-light/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-brand-muted">
                    <CreditCard size={16} className="text-brand-green" /> Initial payment
                  </div>
                  <p className="mt-2 text-xs font-semibold text-brand-muted">Optional. You can pay any time using your Application ID.</p>
                  <div className="mt-2 grid gap-2 text-sm font-bold text-brand-dark sm:grid-cols-2">
                    <span>Status: {result.payment.status}</span>
                    <span>Amount: {formatCurrency(result.payment.amount, result.payment.currency)}</span>
                    {result.payment.paidAt && <span className="sm:col-span-2">Paid: {formatDate(result.payment.paidAt)}</span>}
                    {result.payment.transactionId && <span className="sm:col-span-2 break-all">Transaction: {result.payment.transactionId}</span>}
                  </div>
                  {result.fee?.refundPolicy && <p className="mt-3 text-xs font-semibold text-brand-muted">Payment policy: {result.fee.refundPolicy}</p>}
                  {result.fee?.refundPolicyDetails && <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-brand-muted">{result.fee.refundPolicyDetails}</p>}
                  {result.payment.lastError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{result.payment.lastError}</p>}
                  {result.payment.status !== 'PAID' && (
                    <div className="mt-4 flex flex-col gap-3">
                      {result.paymentConfigured && (
                        <button type="button" onClick={startPayment} disabled={paying || busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">
                          {paying ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                          {paying ? 'Opening checkout…' : 'Pay initial payment (optional)'}
                        </button>
                      )}
                      <Link to="/contact" className="inline-flex text-sm font-bold text-brand-green hover:underline">Need help with payment? Contact us →</Link>
                    </div>
                  )}
                </div>
              )}

              {result.franchiseId && (
                <div className="mt-5 rounded-2xl bg-brand-yellow/25 p-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-brand-muted">Franchise ID</span>
                  <p className="mt-1 font-display text-xl font-extrabold text-brand-dark">{result.franchiseId}</p>
                </div>
              )}
              {result.infoRequestMessage && (
                <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm leading-relaxed text-violet-900">
                  <strong>Message from our team:</strong> {result.infoRequestMessage}
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
            <p className="mt-2">This page shows application and payment status only. It does not display documents or private information. Do not share your Application ID publicly.</p>
            <p className="mt-4 flex items-center gap-2 font-extrabold text-brand-dark"><ClipboardList size={18} className="text-brand-green" /> Need help?</p>
            <p className="mt-2">Contact us from the <Link to="/contact" className="font-bold text-brand-green hover:underline">Contact page</Link> and mention your Application ID.</p>
            <p className="mt-4 flex items-center gap-2 font-bold text-brand-dark"><CheckCircle2 size={17} className="text-brand-green" /> Approval is separate from agreement and activation.</p>
          </div>
        </div>
      </main>
    </>
  );
}
