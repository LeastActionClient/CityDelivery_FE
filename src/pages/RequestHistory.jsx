import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import SEO from '../components/SEO.jsx';
import Button from '../components/Button.jsx';
import { ApiError, getRequestStatuses } from '../services/api.js';
import { clearRequestHistory, forgetRequest, getRequestHistory } from '../utils/requestHistory.js';

const STATUS_STYLES = {
  Pending: {
    pill: 'bg-amber-50 text-amber-900 ring-amber-200',
    dot: 'bg-amber-500',
    bar: 'from-amber-300 via-yellow-300 to-amber-500',
  },
  Reviewing: {
    pill: 'bg-blue-50 text-blue-900 ring-blue-200',
    dot: 'bg-blue-500',
    bar: 'from-blue-300 via-sky-300 to-blue-500',
  },
  Contacted: {
    pill: 'bg-violet-50 text-violet-900 ring-violet-200',
    dot: 'bg-violet-500',
    bar: 'from-violet-300 via-fuchsia-300 to-violet-500',
  },
  Completed: {
    pill: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'from-emerald-300 via-green-300 to-emerald-500',
  },
  Cancelled: {
    pill: 'bg-red-50 text-red-900 ring-red-200',
    dot: 'bg-red-500',
    bar: 'from-red-300 via-rose-300 to-red-500',
  },
};

