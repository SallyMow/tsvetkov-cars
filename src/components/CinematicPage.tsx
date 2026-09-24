'use client';

/**
 * CinematicPage — Final architecture
 *
 * LAYER 1: <Canvas> fixed top-0 left-0 z-0 pointer-events-none — 3D wallpaper
 * LAYER 2: <div> relative z-50 — normal HTML, scrolls over the canvas
 *
 * NO Html, NO ScrollControls, NO Scroll from @react-three/drei.
 * AnimatedCar reads window.scrollY. DOM and WebGL never share a layer.
 */

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Phone, Zap, Sun, Moon } from 'lucide-react';

useGLTF.preload('/porsche/scene.gltf');

// ─── AnimatedCar ──────────────────────────────────────────────────────────────

function AnimatedCar({ isNight }: { isNight: boolean }) {
  const { scene }  = useGLTF('/porsche/scene.gltf');
  const carGroup   = useRef<THREE.Group>(null);
  const gridRef    = useRef<THREE.GridHelper>(null);

  // Frame-0: set correct initial angle so the front faces camera before first render
  useEffect(() => {
    if (!carGroup.current) return;
    carGroup.current.rotation.y = -Math.PI / 4;
    carGroup.current.position.y = -0.8;
  }, []);

  // Strip Sketchfab ground plane
  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const n = child.name.toLowerCase();
      const isFloor = ['ground','floor','base','platform','plane','carpet'].some(k => n.includes(k));
      const box = new THREE.Box3().setFromObject(child);
      const s = new THREE.Vector3(); box.getSize(s);
      if (isFloor && s.y < 0.15 && (s.x > 2.5 || s.z > 2.5)) child.visible = false;
      if (s.y < 0.03 && s.x > 5) child.visible = false;
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!carGroup.current) return;

    const scrollY  = window.scrollY;
    const progress = Math.min(scrollY / (window.innerHeight * 2), 1);

    // Full 360° orbit starting from front 3/4
    const targetY = -Math.PI / 4 - (progress * Math.PI * 2);
    carGroup.current.rotation.y = THREE.MathUtils.damp(carGroup.current.rotation.y, targetY, 4, delta);

    // Keep car low — never touches top-aligned text
    carGroup.current.position.y = -0.8;

    if (isNight) {
      // Engine vibration
      carGroup.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 15) * 0.01;

      // Highway grid scrolling
      if (gridRef.current) gridRef.current.position.z = (state.clock.elapsedTime * 30) % 2;

      // Wheel spin — find any mesh named wheel/tire/tyre
      carGroup.current.traverse((child: THREE.Object3D) => {
        const n = child.name.toLowerCase();
        if ((child as THREE.Mesh).isMesh && (n.includes('wheel') || n.includes('tire') || n.includes('tyre'))) {
          child.rotation.x += 0.2;
        }
      });
    }
  });

  return (
    <>
      {/* Car group — headlights inside so they sweep WITH the car */}
      <group ref={carGroup}>
        <Suspense fallback={null}>
          <Center>
            <primitive object={scene} scale={1} />
          </Center>
        </Suspense>

        {isNight && (
          <group position={[0, 0, 2]}>
            <spotLight position={[0.8, 0.5, 0]}  angle={0.25} penumbra={0.8} intensity={10} color="#ffffff" distance={50} castShadow />
            <spotLight position={[-0.8, 0.5, 0]} angle={0.25} penumbra={0.8} intensity={10} color="#ffffff" distance={50} castShadow />
          </group>
        )}
      </group>

      {/* Shadow + grid outside carGroup — they stay flat, not rotating */}
      <ContactShadows
        position={[0, -0.81, 0]}
        resolution={1024}
        scale={14}
        blur={isNight ? 1 : 2}
        opacity={isNight ? 0.7 : 0.35}
        color={isNight ? '#000000' : '#555555'}
      />

      {isNight && (
        <gridHelper
          ref={gridRef}
          args={[100, 100, '#3f3f46', '#18181b']}
          position={[0, -0.81, 0]}
        />
      )}
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function CinematicPage() {
  const [isNight, setIsNight] = useState(false);

  const glassCard = isNight
    ? 'backdrop-blur-xl bg-black/50 border border-white/10 p-10 rounded-3xl max-w-xl shadow-2xl'
    : 'backdrop-blur-xl bg-white/80 border border-white/50 p-10 rounded-3xl max-w-xl shadow-2xl';

  return (
    <main className={`relative w-full ${isNight ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} transition-colors duration-700`}>

      {/* ── LAYER 1: Fixed 3D background — no HTML inside ─────────────────── */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 6], fov: 40 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: isNight ? 0.6 : 1.05 }}
        >
          <color attach="background" args={[isNight ? '#09090b' : '#ffffff']} />
          <ambientLight intensity={isNight ? 0.2 : 0.7} />
          <spotLight
            position={[-5, 10, 5]} angle={0.2} penumbra={1}
            intensity={isNight ? 0.3 : 1.2}
            castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0001}
          />
          <spotLight position={[6, 4, -4]} angle={0.25} penumbra={1} intensity={isNight ? 0.1 : 0.4} />
          <Environment preset="city" background={false} environmentIntensity={isNight ? 0.2 : 1} />
          {isNight && <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />}
          <AnimatedCar isNight={isNight} />
        </Canvas>
      </div>

      {/* ── LAYER 2: Normal HTML — scrolls over canvas, z-50 ─────────────── */}
      <div className="relative z-50 w-full">

        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full px-6 md:px-10 h-16 flex justify-between items-center z-[9999] transition-colors duration-700 ${
            isNight ? 'bg-zinc-950/90 border-b border-white/10' : 'bg-white/90 border-b border-black/[0.06]'
          }`}
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} strokeWidth={2.5} />
            <span className="font-black text-sm tracking-tight">
              TSVETKOV <span className="font-light">CARS</span>
            </span>
          </div>

          <div className={`hidden md:flex gap-7 text-sm font-medium ${isNight ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {['Автомобили','Услуги','Доставка','О нас'].map(l => (
              <a key={l} href="#" className="opacity-70 hover:opacity-100 transition-opacity"
                style={{ textDecoration: 'none', color: 'inherit' }}>{l}</a>
            ))}
          </div>

          <button
            onClick={() => setIsNight(n => !n)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all pointer-events-auto hover:opacity-90 ${
              isNight
                ? 'backdrop-blur-md bg-zinc-500/10 border border-zinc-500/20 text-white'
                : 'backdrop-blur-md bg-zinc-500/10 border border-zinc-500/20 text-zinc-800'
            }`}
            style={{ cursor: 'pointer' }}
          >
            {isNight ? <><Sun size={13} /> Включить свет</> : <><Moon size={13} /> Ночной заезд</>}
          </button>
        </nav>

        {/* PAGE 1 (0–100vh): Intro — pushed UP to top third */}
        <section className="w-full h-screen flex flex-col items-center justify-start pt-[15vh] pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase text-center leading-none">
            TSVETKOV CARS
          </h1>
          <p className={`mt-5 tracking-[0.3em] uppercase text-sm font-medium opacity-60`}>
            Элитная доставка и аренда
          </p>
          <button
            className={`mt-8 px-8 py-3 rounded-full font-semibold text-sm pointer-events-auto transition-colors ${
              isNight ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Каталог автомобилей
          </button>
        </section>

        {/* PAGE 2 (100–200vh): Logistics — left */}
        <section className="w-full h-screen flex items-center justify-start px-10 md:px-24">
          <div className={glassCard} style={{ pointerEvents: 'auto' }}>
            <span className={`text-sm font-bold tracking-widest uppercase mb-3 block ${isNight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              01 / Логистика
            </span>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Логистика под ключ</h2>
            <p className={`leading-relaxed mb-7 ${isNight ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Прямые контракты с дилерами. Бережная логистика в закрытых контейнерах из США, Европы и Азии. Полное страхование на всех этапах.
            </p>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#fff', background: '#18181b', border: 'none', cursor: 'pointer', fontFamily: 'system-ui,sans-serif' }}>
              Рассчитать доставку <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* PAGE 3 (200–300vh): Customs — right */}
        <section className="w-full h-screen flex items-center justify-end px-10 md:px-24">
          <div className={glassCard} style={{ pointerEvents: 'auto' }}>
            <span className={`text-sm font-bold tracking-widest uppercase mb-3 block ${isNight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              02 / Оформление
            </span>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Таможенная очистка</h2>
            <p className={`leading-relaxed mb-7 ${isNight ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Берем на себя всю бюрократию. ЭПТС, СБКТС, утильсбор. Автомобиль полностью готов к постановке на учет.
            </p>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#fff', background: '#18181b', border: 'none', cursor: 'pointer', fontFamily: 'system-ui,sans-serif' }}>
              Подробнее <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* PAGE 4 (300–400vh): CTA — top aligned, car occupies lower half */}
        <section className="w-full h-screen flex flex-col items-center justify-start pt-[15vh]"
          style={{ pointerEvents: 'none' }}>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-center leading-tight">
            Готовы сделать выбор?
          </h2>
          <p className={`text-base mb-10 opacity-60`}>
            Оставьте заявку — мы свяжемся в течение 15 минут
          </p>
          <div className="flex gap-4 flex-wrap justify-center" style={{ pointerEvents: 'auto' }}>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-colors"
              style={{ fontSize: 15, cursor: 'pointer', border: 'none', fontFamily: 'system-ui,sans-serif' }}
            >
              Оставить заявку
            </button>
            <button
              className={`flex items-center gap-2 px-10 py-4 rounded-full font-semibold transition-colors ${
                isNight ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
              }`}
              style={{ fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui,sans-serif' }}
            >
              <Phone size={14} /> Позвонить
            </button>
          </div>
        </section>

        {/* Catalog — solid bg fully covers the fixed canvas beneath */}
        <section
          className={`min-h-screen w-full p-10 md:p-24 transition-colors duration-700 ${isNight ? 'bg-zinc-950' : 'bg-white'}`}
          style={{ borderTop: isNight ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e4e4e7' }}
        >
          <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-3 ${isNight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Автопарк
          </p>
          <h3 className="text-3xl font-bold mb-10">Доступно к заказу</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: 'Спорткары',   emoji: '🏎️', desc: 'Ferrari, Lamborghini, McLaren' },
              { label: 'Премиум SUV', emoji: '🚙', desc: 'Porsche, BMW, Range Rover'     },
              { label: 'Эксклюзив',   emoji: '💎', desc: 'Лимитированные серии'          },
            ].map(({ label, emoji, desc }) => (
              <div
                key={label}
                className={`h-64 rounded-2xl border flex flex-col items-center justify-center gap-3 cursor-pointer transition-transform hover:scale-[1.02] ${
                  isNight ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <span style={{ fontSize: 36 }}>{emoji}</span>
                <span className="font-bold text-lg">{label}</span>
                <span className={`text-sm ${isNight ? 'text-zinc-500' : 'text-zinc-400'}`}>{desc}</span>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-8">Популярные позиции</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: '/car-audi.jpg',  name: 'Audi Q7',      origin: 'США / Германия', price: 'от $42 000', tag: 'Премиум' },
              { src: '/car-tesla.jpg', name: 'Tesla Model 3', origin: 'США',            price: 'от $38 000', tag: 'Электро' },
              { src: '/car-jeep.jpg',  name: 'Jeep Wrangler', origin: 'США',            price: 'от $35 000', tag: 'Offroad' },
            ].map(({ src, name, origin, price, tag }) => (
              <div key={name} className={`rounded-2xl overflow-hidden border ${isNight ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: isNight ? '#18181b' : '#f9fafb' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.92)', color: '#18181b', backdropFilter: 'blur(8px)', fontFamily: 'system-ui,sans-serif' }}>{tag}</span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                      <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>{origin}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{price}</div>
                  </div>
                  <button
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isNight ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
                    }`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Подробнее <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isNight ? 'border-t border-white/10' : 'border-t border-zinc-200'}`}>
            <div className="flex items-center gap-2">
              <Zap size={14} />
              <span className="font-black text-sm tracking-tight">TSVETKOV <span className="font-light">CARS</span></span>
            </div>
            <p className={`text-sm ${isNight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              © {new Date().getFullYear()} — Ваш персональный эксперт по импорту автомобилей
            </p>
          </div>
        </section>

      </div>{/* end Layer 2 */}
    </main>
  );
}
