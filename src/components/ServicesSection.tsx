'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, ArrowRight, Globe, Shield, Truck, Star } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Доставка из США',
    description: 'Официальная доставка автомобилей с американских аукционов и дилерских центров.',
    color: '#00E5FF',
  },
  {
    icon: Globe,
    title: 'Из Китая и Кореи',
    description: 'Доступ к эксклюзивным моделям, недоступным в России. KIA, Hyundai, BYD, NIO.',
    color: '#0055FF',
  },
  {
    icon: Shield,
    title: 'Юридическая чистота',
    description: 'Полное оформление документов, таможенное оформление и сертификация.',
    color: '#8000FF',
  },
  {
    icon: Star,
    title: 'Гарантия качества',
    description: 'Полная проверка технического состояния перед отправкой и после доставки.',
    color: '#FF8C00',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-zinc-950 overflow-hidden">
      {/* Divider line top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00E5FF]/50" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#00E5FF]/70 uppercase">
              Наши услуги
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Всё для вашего
            <br />
            <span className="text-gradient-cyan">идеального авто</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            От поиска до доставки — берём на себя каждый этап.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative flex gap-5 p-6 rounded-2xl border border-white/8 bg-zinc-900/40 backdrop-blur-sm overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${service.color}10 0%, transparent 60%)`,
                }}
              />
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `${service.color}15`,
                  border: `1px solid ${service.color}30`,
                }}
              >
                <service.icon size={22} style={{ color: service.color }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1.5">{service.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-[#00E5FF]/15 bg-zinc-900/40 backdrop-blur-xl overflow-hidden p-10 md:p-16 text-center"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%)',
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)',
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-[#00E5FF] border border-[#00E5FF]/25 bg-[#00E5FF]/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Бесплатная консультация
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Готовы найти
              <br />
              <span className="text-gradient-cyan">ваш автомобиль?</span>
            </h2>

            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
              Свяжитесь с нами прямо сейчас. Подберём автомобиль под ваш бюджет и предпочтения за 24 часа.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="tel:+7"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-zinc-950"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)',
                  boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
                }}
              >
                <Phone size={16} />
                Позвонить сейчас
              </motion.a>
              <motion.a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-white border border-white/15 bg-white/5 hover:bg-white/8 transition-colors"
              >
                <MessageCircle size={16} className="text-[#00E5FF]" />
                Написать в Telegram
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
