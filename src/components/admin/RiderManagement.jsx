import { useCallback, useEffect, useState } from 'react';
import {
  BadgeCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import {
  getAdminRider,
  getAdminRiderAudit,
  getAdminRiderDocuments,
  getAdminRiders,
  getAdminRiderSettings,
  requestAdminRiderDocuments,
  retryAdminRiderNotifications,
  setAdminRiderActivation,
  updateAdminRiderSettings,
  updateAdminRiderStatus,
} from '../../services/api.js';
import { RIDER_STATUSES, RIDER_VEHICLE_TYPES, riderStatusClass } from '../../utils/rider.js';

const SENSITIVE_KEY_STORAGE = 'city-delivery-rider-sensitive-key';

function readSensitiveKey() {
  try { return sessionStorage.getItem(SENSITIVE_KEY_STORAGE) || ''; } catch { return ''; }
}
function saveSensitiveKey(value) {
  try {
    if (value) sessionStorage.setItem(SENSITIVE_KEY_STORAGE, value);
    else sessionStorage.removeItem(SENSITIVE_KEY_STORAGE);
  } catch { /* storage unavailable */ }
}
function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
function dash(value) {
  return value || 'Not provided';
}
function Detail({ label, children }) {
  return (
    <div className="rounded-2xl bg-brand-light/70 p-4">
      <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-muted">{label}</div>
      <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-brand-text">{children}</div>
    </div>
  );
}

export default function RiderManagement({ apiKey, onUnauthorized }) {
  const [sensitiveKey, setSensitiveKey] = useState(readSensitiveKey);
  const [showSensitive, setShowSensitive] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [audit, setAudit] = useState([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleError = (err) => {
    const sensitiveError = Boolean(err?.fieldErrors?.sensitiveKey) || err?.status === 403;
    if (err?.status === 401 && !sensitiveError && onUnauthorized) onUnauthorized();
    setError(err.message || 'Something went wrong.');
  };

  const requireNote = () => {
    if (note.trim()) return true;
    setError('Please enter a note or reason before rejecting or requesting documents.');
    return false;
  };

  const load = useCallback(async (nextPage = page, nextStatus = status, nextQuery = query, key = sensitiveKey) => {
    if (!apiKey) return;
    setLoading(true);
    setError('');
    try {
      const response = await getAdminRiders(apiKey, key, { page: nextPage, status: nextStatus, q: nextQuery });
      setItems(response.data.items || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || nextPage);
      setPages(response.data.pages || 1);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, query, sensitiveKey, status]);

  useEffect(() => { load(1, '', ''); }, [apiKey]);

  const loadDetail = async (id, key = sensitiveKey) => {
    setBusy(true);
    setError('');
    setSelected(id);
    try {
      const [riderResponse, auditResponse] = await Promise.all([
        getAdminRider(apiKey, key, id),
        getAdminRiderAudit(apiKey, key, id),
      ]);
      setDetail(riderResponse.data);
      setAudit(auditResponse.data || []);
      if (key) {
        const documentsResponse = await getAdminRiderDocuments(apiKey, key, id);
        setDocuments(documentsResponse.data.documents || []);
      } else {
        setDocuments(riderResponse.data.documents || []);
      }
      setNote(riderResponse.data.additionalDocumentRequest?.message || '');
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
    setNote('');
  };

  const refreshDetail = async () => {
    if (!selected) return;
    await loadDetail(selected);
    await load();
  };

  const changeSensitiveKey = (value) => {
    setSensitiveKey(value);
    saveSensitiveKey(value);
  };

  const runAction = async (action) => {
    if (!selected || busy) return;
    setBusy(true);
    setError('');
    try {
      await action();
      await refreshDetail();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const openSettings = async () => {
    setError('');
    try {
      const response = await getAdminRiderSettings(apiKey);
      setSettings(response.data);
      setShowSettings(true);
    } catch (err) {
      handleError(err);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setBusy(true);
    try {
      const response = await updateAdminRiderSettings(apiKey, {
        allowedVehicleTypes: settings.allowedVehicleTypes,
        requireInsurance: settings.requireInsurance,
        requireAadhaar: settings.requireAadhaar,
      });
      setSettings(response.data);
      setShowSettings(false);
      setError('');
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="rounded-4xl bg-brand-dark p-6 text-white shadow-lift sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-yellow">Rider management</p>
            <h2 className="mt-2 text-3xl font-extrabold">Rider applications</h2>
            <p className="mt-2 text-white/65">{total} application{total === 1 ? '' : 's'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openSettings} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20">
              <Settings2 size={16} /> Requirements
            </button>
            <button type="button" onClick={() => load()} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl bg-white/10 p-4 md:grid-cols-[1fr,220px,auto]">
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Search</span>
            <span className="relative block">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load(1, status, query)}
                placeholder="Name, mobile, area or ID" className="w-full rounded-xl border-0 bg-white/15 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/45 focus:ring-2 focus:ring-brand-yellow" />
            </span>
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Status</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value); load(1, event.target.value, query); }}
              className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm font-bold text-brand-dark">
              <option value="">All statuses</option>
              {RIDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">
            <span className="mb-1.5 block text-white/70">Sensitive data key</span>
            <span className="relative block">
              <input type={showSensitive ? 'text' : 'password'} value={sensitiveKey} onChange={(event) => changeSensitiveKey(event.target.value)}
                placeholder="Optional — unlock private fields" className="w-full rounded-xl border-0 bg-white/15 py-2.5 pl-3 pr-10 text-sm text-white placeholder:text-white/45 focus:ring-2 focus:ring-brand-yellow" />
              <button type="button" onClick={() => setShowSensitive((value) => !value)} aria-label={showSensitive ? 'Hide sensitive key' : 'Show sensitive key'}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/70 hover:bg-white/10">
                {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
        </div>
        <button type="button" onClick={() => load(1, status, query)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-bold text-brand-dark">
          <Search size={15} /> Search applications
        </button>
        {!sensitiveKey && <p className="mt-3 flex items-center gap-2 text-xs text-white/55"><ShieldAlert size={15} /> Bank, identity and restricted documents are hidden until the sensitive key is entered.</p>}
      </div>

      {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

      {loading && items.length === 0 ? (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-brand-muted"><Loader2 className="animate-spin" /> Loading applications…</div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-12 text-center text-brand-muted shadow-soft">No rider applications found.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <button key={item.applicationId} type="button" onClick={() => loadDetail(item.applicationId)}
              className="flex w-full flex-col gap-4 rounded-3xl bg-white p-5 text-left shadow-soft ring-1 ring-black/5 transition hover:ring-brand-green/40 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-dark px-3 py-1 font-mono text-xs font-bold text-brand-yellow">{item.applicationId}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${riderStatusClass(item.applicationStatus)}`}>{item.applicationStatus}</span>
                  {item.active && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Active</span>}
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-brand-dark">{dash(item.personalInformation?.fullName)}</h3>
                <p className="mt-1 truncate text-sm text-brand-muted">
                  {dash(item.vehicleInformation?.vehicleType)} · {dash(item.address?.area)} · {formatDate(item.createdAt)}
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
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Rider requirements">
          <div className="w-full max-w-lg rounded-4xl bg-white p-6 shadow-lift sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-brand-dark">Rider requirements</h3>
                <p className="mt-1 text-sm text-brand-muted">Changes apply to new applications and the public form.</p>
              </div>
              <button type="button" onClick={() => setShowSettings(false)} aria-label="Close settings" className="grid h-10 w-10 place-items-center rounded-full bg-brand-light"><X size={18} /></button>
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <p className="field-label">Allowed vehicle types</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {RIDER_VEHICLE_TYPES.map((type) => (
                    <button key={type} type="button" onClick={() => setSettings((s) => ({
                      ...s,
                      allowedVehicleTypes: s.allowedVehicleTypes.includes(type)
                        ? s.allowedVehicleTypes.filter((item) => item !== type)
                        : [...s.allowedVehicleTypes, type],
                    }))}
                      className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${settings.allowedVehicleTypes.includes(type) ? 'bg-brand-green text-white ring-brand-green' : 'bg-white text-brand-dark ring-black/10'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {[
                ['requireInsurance', 'Require insurance proof'],
                ['requireAadhaar', 'Require Aadhaar proof'],
              ].map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-brand-light/70 p-4">
                  <input type="checkbox" checked={Boolean(settings[key])} onChange={(event) => setSettings((s) => ({ ...s, [key]: event.target.checked }))} className="h-5 w-5 accent-brand-green" />
                  <span className="text-sm font-bold text-brand-dark">{label}</span>
                </label>
              ))}
              <button type="button" onClick={saveSettings} disabled={busy || !settings.allowedVehicleTypes.length} className="btn w-full">
                {busy ? <Loader2 size={17} className="animate-spin" /> : <BadgeCheck size={17} />} Save requirements
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && detail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Rider application ${detail.applicationId}`}>
          <div className="mx-auto max-h-[calc(100vh-1.5rem)] max-w-4xl overflow-y-auto rounded-4xl bg-white p-5 shadow-lift sm:max-h-[calc(100vh-3rem)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-dark px-3 py-1 font-mono text-xs font-bold text-brand-yellow">{detail.applicationId}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${riderStatusClass(detail.applicationStatus)}`}>{detail.applicationStatus}</span>
                  {detail.riderId && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">ID: {detail.riderId}</span>}
                </div>
                <h3 className="mt-3 text-3xl font-extrabold text-brand-dark">{dash(detail.personalInformation?.fullName)}</h3>
                <p className="mt-1 text-sm text-brand-muted">Submitted {formatDate(detail.createdAt)}</p>
              </div>
              <button type="button" onClick={closeDetail} aria-label="Close rider details" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light transition hover:bg-red-50 hover:text-red-600"><X size={20} /></button>
            </div>

            {busy && <div className="mt-5 flex items-center gap-2 text-sm font-bold text-brand-muted"><Loader2 size={17} className="animate-spin" /> Updating…</div>}
            {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail label="Mobile">{dash(detail.contactInformation?.mobile)}</Detail>
              <Detail label="Email / WhatsApp">{dash(detail.contactInformation?.email)} / {dash(detail.contactInformation?.whatsapp)}</Detail>
              <Detail label="Address">{detail.address?.residentialAddress}, {detail.address?.area}, {detail.address?.city} - {detail.address?.pincode}</Detail>
              <Detail label="Emergency contact">{dash(detail.contactInformation?.emergencyContactName)} · {dash(detail.contactInformation?.emergencyContactNumber)}</Detail>
              <Detail label="Licence">{dash(detail.drivingInformation?.licenceNumber)} · {dash(detail.drivingInformation?.experience)}</Detail>
              <Detail label="Vehicle">{detail.vehicleInformation?.ownsVehicle ? `${dash(detail.vehicleInformation?.vehicleType)} · ${dash(detail.vehicleInformation?.registrationNumber)} · ${dash(detail.vehicleInformation?.brand)} ${dash(detail.vehicleInformation?.model)}` : 'Vehicle assistance requested'}</Detail>
              <Detail label="Work preference">{dash(detail.workPreferences?.preferredWorkingArea)} · {dash(detail.workPreferences?.workType)} · {(detail.workPreferences?.availabilityDays || []).join(', ') || 'No days selected'}</Detail>
              <Detail label="Identity consent">Aadhaar: {detail.identityVerification?.aadhaarConsent ? 'Yes' : 'No'} · PAN: {detail.identityVerification?.panConsent ? 'Yes' : 'No'}</Detail>
              {detail.sensitiveDataUnlocked && (
                <>
                  <Detail label="Aadhaar number">{dash(detail.identityVerification?.aadhaarNumber)}</Detail>
                  <Detail label="PAN number">{dash(detail.identityVerification?.panNumber)}</Detail>
                  <Detail label="Bank details">{dash(detail.paymentInformation?.accountHolderName)} · {dash(detail.paymentInformation?.bankName)} · {dash(detail.paymentInformation?.accountNumber)} · {dash(detail.paymentInformation?.ifscCode)}</Detail>
                  <Detail label="UPI ID">{dash(detail.paymentInformation?.upiId)}</Detail>
                </>
              )}
              {detail.additionalDocumentRequest?.message && <Detail label="Document request">{detail.additionalDocumentRequest.message} <span className="text-brand-muted">({formatDate(detail.additionalDocumentRequest.requestedAt)})</span></Detail>}
              {detail.rejectionReason && <Detail label="Rejection reason">{detail.rejectionReason}</Detail>}
            </div>

            {!detail.sensitiveDataUnlocked && (
              <p className="mt-5 flex items-center gap-2 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900"><KeyRound size={18} /> Enter the sensitive data key above to view bank, identity and restricted documents.</p>
            )}

            <div className="mt-6 rounded-3xl bg-brand-light/70 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <label className="block w-full min-w-0 text-sm font-bold text-brand-dark lg:max-w-md">
                  Note / reason
                  <textarea rows="3" value={note} onChange={(event) => { setNote(event.target.value); setError(''); }} placeholder="Required for rejection or document requests" className="field mt-1.5 min-h-[88px] resize-y" />
                </label>
                <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap [&>button]:w-full [&>button]:justify-center sm:[&>button]:w-auto">
                  <button type="button" disabled={busy} onClick={() => runAction(() => updateAdminRiderStatus(apiKey, sensitiveKey, detail.applicationId, { status: 'Under Review' }))} className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2.5 text-sm font-bold text-blue-900"><Eye size={16} /> Mark under review</button>
                  <button type="button" disabled={busy} onClick={() => runAction(() => updateAdminRiderStatus(apiKey, sensitiveKey, detail.applicationId, { status: 'Approved' }))} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-900"><UserCheck size={16} /> Approve</button>
                  <button type="button" disabled={busy} onClick={() => { if (requireNote()) runAction(() => requestAdminRiderDocuments(apiKey, sensitiveKey, detail.applicationId, note.trim())); }} className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2.5 text-sm font-bold text-violet-900"><FileText size={16} /> Request documents</button>
                  <button type="button" disabled={busy} onClick={() => { if (requireNote()) runAction(() => updateAdminRiderStatus(apiKey, sensitiveKey, detail.applicationId, { status: 'Rejected', reason: note.trim() })); }} className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2.5 text-sm font-bold text-red-900"><Ban size={16} /> Reject</button>
                  <button type="button" disabled={busy} onClick={() => runAction(() => updateAdminRiderStatus(apiKey, sensitiveKey, detail.applicationId, { status: 'Inactive' }))} className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800"><Ban size={16} /> Mark inactive</button>
                  <button type="button" disabled={busy || detail.applicationStatus !== 'Approved'} onClick={() => runAction(() => setAdminRiderActivation(apiKey, sensitiveKey, detail.applicationId, !detail.active))}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${detail.active ? 'bg-slate-800 text-white' : 'bg-brand-green text-white'} disabled:opacity-40`}>
                    <BadgeCheck size={16} /> {detail.active ? 'Deactivate rider' : 'Activate rider'}
                  </button>
                  <button type="button" disabled={busy} onClick={() => runAction(() => retryAdminRiderNotifications(apiKey, sensitiveKey, detail.applicationId))} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-brand-dark ring-1 ring-black/10"><RefreshCw size={16} /> Retry emails</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-brand-muted">Documents</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {documents.length === 0 ? <p className="text-sm text-brand-muted">No documents available.</p> : documents.map((doc) => (
                  <a key={doc.key} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-brand-light/70 p-4 transition hover:bg-brand-yellow/20">
                    <FileText size={19} className="shrink-0 text-brand-green" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-brand-dark">{doc.key}</span>
                      <span className="block truncate text-xs text-brand-muted">{doc.originalName} · {(doc.bytes / 1024).toFixed(0)} KB</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-brand-muted">Audit history</h4>
              <div className="mt-3 space-y-2">
                {audit.length === 0 ? <p className="text-sm text-brand-muted">No actions recorded yet.</p> : audit.map((entry) => (
                  <div key={entry._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-brand-light/70 px-4 py-3 text-sm">
                    <span className="font-bold text-brand-dark">{entry.action}</span>
                    <span className="text-xs text-brand-muted">{entry.actor} · {formatDate(entry.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