function statusStyle(status) {
  return STATUS_STYLES[status] || {
    pill: 'bg-brand-light text-brand-dark ring-black/10',
    dot: 'bg-brand-muted',
    bar: 'from-brand-yellow via-brand-yellow-soft to-brand-green',
  };
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function RequestHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);

  const refresh = useCallback(async () => {
    const stored = getRequestHistory().map((item) => ({ ...item, data: null, error: '', checking: true }));
    setItems(stored);
    setLoading(true);

    if (!stored.length) {
      setLoading(false);
      return;
    }

    try {
      const response = await getRequestStatuses(stored.map((item) => item.requestId));
      const byId = new Map((response.data?.items || []).map((item) => [item.requestId, item]));
      const missing = new Set(response.data?.missing || []);
      setItems(stored.map((item) => {
        const data = byId.get(item.requestId);
        return {
          ...item,
          data: data || null,
          error: data ? '' : (missing.has(item.requestId) ? 'Request not found.' : 'Status unavailable.'),
          checking: false,
        };
      }));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not check status.';
      setItems(stored.map((item) => ({ ...item, data: null, error: message, checking: false })));
    }

    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!removeTarget && !clearOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setRemoveTarget(null);
      setClearOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [removeTarget, clearOpen]);

  const remove = (requestId) => {
    forgetRequest(requestId);
    setItems((current) => current.filter((entry) => entry.requestId !== requestId));
  };

  const clear = () => {
    clearRequestHistory();
    setItems([]);
  };

  const activeCount = items.filter((item) => {
    const status = item.data?.status;
    return status && status !== 'Completed' && status !== 'Cancelled';
  }).length;
  const completedCount = items.filter((item) => item.data?.status === 'Completed').length;
  const syncingCount = items.filter((item) => item.checking).length;

  const stats = [
    { label: 'Saved requests', value: items.length, icon: ClipboardList, tone: 'bg-white/10 text-brand-yellow' },
    { label: 'In progress', value: activeCount, icon: Clock3, tone: 'bg-white/10 text-white' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, tone: 'bg-white/10 text-emerald-300' },
    { label: 'Live sync', value: syncingCount ? 'Syncing' : 'Ready', icon: Sparkles, tone: 'bg-white/10 text-brand-yellow-soft' },
  ];

  return (
    <>
      <SEO
        title="My Requests | City Delivery Services"
        description="View the delivery requests saved on this device and check their current status."
        path="/request/history"
        noindex
      />

      <section className="relative isolate overflow-hidden bg-brand-dark pb-28 pt-36 text-white sm:pt-44">
        <div aria-hidden="true" className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-green/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div aria-hidden="true" className="absolute left-1/2 top-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-yellow backdrop-blur">
              <Sparkles size={14} /> My requests
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your request history
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              A private, live tracking dashboard for requests saved on this device — no login, no noise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.tone}`}>
                    <Icon size={20} />
                  </div>
                  <div className="mt-4 text-2xl font-extrabold tracking-tight">{stat.value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <main className="relative z-10 -mt-12 bg-brand-light px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-lift ring-1 ring-black/5">
            <div className="flex items-center gap-3 mt-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-yellow text-brand-dark">
                <Clock3 size={22} />
              </span>
              <div>
                <p className="font-extrabold text-brand-dark">Live tracking dashboard</p>
                <p className="text-sm text-brand-muted">Statuses refresh automatically from your saved Request IDs.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="btn inline-flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}
                {loading ? 'Refreshing…' : 'Refresh status'}
              </button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setClearOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 transition hover:bg-red-50"
                >
                  <Trash2 size={16} /> Clear
                </button>
              )}
            </div>
          </div>

          {items.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-4xl bg-white p-8 text-center shadow-soft ring-1 ring-black/5 sm:p-14"
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-yellow via-brand-yellow-soft to-brand-green" />
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-yellow to-brand-yellow-soft text-brand-dark shadow-glow">
                <ClipboardList size={36} />
              </span>
              <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-brand-dark">No saved requests yet</h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-brand-muted">
                Once you submit a request, it appears here with a live status. It stays private to this device.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button to="/request">Submit a request</Button>
                <Button to="/request/status" variant="outline">Check with Request ID</Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-5">
            {items.map((item, index) => {
              const style = statusStyle(item.data?.status);
              const label = item.checking ? 'Checking…' : item.data?.status || 'Unavailable';
              return (
                <motion.article
                  key={item.requestId}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  className="group relative overflow-hidden rounded-4xl bg-white shadow-soft ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div aria-hidden="true" className={`h-1.5 bg-gradient-to-r ${style.bar}`} />
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-muted">Request ID</div>
                        <div className="mt-2 break-all font-mono text-xl font-extrabold tracking-tight text-brand-dark sm:text-2xl">
                          {item.requestId}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ring-1 ${style.pill}`}>
                        <span className={`h-2 w-2 rounded-full ${style.dot} ${item.checking ? 'animate-pulse' : ''}`} />
                        {label}
                      </span>
                    </div>

                    {item.data?.nextSteps && (
                      <div className="mt-6 flex gap-3 rounded-3xl bg-brand-yellow-soft/40 p-4 ring-1 ring-brand-yellow/40">
                        <Sparkles size={18} className="mt-0.5 shrink-0 text-brand-green" />
                        <p className="leading-relaxed text-brand-dark">{item.data.nextSteps}</p>
                      </div>
                    )}
                    {item.error && (
                      <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 ring-1 ring-red-100">
                        {item.error}
                      </p>
                    )}

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-brand-light/80 p-4 ring-1 ring-black/5">
                        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-brand-muted">
                          <Clock3 size={14} /> Submitted
                        </div>
                        <div className="mt-2 font-bold text-brand-dark">{formatDate(item.data?.createdAt)}</div>
                      </div>
                      <div className="rounded-2xl bg-brand-light/80 p-4 ring-1 ring-black/5">
                        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-brand-muted">
                          <RefreshCw size={14} /> Last updated
                        </div>
                        <div className="mt-2 font-bold text-brand-dark">{formatDate(item.data?.updatedAt)}</div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-5">
                      <p className="text-xs font-semibold text-brand-muted">Live status · saved on this device</p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/request/status?requestId=${encodeURIComponent(item.requestId)}`}
                          className="btn inline-flex items-center gap-2"
                        >
                          View status <ArrowUpRight size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setRemoveTarget(item.requestId)}
                          aria-label={`Remove ${item.requestId} from this device`}
                          title="Remove from this device"
                          className="inline-flex h-11 items-center gap-2 rounded-full bg-red-50 px-4 text-sm font-bold text-red-700 ring-1 ring-red-100 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="relative mt-7 overflow-hidden rounded-4xl bg-brand-dark p-7 text-white shadow-lift sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-green/30 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand-yellow backdrop-blur">
                  <LockKeyhole size={22} />
                </span>
                <div>
                  <p className="font-extrabold">Private to this device</p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                    This list is stored only in this browser. It is not an account and will not appear on another device. Clearing browser data removes it. Statuses are fetched live using the saved Request IDs.
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white/80 backdrop-blur">
                No login
              </span>
            </div>
          </div>
        </div>
      </main>

      {removeTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-dark/60 px-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setRemoveTarget(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-request-title"
            aria-describedby="remove-request-description"
            className="w-full max-w-md rounded-4xl bg-white p-7 shadow-lift ring-1 ring-black/5 sm:p-8"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
              <AlertTriangle size={26} />
            </span>
            <h2 id="remove-request-title" className="mt-6 text-2xl font-extrabold tracking-tight text-brand-dark">
              Remove this request?
            </h2>
            <p id="remove-request-description" className="mt-3 leading-relaxed text-brand-muted">
              This removes the saved shortcut for{' '}
              <span className="font-mono font-bold text-brand-dark">{removeTarget}</span> from this device. The original request and its live status are not deleted.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setRemoveTarget(null)}
                className="btn-outline inline-flex items-center justify-center p-4 rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  remove(removeTarget);
                  setRemoveTarget(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                <Trash2 size={16} /> Remove request
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {clearOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-dark/60 px-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setClearOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-requests-title"
            aria-describedby="clear-requests-description"
            className="w-full max-w-md rounded-4xl bg-white p-7 shadow-lift ring-1 ring-black/5 sm:p-8"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
              <AlertTriangle size={26} />
            </span>
            <h2 id="clear-requests-title" className="mt-6 text-2xl font-extrabold tracking-tight text-brand-dark">
              Clear all saved requests?
            </h2>
            <p id="clear-requests-description" className="mt-3 leading-relaxed text-brand-muted">
              This removes all <span className="font-bold text-brand-dark">{items.length}</span> saved Request IDs from this browser. Your original requests and their live statuses are not deleted.
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setClearOpen(false)}
                className="btn-outline inline-flex items-center justify-center rounded-full p-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clear();
                  setClearOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                <Trash2 size={16} /> Clear history
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
