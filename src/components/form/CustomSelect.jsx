import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

/** Accessible custom listbox dropdown (keyboard: arrows, Enter/Space, Esc, Home/End, type-ahead-free). */
export default function CustomSelect({ id, value, onChange, options, placeholder = 'Select…', invalid, onBlur }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [open, onBlur]);

  const openList = () => {
    setActive(Math.max(options.indexOf(value), 0));
    setOpen(true);
  };

  const choose = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => Math.min(a + 1, options.length - 1)); break;
      case 'ArrowUp': e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(options.length - 1); break;
      case 'Enter':
      case ' ': e.preventDefault(); if (active >= 0) choose(options[active]); break;
      case 'Escape': e.preventDefault(); setOpen(false); break;
      case 'Tab': setOpen(false); break;
      default:
    }
  };

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`field flex min-h-[52px] items-center justify-between text-left ${invalid ? 'field-error' : ''}`}
      >
        <span className={value ? '' : 'text-brand-muted/70'}>{value || placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 text-brand-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-black/5"
          >
            {options.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(opt)}
                className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl px-3.5 text-[15px] font-semibold ${
                  i === active ? 'bg-brand-yellow/40' : ''
                } ${opt === value ? 'text-brand-green' : 'text-brand-text'}`}
              >
                {opt}
                {opt === value && <Check size={16} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
