'use client';

/**
 * CyberExperience — Full-page 3D Scroll Experience
 *
 * Architecture:
 *  • Canvas fills 100vw × 100vh as fixed background
 *  • drei ScrollControls (pages=3) hijacks scroll → drei handles it
 *  • CyberCore: pure geometry (icosahedron + 3 torus rings + satellites)
 *    — reacts to scroll offset via useScroll + useFrame (no GLTF, no CDN)
 *  • HTML pages rendered via <Scroll html> float above the canvas
 *  • HTML animations driven by a module-level motionValue (sp) that is
 *    updated inside useFrame (Canvas context → shared to HTML context)
 */

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Stars, Float } from '@react-three/drei';
import { motion, motionValue, useTransform } from 'framer-motion';
import * as THREE from 'three';
import {
  ArrowRight,
  Phone,
  Globe,
  Shield,
  Zap,
  ChevronDown,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';

// ─── Shared scroll bridge ─────────────────────────────────────────────────────
// motionValue lives at module scope so both Canvas components (which call
// sp.set() via useFrame) and HTML components (which read via useTransform)
// can access it without props drilling or context.
const sp = motionValue(0);

// ─── 3D: HolographicCar ──────────────────────────────────────────────────────

function HolographicCar() {
  const group  = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((_state, delta) => {
    if (!group.current) return;
    const offset = scroll.offset; // 0 → 1 across 3 pages

    // Keep HTML animation bridge in sync
    sp.set(offset);

    // Base slow Y rotation — cinematic showroom feel
    group.current.rotation.y += delta * 0.2;

    // Scroll-driven fly-by: car starts right of centre, flies past camera
    group.current.position.z = offset * 10;       // z -2 → 8
    group.current.position.x = 2 + offset * -5;   // x 2 → -3 (left sweep)
    group.current.rotation.z = offset * Math.PI;  // rolls flat as it flies past
  });

  return (
    <group ref={group} position={[2, 0, -2]} scale={1.5}>
      {/*
        Float from drei gives the whole car a subtle anti-gravity hover.
        floatIntensity / speed are numbers, NOT strings — fixed from user request.
      */}
      <Float floatIntensity={2} speed={2} rotationIntensity={0.15}>

        {/* ── Main body ── */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.2, 0.4, 4.5]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.4} />
        </mesh>

        {/* ── Cabin / roofline ── */}
        <mesh position={[0, 0.95, -0.4]}>
          <boxGeometry args={[1.4, 0.4, 2]} />
          <meshBasicMaterial color="#0055FF" wireframe transparent opacity={0.6} />
        </mesh>

        {/* ── Front spoiler ── */}
        <mesh position={[0, 0.28, 2.35]}>
          <boxGeometry args={[2.0, 0.08, 0.3]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.7} />
        </mesh>

        {/* ── Rear diffuser ── */}
        <mesh position={[0, 0.28, -2.35]}>
          <boxGeometry args={[2.0, 0.1, 0.22]} />
          <meshBasicMaterial color="#0055FF" wireframe transparent opacity={0.65} />
        </mesh>

        {/* ── 4 wheels — flatMap avoids nested array JSX issue ── */}
        {([-1.2, 1.2] as number[]).flatMap((x) =>
          ([-1.5, 1.3] as number[]).map((z) => (
            <mesh
              key={`wheel-${x}-${z}`}
              position={[x, 0.2, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.45, 0.45, 0.22, 24]} />
              <meshBasicMaterial color="#00E5FF" wireframe />
            </mesh>
          ))
        )}

        {/* ── Wheel arches (torus over each wheel) ── */}
        {([-1.2, 1.2] as number[]).flatMap((x) =>
          ([-1.5, 1.3] as number[]).map((z) => (
            <mesh
              key={`arch-${x}-${z}`}
              position={[x, 0.2, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <torusGeometry args={[0.47, 0.04, 8, 28]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
            </mesh>
          ))
        )}

        {/* ── Headlights (front) ── */}
        <mesh position={[-0.6, 0.6, 2.28]}>
          <boxGeometry args={[0.38, 0.1, 0.04]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.95} />
        </mesh>
        <mesh position={[0.6, 0.6, 2.28]}>
          <boxGeometry args={[0.38, 0.1, 0.04]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.95} />
        </mesh>

        {/* ── Taillights (rear) ── */}
        <mesh position={[-0.6, 0.6, -2.28]}>
          <boxGeometry args={[0.38, 0.1, 0.04]} />
          <meshBasicMaterial color="#FF2244" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0.6, 0.6, -2.28]}>
          <boxGeometry args={[0.38, 0.1, 0.04]} />
          <meshBasicMaterial color="#FF2244" transparent opacity={0.9} />
        </mesh>

        {/* ── Neon underglow — cyan point light beneath chassis ── */}
        <pointLight color="#00E5FF" intensity={18} distance={4} position={[0, -0.15, 0]} />

        {/* ── Accent lighting ── */}
        <pointLight color="#0055FF" intensity={10} distance={6} position={[0, 2, -1]} />
      </Float>
    </group>
  );
}

// ─── 3D: Scene root ───────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 16, 42]} />
      <ambientLight intensity={0.25} />

      {/* Starfield — 5 000 stars for deep-space atmosphere */}
      <Suspense fallback={null}>
        <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>

      <HolographicCar />
    </>
  );
}

