import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { hasWebGL } from '../hooks/useEnvironment.js';
import { LogoMark } from './Logo.jsx';

const Hero3D = lazy(() => import('./Hero3D.jsx'));

/** Shown while the 3D chunk loads, and as the fallback when WebGL is unavailable. */
function StaticFallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-brand-yellow/40 blur-3xl" />
        <LogoMark className="h-40 w-40 animate-floaty drop-shadow-2xl sm:h-52 sm:w-52" />
      </div>
    </div>
  );
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticFallback /> : this.props.children;
  }
}

export default function HeroVisual() {
  const [ok, setOk] = useState(null);
  useEffect(() => setOk(hasWebGL()), []);

  if (ok === false) return <StaticFallback />;
  return (
    <Boundary>
      <Suspense fallback={<StaticFallback />}>{ok ? <Hero3D /> : <StaticFallback />}</Suspense>
    </Boundary>
  );
}
