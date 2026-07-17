import { type ReactElement } from 'react';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import IndiaBadges from '@/layouts/parts/IndiaBadges';
import Locations from '@/layouts/parts/Locations';
import Website from '@/layouts/Website';

/**
 * Root layout component that wraps all pages with consistent header and footer
 *
 * This component provides a centralized layout structure for the entire application,
 * ensuring consistent navigation and footer across all pages. It uses the Website
 * layout component and includes Header and Footer components.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx files
 * in the layouts/parts directory.
 *
 * @param children - Child routes to render (typically <Outlet /> from react-router-dom)
 *
 * @example
 * ```tsx
 * <RootLayout>
 *   <Outlet />
 * </RootLayout>
 * ```
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Header />
      <main className="pt-[120px]">
        {children}
      </main>
      <IndiaBadges />
      <Locations />
      <Footer />
    </Website>
  );
}