// ─── HTML Page 1: HERO ───────────────────────────────────────────────────────


function HeroPage() {
  // Content fades and rises as user scrolls past page 1
  const opacity = useTransform(sp, [0, 0.27], [1, 0]);
  const y       = useTransform(sp, [0, 0.27], [0, -55]);

  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '0 8vw',
        paddingTop: 80,
      }}
    >
      {/* Left readability gradient — blends text against the 3D scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg,rgba(5,8,16,0.96) 0%,rgba(5,8,16,0.82) 35%,rgba(5,8,16,0.3) 60%,transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{ opacity, y, position: 'relative', zIndex: 1, maxWidth: 640 }}
      >
        {/* Eyebrow */}
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#00E5FF',
              border: '1px solid rgba(0,229,255,0.28)',
              background: 'rgba(0,229,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00E5FF',
                boxShadow: '0 0 8px #00E5FF',
                animation: 'pulse 2s infinite',
              }}
            />
            БУДУЩЕЕ ВОЖДЕНИЯ
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.6rem, 5.8vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            marginBottom: 28,
            color: '#ffffff',
          }}
        >
          Ваш персональный
          <br />
          эксперт в мире
          <br />
          <span
            style={{
              background: 'linear-gradient(118deg,#00E5FF 0%,#0088FF 50%,#00CFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(0,229,255,0.45))',
            }}
          >
            автомобилей
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 40,
            maxWidth: 460,
          }}
        >
          Доставка и аренда эксклюзивных автомобилей из{' '}
          <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            Америки, Европы, Китая
          </span>{' '}
          и{' '}
          <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            Кореи
          </span>
          .
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 52 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 30px',
              borderRadius: 12,
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#050810',
              background: 'linear-gradient(135deg,#00E5FF 0%,#0099CC 100%)',
              border: 'none',
              cursor: 'pointer',
              boxShadow:
                '0 0 40px rgba(0,229,255,0.38),0 8px 24px rgba(0,229,255,0.18),inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            Выбрать автомобиль
            <ArrowRight size={16} />
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 30px',
              borderRadius: 12,
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Phone size={15} style={{ color: '#00E5FF' }} />
            Консультация
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 36,
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {[
            { val: '500+', lbl: 'Клиентов' },
            { val: '4',    lbl: 'Страны' },
            { val: '5.0★', lbl: 'Рейтинг' },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg,#00E5FF,#0077FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  marginTop: 4,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.08em',
                }}
              >
                {lbl}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Скролл
          </span>
          <ChevronDown size={16} style={{ color: 'rgba(0,229,255,0.4)' }} />
        </div>
      </motion.div>
    </section>
  );
}

// ─── HTML Page 2: SERVICES ────────────────────────────────────────────────────

const SERVICES = [
  { icon: Globe,  title: 'США и Европа', desc: 'Официальные дилеры, сертифицированные авто' },
  { icon: MapPin, title: 'Китай и Корея', desc: 'Новые модели, недоступные в России' },
  { icon: Shield, title: 'Гарантия',      desc: 'Юридическая поддержка и полная безопасность' },
  { icon: Clock,  title: 'Быстро',        desc: 'Доставка от 30 дней под ключ' },
];

