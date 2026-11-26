import { useCallback, useEffect, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  StickyNote,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import {
  addAdminFranchiseNote,
  getAdminFranchise,
  getAdminFranchiseAudit,
  getAdminFranchiseDocuments,
  getAdminFranchiseSettings,
  getAdminFranchises,
  markAdminFranchiseFeePaid,
  requestAdminFranchiseInfo,
  retryAdminFranchiseNotifications,
  updateAdminFranchiseSettings,
  updateAdminFranchiseStatus,
} from '../../services/api.js';
import {
  FRANCHISE_STATUSES,
  formatCurrency,
  franchiseStatusClass,
} from '../../utils/franchise.js';

const ROLE_STORAGE = 'city-delivery-franchise-role';
const ROLES = ['owner', 'franchise_manager', 'support'];
const WRITE_ROLES = ['owner', 'franchise_manager'];

function readRole() {
  try { return sessionStorage.getItem(ROLE_STORAGE) || 'owner'; } catch { return 'owner'; }
}
function saveRole(value) {
  try { sessionStorage.setItem(ROLE_STORAGE, value); } catch { }
}
function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
function dash(value) {
  return value === undefined || value === null || value === '' ? 'Not provided' : String(value);
}
function vehicleSummary(item) {
  const rows = item.business?.vehicles || [];
  if (!rows.length) return 'No vehicle counts added';
  const types = rows.map((row) => (row.type === 'Other' && row.otherType ? row.otherType : row.type)).filter(Boolean).join(', ');
  const count = item.business?.numberOfVehicles || rows.reduce((sum, row) => sum + (Number(row.count) || 0), 0);
  return `${count} vehicle${count === 1 ? '' : 's'} · ${types || 'Types not provided'}`;
}
function Detail({ label, children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-brand-light/70 p-4 ${className}`}>
      <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-muted">{label}</div>
      <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-brand-text">{children}</div>
    </div>
  );
}

export default function FranchiseManagement({ apiKey, onUnauthorized }) {
  const [role, setRole] = useState(readRole);
  const [showRole, setShowRole] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [payment, setPayment] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [audit, setAudit] = useState([]);
  const [message, setMessage] = useState('');
  const [nextStatus, setNextStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const canWrite = WRITE_ROLES.includes(role);

  const handleError = (err) => {
    if (err?.status === 401 && onUnauthorized) onUnauthorized();
    setError(err.message || 'Something went wrong.');
  };

  const load = useCallback(async (nextPage = page, filters = {}) => {
    if (!apiKey) return;
    const nextStatus = filters.status ?? status;
    const nextCity = filters.city ?? city;
    const nextPayment = filters.payment ?? payment;
    const nextQuery = filters.query ?? query;
    setLoading(true);
    setError('');
    try {
      const response = await getAdminFranchises(apiKey, role, {
        page: nextPage,
        status: nextStatus,
        city: nextCity,
        payment: nextPayment,
        q: nextQuery,
      });
      setItems(response.data.items || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || nextPage);
      setPages(response.data.pages || 1);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [apiKey, city, page, payment, query, role, status]);

  useEffect(() => { load(1, { status: '', city: '', payment: '', query: '' }); }, [apiKey, role]);

  const loadDetail = async (id) => {
    setBusy(true);
    setError('');
    setSelected(id);
    try {
      const [applicationResponse, documentsResponse, auditResponse] = await Promise.all([
        getAdminFranchise(apiKey, role, id),
        getAdminFranchiseDocuments(apiKey, role, id),
        getAdminFranchiseAudit(apiKey, role, id),
      ]);
      setDetail(applicationResponse.data);
      setDocuments(documentsResponse.data.documents || []);
      setAudit(auditResponse.data || []);
      setNextStatus(applicationResponse.data.applicationStatus || '');
      setMessage('');
      setPaymentReference('');
      setPaymentNote('');
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail(null);
    setDocuments([]);
    setAudit([]);
    setMessage('');
    setNextStatus('');
    setPaymentReference('');
    setPaymentNote('');
  };

  const refreshDetail = async () => {
    if (!selected) return;
    await loadDetail(selected);
    await load();
  };

  const runAction = async (action, successMessage) => {
    if (!selected || busy) return;
    setBusy(true);
    setError('');
    try {
      await action();
      if (successMessage) setMessage(successMessage);
      await refreshDetail();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = () => {
    if (!canWrite) { setError('Your role cannot change application status.'); return; }
    if (nextStatus === 'Rejected' && !message.trim()) {
      setError('Please enter a rejection reason in the message box.');
      return;
    }
    if (!nextStatus || nextStatus === detail.applicationStatus) return;
    runAction(
      () => updateAdminFranchiseStatus(apiKey, role, detail.applicationId, {
        status: nextStatus,
        reason: nextStatus === 'Rejected' ? message.trim() : undefined,
      }),
      'Status updated and applicant notified where applicable.'
    );
  };

  const markFeePaid = () => {
    if (!canWrite) { setError('Your role cannot update payment status.'); return; }
    if (detail?.payment?.status === 'PAID') { setError('Initial payment is already recorded as paid.'); return; }
    runAction(
      () => markAdminFranchiseFeePaid(apiKey, role, detail.applicationId, {
        reference: paymentReference.trim(),
        note: paymentNote.trim(),
      }),
      'Initial payment marked as paid.'
    );
  };

  const requestInfo = () => {
    if (!message.trim()) { setError('Please enter the information you need.'); return; }
    runAction(
      () => requestAdminFranchiseInfo(apiKey, role, detail.applicationId, message.trim()),
      'Information request saved and applicant notified.'
    );
  };

  const addNote = () => {
    if (!canWrite) { setError('Your role cannot add internal notes.'); return; }
    if (!message.trim()) { setError('Please enter a note.'); return; }
    runAction(() => addAdminFranchiseNote(apiKey, role, detail.applicationId, message.trim()), 'Internal note added.');
  };

  const retryNotifications = () => {
    runAction(() => retryAdminFranchiseNotifications(apiKey, role, detail.applicationId), 'Notification retry finished.');
  };

  const openSettings = async () => {
    setError('');
    try {
      const response = await getAdminFranchiseSettings(apiKey, role);
      setSettings(response.data);
      setShowSettings(true);
    } catch (err) {
      handleError(err);
    }
  };

  const saveSettings = async () => {
    if (!settings || !canWrite) return;
    setBusy(true);
    setError('');
    try {
      const response = await updateAdminFranchiseSettings(apiKey, role, {
        applicationFee: Number(settings.applicationFee),
        refundPolicy: settings.refundPolicy,
        refundPolicyDetails: settings.refundPolicyDetails || '',
        paymentInstructions: settings.paymentInstructions || '',
      });
      setSettings(response.data);
      setShowSettings(false);
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const changeRole = (value) => {
    setRole(value);
    saveRole(value);
    setShowRole(false);
  };

  return (
    <section className="mt-8">
      <div className="rounded-4xl bg-brand-dark p-6 text-white shadow-lift sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-yellow">Franchise management</p>
            <h2 className="mt-2 text-3xl font-extrabold">Franchise applications</h2>
            <p className="mt-2 text-white/65">{total} application{total === 1 ? '' : 's'} · role: {role}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openSettings} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20">
              <Settings2 size={16} /> Fee & policy
            </button>
            <div className="relative">
              <button type="button" onClick={() => setShowRole((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20">
                <ShieldCheck size={16} /> Role <ChevronRight size={14} className={showRole ? 'rotate-90' : ''} />
              </button>
              {showRole && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl bg-white p-2 text-brand-dark shadow-lift ring-1 ring-black/5">
                  {ROLES.map((item) => (
                    <button key={item} type="button" onClick={() => changeRole(item)} className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition ${item === role ? 'bg-brand-yellow' : 'hover:bg-brand-light'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => load()} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl bg-white/10 p-4 md:grid-cols-2 lg:grid-cols-[1.3fr,1fr,1fr,1fr]">
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Search</span>
            <span className="relative block">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && load(1, { query: event.target.value })}
                placeholder="Name, mobile, ID, city or transaction"
                className="w-full rounded-xl border-0 bg-white/15 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/45 focus:ring-2 focus:ring-brand-yellow"
              />
            </span>
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Status</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value); load(1, { status: event.target.value }); }} className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm font-bold text-brand-dark">
              <option value="">All statuses</option>
              {FRANCHISE_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">City</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load(1, { city: event.target.value })} placeholder="City" className="w-full rounded-xl border-0 bg-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/45 focus:ring-2 focus:ring-brand-yellow" />
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Payment</span>
            <select value={payment} onChange={(event) => { setPayment(event.target.value); load(1, { payment: event.target.value }); }} className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm font-bold text-brand-dark">
              <option value="">All payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending or failed</option>
            </select>
          </label>
        </div>
        <button type="button" onClick={() => load(1)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-bold text-brand-dark">
          <Search size={15} /> Search applications
        </button>
        {!canWrite && <p className="mt-3 flex items-center gap-2 text-xs text-white/55"><Eye size={15} /> Support role has read-only access for status changes and notes.</p>}
      </div>

      {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

      {loading && items.length === 0 ? (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-brand-muted"><Loader2 className="animate-spin" /> Loading applications…</div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-12 text-center text-brand-muted shadow-soft">No franchise applications found.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <button key={item.applicationId} type="button" onClick={() => loadDetail(item.applicationId)} className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 text-left shadow-soft ring-1 ring-black/5 transition hover:ring-brand-green/40 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-dark px-3 py-1 font-mono text-xs font-bold text-brand-yellow">{item.applicationId}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${franchiseStatusClass(item.applicationStatus)}`}>{item.applicationStatus}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.payment?.status === 'PAID' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{item.payment?.status || 'PENDING'}</span>
                  {item.franchiseId && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-900">{item.franchiseId}</span>}
                </div>
                <h3 className="mt-3 truncate text-xl font-extrabold text-brand-dark">{dash(item.fullName)}</h3>
                <p className="mt-1 truncate text-sm text-brand-muted">
                  {dash(item.location?.city)} · {vehicleSummary(item)} · {formatDate(item.createdAt)}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-green">Review <ChevronRight size={17} /></span>
            </button>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow-soft">
          <button type="button" disabled={page <= 1 || loading} onClick={() => load(page - 1)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-brand-dark disabled:opacity-40"><ChevronLeft size={17} /> Previous</button>
          <span className="text-sm font-bold text-brand-muted">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages || loading} onClick={() => load(page + 1)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-brand-dark disabled:opacity-40">Next <ChevronRight size={17} /></button>
        </div>
      )}

      {showSettings && settings && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Franchise fee and policy">
          <div className="w-full max-w-lg rounded-4xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-brand-dark">Fee &amp; policy</h3>
                <p className="mt-1 text-sm text-brand-muted">Changes apply to new franchise applications.</p>
              </div>
              <button type="button" onClick={() => setShowSettings(false)} aria-label="Close settings" className="grid h-10 w-10 place-items-center rounded-full bg-brand-light"><X size={18} /></button>
            </div>
            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="field-label">Initial payment (INR, optional)</span>
                <input type="number" min="1" max="100000" step="0.01" value={settings.applicationFee} onChange={(event) => setSettings((s) => ({ ...s, applicationFee: event.target.value }))} className="field" disabled={!canWrite} />
              </label>
              <label className="block">
                <span className="field-label">Refund policy</span>
                <select value={settings.refundPolicy} onChange={(event) => setSettings((s) => ({ ...s, refundPolicy: event.target.value }))} className="field" disabled={!canWrite}>
                  <option>Refundable</option>
                  <option>Non-refundable</option>
                </select>
              </label>
              <label className="block">
                <span className="field-label">Refund policy details</span>
                <textarea value={settings.refundPolicyDetails || ''} onChange={(event) => setSettings((s) => ({ ...s, refundPolicyDetails: event.target.value }))} className="field min-h-[96px] resize-y" disabled={!canWrite} />
              </label>
              <label className="block">
                <span className="field-label">Payment instructions</span>
                <textarea value={settings.paymentInstructions || ''} onChange={(event) => setSettings((s) => ({ ...s, paymentInstructions: event.target.value }))} className="field min-h-[96px] resize-y" disabled={!canWrite} />
              </label>
              <button type="button" onClick={saveSettings} disabled={busy || !canWrite} className="btn w-full">
                {busy ? <Loader2 size={17} className="animate-spin" /> : <BadgeCheck size={17} />} Save policy
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && detail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Franchise application ${detail.applicationId}`}>
          <div className="mx-auto max-h-[calc(100vh-1.5rem)] max-w-5xl overflow-y-auto rounded-4xl bg-white p-5 shadow-lift sm:max-h-[calc(100vh-3rem)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-dark px-3 py-1 font-mono text-xs font-bold text-brand-yellow">{detail.applicationId}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${franchiseStatusClass(detail.applicationStatus)}`}>{detail.applicationStatus}</span>
                  {detail.franchiseId && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-900">ID: {detail.franchiseId}</span>}
                </div>
                <h3 className="mt-3 text-3xl font-extrabold text-brand-dark">{dash(detail.fullName)}</h3>
                <p className="mt-1 text-sm text-brand-muted">Submitted {formatDate(detail.createdAt)}</p>
              </div>
              <button type="button" onClick={closeDetail} aria-label="Close franchise details" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light transition hover:bg-red-50 hover:text-red-600"><X size={20} /></button>
            </div>

            {busy && <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-muted"><Loader2 size={17} className="animate-spin" /> Working…</div>}
            {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
            {message && !error && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">{message}</div>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Mobile"><span className="inline-flex items-center gap-2"><Phone size={15} /> {dash(detail.mobile)}</span></Detail>
              <Detail label="Email"><span className="inline-flex items-center gap-2 break-all"><Mail size={15} /> {dash(detail.email)}</span></Detail>
              <Detail label="Location">{dash(detail.location?.state)}, {dash(detail.location?.district)}, {dash(detail.location?.city)}</Detail>
              <Detail label="Operating area">{dash(detail.location?.preferredOperatingArea)}</Detail>
              <Detail label="PIN code">{dash(detail.location?.pincode)}</Detail>
              <Detail label="Full address">{dash(detail.location?.fullAddress)}</Detail>
              <Detail label="Business experience">{dash(detail.business?.experience)}</Detail>
              <Detail label="Investment capacity">{dash(detail.business?.investmentCapacity)}</Detail>
              <Detail label="Office or shop">{detail.business?.hasOfficeOrShop ? 'Yes' : 'No'}</Detail>
              <Detail label="Vehicles">{dash(detail.business?.numberOfVehicles)}</Detail>
              <Detail label="Motivation" className="lg:col-span-2">{dash(detail.business?.motivation)}</Detail>
              <Detail label="Fee snapshot">
                {formatCurrency(detail.feeSnapshot?.amount, detail.feeSnapshot?.currency)} · {dash(detail.feeSnapshot?.refundPolicy)}
              </Detail>
              {detail.feeSnapshot?.refundPolicyDetails && <Detail label="Refund policy details" className="lg:col-span-2">{detail.feeSnapshot.refundPolicyDetails}</Detail>}
              {detail.infoRequest?.message && <Detail label="Information requested" className="lg:col-span-2">{detail.infoRequest.message} · {formatDate(detail.infoRequest.requestedAt)}</Detail>}
              {detail.rejectionReason && <Detail label="Rejection reason" className="lg:col-span-2">{detail.rejectionReason}</Detail>}
            </div>

            <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 text-lg font-extrabold text-brand-dark"><Truck size={19} className="text-brand-green" /> Vehicle details</h4>
                <span className="rounded-full bg-brand-yellow/25 px-3 py-1 text-xs font-extrabold text-brand-dark">Total: {detail.business?.numberOfVehicles || 0}</span>
              </div>
              {(detail.business?.vehicles || []).length === 0 ? (
                <p className="mt-3 rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-muted">No vehicle counts were submitted.</p>
              ) : (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.business.vehicles.map((vehicle, index) => (
                    <div key={`${vehicle.type}-${index}`} className="rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-text">
                      <span className="font-extrabold text-brand-dark">
                        {vehicle.type === 'Other' && vehicle.otherType ? vehicle.otherType : dash(vehicle.type)}: {dash(vehicle.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-3xl bg-brand-light/70 p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-brand-dark">
                <CreditCard size={18} className="text-brand-green" /> Payment
                <span className={`rounded-full px-3 py-1 text-xs ${detail.payment?.status === 'PAID' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>{detail.payment?.status || 'PENDING'}</span>
              </div>
              <div className="mt-3 grid gap-3 text-sm text-brand-text sm:grid-cols-2">
                <span>Amount: {formatCurrency(detail.payment?.amount || detail.feeSnapshot?.amount, detail.payment?.currency || detail.feeSnapshot?.currency)}</span>
                <span>Reference: {dash(detail.payment?.transactionId)}</span>
                <span>Paid: {formatDate(detail.payment?.paidAt)}</span>
              </div>
              {detail.payment?.lastError && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{detail.payment.lastError}</p>}
              {detail.payment?.status !== 'PAID' && canWrite && (
                <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
                  <p className="text-xs font-extrabold text-brand-dark">Fee collected offline? Record it here for reference.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input
                      value={paymentReference}
                      onChange={(event) => setPaymentReference(event.target.value)}
                      placeholder="Payment reference / UTR (optional)"
                      className="w-full rounded-xl border-0 bg-brand-light/70 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/70 focus:ring-2 focus:ring-brand-yellow"
                      disabled={busy}
                    />
                    <input
                      value={paymentNote}
                      onChange={(event) => setPaymentNote(event.target.value)}
                      placeholder="Note (optional)"
                      className="w-full rounded-xl border-0 bg-brand-light/70 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/70 focus:ring-2 focus:ring-brand-yellow"
                      disabled={busy}
                    />
                  </div>
                  <button type="button" onClick={markFeePaid} disabled={busy} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">
                    <BadgeCheck size={16} /> Mark fee paid (offline)
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-3xl bg-brand-dark p-5 text-white">
              <h4 className="flex items-center gap-2 text-lg font-extrabold"><UserCheck size={19} className="text-brand-yellow" /> Application actions</h4>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,1.3fr]">
                <div>
                  <label className="block text-sm font-bold">
                    <span className="mb-1.5 block text-white/70">Set status</span>
                    <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm font-bold text-brand-dark" disabled={!canWrite || busy}>
                      {FRANCHISE_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <button type="button" onClick={changeStatus} disabled={!canWrite || busy || !nextStatus || nextStatus === detail.applicationStatus} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 py-2.5 text-sm font-extrabold text-brand-dark disabled:opacity-50">
                    <BadgeCheck size={16} /> Update status
                  </button>
                  <button type="button" onClick={retryNotifications} disabled={busy} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-50">
                    <RefreshCw size={16} /> Retry notifications
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-bold">
                    <span className="mb-1.5 block text-white/70">Message / reason / internal note</span>
                    <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Used for status reasons, applicant messages and internal notes" className="min-h-[110px] w-full resize-y rounded-2xl border-0 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-brand-muted/70 focus:ring-2 focus:ring-brand-yellow" disabled={busy} />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={requestInfo} disabled={busy || !message.trim()} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-50">
                      <Send size={16} /> Request info
                    </button>
                    <button type="button" onClick={addNote} disabled={busy || !canWrite || !message.trim()} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-50">
                      <StickyNote size={16} /> Add note
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold text-brand-dark"><FileText size={19} className="text-brand-green" /> Documents</h4>
                {documents.length === 0 ? (
                  <p className="mt-3 rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-muted">No documents were submitted.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {documents.map((doc) => (
                      <a key={doc.key} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl bg-brand-light/70 p-4 transition hover:bg-brand-yellow/20">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold text-brand-dark">{dash(doc.originalName)}</span>
                          <span className="text-xs text-brand-muted">{doc.key} · {dash(doc.mimeType)} · {formatDate(doc.uploadedAt)}</span>
                        </span>
                        <Eye size={17} className="shrink-0 text-brand-green" />
                      </a>
                    ))}
                  </div>
                )}
                {detail.adminNotes?.length > 0 && (
                  <>
                    <h4 className="mt-6 text-lg font-extrabold text-brand-dark">Internal notes</h4>
                    <div className="mt-3 space-y-2">
                      {[...detail.adminNotes].reverse().map((note, index) => (
                        <div key={`${note.createdAt || index}-${index}`} className="rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-text">
                          <span className="block text-xs font-extrabold uppercase text-brand-muted">{dash(note.role)} · {dash(note.actor)} · {formatDate(note.createdAt)}</span>
                          <span className="mt-1 block whitespace-pre-wrap">{note.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-lg font-extrabold text-brand-dark"><Building2 size={19} className="text-brand-green" /> Audit trail</h4>
                {audit.length === 0 ? (
                  <p className="mt-3 rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-muted">No audit events found.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {audit.map((log, index) => (
                      <div key={log._id || `${log.action}-${index}`} className="rounded-2xl bg-brand-light/70 p-4 text-sm text-brand-text">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-extrabold text-brand-dark">{dash(log.action)}</span>
                          <span className="text-xs text-brand-muted">{formatDate(log.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-xs text-brand-muted">{dash(log.role)} · {dash(log.actor)}</p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-brand-muted">{JSON.stringify(log.details, null, 2)}</pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Detail label="Submitted">{formatDate(detail.createdAt)}</Detail>
              <Detail label="Last updated">{formatDate(detail.updatedAt)}</Detail>
              <Detail label="Approved / activated">{formatDate(detail.approvedAt)} / {formatDate(detail.activatedAt)}</Detail>
              <Detail label="Submitted email" className="sm:col-span-3">{detail.notifications?.submitted?.status || '—'} · attempts {detail.notifications?.submitted?.attempts || 0}</Detail>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
