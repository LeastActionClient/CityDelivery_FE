import { Link } from 'react-router-dom';
import logoAsset from '../assets/Logo.png';

export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="18" fill="#111713" />
      <path d="M32 12 14 22v20l18 10 18-10V22z" fill="#FFC928" />
      <path d="M32 12v40M14 22l18 10 18-10" stroke="#168447" strokeWidth="4" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="City Delivery Services — home">
      <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <img src={logoAsset} alt="" className="h-20 w-[120px] rounded-full object-contain sm:h-20 sm:w-[120px]" />
      </span>
      {/* <span className={`font-display text-[17px] font-extrabold leading-[1.05] tracking-tight ${light ? 'text-white' : 'text-brand-dark'}`}>
        City Delivery
        <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green">
          <span className={light ? 'text-brand-yellow' : ''}>Services</span>
        </span>
      </span> */}
    </Link>
  );
}
