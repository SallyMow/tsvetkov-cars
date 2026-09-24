'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Fuel, Gauge, Calendar, MapPin, Zap } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarCard {
  id: number;
  name: string;
  brand: string;
  price: string;
  priceNote?: string;
  specs: string;
  origin?: string;
  badge?: string;
  badgeColor?: 'cyan' | 'purple' | 'amber';
  gradient: string;
  accentColor: string;
  image: string;
  details: {
    year?: string;
    transmission?: string;
    engine?: string;
    fuel?: string;
    body?: string;
    mileage?: string;
  };
  available: boolean;
  featured?: boolean;
}

// ─── Car Data ─────────────────────────────────────────────────────────────────

const cars: CarCard[] = [
  {
    id: 1,
    name: 'Q7',
    brand: 'Audi',
    price: '5 490 000 ₽',
    specs: '2020 г. • Автомат • 3,0 л • Бензин',
    badge: 'В наличии',
    badgeColor: 'cyan',
    gradient: 'from-[#00E5FF]/10 via-[#0055FF]/5 to-transparent',
    accentColor: '#00E5FF',
    image: '/car-audi.jpg',
    details: {
      year: '2020',
      transmission: 'Автомат',
      engine: '3,0 л',
      fuel: 'Бензин',
      body: 'Внедорожник 5 дв.',
      mileage: '23 000 км',
    },
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Model 3',
    brand: 'Tesla',
    price: 'По запросу',
    priceNote: 'Под заказ из США',
    specs: 'Электро • Автомат • Седан',
    origin: 'США',
    badge: 'Под заказ',
    badgeColor: 'purple',
    gradient: 'from-[#8000FF]/10 via-[#0055FF]/5 to-transparent',
    accentColor: '#8000FF',
    image: '/car-tesla.jpg',
    details: {
      transmission: 'Автомат',
      fuel: 'Электро',
      body: 'Седан',
    },
    available: false,
  },
  {
    id: 3,
    name: 'Wrangler',
    brand: 'Jeep',
    price: 'По запросу',
    priceNote: 'Свяжитесь с нами',
    specs: 'Внедорожник • Идеален для любых условий',
    badge: 'Под заказ',
    badgeColor: 'amber',
    gradient: 'from-[#FF8C00]/10 via-[#FF4500]/5 to-transparent',
    accentColor: '#FF8C00',
    image: '/car-jeep.jpg',
    details: {
      fuel: 'Бензин',
      body: 'Внедорожник',
    },
    available: false,
  },
];

// ─── Spec Pill ─────────────────────────────────────────────────────────────────

function SpecTag({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-zinc-400 bg-white/5 border border-white/8">
      <Icon size={11} className="text-zinc-500" />
      {label}
    </span>
  );
}

// ─── Car Photo Visual ─────────────────────────────────────────────────────────

function CarVisual({
  image,
  name,
  accentColor,
  featured,
}: {
  image: string;
  name: string;
  accentColor: string;
  featured?: boolean;
}) {
  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl">
      {/* Real photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />

      {/* Dark vignette — bottom-to-card fade so text below reads cleanly */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,9,11,0.1) 0%, rgba(9,9,11,0.0) 40%, rgba(9,9,11,0.65) 100%)',
        }}
      />

      {/* Subtle accent tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 110%, ${accentColor}22 0%, transparent 65%)`,
        }}
      />

      {/* Corner bracket decorations on featured card */}
      {featured && (
        <>
          <div
            className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 rounded-tl"
            style={{ borderColor: accentColor }}
          />
          <div
            className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 rounded-tr"
            style={{ borderColor: accentColor }}
          />
          <div
            className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 rounded-bl"
            style={{ borderColor: accentColor }}
          />
          <div
            className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 rounded-br"
            style={{ borderColor: accentColor }}
          />
        </>
      )}
    </div>
  );
}


// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeStyles = {
  cyan: 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/8',
  purple: 'text-[#A855F7] border-[#A855F7]/30 bg-[#A855F7]/8',
  amber: 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/8',
};

// ─── Car Card ─────────────────────────────────────────────────────────────────

function CarCard({ car, index }: { car: CarCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.025, y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,229,255,0.08)]"
      style={{
        boxShadow: car.featured
          ? `0 0 0 1px ${car.accentColor}20, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Gradient top overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${car.gradient} pointer-events-none`} />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${car.accentColor}40`,
        }}
      />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
              {car.brand}
            </p>
            <h3 className="text-2xl font-black text-white">{car.name}</h3>
          </div>
          {car.badge && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${badgeStyles[car.badgeColor || 'cyan']}`}
            >
              {car.badge}
            </span>
          )}
        </div>

        {/* Car photo */}
        <CarVisual
          image={car.image}
          name={`${car.brand} ${car.name}`}
          accentColor={car.accentColor}
          featured={car.featured}
        />

        {/* Price */}
        <div className="mt-5 mb-4">
          <div
            className="text-2xl font-black"
            style={{
              color: car.available ? car.accentColor : 'white',
              textShadow: car.available ? `0 0 20px ${car.accentColor}60` : 'none',
            }}
          >
            {car.price}
          </div>
          {car.priceNote && (
            <p className="text-xs text-zinc-500 mt-0.5">{car.priceNote}</p>
          )}
        </div>

        {/* Spec tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {car.details.year && <SpecTag icon={Calendar} label={car.details.year} />}
          {car.details.transmission && <SpecTag icon={Gauge} label={car.details.transmission} />}
          {car.details.engine && <SpecTag icon={Gauge} label={car.details.engine} />}
          {car.details.fuel && <SpecTag icon={car.details.fuel === 'Электро' ? Zap : Fuel} label={car.details.fuel} />}
          {car.details.body && <SpecTag icon={MapPin} label={car.details.body} />}
          {car.details.mileage && <SpecTag icon={Gauge} label={car.details.mileage} />}
        </div>

        {/* Divider */}
        <div className="flex-1" />
        <div className="h-px bg-white/8 mb-5" />

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="group/btn relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold overflow-hidden transition-all duration-300"
          style={
            car.available
              ? {
                  background: `linear-gradient(135deg, ${car.accentColor} 0%, ${car.accentColor}CC 100%)`,
                  color: '#09090b',
                  boxShadow: `0 0 20px ${car.accentColor}40`,
                }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.12)',
                }
          }
        >
          <span>{car.available ? 'Узнать детали' : 'Оставить заявку'}</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
          {/* Shine */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-600 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Fleet Section ────────────────────────────────────────────────────────────

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-zinc-950 overflow-hidden"
      id="fleet"
    >
      {/* Background elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00E5FF]/50" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#00E5FF]/70 uppercase">
              Наш автопарк
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00E5FF]/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            АВТОМОБИЛИ В НАЛИЧИИ
            <br />
            <span className="text-gradient-cyan">И ПОД ЗАКАЗ</span>
          </h2>

          <p className="text-zinc-400 text-lg mt-3">
            Цены от{' '}
            <span className="text-white font-semibold">3 700 000 ₽</span>
            {' '}до{' '}
            <span className="text-white font-semibold">5 850 000 ₽</span>
          </p>
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl overflow-hidden p-8 md:p-12"
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 30% 50%, #00E5FF 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #0055FF 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Не нашли свой автомобиль?
              </h3>
              <p className="text-zinc-400 max-w-md">
                Мы доставим любой автомобиль под заказ из Америки, Европы, Китая или Кореи по вашим параметрам.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-zinc-950 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.35)',
              }}
            >
              Заказать автомобиль
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
