'use client';

/**
 * LuxuryPage — Minimalist Luxury Automotive (Light Mode)
 * Aesthetic reference: Apple / Porsche / Tesla website
 *
 * • Zero WebGL, zero Three.js, zero neon
 * • Framer Motion scroll-driven hero (sticky + scale + fade)
 * • Pure white / zinc-50 background, near-black typography
 * • Premium editorial layout throughout
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Globe,
  Shield,
  Clock,
  ChevronDown,
  Zap,
} from 'lucide-react';
import HeroSection from './HeroSection';


// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:       '#ffffff',
  surface:  '#f9fafb',
  border:   '#e4e4e7',
  primary:  '#0a0a0a',
  secondary:'#71717a',
  muted:    '#a1a1aa',
  ink:      '#18181b',
} as const;

const fade = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

function LuxuryNav() {
  const { scrollY } = useScroll();
  // Add shadow + solid bg after 40 px of scroll
  const shadow  = useTransform(scrollY, [0, 40], ['0 0 0 0 rgba(0,0,0,0)', '0 1px 0 0 rgba(0,0,0,0.08)']);
  const bgAlpha = useTransform(scrollY, [0, 40], ['rgba(255,255,255,0.0)', 'rgba(255,255,255,1.0)']);

  return (
    <motion.nav
      style={{ boxShadow: shadow, backgroundColor: bgAlpha }}
      className="fixed top-0 inset-x-0 z-50 h-[68px] flex items-center justify-between px-8 lg:px-14 backdrop-blur-sm"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <Zap size={17} strokeWidth={2.5} color={C.ink} />
        <span className="font-black text-[15px] tracking-tight" style={{ color: C.ink }}>
          TSVETKOV<span className="font-light"> CARS</span>
        </span>
      </div>

      {/* Links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium" style={{ color: C.secondary }}>
        {['Автомобили', 'Услуги', 'Доставка', 'О нас'].map((l) => (
          <a
            key={l}
            href="#"
            className="transition-colors duration-200 hover:text-zinc-900"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-80 active:scale-95"
        style={{ background: C.ink }}
      >
        Связаться <ArrowUpRight size={13} strokeWidth={2.5} />
      </button>
    </motion.nav>
  );
}

// ─── Hero — scroll-driven sticky parallax ─────────────────────────────────────

function LuxuryHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Text: fades out and floats up as user scrolls
  const textY       = useTransform(scrollYProgress, [0, 0.6], ['0px', '-100px']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Car image: scales from 0.8 → 1.1 (zoom in) and fades subtly
  const rawScale  = useTransform(scrollYProgress, [0, 1], [0.8, 1.1]);
  const carScale  = useSpring(rawScale, { stiffness: 60, damping: 20 });
  const carY      = useTransform(scrollYProgress, [0, 1], ['0px', '-30px']);

  // Scroll cue fades out early
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    /* 200 vh tall — page scrolls through this, inner div stays sticky */
    <div ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: C.surface }}>

        {/* ── Car Image (scales on scroll) ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ y: carY }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ scale: carScale, transformOrigin: 'center 60%' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2000&auto=format&fit=crop"
              alt="Premium sports car"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/car-tesla.jpg'; }}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 55%' }}
            />
            {/* Bottom gradient — fades car into white for text area */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(249,250,251,0.95) 0%, rgba(249,250,251,0.6) 28%, transparent 55%)',
              }}
            />
            {/* Left-side gradient — text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(249,250,251,0.88) 0%, rgba(249,250,251,0.4) 40%, transparent 70%)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── Hero Text (fades + rises on scroll) ── */}
        <motion.div
          className="absolute bottom-[12vh] left-0 right-0 px-8 lg:px-14 max-w-7xl mx-auto"
          style={{ y: textY, opacity: textOpacity }}
        >
          {/* Eyebrow */}
          <motion.p
            className="text-[11px] font-bold tracking-[0.3em] uppercase mb-6"
            style={{ color: C.muted }}
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Элитная доставка и аренда
          </motion.p>

          {/* Headline */}
          <div className="overflow-hidden">
            {['Ваш персональный', 'эксперт в мире', 'автомобилей'].map((line, i) => (
              <motion.h1
                key={line}
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={i + 1}
                className="block font-black leading-[1.02] tracking-tight"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5.8rem)',
                  color: C.primary,
                }}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {/* Subtext + CTAs */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <p className="text-base max-w-sm leading-relaxed" style={{ color: C.secondary }}>
              Автомобили из{' '}
              <span style={{ color: C.primary, fontWeight: 500 }}>США, Европы, Китая</span>{' '}
              и{' '}
              <span style={{ color: C.primary, fontWeight: 500 }}>Кореи</span>{' '}
              — под ключ.
            </p>

            <div className="flex gap-3 flex-wrap">
              {/* Primary — filled black */}
              <button
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{ background: C.ink }}
              >
                Выбрать автомобиль
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Secondary — outlined */}
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all duration-200 active:scale-95"
                style={{ color: C.ink, border: `1.5px solid ${C.border}`, background: 'transparent' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = C.ink)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = C.border)}
              >
                <Phone size={13} />
                Консультация
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: C.muted }}>
            Листать
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: C.muted }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const items = [
    { val: '500+', lbl: 'Довольных клиентов' },
    { val: '4',    lbl: 'Страны поставки' },
    { val: '7+',   lbl: 'Лет на рынке' },
    { val: '100%', lbl: 'Официальная гарантия' },
  ];

  return (
    <section style={{ background: C.ink }}>
      <div className="container mx-auto px-8 lg:px-14 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map(({ val, lbl }, i) => (
            <motion.div
              key={lbl}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="flex flex-col"
            >
              <span className="text-3xl font-black text-white tracking-tight">{val}</span>
              <span className="text-[12px] mt-1.5 font-medium" style={{ color: '#71717a' }}>{lbl}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Fleet Section ────────────────────────────────────────────────────────────

const FLEET = [
  {
    src:    '/car-audi.jpg',
    name:   'Audi Q7',
    origin: 'США / Германия',
    price:  'от $42 000',
    tag:    'Премиум',
  },
  {
    src:    '/car-tesla.jpg',
    name:   'Tesla Model 3',
    origin: 'США',
    price:  'от $38 000',
    tag:    'Электро',
  },
  {
    src:    '/car-jeep.jpg',
    name:   'Jeep Wrangler',
    origin: 'США',
    price:  'от $35 000',
    tag:    'Offroad',
  },
];

function FleetSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: C.bg }}>
      <div className="container mx-auto px-8 lg:px-14 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <motion.p
              className="text-[11px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: C.muted }}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Наш автопарк
            </motion.p>
            <motion.h2
              className="font-black tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', color: C.primary }}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Эксклюзивный<br />Автопарк
            </motion.h2>
          </div>
          <motion.button
            className="group hidden sm:flex items-center gap-2 text-[13px] font-semibold pb-0.5 self-end"
            style={{ color: C.primary, borderBottom: `1.5px solid ${C.primary}` }}
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Все модели
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLEET.map(({ src, name, origin, price, tag }, i) => (
            <motion.article
              key={name}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer"
              style={{ border: `1px solid ${C.border}` }}
              whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-zinc-50" style={{ aspectRatio: '16/10' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Tag */}
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                  style={{ background: 'rgba(255,255,255,0.9)', color: C.ink, backdropFilter: 'blur(8px)' }}
                >
                  {tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1" style={{ background: C.bg }}>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold" style={{ color: C.primary }}>{name}</h3>
                  <span className="text-base font-black" style={{ color: C.ink }}>{price}</span>
                </div>
                <p className="text-[13px] mb-6" style={{ color: C.muted }}>{origin}</p>

                <button
                  className="group/btn mt-auto flex items-center justify-between w-full px-5 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  style={{ background: C.surface, color: C.ink }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.ink;
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.surface;
                    (e.currentTarget as HTMLButtonElement).style.color = C.ink;
                  }}
                >
                  Подробнее
                  <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────

const SERVICES = [
  { icon: Globe,  title: 'США и Европа',    desc: 'Сертифицированные авто от официальных дилеров с полным пакетом документов.' },
  { icon: Zap,    title: 'Китай и Корея',   desc: 'Новейшие модели ещё до их официального появления на российском рынке.' },
  { icon: Shield, title: 'Гарантия',        desc: 'Юридическая поддержка, таможенное оформление и гарантия безопасности.' },
  { icon: Clock,  title: 'Быстро',          desc: 'Доставка под ключ от 30 дней. Вы получаете автомобиль у своего порога.' },
];

function ServicesSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div className="container mx-auto px-8 lg:px-14 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-24">
            <motion.p
              className="text-[11px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: C.muted }}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Наши услуги
            </motion.p>
            <motion.h2
              className="font-black tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: C.primary }}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Доставка из<br />любой точки<br />мира
            </motion.h2>
          </div>

          {/* Right column — service list */}
          <div className="flex flex-col divide-y" style={{ borderColor: C.border }}>
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                className="flex gap-6 py-8 group cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200"
                  style={{ background: C.border }}
                >
                  <Icon size={16} strokeWidth={1.8} style={{ color: C.ink }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold" style={{ color: C.primary }}>{title}</h3>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: C.secondary }}
                    />
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: C.secondary }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Black CTA Banner ─────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section style={{ background: C.ink }}>
      <div className="container mx-auto px-8 lg:px-14 max-w-7xl py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#52525b' }}>
              Готовы начать?
            </p>
            <h2
              className="font-black tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff' }}
            >
              Выбери идеальный<br />автомобиль прямо сейчас
            </h2>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="flex flex-wrap gap-4 shrink-0"
          >
            <button
              className="flex items-center gap-2 px-8 py-4 rounded-full text-[14px] font-semibold text-zinc-900 bg-white transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              Выбрать автомобиль <ArrowRight size={15} />
            </button>
            <button
              className="flex items-center gap-2 px-8 py-4 rounded-full text-[14px] font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              <Phone size={14} />
              Позвонить нам
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div className="container mx-auto px-8 lg:px-14 max-w-7xl py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={15} strokeWidth={2.5} style={{ color: C.ink }} />
            <span className="font-black text-[14px] tracking-tight" style={{ color: C.ink }}>
              TSVETKOV<span className="font-light"> CARS</span>
            </span>
          </div>
          <p className="text-[12px]" style={{ color: C.muted }}>
            © {new Date().getFullYear()} Tsvetkov Cars — Ваш персональный эксперт
          </p>
          <div className="flex gap-6 text-[12px] font-medium" style={{ color: C.muted }}>
            {['Политика', 'Условия', 'Контакты'].map((l) => (
              <a key={l} href="#" style={{ textDecoration: 'none', color: 'inherit' }}
                 className="hover:text-zinc-900 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function LuxuryPage() {
  return (
    <div className="bg-white antialiased min-h-screen">
      <LuxuryNav />
      <HeroSection />
      <StatsBar />
      <FleetSection />
      <ServicesSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
