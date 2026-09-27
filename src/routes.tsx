import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import type { CategorySlug } from './data/products';

const ProductsPage = lazy(() => import('./pages/products'));
const ProductCategoryPage = lazy(() => import('./pages/product-category'));
const AboutPage = lazy(() => import('./pages/about'));
const GalleryPage = lazy(() => import('./pages/gallery'));
const ContactPage = lazy(() => import('./pages/contact'));
const NotFoundPage = lazy(() => import('./pages/_404'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/products/:slug',
    element: <ProductCategoryPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/gallery',
    element: <GalleryPage />,
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
export type Path =
  | '/'
  | '/products'
  | `/products/${CategorySlug}`
  | '/about'
  | '/gallery'
  | '/contact';

export type Params = Record<string, string | undefined>;
