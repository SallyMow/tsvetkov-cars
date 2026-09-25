import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';

export const metadata: Metadata = {
  title: 'Tsvetkov Cars — Элитная аренда и доставка автомобилей',
  description: 'Доставка и аренда эксклюзивных автомобилей из Америки, Европы, Китая и Кореи.',
};

export default function HomePage() {
  return <HeroSection />;
}
