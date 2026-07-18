import { type ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();

  // Reset scroll to the top whenever the route changes — otherwise React Router
  // preserves the previous page's scroll offset on navigation.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

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
