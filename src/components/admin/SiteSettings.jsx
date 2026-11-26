import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, MapPin, Plus, Save, X } from 'lucide-react';
import {
  ApiError,
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from '../../services/api.js';

const MAX_LENGTH = 200;

function parseCities(value) {
  return String(value || '')
    .split(',')
    .map((city) => city.trim())
    .filter(Boolean)
    .reduce((acc, city) => {
      if (!acc.some((existing) => existing.toLowerCase() === city.toLowerCase())) {
        acc.push(city);
      }
      return acc;
    }, []);
}

function serializeCities(cities) {
  return cities.join(', ');
}

export default function SiteSettings({ apiKey, onUnauthorized }) {
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminSiteSettings(apiKey);
      setCities(parseCities(response.data?.serviceCity));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(err.message || 'Could not load site settings.');
    } finally {
      setLoading(false);
    }
  }, [apiKey, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const addCity = () => {
    const incoming = parseCities(cityInput);
    if (!incoming.length) {
      setError('Enter a city first.');
      return;
    }
    const nextCities = [...cities];
    incoming.forEach((city) => {
      if (!nextCities.some((existing) => existing.toLowerCase() === city.toLowerCase())) {
        nextCities.push(city);
      }
    });
    const nextValue = serializeCities(nextCities);
    if (nextValue.length > MAX_LENGTH) {
      setError(`Up to ${MAX_LENGTH} characters are allowed. Remove a city and try again.`);
      return;
    }
    setCities(nextCities);
    setCityInput('');
    setError('');
    setSaved(false);
  };

  const removeCity = (city) => {
    setCities((current) => current.filter((item) => item !== city));
    setSaved(false);
    setError('');
  };

  const save = async (event) => {
    event.preventDefault();
    const nextValue = serializeCities(cities);
    if (!nextValue) {
      setError('Please add at least one city where we serve.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateAdminSiteSettings(apiKey, nextValue);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onUnauthorized();
        return;
      }
      setError(err.message || 'Could not update site settings.');
    } finally {
      setSaving(false);
    }
  };

  const preview = serializeCities(cities);

  return (
    <section className="mt-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold text-brand-dark">
            <MapPin size={20} className="text-brand-green" /> Footer service cities
          </div>
          <p className="mt-1 max-w-2xl text-sm font-medium text-brand-muted">
            Add each city separately. These cities appear beside “City where we serve” in the website and app footer.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 self-start rounded-full bg-brand-light px-4 py-2 text-sm font-bold text-brand-dark transition hover:bg-slate-100 disabled:opacity-50"
        >
          <Loader2 size={15} className={loading ? 'animate-spin' : ''} /> Reload
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {saved && (
        <div role="status" className="mt-6 flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> Footer service cities updated.
        </div>
      )}

      <form onSubmit={save} className="mt-6 max-w-2xl">
        <label htmlFor="cityInput" className="text-sm font-bold text-brand-dark">
          Add a city
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="cityInput"
            type="text"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addCity();
              }
            }}
            placeholder="Example: Vellore or Vellore, Chennai"
            disabled={loading || saving}
            className="w-full rounded-2xl border-0 bg-brand-light px-4 py-3 text-sm font-semibold text-brand-dark outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-brand-green disabled:opacity-60"
          />
          <button
            type="button"
            onClick={addCity}
            disabled={loading || saving || !cityInput.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            <Plus size={16} /> Add city
          </button>
        </div>

        <div className="mt-5">
          <div className="text-sm font-bold text-brand-dark">Cities in the footer</div>
          {cities.length === 0 ? (
            <div className="mt-2 rounded-2xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-muted">
              No cities added yet.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {cities.map((city) => (
                <span key={city} className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-3 py-2 text-sm font-bold text-brand-yellow">
                  {city}
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    disabled={loading || saving}
                    aria-label={`Remove ${city}`}
                    className="rounded-full p-0.5 transition hover:bg-white/15 disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-muted">
          <span className="font-bold text-brand-dark">Footer preview:</span> {preview || '—'}
        </div>
        <div className="mt-2 text-right text-xs font-medium text-brand-muted">
          {preview.length}/{MAX_LENGTH}
        </div>

        <button
          type="submit"
          disabled={loading || saving || cities.length === 0}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-brand-yellow transition hover:bg-black disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}
