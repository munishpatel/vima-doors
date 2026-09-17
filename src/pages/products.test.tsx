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

describe('anatomy hero', () => {
  it('falls back to the flat elevation when WebGL is unavailable', async () => {
    renderPage();
    expect(await screen.findByRole('img', { name: /teak door elevation/i })).toBeInTheDocument();
    // No WebGL means no 3D toggle is offered at all.
    expect(screen.queryByRole('group', { name: /door view/i })).not.toBeInTheDocument();
  });

  it('labels each part with the term the Indian door trade uses', () => {
    renderPage();
    for (const label of [
      'Doorframe / Chowkhat',
      'Stile & Rail',
      'Carving / Nakashi',
      'Hinges / Kabza',
      'Lock & Handle',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });

  it('expands specs only once a part is selected', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.queryByText('80 kg on 3 kabza')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hinges \/ kabza/i }));

    expect(await screen.findByText('80 kg on 3 kabza')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hinges \/ kabza/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('deselects when the same part is clicked twice', async () => {
    const user = userEvent.setup();
    renderPage();
    const button = screen.getByRole('button', { name: /lock & handle/i });

    await user.click(button);
    expect(await screen.findByText('Euro profile, 6-pin')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');

    // The card's exit animates `height: auto`, which jsdom cannot measure, so
    // assert the selection state rather than waiting on an unmount.
    await user.click(button);
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'false'));
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
