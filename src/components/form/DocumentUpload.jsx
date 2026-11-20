import { useEffect, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { MAX_IMAGE_BYTES } from '../../utils/config.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function DocumentUpload({ id, label, hint, file, onChange, error, required = false, accept }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!file || file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = (candidate) => {
    setLocalError('');
    if (!candidate) return;
    if (!ALLOWED.includes(candidate.type) && !(candidate.name || '').toLowerCase().endsWith('.pdf')) {
      setLocalError('Please choose a JPG, PNG, WebP or PDF file.');
      return;
    }
    if (candidate.size > MAX_IMAGE_BYTES) {
      setLocalError('That file is larger than 5 MB. Please choose a smaller one.');
      return;
    }
    onChange(candidate);
  };

  const remove = () => {
    onChange(null);
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const shownError = localError || error;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-brand-dark">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        {hint && <span className="text-right text-xs text-brand-muted">{hint}</span>}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept || ALLOWED.join(',')}
        className="sr-only"
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />
      {file ? (
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5">
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-brand-light text-brand-green"><FileText size={24} /></span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-brand-dark">{file.name}</p>
            <p className="text-sm text-brand-muted">{(file.size / 1024).toFixed(0)} KB — ready to upload</p>
          </div>
          <button type="button" onClick={remove} aria-label={`Remove ${label}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-dark text-white transition hover:bg-red-600">
            <X size={17} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files?.[0]); }}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
            dragging ? 'border-brand-green bg-brand-green/5' : 'border-brand-yellow-deep/60 bg-white/70 hover:border-brand-green'
          }`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-yellow text-brand-dark"><UploadCloud size={21} /></span>
          <span className="text-sm font-bold text-brand-dark">Choose file or drag here</span>
          <span className="text-xs text-brand-muted">JPG, PNG, WebP or PDF · up to 5 MB</span>
        </label>
      )}
      {shownError && <p role="alert" className="mt-1.5 text-sm font-semibold text-red-600">{shownError}</p>}
    </div>
  );
}
