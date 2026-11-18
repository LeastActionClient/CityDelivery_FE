import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '../../utils/config.js';

/** Drag-and-drop / click image picker with local preview. File is only uploaded when the form is submitted. */
export default function ImageUpload({ id, file, onChange, error }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // no memory leak
  }, [file]);

  const accept = (f) => {
    setLocalError('');
    if (!f) return;
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
      setLocalError('Please choose a JPG, PNG or WebP image.');
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setLocalError('That image is larger than 5 MB. Please choose a smaller one.');
      return;
    }
    onChange(f);
  };

  const remove = () => {
    onChange(null);
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const shownError = localError || error;

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="relative flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-black/5">
            <img src={preview} alt="Selected product preview" className="h-24 w-24 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{file.name}</p>
              <p className="text-sm text-brand-muted">{(file.size / 1024).toFixed(0)} KB — ready to upload</p>
            </div>
            <button type="button" onClick={remove} aria-label="Remove image"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-dark text-white transition hover:bg-red-600">
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="drop"
            htmlFor={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files?.[0]); }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
              dragging ? 'border-brand-green bg-brand-green/5' : 'border-brand-yellow-deep/60 bg-white/70 hover:border-brand-green'
            }`}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-yellow text-brand-dark"><ImagePlus size={22} /></span>
            <span className="font-bold">Tap to upload or drag a photo here</span>
            <span className="text-xs text-brand-muted">JPG, PNG or WebP · up to 5 MB</span>
          </motion.label>
        )}
      </AnimatePresence>
      {shownError && <p role="alert" className="mt-1.5 text-sm font-semibold text-red-600">{shownError}</p>}
    </div>
  );
}
