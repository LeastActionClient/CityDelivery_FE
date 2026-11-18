import { AlertCircle } from 'lucide-react';

/** Label + control wrapper with required marker, hint and inline error. */
export default function Field({ id, label, required, optional, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        {optional && <span className="ml-2 text-xs font-semibold text-brand-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-brand-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-red-600">
          <AlertCircle size={15} /> {error}
        </p>
      )}
    </div>
  );
}
