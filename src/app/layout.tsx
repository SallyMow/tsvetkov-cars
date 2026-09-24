import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TSVETKOV CARS | Премиальный импорт и аренда автомобилей',
  description:
    'Доставка автомобилей премиум-класса из Европы, Кореи и с аукционов. Полное юридическое сопровождение, таможня и выдача с ЭПТС.',
  keywords: [
    'доставка авто из Европы',
    'импорт автомобилей из Кореи',
    'авто с аукциона Япония',
    'таможенное оформление автомобилей',
    'ЭПТС СБКТС',
    'премиальные автомобили',
    'Tsvetkov Cars',
    'автомобили под заказ',
  ],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000000"/><text y="76" x="50" text-anchor="middle" font-size="72" font-family="Arial Black,sans-serif" font-weight="900" fill="%23ffb86c">T</text></svg>',
  },
  openGraph: {
    title: 'TSVETKOV CARS | Премиальный импорт и аренда автомобилей',
    description:
      'Доставка автомобилей премиум-класса из Европы, Кореи и с аукционов. Полное юридическое сопровождение, таможня и выдача с ЭПТС.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Tsvetkov Cars',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TSVETKOV CARS | Премиальный импорт и аренда автомобилей',
    description:
      'Доставка автомобилей премиум-класса из Европы, Кореи и с аукционов.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-white antialiased`}>
        {/* Scanline effect */}
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
