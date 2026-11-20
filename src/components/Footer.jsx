import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle, ArrowRight } from 'lucide-react';
import Button from './Button.jsx';
import { SITE, NAV_LINKS } from '../utils/config.js';
import logo2 from '../assets/Logo2.png';

const SOCIAL_ICONS = { Instagram, Facebook, X: Twitter, WhatsApp: MessageCircle };

export default function Footer() {
  const socials = Object.entries(SITE.social).filter(([, url]) => url);

  return (
    // Paste this <footer> as the return value of your Footer component.
// Needs: motion (framer-motion), Link (react-router-dom), Logo, SITE, NAV_LINKS,
// and lucide-react icons Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle, ArrowRight.
<footer
      className="ft relative overflow-hidden bg-[#16161A] text-white"
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      <style>{`
        .ft-spot{background:radial-gradient(420px circle at var(--mx,70%) var(--my,20%),rgba(255,201,40,.13),transparent 60%)}
        .ft-grid{background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:44px 44px;animation:ft-grid 10s linear infinite;-webkit-mask-image:linear-gradient(to bottom,#000,transparent 85%);mask-image:linear-gradient(to bottom,#000,transparent 85%)}
        .ft-orb{animation:ft-orb 10s ease-in-out infinite}
        .ft-topline{background:linear-gradient(90deg,transparent,#FFC928,#0F8A2F,#FFC928,transparent);background-size:200% 100%;animation:ft-slide 5s linear infinite}
        .ft-link{position:relative;display:inline-block;transition:transform .2s,color .2s}
        .ft-link::after{content:"";position:absolute;left:0;bottom:-3px;height:2px;width:100%;background:#FFC928;transform:scaleX(0);transform-origin:left;transition:transform .25s}
        .ft-link:hover{transform:translateX(6px);color:#FFC928}
        .ft-link:hover::after{transform:scaleX(1)}
        .ft-btn{transition:transform .15s,box-shadow .15s}
        .ft-btn:hover{transform:translateY(-3px)}
        .ft-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #B98600,0 6px 12px rgba(255,201,40,.25)!important}
        .ft-ico{animation:ft-float 5s ease-in-out infinite}
        .ft-soc{transition:transform .2s,background .2s,color .2s,box-shadow .2s;box-shadow:0 5px 0 rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.22)}
        .ft-soc:hover{transform:translateY(-5px) rotate(-6deg);background:#FFC928;color:#16161A;box-shadow:0 9px 0 #B98600,0 16px 22px rgba(255,201,40,.3),inset 0 2px 0 rgba(255,255,255,.55)}
        .ft-soc:active{transform:translateY(2px);box-shadow:0 2px 0 #B98600}
        .ft-contact{transition:transform .25s}
        .ft-contact:hover{transform:perspective(600px) rotateY(-8deg) translateX(6px)}
        @keyframes ft-grid{to{background-position:44px 44px}}
        @keyframes ft-orb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,30px) scale(1.15)}}
        @keyframes ft-slide{to{background-position:200% 0}}
        @keyframes ft-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(-5deg)}}
        @media (prefers-reduced-motion:reduce){.ft *,.ft *::after{animation:none!important;transition:none!important}}
      `}</style>

      {/* animated background */}
      <span className="ft-topline absolute inset-x-0 top-0 h-[3px]" aria-hidden="true" />
      <span className="ft-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="ft-spot pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="ft-orb pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#FFC928]/15 blur-3xl" aria-hidden="true" />
      <span className="ft-orb pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#0F8A2F]/25 blur-3xl" style={{ animationDelay: '-5s' }} aria-hidden="true" />

      <div className="container-x relative grid gap-12 py-16 md:grid-cols-12" style={{ perspective: '1200px' }}>
        {/* brand */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 14 }}
          style={{ transformPerspective: 1000 }}
          className="md:col-span-5"
        >
          <Link to="/" className="group inline-flex" aria-label="City Delivery Services — home">
            <img src={logo2} alt="City Delivery Services" className="h-28 w-auto max-w-full rounded-2xl object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-32" />
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-white/65">
            Tell us the product, the store and where it should go. We handle the request from there.
          </p>
          <Link
            to="/request"
            className="ft-btn mt-6 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-b from-[#FFE066] to-[#FFC928] px-7 py-3.5 font-bold text-[#16161A]"
            style={{ boxShadow: '0 6px 0 #B98600,0 16px 26px rgba(255,201,40,.3),inset 0 2px 0 rgba(255,255,255,.6)' }}
          >
            Request a Product <ArrowRight size={18} strokeWidth={2.6} />
          </Link>
        </motion.div>

        {/* explore */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.12 }}
          style={{ transformPerspective: 1000 }}
          className="md:col-span-3"
        >
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-[#FFC928]">Explore</h3>
          <span className="mt-2 block h-[3px] w-10 rounded-full bg-[#FFC928]" aria-hidden="true" />
          <ul className="mt-5 space-y-3 text-white/75">
            {[...NAV_LINKS.slice(1), { to: '/become-a-rider', label: 'Become a Rider' }, { to: '/request', label: 'Request a Product' }, { to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms and Conditions' }].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="ft-link">{l.label}</Link>
              </li>
            ))}
          </ul>
          <Link
            to="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-[#FFC928] hover:bg-[#FFC928] hover:text-[#16161A]"
          >
            Admin <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* contact */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.24 }}
          style={{ transformPerspective: 1000 }}
          className="md:col-span-4"
        >
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-[#FFC928]">Get in touch</h3>
          <span className="mt-2 block h-[3px] w-10 rounded-full bg-[#FFC928]" aria-hidden="true" />
          <ul className="mt-5 space-y-4 text-white/75">
            {SITE.email && (
              <li className="ft-contact flex items-center gap-3">
                <span className="ft-ico grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2c2c34] to-[#111115] text-[#FFC928]" style={{ boxShadow: '0 4px 0 #050507,inset 0 1px 0 rgba(255,255,255,.18)' }}><Mail size={18} /></span>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-[#FFC928]">{SITE.email}</a>
              </li>
            )}
            {SITE.phone && (
              <li className="ft-contact flex items-center gap-3">
                <span className="ft-ico grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2c2c34] to-[#111115] text-[#FFC928]" style={{ animationDelay: '-1.2s', boxShadow: '0 4px 0 #050507,inset 0 1px 0 rgba(255,255,255,.18)' }}><Phone size={18} /></span>
                <a href={`tel:${SITE.phone}`} className="transition-colors hover:text-[#FFC928]">{SITE.phone}</a>
              </li>
            )}
            {SITE.address && (
              <li className="ft-contact flex items-start gap-3">
                <span className="ft-ico grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#2c2c34] to-[#111115] text-[#FFC928]" style={{ animationDelay: '-2.4s', boxShadow: '0 4px 0 #050507,inset 0 1px 0 rgba(255,255,255,.18)' }}><MapPin size={18} /></span>
                <span className="pt-2">{SITE.address}</span>
              </li>
            )}
            {!SITE.email && !SITE.phone && !SITE.address && (
              <li><Link to="/contact" className="ft-link">Use our contact form →</Link></li>
            )}
          </ul>

          {(() => {
            const icons = { Instagram, Facebook, X: Twitter, WhatsApp: MessageCircle };
            const socials = Object.entries(SITE.social).filter(([, url]) => url);
            if (socials.length === 0) return null;
            return (
              <div className="mt-7 flex gap-4">
                {socials.map(([name, url]) => {
                  const Icon = icons[name];
                  return (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="ft-soc grid h-11 w-11 place-items-center rounded-full bg-white/10">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            );
          })()}

          <div className="mt-8 border-l-4 border-[#FFC928] pl-4">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#FFC928]">Founder &amp; Chairman</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-white">Saranya Gopinath</p>
          </div>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-5 py-6 text-sm text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <a href="https://www.doormartdelivery.in/assets/leastactionlogo-SbXcJl_q.png" target="_blank" rel="noopener noreferrer" aria-label="Least Action" className="transition-transform hover:-translate-y-1 hover:rotate-[-4deg]">
              <img
                src="https://www.doormartdelivery.in/assets/leastactionlogo-SbXcJl_q.png"
                alt="Least Action"
                className="h-10 w-10 rounded-lg object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
            <span>
              <span className="block">
                Powered by{' '}
                <a href="https://www.leastactioncompany.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white transition-colors hover:text-[#FFC928]">
                  Least Action Company
                </a>
                <span className="mx-1">·</span>
                <a href="https://www.sgfoundationtrust.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#FFC928]">
                  A unit of SG Foundation Trust
                </a>
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <span>© {new Date().getFullYear()} City Delivery Services. All rights reserved.</span>
            <span>Requests are reviewed by our team — availability and timing are confirmed with you directly.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
