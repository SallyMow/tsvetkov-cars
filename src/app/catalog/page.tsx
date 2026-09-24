'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

// ─── Mock-данные ────────────────────────────────────────────────────────────

interface Car {
  id: number;
  brand: string;
  model: string;
  fullName: string;
  price: number;
  year: number;
  engine: 'Бензин' | 'Дизель' | 'Электро';
  volume: string;
  power: number;
  type: 'Из Европы' | 'С Аукциона' | 'Из Кореи' | 'Из США';
}

const carsData: Car[] = [
  { id: 1, brand: 'Porsche',  model: 'Macan GTS',       fullName: 'Porsche Macan GTS Рестайлинг',   price: 12_550_000, year: 2024, engine: 'Бензин',  volume: '2.9', power: 440, type: 'Из Европы'  },
  { id: 2, brand: 'Audi',     model: 'RS Q8',            fullName: 'Audi RS Q8 Performance',         price: 18_900_000, year: 2023, engine: 'Бензин',  volume: '4.0', power: 600, type: 'С Аукциона' },
  { id: 3, brand: 'BMW',      model: 'M4 Competition',   fullName: 'BMW M4 Competition G82',          price: 14_800_000, year: 2024, engine: 'Бензин',  volume: '3.0', power: 510, type: 'Из Кореи'   },
  { id: 4, brand: 'Mercedes', model: 'AMG GT 63 S',      fullName: 'Mercedes AMG GT 63 S 4-Door',    price: 22_400_000, year: 2023, engine: 'Бензин',  volume: '4.0', power: 639, type: 'Из Европы'  },
  { id: 5, brand: 'BMW',      model: 'i7 xDrive60',      fullName: 'BMW i7 xDrive60 M Sport',        price: 19_900_000, year: 2024, engine: 'Электро', volume: '—',   power: 544, type: 'Из Европы'  },
  { id: 6, brand: 'Porsche',  model: 'Cayenne Turbo GT', fullName: 'Porsche Cayenne Turbo GT',       price: 31_200_000, year: 2024, engine: 'Бензин',  volume: '4.0', power: 640, type: 'С Аукциона' },
  { id: 7, brand: 'Audi',     model: 'e-tron GT',        fullName: 'Audi RS e-tron GT',              price: 16_700_000, year: 2023, engine: 'Электро', volume: '—',   power: 598, type: 'Из США'      },
  { id: 8, brand: 'Mercedes', model: 'G 63 AMG',         fullName: 'Mercedes-Benz G 63 AMG',         price: 27_500_000, year: 2024, engine: 'Бензин',  volume: '4.0', power: 585, type: 'Из Кореи'   },
];

// ─── Хелперы ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

// ─── CarCover ─────────────────────────────────────────────────────────────────

function CarCover({ brand, tagline }: { brand: string; tagline: string }) {
  return (
    <div
      className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 40% 60%, #2a2a2e 0%, #1a1a1d 40%, #0a0a0c 100%)' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 25%, rgba(180,180,200,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '28%', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,184,108,0.18), rgba(255,255,255,0.10), rgba(255,184,108,0.18), transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.08)', textShadow: '0 0 40px rgba(255,184,108,0.25), 0 0 80px rgba(255,184,108,0.10)', userSelect: 'none' }}>
          {brand}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,184,108,0.35)', userSelect: 'none' }}>
          {tagline}
        </span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg,rgba(255,184,108,0.6),transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 2, height: 40, background: 'linear-gradient(180deg,transparent,rgba(255,184,108,0.6))' }} />
    </div>
  );
}

// ─── Иконки ──────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

// ─── DrawerSidebar ────────────────────────────────────────────────────────────

