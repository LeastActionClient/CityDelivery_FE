import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { ApiError, getAdminRequests, updateAdminRequestStatus } from '../services/api.js';
import responsiveHeroBackground from '../assets/resposiveImage.png';

const STORAGE_KEY = 'city-delivery-admin-api-key';
const STATUSES = ['Pending', 'Reviewing', 'Contacted', 'Completed', 'Cancelled'];

function readKey() {
  try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
}

function saveKey(key) {
  try { sessionStorage.setItem(STORAGE_KEY, key); } catch { /* storage unavailable */ }
}

function clearKey() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function valueOrDash(value) {
  return value || 'Not provided';
}

function statusClass(status) {
  return {
    Pending: 'bg-amber-100 text-amber-900',
    Reviewing: 'bg-blue-100 text-blue-900',
    Contacted: 'bg-violet-100 text-violet-900',
    Completed: 'bg-emerald-100 text-emerald-900',
    Cancelled: 'bg-red-100 text-red-900',
  }[status] || 'bg-white/10 text-white';
}

function Login({ onLogin, error, busy }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-light px-5 py-12">
      <img src={responsiveHeroBackground} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-[1px]" aria-hidden="true" />
      <section className="relative z-10 w-full max-w-md rounded-4xl bg-white/95 p-7 shadow-lift ring-1 ring-black/5 sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-dark text-brand-yellow shadow-soft">
          <ShieldCheck size={32} />
        </div>
        <p className="mt-7 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-brand-green">Private area</p>
        <h1 className="mt-2 text-center text-3xl font-extrabold text-brand-dark">Admin login</h1>
        <p className="mt-3 text-center leading-relaxed text-brand-muted">Enter the admin Secret key to view submitted customer requests.</p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (key.trim()) onLogin(key.trim());
          }}
        >
          <label className="block text-sm font-bold text-brand-text" htmlFor="admin-api-key">Admin Secret key</label>
          <div className="relative">
            <input
              id="admin-api-key"
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(event) => setKey(event.target.value)}
              className="field pr-14"
              autoComplete="current-password"
              placeholder="Enter your admin key"
              required
            />
            <button
              type="button"
              onClick={() => setShowKey((visible) => !visible)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-light hover:text-brand-dark"
              aria-label={showKey ? 'Hide admin API key' : 'Show admin API key'}
            >
              {showKey ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {error && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={busy || !key.trim()} className="btn w-full">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {busy ? 'Checking…' : 'Sign in'}
          </button>
          <Link to="/" className="block text-center text-sm font-bold text-brand-green transition-colors hover:text-brand-green-hover">
            ← Back to website
          </Link>
        </form>
      </section>
    </main>
  );
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl bg-brand-light/70 p-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-muted">
        <Icon size={15} className="text-brand-green" /> {label}
      </div>
      <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-brand-text">{children}</div>
    </div>
  );
}

