import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useEnvironment.js';

const YELLOW = '#FFC928';
const YELLOW_DEEP = '#F5B800';
const GREEN = '#168447';
const DARK = '#111713';

/** The hero package: yellow parcel, green tape, white label — all primitives, no model files. */
function Parcel({ reduced }) {
  const group = useRef();
  const inner = useRef();

  useFrame((state, dt) => {
    if (!group.current) return;
    // Mouse / touch parallax (eased)
    const tx = reduced ? 0 : state.pointer.x * 0.5;
    const ty = reduced ? 0 : -state.pointer.y * 0.28;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, tx - 0.5, 3, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, ty + 0.18, 3, dt);
    if (inner.current && !reduced) inner.current.rotation.y += dt * 0.18; // slow idle spin
  });

  return (
    <group ref={group}>
      <Float speed={reduced ? 0 : 1.6} rotationIntensity={0.15} floatIntensity={reduced ? 0 : 0.9}>
        <group ref={inner}>
          <RoundedBox args={[2.3, 1.7, 1.7]} radius={0.14} smoothness={4}>
            <meshStandardMaterial color={YELLOW} roughness={0.38} metalness={0.05} />
          </RoundedBox>
          {/* tape — top strip + wrap */}
          <RoundedBox args={[0.42, 1.74, 1.74]} radius={0.04} smoothness={2}>
            <meshStandardMaterial color={GREEN} roughness={0.45} />
          </RoundedBox>
          {/* shipping label */}
          <mesh position={[0.62, -0.12, 0.865]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
          <mesh position={[0.62, -0.02, 0.868]}>
            <planeGeometry args={[0.6, 0.06]} />
            <meshStandardMaterial color={DARK} />
          </mesh>
          <mesh position={[0.5, -0.16, 0.868]}>
            <planeGeometry args={[0.38, 0.05]} />
            <meshStandardMaterial color={DARK} />
          </mesh>
          <mesh position={[0.5, -0.27, 0.868]}>
            <planeGeometry args={[0.46, 0.05]} />
            <meshStandardMaterial color={GREEN} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Orbiter({ position, children, speed = 1.4, intensity = 1.2, reduced }) {
  return (
    <Float speed={reduced ? 0 : speed} rotationIntensity={reduced ? 0 : 1.2} floatIntensity={reduced ? 0 : intensity} position={position}>
      {children}
    </Float>
  );
}

function Extras({ mobile, reduced }) {
  const sphereArgs = useMemo(() => [0.32, 32, 32], []);
  return (
    <>
      {/* apple */}
      <Orbiter position={[-2.2, 1.2, 0.4]} speed={1.8} reduced={reduced}>
        <mesh>
          <sphereGeometry args={sphereArgs} />
          <meshStandardMaterial color={GREEN} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
      </Orbiter>

      {/* orange */}
      <Orbiter position={[2.3, -1.15, 0.8]} speed={1.3} reduced={reduced}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FF9F1C" roughness={0.45} />
        </mesh>
      </Orbiter>

      {/* yellow ring */}
      <Orbiter position={[2.1, 1.5, -0.4]} speed={2} reduced={reduced}>
        <mesh rotation={[1.1, 0.4, 0]}>
          <torusGeometry args={[0.36, 0.11, 20, 48]} />
          <meshStandardMaterial color={YELLOW_DEEP} roughness={0.3} metalness={0.15} />
        </mesh>
      </Orbiter>

      {!mobile && (
        <>
          {/* faceted gem */}
          <Orbiter position={[-2.4, -1.1, -0.2]} speed={1.6} intensity={1.4} reduced={reduced}>
            <mesh>
              <icosahedronGeometry args={[0.36, 0]} />
              <meshStandardMaterial color={YELLOW} flatShading roughness={0.35} />
            </mesh>
          </Orbiter>

          {/* bottle */}
          <Orbiter position={[0.2, 1.85, -0.8]} speed={1.5} reduced={reduced}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.62, 24]} />
              <meshStandardMaterial color="#ffffff" roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.09, 0.12, 0.2, 16]} />
              <meshStandardMaterial color={GREEN} />
            </mesh>
          </Orbiter>

          {/* small cubes */}
          <Orbiter position={[-1.1, -1.7, 0.7]} speed={2.2} reduced={reduced}>
            <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.06}>
              <meshStandardMaterial color={GREEN} roughness={0.4} />
            </RoundedBox>
          </Orbiter>
        </>
      )}
    </>
  );
}

export default function Hero3D() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const wrap = useRef(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the hero scrolls out of view (saves battery / GPU).
  useEffect(() => {
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: mobile ? 46 : 40 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible && !reduced ? 'always' : 'demand'}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={['#fff7d6', '#6b7f5e', 0.7]} />
        <directionalLight position={[4, 5, 5]} intensity={2.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#FFE58A" />
        <Parcel reduced={reduced} />
        <Extras mobile={mobile} reduced={reduced} />
      </Canvas>
    </div>
  );
}
