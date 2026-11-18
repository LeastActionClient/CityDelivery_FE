import { Reveal } from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, description, align = 'center', dark = false }) {
  const alignCls = align === 'center' ? 'mx-auto text-center' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={`mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl ${dark ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-brand-muted'}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
