import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { CATEGORIES } from '@/data/products';
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

describe('split banner', () => {
  it('without WebGL, shows the trimmed door photo and the labelled elevation', async () => {
    renderPage();
    const photo = await screen.findByRole('img', { name: /fluted vima door installed in a home/i });
    expect(photo).toHaveAttribute('src', expect.stringContaining('e_trim'));
    expect(photo).toHaveAttribute('src', expect.stringContaining('Fluted_1_oulo1t.jpg'));
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

  it('scrolls down to the product collections', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /browse our collection/i }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(document.getElementById('collection')).toContainElement(
      screen.getByRole('heading', { name: /product collections/i, level: 2 }),
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

  it('shows a tile for every collection', () => {
    renderPage();
    for (const category of CATEGORIES) {
      expect(
        screen.getByRole('button', { name: `Browse ${category.name} doors` }),
      ).toBeInTheDocument();
    }
  });

  it('scrolls to the product collections from a collection tile', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Browse Veneer doors' }));

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});

describe('product collections', () => {
  const section = () =>
    screen.getByRole('heading', { name: /product collections/i, level: 2 }).closest('section')!;

  it('replaces the full catalogue', () => {
    renderPage();
    expect(screen.queryByRole('searchbox', { name: /search doors/i })).not.toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('pairs Doors with WPC doors & frames, not windows', () => {
    renderPage();
    const collections = within(section());
    expect(collections.getByRole('heading', { name: 'Doors', level: 3 })).toBeInTheDocument();
    expect(collections.getByRole('heading', { name: 'WPC', level: 3 })).toBeInTheDocument();
    expect(collections.getByText('Doors & Frames')).toBeInTheDocument();
    expect(section()).not.toHaveTextContent(/window/i);
  });

  it('shows all eight collection photos, resized by Cloudinary', () => {
    renderPage();
    const photos = within(section()).getAllByRole('img');
    expect(photos).toHaveLength(8);
    for (const photo of photos) {
      expect(photo).toHaveAttribute('src', expect.stringContaining('/upload/f_auto,q_auto,w_800/'));
      expect(photo).toHaveAccessibleName();
    }
  });
});