function RequestCard({ item, apiKey, onStatusChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const changeStatus = async (event) => {
    const nextStatus = event.target.value;
    setSaving(true);
    setError('');
    try {
      await updateAdminRequestStatus(apiKey, item.requestId, nextStatus);
      onStatusChange(item.requestId, nextStatus);
    } catch (err) {
      setError(err.message || 'Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <details className="group rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
      <summary className="flex cursor-pointer list-none flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-dark px-3 py-1 font-mono text-xs font-bold text-brand-yellow">{item.requestId}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span>
          </div>
          <h2 className="mt-3 truncate text-xl font-extrabold text-brand-dark">{valueOrDash(item.customerName)}</h2>
          <p className="mt-1 truncate text-sm text-brand-muted">{valueOrDash(item.productName)} · {formatDate(item.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <select
            value={item.status}
            onChange={changeStatus}
            onClick={(event) => event.stopPropagation()}
            className="rounded-xl border-0 bg-brand-light px-3 py-2 text-sm font-bold text-brand-dark ring-1 ring-black/10"
            aria-label={`Update status for ${item.requestId}`}
          >
            {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          {saving ? <Loader2 size={18} className="animate-spin text-brand-green" /> : <ChevronRight size={20} className="text-brand-muted transition-transform group-open:rotate-90" />}
        </div>
      </summary>

      <div className="border-t border-black/5 px-5 pb-6 pt-5 sm:px-6">
        {error && <p role="alert" className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <Detail icon={Mail} label="Email">{valueOrDash(item.email)}</Detail>
          <Detail icon={Phone} label="Mobile number">{valueOrDash(item.phone)}</Detail>
          <Detail icon={Package} label="Product">{valueOrDash(item.productName)}</Detail>
          <Detail icon={ClipboardList} label="Category">{valueOrDash(item.productCategory)}</Detail>
          <Detail icon={Store} label="Store name">{valueOrDash(item.storeName)}</Detail>
          <Detail icon={MapPin} label="Store location">{valueOrDash(item.storeLocation)}</Detail>
          <Detail icon={ClipboardList} label="Description">{valueOrDash(item.productDescription)}</Detail>
          <Detail icon={ClipboardList} label="Quantity">{valueOrDash(item.quantity)}</Detail>
          <Detail icon={MapPin} label="Delivery address">{valueOrDash(item.deliveryAddress)}</Detail>
          <Detail icon={MapPin} label="City / postal code">{valueOrDash(item.city)}{item.postalCode ? ` · ${item.postalCode}` : ''}</Detail>
          <Detail icon={ClipboardList} label="Estimated budget">{item.estimatedBudget != null ? `₹${Number(item.estimatedBudget).toLocaleString('en-IN')}` : 'Not provided'}</Detail>
          <Detail icon={CalendarDays} label="Submitted">{formatDate(item.createdAt)}</Detail>
          <div className="rounded-2xl bg-brand-light/70 p-4 md:col-span-2">
            <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-muted">Additional instructions</div>
            <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-brand-text">{valueOrDash(item.additionalInstructions)}</div>
          </div>
          {item.productImage?.url && (
            <div className="rounded-2xl bg-brand-light/70 p-4 md:col-span-2">
              <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-muted">Product image</div>
              <a href={item.productImage.url} target="_blank" rel="noopener noreferrer" className="mt-3 block w-fit">
                <img src={item.productImage.url} alt={`Product reference for ${item.requestId}`} className="max-h-64 max-w-full rounded-2xl object-contain ring-1 ring-black/10" />
              </a>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-brand-muted">
          <span className="rounded-full bg-brand-light px-3 py-1">Team notification: {item.ownerNotification?.status || '—'}</span>
          <span className="rounded-full bg-brand-light px-3 py-1">Customer email: {item.customerNotification?.status || (item.email ? '—' : 'not provided')}</span>
        </div>
      </div>
    </details>
  );
}

export default function Admin() {
  const [apiKey, setApiKey] = useState(readKey);
  const [loginError, setLoginError] = useState('');
  const [checking, setChecking] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = useCallback(async (key = apiKey, nextPage = page, nextStatus = status) => {
    if (!key) return false;
    setLoading(true);
    setError('');
    try {
      const response = await getAdminRequests(key, { page: nextPage, status: nextStatus });
      setItems(response.data.items || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || nextPage);
      setPages(response.data.pages || 1);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearKey();
        setApiKey('');
        setLoginError('That admin key was not accepted.');
      } else {
        setError(err.message || 'Could not load requests.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, status]);

  useEffect(() => {
    if (apiKey) loadRequests(apiKey, 1, '');
  }, []); // authenticate a stored session once on mount

  const login = async (key) => {
    setChecking(true);
    setLoginError('');
    saveKey(key);
    const ok = await loadRequests(key, 1, '');
    if (ok) setApiKey(key);
    else clearKey();
    setChecking(false);
  };

  const logout = () => {
    clearKey();
    setApiKey('');
    setItems([]);
  };

  if (!apiKey) return <Login onLogin={login} error={loginError} busy={checking} />;

  return (
    <main className="min-h-screen bg-brand-light px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 rounded-4xl bg-brand-dark p-6 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-yellow">City Delivery Services</p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Customer requests</h1>
            <p className="mt-2 text-white/65">{total} submitted request{total === 1 ? '' : 's'}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => loadRequests()} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2.5 text-sm font-bold text-brand-dark transition hover:bg-yellow-300">
              <LogOut size={16} /> Log out
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-dark"><ClipboardList size={18} className="text-brand-green" /> All submitted details</div>
          <label className="flex items-center gap-3 text-sm font-bold text-brand-dark">
            Filter status
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); loadRequests(apiKey, 1, event.target.value); }} className="rounded-xl border-0 bg-white px-3 py-2 font-semibold ring-1 ring-black/10">
              <option value="">All statuses</option>
              {STATUSES.map((itemStatus) => <option key={itemStatus} value={itemStatus}>{itemStatus}</option>)}
            </select>
          </label>
        </div>

        {error && <div role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{error}</div>}
        {loading && items.length === 0 ? (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-brand-muted"><Loader2 className="animate-spin" /> Loading requests…</div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-12 text-center text-brand-muted shadow-soft">No submitted requests found.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => <RequestCard key={item.requestId} item={item} apiKey={apiKey} onStatusChange={(id, nextStatus) => setItems((current) => current.map((entry) => entry.requestId === id ? { ...entry, status: nextStatus } : entry))} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-7 flex items-center justify-between rounded-3xl bg-white p-4 shadow-soft">
            <button type="button" disabled={page <= 1 || loading} onClick={() => loadRequests(apiKey, page - 1, status)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-brand-dark transition hover:bg-brand-light disabled:opacity-40"><ChevronLeft size={17} /> Previous</button>
            <span className="text-sm font-bold text-brand-muted">Page {page} of {pages}</span>
            <button type="button" disabled={page >= pages || loading} onClick={() => loadRequests(apiKey, page + 1, status)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-brand-dark transition hover:bg-brand-light disabled:opacity-40">Next <ChevronRight size={17} /></button>
          </div>
        )}
      </div>
    </main>
  );
}
