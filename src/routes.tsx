import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

const AboutPage = lazy(() => import('./pages/about'));
const ContactPage = lazy(() => import('./pages/contact'));
const NotFoundPage = lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/' | '/about' | '/contact';

export type Params = Record<string, string | undefined>;