function ServicesPage() {
  const opacity = useTransform(sp, [0.27, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const y       = useTransform(sp, [0.27, 0.38], [70, 0]);

  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '0 8vw',
      }}
    >
      {/* Dark overlay so cards are readable over the massive 3D core */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,8,16,0.72)',
          backdropFilter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ opacity, y, position: 'relative', zIndex: 1, width: '100%', maxWidth: 900 }}>
        {/* Section label */}
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: '#00E5FF',
            marginBottom: 18,
            textTransform: 'uppercase',
          }}
        >
          ── НАШИ УСЛУГИ
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            color: '#ffffff',
            marginBottom: 52,
          }}
        >
          Доставка из{' '}
          <span
            style={{
              background: 'linear-gradient(118deg,#00E5FF,#0055FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Европы и Китая
          </span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 20,
          }}
        >
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                padding: '24px 22px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,229,255,0.12)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(0,229,255,0.1)',
                  border: '1px solid rgba(0,229,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={18} style={{ color: '#00E5FF' }} />
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                {title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── HTML Page 3: FLEET ───────────────────────────────────────────────────────

const FLEET = [
  {
    src:   '/car-audi.jpg',
    name:  'Audi Q7',
    badge: 'ТОПОВЫЙ',
    origin:'США / Европа',
    price: 'от $42 000',
    color: '#00E5FF',
  },
  {
    src:   '/car-tesla.jpg',
    name:  'Tesla Model 3',
    badge: 'ЭЛЕКТРО',
    origin:'США',
    price: 'от $38 000',
    color: '#8000FF',
  },
  {
    src:   '/car-jeep.jpg',
    name:  'Jeep Wrangler',
    badge: 'OFFROAD',
    origin:'США',
    price: 'от $35 000',
    color: '#FF8C00',
  },
];

function FleetPage() {
  const opacity = useTransform(sp, [0.65, 0.78], [0, 1]);
  const y       = useTransform(sp, [0.65, 0.78], [80, 0]);

  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '0 8vw',
      }}
    >
      {/* Full dark overlay — cars need clean backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,8,16,0.82)',
          backdropFilter: 'blur(3px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div style={{ opacity, y, position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: '#00E5FF',
            marginBottom: 18,
            textTransform: 'uppercase',
          }}
        >
          ── НАШИ АВТОМОБИЛИ
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: 44,
          }}
        >
          Эксклюзивный{' '}
          <span
            style={{
              background: 'linear-gradient(118deg,#00E5FF,#0055FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Автопарк
          </span>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 22,
          }}
        >
          {FLEET.map(({ src, name, badge, origin, price, color }) => (
            <div
              key={name}
              style={{
                borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${color}28`,
                backdropFilter: 'blur(16px)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Car image */}
              <div style={{ position: 'relative', height: 175, overflow: 'hidden', background: '#0a0f1e' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: `brightness(0.92) contrast(1.06) drop-shadow(0 4px 20px ${color}33)`,
                    transition: 'transform 0.4s ease',
                  }}
                />
                {/* Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    padding: '4px 10px',
                    borderRadius: 99,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color,
                    background: `${color}1a`,
                    border: `1px solid ${color}44`,
                  }}
                >
                  {badge}
                </div>
              </div>

              {/* Card content */}
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>
                      {origin}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color,
                      filter: `drop-shadow(0 0 8px ${color}66)`,
                    }}
                  >
                    {price}
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color,
                    background: `${color}10`,
                    border: `1px solid ${color}30`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Подробнее <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer inside experience */}
        <div
          style={{
            marginTop: 50,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            Tsvetkov <span style={{ color: '#00E5FF' }}>Cars</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} — Ваш персональный эксперт
          </span>
        </div>
      </motion.div>
    </section>
  );
}

// ─── HUD Navbar (fixed overlay, outside Canvas) ───────────────────────────────

function HUDNav() {
  const navBg = useTransform(sp, [0, 0.08], ['rgba(5,8,16,0)', 'rgba(5,8,16,0.85)']);
  const navBorder = useTransform(
    sp,
    [0, 0.08],
    ['rgba(255,255,255,0)', 'rgba(0,229,255,0.12)'],
  );

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backgroundColor: navBg,
        borderBottom: '1px solid',
        borderColor: navBorder,
        backdropFilter: 'blur(16px)',
        padding: '0 5vw',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Zap size={18} style={{ color: '#00E5FF' }} />
        <span style={{ fontWeight: 900, color: '#fff', letterSpacing: '0.04em' }}>
          TSVETKOV <span style={{ color: '#00E5FF' }}>CARS</span>
        </span>
      </div>

      {/* Nav links */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {['Автомобили', 'Услуги', 'О нас', 'Контакты'].map((l) => (
          <a
            key={l}
            href="#"
            style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#00E5FF')}
            onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)')}
          >
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        style={{
          padding: '9px 20px',
          borderRadius: 10,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#050810',
          background: 'linear-gradient(135deg,#00E5FF,#0099CC)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(0,229,255,0.3)',
        }}
      >
        Связаться
      </button>
    </motion.nav>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function CyberExperience() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Fixed HUD nav — sits above the Canvas */}
      <HUDNav />

      {/* Full-viewport Canvas */}
      <Canvas
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        shadows={false}
      >
        {/*
          ScrollControls:
          • pages={3}   → 300vh total scroll depth
          • damping={0.1} → smooth, cinematic scroll with inertia
          • Children NOT wrapped in <Scroll> render as fixed 3D objects
          • Children in <Scroll html> scroll as HTML overlay
        */}
        <ScrollControls pages={3} damping={0.1}>
          <Scene />

          {/* HTML overlay — all 3 pages of content */}
          <Scroll html style={{ width: '100%' }}>
            <HeroPage />
            <ServicesPage />
            <FleetPage />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
