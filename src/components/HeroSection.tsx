'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import AnimatedCar from './AnimatedCar';

// ─── Иконки ────────────────────────────────────────────────────────────────

function IconContract({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconPrice({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Компонент ─────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [isNight, setIsNight] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  // Форма заявки
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormName('');
      setFormPhone('');
      setActiveService(null);
    }, 2200);
  }

  const steps = [
    { n: '01', title: 'Подбор и аудит', desc: 'Проверяем историю и техническое состояние по базам CarFax, AutoCheck и дилерским отчётам.' },
    { n: '02', title: 'Выкуп и оформление', desc: 'Полное юридическое сопровождение сделки — от оплаты до получения документов.' },
    { n: '03', title: 'Логистика', desc: 'Доставка в закрытых контейнерах со страховкой груза на весь маршрут.' },
    { n: '04', title: 'Таможня и выдача', desc: 'ЭПТС, СБКТС, утильсбор — всё включено. Вы получаете авто готовым к регистрации.' },
  ];

  const guarantees = [
    { icon: <IconContract className="w-6 h-6" />, title: 'Работаем по договору', desc: 'Официальный договор с фиксацией всех условий и стоимости.' },
    { icon: <IconPrice className="w-6 h-6" />, title: 'Фиксированная цена', desc: 'Никаких скрытых наценок — цена согласована до начала работ.' },
    { icon: <IconShield className="w-6 h-6" />, title: '100% страхование в пути', desc: 'Авто застраховано на всём маршруте — от склада до вашего города.' },
  ];

  const inputClass = (night: boolean) =>
    `w-full bg-transparent border-b py-3 text-sm font-medium outline-none transition-colors placeholder-opacity-40 ${
      night
        ? 'border-white/20 text-white placeholder-white/40 focus:border-[#ffb86c]'
        : 'border-black/20 text-black placeholder-black/40 focus:border-black'
    }`;

  return (
    <main className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 ${isNight ? 'bg-[#09090b] text-white' : 'bg-[#f4f4f5] text-zinc-900'}`}>

      <style>{`
        @keyframes sidebarReveal {
          0% { opacity: 0; transform: translateX(-60px); filter: blur(12px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes gradientFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes lineGrow {
          0% { height: 0%; opacity: 0; }
          100% { height: 100%; opacity: 1; }
        }
        @keyframes itemFade {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .anim-sidebar { animation: sidebarReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-bg { animation: gradientFade 0.8s ease-in-out forwards; }
        .anim-line { animation: lineGrow 0.8s cubic-bezier(0.85, 0, 0.15, 1) 0.2s forwards; opacity: 0; }
        .anim-item-1 { animation: itemFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .anim-item-2 { animation: itemFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .anim-item-3 { animation: itemFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        .anim-success { animation: successPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .messenger-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .messenger-btn:hover { transform: scale(1.12); }

        /* iOS touch/scroll fix: R3F sets touch-action:none on <canvas> which
           suppresses pan-y gesture for the whole stacking context on Safari.
           Result: swipe does nothing until user taps first.
           Fix: re-enable pan-y on scroll container and override canvas. */
        #main-scroll-container {
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        #main-scroll-container canvas {
          touch-action: pan-y !important;
        }
      `}</style>

      {/* ── 3D Canvas (полная высота без резких горизонтальных обрезов) ── */}
      <div className="absolute top-0 left-0 w-full h-full md:h-screen z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 1.5, 7.0], fov: 36 }}>
          <ambientLight intensity={isNight ? 0.3 : 0.6} />
          <directionalLight position={[5, 3, -5]} intensity={isNight ? 0.8 : 1.5} color={isNight ? '#8be9fd' : '#ffffff'} />
          <directionalLight position={[-6, 7, -2]} intensity={isNight ? 1.0 : 2.5} color={isNight ? '#e0f2fe' : '#ffffff'} />
          <Environment preset={isNight ? 'night' : 'city'} environmentIntensity={isNight ? 0.2 : 0.8} />
          <AnimatedCar isNight={isNight} activeService={activeService} />
        </Canvas>
      </div>

      {/* ── Навигация ── */}
      <nav className="absolute top-0 w-full px-4 py-4 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <Link href="/" className="font-bold text-base md:text-xl tracking-[0.2em] uppercase drop-shadow-md pointer-events-auto hover:opacity-80 transition-opacity" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
          TSVETKOV CARS
        </Link>
        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
          <div className={`hidden md:flex gap-8 text-sm font-semibold tracking-widest uppercase ${isNight ? 'text-white/70' : 'text-black/70'}`}>
            <Link href="/" className="hover:opacity-100 transition-opacity">Главная</Link>
            <Link href="/catalog" className="hover:opacity-100 transition-opacity">Каталог</Link>
            <span className="opacity-60 cursor-not-allowed">Контакты</span>
          </div>
          <button
            onClick={() => setIsNight(!isNight)}
            className={`px-4 md:px-6 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-500 cursor-pointer shadow-lg ${isNight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}
          >
            {isNight ? 'День' : 'Ночь'}
          </button>
        </div>
      </nav>

      {/* ── Скролл-контейнер ── */}
      <div
        id="main-scroll-container"
        className={`relative z-10 w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth transition-opacity duration-700 ${activeService ? 'opacity-0 pointer-events-none hidden' : 'opacity-100 block'}`}
        style={{ height: '100dvh', touchAction: 'pan-y' }}
      >

        {/* Главный экран — мобиле h-[46vh] → карточка услуг начинается сразу под авто; desktop — 100dvh */}
        <section className="w-full h-[46vh] md:h-screen snap-start relative pointer-events-none">
          <div className="absolute top-[8vh] md:top-[10vh] left-0 w-full flex flex-col items-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-widest uppercase text-center drop-shadow-2xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.25)' }}>TSVETKOV CARS</h1>
            <p className="mt-3 md:mt-4 tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs font-medium opacity-80">Элитная доставка и аренда</p>
          </div>
        </section>

        {/* Услуга 1 */}
        <section className="w-full snap-start md:snap-center flex flex-col md:flex-row items-start md:items-center justify-start px-4 md:px-24 pointer-events-none pt-6 md:pt-0 pb-12 md:pb-0 min-h-[58vh] md:h-screen">
          <div className={`p-6 md:p-10 w-full max-w-lg pointer-events-auto transition-colors duration-700 shadow-xl rounded-3xl ${isNight ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
            <span className="opacity-60 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">01 / Логистика</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">Логистика под ключ</h2>
            <p className="opacity-90 leading-relaxed text-sm md:text-base mb-6 md:mb-8">Прямые контракты с дилерами. Бережная логистика в закрытых контейнерах. Полное страхование на всех этапах пути из Европы, США и Азии.</p>
            <button onClick={() => setActiveService('Логистика под ключ')} className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer ${isNight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              Выбрать услугу
            </button>
          </div>
        </section>

        {/* Услуга 2 */}
        <section className="w-full snap-start md:snap-center flex flex-col md:flex-row items-start md:items-center justify-start md:justify-end px-4 md:px-24 pointer-events-none pt-6 md:pt-0 pb-12 md:pb-0 min-h-[58vh] md:h-screen">
          <div className={`p-6 md:p-10 w-full max-w-lg pointer-events-auto transition-colors duration-700 shadow-xl rounded-3xl ${isNight ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
            <span className="opacity-60 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">02 / Оформление</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">Таможенная очистка</h2>
            <p className="opacity-90 leading-relaxed text-sm md:text-base mb-6 md:mb-8">Берем на себя всю бюрократию. ЭПТС, СБКТС, утильсбор. Вы получаете автомобиль, полностью готовый к постановке на учет без скрытых платежей.</p>
            <button onClick={() => setActiveService('Таможенная очистка')} className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer ${isNight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              Выбрать услугу
            </button>
          </div>
        </section>

        {/* Услуга 3 */}
        <section className="w-full snap-start md:snap-center flex flex-col md:flex-row items-start md:items-center justify-start px-4 md:px-24 pointer-events-none pt-6 md:pt-0 pb-12 md:pb-0 min-h-[58vh] md:h-screen">
          <div className={`p-6 md:p-10 w-full max-w-lg pointer-events-auto transition-colors duration-700 shadow-xl rounded-3xl ${isNight ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
            <span className="opacity-60 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">03 / Подбор</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">Эксклюзив</h2>
            <p className="opacity-90 leading-relaxed text-sm md:text-base mb-6 md:mb-8">Находим лимитированные серии и редкие комплектации по всему миру. Детальная проверка юридической истории и технического состояния.</p>
            <button onClick={() => setActiveService('Эксклюзивный подбор')} className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer ${isNight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              Выбрать услугу
            </button>
          </div>
        </section>

        {/* ── Блок «Как мы работаем» ── */}
        <div className={`w-full snap-start transition-colors duration-1000 py-16 md:py-28 px-4 md:px-24 ${isNight ? 'bg-[#09090b]' : 'bg-[#f4f4f5]'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
              <div className="h-[2px] w-8 md:w-12 bg-[#ffb86c]"></div>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight">Прозрачный процесс</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-8">
              {steps.map((s, i) => (
                <div key={i} className={`relative p-6 md:p-8 rounded-3xl border transition-colors duration-700 ${isNight ? 'bg-white/3 border-white/8 hover:border-[#ffb86c]/40' : 'bg-white border-black/6 hover:border-black/20'} group`}
                  style={{ background: isNight ? 'rgba(255,255,255,0.03)' : undefined }}>
                  <span className={`block text-5xl md:text-6xl font-black mb-4 md:mb-6 leading-none ${isNight ? 'text-white/6' : 'text-black/6'} group-hover:text-[#ffb86c]/20 transition-colors duration-500`}>
                    {s.n}
                  </span>
                  <h3 className="text-base font-bold uppercase tracking-wide mb-3">{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${isNight ? 'opacity-50' : 'opacity-60'}`}>{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-12 -right-4 text-xl ${isNight ? 'text-white/15' : 'text-black/15'}`}>›</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Блок «Гарантии» ── */}
        <div className={`w-full snap-start transition-colors duration-1000 py-14 md:py-20 px-4 md:px-24 ${isNight ? 'bg-[#09090b]' : 'bg-[#f4f4f5]'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="h-[2px] w-8 md:w-12 bg-[#ffb86c]"></div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Наши гарантии</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {guarantees.map((g, i) => (
                <div key={i} className={`flex gap-4 md:gap-5 p-6 md:p-8 rounded-3xl border transition-colors duration-500 ${isNight ? 'border-white/8 bg-white/3 hover:border-[#ffb86c]/30' : 'border-black/6 bg-white hover:border-black/15'}`}
                  style={{ background: isNight ? 'rgba(255,255,255,0.03)' : undefined }}>
                  <div className="text-[#ffb86c] shrink-0 mt-0.5">{g.icon}</div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide mb-2">{g.title}</h3>
                    <p className={`text-sm leading-relaxed ${isNight ? 'opacity-50' : 'opacity-60'}`}>{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Переход в каталог */}
        <div className={`w-full snap-start transition-colors duration-1000 flex items-center justify-center py-24 md:py-40 px-4 ${isNight ? 'bg-[#09090b]' : 'bg-[#f4f4f5]'}`}>
          <div className="text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-4 md:mb-6">Готовы выбрать?</h2>
            <p className={`max-w-sm md:max-w-md text-sm font-medium mb-8 md:mb-10 px-2 ${isNight ? 'opacity-60' : 'opacity-70'}`}>
              Перейдите в наш каталог, чтобы ознакомиться с автомобилями в наличии и настроить фильтры поиска.
            </p>
            <Link href="/catalog" className={`px-8 md:px-12 py-4 md:py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-2xl hover:-translate-y-1 inline-block ${isNight ? 'bg-[#ffb86c] text-black hover:bg-[#eab308]' : 'bg-black text-white hover:bg-zinc-800'}`}>
              Открыть каталог авто
            </Link>
          </div>
        </div>

        {/* ── Футер ── */}
        <footer className={`w-full snap-start pt-16 pb-48 md:py-20 px-6 md:px-24 border-t transition-colors duration-1000 ${isNight ? 'bg-[#09090b] border-white/10' : 'bg-[#f4f4f5] border-black/10'}`} style={{ paddingBottom: 'max(12rem, calc(env(safe-area-inset-bottom, 24px) + 9rem))' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">Tsvetkov Cars Club</h2>
              <p className={`max-w-sm leading-relaxed text-sm font-medium mb-6 ${isNight ? 'opacity-60' : 'opacity-70'}`}>
                Ваш персональный эксперт по доставке автомобилей из Южной Кореи, Европы, США, Грузии и ОАЭ.
              </p>
              {/* Соцсети в футере */}
              <div className="flex gap-3">
                <a href="https://t.me/tsvetkovcars" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${isNight ? 'bg-white/8 text-white hover:bg-[#229ED9]/20 hover:text-[#229ED9]' : 'bg-black/6 text-black hover:bg-[#229ED9]/10 hover:text-[#229ED9]'}`}
                  style={{ background: isNight ? 'rgba(255,255,255,0.06)' : undefined }}>
                  <IconTelegram /> Telegram
                </a>
                <a href="https://wa.me/79778775625" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${isNight ? 'bg-white/8 text-white hover:bg-[#25D366]/20 hover:text-[#25D366]' : 'bg-black/6 text-black hover:bg-[#25D366]/10 hover:text-[#25D366]'}`}
                  style={{ background: isNight ? 'rgba(255,255,255,0.06)' : undefined }}>
                  <IconWhatsApp /> WhatsApp
                </a>
                <a href="https://vk.com/tsvetkovcars" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${isNight ? 'bg-white/8 text-white hover:bg-[#0077FF]/20 hover:text-[#0077FF]' : 'bg-black/6 text-black hover:bg-[#0077FF]/10 hover:text-[#0077FF]'}`}
                  style={{ background: isNight ? 'rgba(255,255,255,0.06)' : undefined }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.713-1.033-1.01-1.49-.81-1.49.227v1.486c0 .315-.1.503-1.148.503-1.693 0-3.572-.957-4.892-2.742C6.053 12.67 5.5 10.44 5.5 9.375c0-.275.127-.531.503-.531h1.745c.373 0 .516.17.66.567.726 2.095 1.944 3.927 2.443 3.927.19 0 .276-.087.276-.566V10.63c-.057-1.015-.594-1.101-.594-1.462 0-.213.17-.43.443-.43h2.745c.316 0 .43.17.43.536v2.879c0 .315.14.43.227.43.19 0 .347-.115.694-.463 1.075-1.207 1.84-3.063 1.84-3.063.1-.215.28-.413.653-.413h1.744c.527 0 .64.27.527.537-.22 1.012-2.36 4.04-2.36 4.04-.19.316-.26.456 0 .806.19.253.812.78 1.227 1.255.76.854 1.34 1.57 1.497 2.064.17.483-.087.727-.534.727z"/></svg>
                  ВКонтакте
                </a>
              </div>
            </div>

            <div>
              <h4 className={`font-bold uppercase tracking-widest text-xs mb-6 ${isNight ? 'opacity-80' : 'opacity-60'}`}>Навигация</h4>
              <ul className={`space-y-4 text-sm font-medium ${isNight ? 'opacity-60' : 'opacity-80'}`}>
                <li><Link href="/catalog" className="hover:opacity-100 transition-opacity">Каталог автомобилей</Link></li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Услуги логистики</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Таможенное оформление</li>
                <li className="hover:opacity-100 cursor-pointer transition-opacity">Автомобили с аукционов</li>
              </ul>
            </div>

            <div>
              <h4 className={`font-bold uppercase tracking-widest text-xs mb-6 ${isNight ? 'opacity-80' : 'opacity-60'}`}>Контакты</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="font-bold text-xl tracking-wide">+7 977 877 56 25</li>
                <li className={`cursor-pointer transition-opacity ${isNight ? 'opacity-60 hover:opacity-100' : 'opacity-80 hover:opacity-100'}`}>i@tsvetkov-cars.ru</li>
                <li className={`mt-4 ${isNight ? 'opacity-40' : 'opacity-50'}`}>Москва и Московская область</li>
                <li className="flex gap-3 mt-4">
                  <a href="https://t.me/tsvetkovcars" target="_blank" rel="noopener noreferrer" className="text-[#229ED9] hover:opacity-80 transition-opacity"><IconTelegram /></a>
                  <a href="https://wa.me/79778775625" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:opacity-80 transition-opacity"><IconWhatsApp /></a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t text-xs font-bold tracking-wide uppercase ${isNight ? 'border-white/10 opacity-30' : 'border-black/10 opacity-40'}`}>
            <p>Tsvetkov Cars Club © 2026. Все права защищены.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Конфиденциальность</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Договор оферты</span>
            </div>
          </div>
        </footer>

      </div>

      {/* ── Плавающие мессенджеры — скрыты на мобиле когда открыта форма ── */}
      <div
        className={`fixed z-50 flex flex-col items-center gap-0 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${activeService ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}
        style={{
          background: 'rgba(24,24,27,0.85)',
          bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          right: 'max(16px, env(safe-area-inset-right, 16px))',
        }}
      >
        <a href="https://t.me/tsvetkovcars" target="_blank" rel="noopener noreferrer"
          className="w-[52px] h-[52px] flex items-center justify-center text-white/60 hover:text-[#ffb86c] transition-colors duration-200"
          title="Telegram">
          <IconTelegram />
        </a>
        <div className="w-6 h-[1px] bg-white/10" />
        <a href="https://wa.me/79778775625" target="_blank" rel="noopener noreferrer"
          className="w-[52px] h-[52px] flex items-center justify-center text-white/60 hover:text-[#ffb86c] transition-colors duration-200"
          title="WhatsApp">
          <IconWhatsApp />
        </a>
      </div>

      {/* ── Оверлей с формой заявки ── */}
      {activeService && (
        <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none flex items-stretch md:items-center">
          {/* Фон — на мобиле полная ширина и высокая непрозрачность */}
          <div className={`absolute top-0 left-0 w-full md:w-[50%] h-full bg-gradient-to-r ${isNight ? 'from-[#09090b] via-[#09090b]/95' : 'from-[#fcfcfc] via-[#fcfcfc]/97'} to-transparent z-0 anim-bg md:opacity-100`}></div>
          {/* Дополнительный мобильный фон (полная ширина, блокирует 3D) */}
          <div className={`absolute top-0 left-0 w-full h-full md:hidden z-0 ${isNight ? 'bg-[#09090b]/90' : 'bg-[#fcfcfc]/92'} backdrop-blur-sm`}></div>

          {/* Контент формы — на мобиле скроллируемый блок на всю высоту */}
          <div
            key={activeService}
            className="pointer-events-auto anim-sidebar relative z-10 w-full md:max-w-lg flex flex-col justify-start md:justify-center overflow-y-auto"
            style={{ paddingTop: 'max(72px, env(safe-area-inset-top, 72px))', paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))' }}
          >
            {/* Декоративная вертикальная линия */}
            <div className={`absolute top-0 left-4 md:left-24 w-[2px] ${isNight ? 'bg-[#ffb86c]' : 'bg-black'} anim-line shadow-[0_0_15px_#ffb86c]`}></div>

            <div className="px-8 md:pl-24 md:pr-6">
              <div className="anim-item-1 mb-4 flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full animate-pulse ${isNight ? 'bg-[#ffb86c]' : 'bg-red-500'}`}></div>
                <span className={`text-[10px] font-mono tracking-[0.3em] uppercase ${isNight ? 'text-white/50' : 'text-black/50'}`}>Config Mode</span>
              </div>

              <h2 className={`anim-item-2 text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-3 ${isNight ? 'text-white' : 'text-black'}`}>
                {activeService.split(' ').map((word, i) => (
                  <React.Fragment key={i}>{word} <br /></React.Fragment>
                ))}
              </h2>

              <p className={`anim-item-3 text-sm font-medium mb-6 ${isNight ? 'text-white/70' : 'text-black/70'}`}>
                Оставьте заявку — наш эксперт свяжется в течение 15 минут.
              </p>

              {/* Форма */}
              {submitted ? (
                <div className="anim-success">
                  <div className={`flex items-center gap-4 p-6 rounded-2xl border ${isNight ? 'border-[#ffb86c]/30 bg-[#ffb86c]/8' : 'border-black/10 bg-black/3'}`}
                    style={{ background: isNight ? 'rgba(255,184,108,0.06)' : 'rgba(0,0,0,0.02)' }}>
                    <div className="w-10 h-10 rounded-full bg-[#ffb86c] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide">Заявка отправлена!</p>
                      <p className={`text-xs mt-1 ${isNight ? 'opacity-60' : 'opacity-60'}`}>Мы свяжемся с вами в течение 15 минут</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="anim-item-3 flex flex-col gap-5">
                  <div>
                    <label className={`block text-[10px] font-bold tracking-[0.15em] uppercase mb-2 ${isNight ? 'text-white/40' : 'text-black/40'}`}>Ваше имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван Иванов"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className={inputClass(isNight)}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-bold tracking-[0.15em] uppercase mb-2 ${isNight ? 'text-white/40' : 'text-black/40'}`}>Телефон</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 977 877 56 25"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className={inputClass(isNight)}
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    {/* ФЗ-152 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 w-4 h-4 shrink-0 accent-[#ffb86c] cursor-pointer"
                      />
                      <span className={`text-[10px] leading-relaxed ${isNight ? 'text-white/40' : 'text-black/40'} group-hover:text-white/60 transition-colors`}>
                        Нажимая кнопку, вы соглашаетесь с{' '}
                        <span className="underline underline-offset-2 cursor-pointer hover:opacity-100">
                          Политикой конфиденциальности
                        </span>{' '}
                        и обработкой персональных данных.
                      </span>
                    </label>
                    <button
                      type="submit"
                      className={`w-full py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg cursor-pointer ${isNight ? 'bg-[#ffb86c] text-black hover:bg-[#eab308]' : 'bg-black text-white hover:bg-zinc-800'}`}
                    >
                      Отправить заявку
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveService(null)}
                      className={`w-full py-4 bg-transparent border font-bold uppercase tracking-[0.2em] text-xs transition-all cursor-pointer ${isNight ? 'border-white/20 text-white hover:border-white/60' : 'border-black/20 text-black hover:border-black/60'}`}
                    >
                      Вернуться к меню
                    </button>
                  </div>
                </form>
              )}

              {/* ── Брендовый футер формы ── */}
              <div className={`mt-10 pt-5 border-t ${isNight ? 'border-white/8' : 'border-black/8'}`}>
                <p className={`text-[10px] font-black tracking-[0.35em] uppercase text-center ${isNight ? 'text-white/25' : 'text-zinc-400/80'}`}>
                  TSVETKOV CARS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