function DrawerSidebar({
  car,
  onClose,
}: {
  car: Car;
  onClose: () => void;
}) {
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent]   = useState(false);
  const [visible, setVisible] = useState(false);

  // Монтируем с задержкой для анимации slide-in
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 320);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      handleClose();
    }, 2000);
  }

  const specs = [
    { label: 'Год выпуска',  value: `${car.year} г.` },
    { label: 'Двигатель',    value: car.engine },
    { label: 'Объём',        value: car.engine === 'Электро' ? '—' : `${car.volume} л` },
    { label: 'Мощность',     value: `${car.power} л.с.` },
    { label: 'Происхождение', value: car.type },
    { label: 'Марка',        value: car.brand },
  ];

  const inputBase = 'w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#ffb86c] transition-colors duration-200';

  return (
    <>
      {/* ── Затемнение фона ── */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.65)', opacity: visible ? 1 : 0 }}
      />

      {/* ── Панель ── */}
      <aside
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-[#111114] border-l border-white/8 shadow-[−20px_0_60px_rgba(0,0,0,0.6)] overflow-y-auto w-full md:max-w-[520px]"
        style={{
          width: 'min(520px, 100vw)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Золотая вертикальная линия слева */}
        <div
          className="absolute top-0 left-0 w-[2px] bg-[#ffb86c]"
          style={{
            height: visible ? '100%' : '0%',
            transition: 'height 0.7s cubic-bezier(0.85,0,0.15,1) 0.15s',
            boxShadow: '0 0 12px rgba(255,184,108,0.4)',
          }}
        />

        {/* ── Шапка панели ── */}
        <div className="flex items-start justify-between p-8 pb-6 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffb86c] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">Config Mode</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-white">
              {car.brand}<br />
              <span className="text-white/50">{car.model}</span>
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200 shrink-0 mt-1"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Цена */}
        <div className="px-8 mb-6">
          <p className="text-3xl font-bold text-[#ffb86c] tracking-tight">{formatPrice(car.price)}</p>
        </div>

        {/* CarCover */}
        <div className="px-8 mb-8">
          <CarCover brand={car.brand} tagline={car.model} />
        </div>

        {/* ── Характеристики ── */}
        <div className="px-8 mb-8">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-4">Характеристики</p>
          <div className="grid grid-cols-2 gap-3">
            {specs.map(s => (
              <div key={s.label} className="bg-white/3 rounded-xl px-4 py-3 border border-white/5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-[10px] font-bold tracking-wider uppercase text-white/30 mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Разделитель */}
        <div className="mx-8 h-[1px] bg-white/5 mb-8" />

        {/* ── Форма ── */}
        <div className="px-8 pb-10 flex-1">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2">Оформить заявку</p>
          <p className="text-sm text-white/50 leading-relaxed mb-6">
            Оставьте контакты — менеджер свяжется с вами для обсуждения деталей доставки этого автомобиля.
          </p>

          {sent ? (
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-[#ffb86c]/20"
              style={{ background: 'rgba(255,184,108,0.06)' }}>
              <div className="w-9 h-9 rounded-full bg-[#ffb86c] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wide text-white">Заявка отправлена!</p>
                <p className="text-xs text-white/40 mt-0.5">Свяжемся в течение 15 минут</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2">Ваше имя</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2">Телефон</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 977 877 56 25"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {/* ФЗ-152: согласие на обработку данных */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#ffb86c] cursor-pointer"
                  />
                  <span className="text-[10px] leading-relaxed text-white/35 group-hover:text-white/55 transition-colors">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <span className="underline underline-offset-2 cursor-pointer hover:text-white/80">
                      Политикой конфиденциальности
                    </span>{' '}
                    и обработкой персональных данных.
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#ffb86c] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#eab308] transition-colors shadow-[0_0_24px_rgba(255,184,108,0.2)] cursor-pointer"
                >
                  Оформить заказ
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-4 bg-transparent border border-white/10 text-white/40 font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:border-white/30 hover:text-white/70 transition-all cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Страница каталога ────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [searchTerm,     setSearchTerm]     = useState('');
  const [selectedBrand,  setSelectedBrand]  = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [priceFrom,      setPriceFrom]      = useState('');
  const [priceTo,        setPriceTo]        = useState('');

  // ── Шаг 1: состояние выбранного авто
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Блокируем скролл страницы когда drawer открыт
  useEffect(() => {
    document.body.style.overflow = selectedCar ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedCar]);

  // ── Фильтрация
  const filteredCars = useMemo(() => {
    const q    = searchTerm.toLowerCase().trim();
    const from = priceFrom ? parseInt(priceFrom.replace(/\D/g, ''), 10) : null;
    const to   = priceTo   ? parseInt(priceTo.replace(/\D/g, ''), 10)   : null;
    return carsData.filter(car => {
      if (q && !car.fullName.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
      if (selectedBrand  && car.brand   !== selectedBrand)  return false;
      if (selectedEngine && car.engine  !== selectedEngine) return false;
      if (from !== null  && car.price   < from)             return false;
      if (to   !== null  && car.price   > to)               return false;
      return true;
    });
  }, [searchTerm, selectedBrand, selectedEngine, priceFrom, priceTo]);

  function resetFilters() {
    setSearchTerm(''); setSelectedBrand(''); setSelectedEngine('');
    setPriceFrom(''); setPriceTo('');
  }

  const hasFilters = searchTerm || selectedBrand || selectedEngine || priceFrom || priceTo;
  const selectClass = 'w-full bg-[#1c1c21] border border-transparent focus:border-white/20 rounded-xl px-5 py-4 text-sm text-white appearance-none outline-none cursor-pointer transition-colors';

  return (
    <>
      <main className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#ffb86c] selection:text-black pb-20">

        {/* Навигация */}
        <nav className="w-full p-8 flex justify-between items-center border-b border-white/5">
          <Link href="/" className="font-bold text-xl tracking-[0.2em] uppercase hover:text-[#ffb86c] transition-colors">
            TSVETKOV CARS
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-semibold tracking-widest uppercase opacity-70">
            <Link href="/catalog" className="text-white opacity-100 border-b border-[#ffb86c] pb-1">Каталог</Link>
            <Link href="/" className="cursor-pointer hover:opacity-100 transition-opacity">Услуги</Link>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">Контакты</span>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

          {/* Заголовок */}
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[2px] w-12 bg-[#ffb86c]" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Каталог авто</h1>
          </div>

          {/* ── Фильтры ── */}
          <div className="w-full bg-[#131316] border border-white/5 rounded-3xl p-4 md:p-8 mb-12 md:mb-16 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск по марке или модели"
                  className="w-full bg-[#1c1c21] border border-transparent focus:border-white/20 rounded-xl px-5 py-4 pr-10 text-sm text-white placeholder-white/40 outline-none transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <IconSearch />
              </div>
              <select className={selectClass} value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                <option value="">Марка</option>
                <option value="Porsche">Porsche</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Mercedes">Mercedes</option>
              </select>
              <select className={selectClass} disabled>
                <option>{selectedBrand ? `Все ${selectedBrand}` : 'Модель'}</option>
              </select>
              <select className={selectClass} value={selectedEngine} onChange={e => setSelectedEngine(e.target.value)}>
                <option value="">Двигатель</option>
                <option value="Бензин">Бензин</option>
                <option value="Дизель">Дизель</option>
                <option value="Электро">Электро</option>
              </select>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] uppercase text-white/40 mb-3">Стоимость (₽)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="От" className="w-full bg-[#1c1c21] rounded-xl px-4 py-3 text-sm text-white text-center outline-none focus:bg-[#25252b] transition-colors" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} />
                  <input type="text" placeholder="До" className="w-full bg-[#1c1c21] rounded-xl px-4 py-3 text-sm text-white text-center outline-none focus:bg-[#25252b] transition-colors" value={priceTo} onChange={e => setPriceTo(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] uppercase text-white/40 mb-3">Год выпуска</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="От" className="w-full bg-[#1c1c21] rounded-xl px-4 py-3 text-sm text-white text-center outline-none focus:bg-[#25252b] transition-colors" />
                  <input type="text" placeholder="До" className="w-full bg-[#1c1c21] rounded-xl px-4 py-3 text-sm text-white text-center outline-none focus:bg-[#25252b] transition-colors" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 items-end">
                <button onClick={resetFilters} className={`px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all ${hasFilters ? 'text-[#ffb86c] hover:text-white' : 'text-white/30 cursor-default'}`}>
                  Сбросить ✕
                </button>
                <button className="px-10 py-4 bg-[#ffb86c] text-black text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[#eab308] transition-colors shadow-[0_0_20px_rgba(255,184,108,0.2)]">
                  {filteredCars.length === 0 ? 'Нет совпадений' : `Показать ${filteredCars.length} авто`}
                </button>
              </div>
            </div>
          </div>

          {/* ── Сетка карточек ── */}
          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white/30 text-sm font-medium tracking-widest uppercase">Автомобили не найдены</p>
              <button onClick={resetFilters} className="mt-2 px-6 py-3 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {filteredCars.map(car => (
                <div
                  key={car.id}
                  className="flex flex-col bg-[#131316] border border-white/5 rounded-[2rem] p-4 shadow-2xl group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-white/10"
                  onClick={() => setSelectedCar(car)}    // ── Шаг 2: клик по карточке
                >
                  {/* CSS-заглушка */}
                  <div className="relative mb-5">
                    <CarCover brand={car.brand} tagline={car.model} />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border border-white/10">
                        {car.type}
                      </span>
                    </div>
                  </div>

                  <div className="px-2 flex flex-col gap-4">
                    <h3 className="text-lg font-bold uppercase leading-tight tracking-wide text-white">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-xl font-medium text-[#ffb86c]">{formatPrice(car.price)}</p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium py-2 text-zinc-400">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#ffb86c] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>{car.engine === 'Электро' ? 'Электро' : `${car.volume} л`}, {car.power} л.с.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#ffb86c] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{car.year} г.</span>
                      </div>
                    </div>

                    {/* Кнопка — тоже открывает drawer (event уже всплывёт от карточки) */}
                    <button
                      className="w-full py-4 mt-2 bg-[#ffb86c] text-black font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-[#eab308] transition-colors"
                      onClick={e => { e.stopPropagation(); setSelectedCar(car); }}
                    >
                      Оставить заявку
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Шаг 3: Drawer ── */}
      {selectedCar && (
        <DrawerSidebar
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </>
  );
}
