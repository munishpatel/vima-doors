import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { PRODUCTS } from '@/data/products';
import ProductsPage from './products';

// jsdom has no layout engine and no WebGL, so the page takes its 2D path.
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();
});

function renderPage(initialUrl = '/products') {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <ProductsPage />
    </MemoryRouter>,
  );
}

const cardTitles = () =>
  screen
    .getAllByRole('article')
    .map((el) => within(el).getByRole('heading', { level: 3 }).textContent);

describe('split banner', () => {
  it('shows the installed door and its labelled anatomy without WebGL', async () => {
    renderPage();
    expect(await screen.findByRole('img', { name: /teak door installed in a home/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /teak door elevation/i })).toBeInTheDocument();
  });

  it('pairs the installed headline with the custom-design pitch', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: /luxury wooden doors by vima doors/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /you imagine it\. we build it\./i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /share your design/i })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/918106802929'),
    );
  });

  it('names every part of the door in the trade terms', () => {
    renderPage();
    for (const label of [
      'Doorframe / Chowkhat',
      'Stile & Rail',
      'Carving / Nakashi',
      'Hinges / Kabza',
      'Lock & Handle',
    ]) {
      expect(screen.getByText(new RegExp(`^${label}:`))).toBeInTheDocument();
    }
  });

  it('scrolls down to the catalogue', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /browse our collection/i }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(document.getElementById('collection')).toContainElement(
      screen.getByRole('heading', { name: /collections/i, level: 2 }),
    );
  });
});

describe('intro', () => {
  it('introduces Vima Doors as a door manufacturer, without windows', () => {
    renderPage();
    const intro = screen
      .getByRole('heading', { name: /vima doors — premium door manufacturer in india/i })
      .closest('section');
    expect(intro).not.toBeNull();
    expect(intro).toHaveTextContent(/door manufacturers/i);
    expect(intro).not.toHaveTextContent(/window/i);
    expect(intro).not.toHaveTextContent(/boon/i);
  });
});

describe('product catalog', () => {
  it('lists every design by default, newest first', () => {
    renderPage();
    expect(screen.getAllByRole('article')).toHaveLength(PRODUCTS.length);
    expect(cardTitles()[0]).toBe('V25 Flush Plain'); // released 2026-09-09
  });

  it('filters from a shared ?category= URL on first paint', () => {
    renderPage('/products?category=veneer');
    const titles = cardTitles();
    expect(titles).toHaveLength(3);
    expect(titles).toContain('Book Match Walnut');
    expect(screen.getByRole('tab', { name: /veneer/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('honours ?sort=popular', () => {
    renderPage('/products?sort=popular');
    expect(cardTitles()[0]).toBe('Burma Plank Solid'); // popularity 96
  });

  it('filters on category click and writes the choice to the URL', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('tab', { name: /pooja doors/i }));

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3));
    expect(screen.getByText(/pierced jaali, bell detail/i)).toBeInTheDocument();
  });

  it('searches across name, code, core and finish', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole('searchbox', { name: /search doors/i }), 'burma');

    await waitFor(
      () => expect(cardTitles()).toEqual(['Burma Plank Solid', 'Teak Ledge Entry']),
      { timeout: 4000 },
    );
  });

  it('offers a way out when nothing matches', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole('searchbox', { name: /search doors/i }), 'zzzz');

    expect(await screen.findByText(/nothing matches that yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('opens a detail dialog with the full spec', async () => {
    const user = userEvent.setup();
    renderPage('/products?category=nova-v25');

    const card = screen.getAllByRole('article')[0];
    await user.click(within(card).getByRole('button', { name: /view details/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('25 mm')).toBeInTheDocument();
    expect(within(dialog).getByText('WPC core')).toBeInTheDocument();
  });
});
