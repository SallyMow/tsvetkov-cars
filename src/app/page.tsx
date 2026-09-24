import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Tsvetkov Cars — Элитная аренда и доставка автомобилей',
  description: 'Доставка и аренда эксклюзивных автомобилей из Америки, Европы, Китая и Кореи.',
};

// HeroSection uses WebGL (Canvas) — must be client-only
const HeroSection = dynamic(
  () => import('@/components/HeroSection'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100vw', height: '100vh',
        background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid #e4e4e7',
          borderTopColor: '#18181b',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    ),
  },
);

export default function HomePage() {
  return <HeroSection />;
}
