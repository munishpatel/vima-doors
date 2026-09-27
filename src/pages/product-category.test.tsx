import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { CATEGORIES } from '@/data/products';
import ProductCategoryPage from './product-category';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => vi.unstubAllGlobals());

/** Answers every Cloudinary tag list with these public ids. */
function stubTagList(publicIds: string[]) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        resources: publicIds.map((id) => ({ public_id: id, version: 1, format: 'jpg' })),
      }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderPage(url: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/products/:slug" element={<ProductCategoryPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('category page', () => {
  it('puts the collection title on the cover', () => {
    renderPage('/products/veneer-doors');
    expect(screen.getByRole('heading', { level: 1, name: 'Veneer Doors' })).toBeInTheDocument();
  });

  it('marks the current collection in the strip and links every other one', () => {
    renderPage('/products/veneer-doors');
    const strip = within(screen.getByRole('navigation', { name: /door collections/i }));
    expect(strip.getAllByRole('link')).toHaveLength(CATEGORIES.length);
    expect(strip.getByRole('link', { name: 'Veneer' })).toHaveAttribute('aria-current', 'page');
    expect(strip.getByRole('link', { name: 'Teak' })).toHaveAttribute(
      'href',
      '/products/teak-doors',
    );
  });

  it("lists the collection's tagged Cloudinary photos, numbered and CDN-padded", async () => {
    const fetchMock = stubTagList(Array.from({ length: 7 }, (_, i) => `High_${i + 1}_abc`));
    renderPage('/products/highlighter-doors');

    expect(screen.getByRole('list', { name: /loading designs/i })).toBeInTheDocument();

    const designs = within(screen.getByRole('region', { name: /highlighter doors designs/i }));
    const photos = await designs.findAllByRole('img');
    expect(photos).toHaveLength(7);
    expect(photos[0]).toHaveAccessibleName('Highlighter 01 door');
    expect(photos[0]).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/vimadoors/image/upload/f_auto,q_auto,c_pad,ar_3:4,b_auto,w_600/v1/High_1_abc.jpg',
    );
    expect(designs.getByText('Highlighter 07')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://res.cloudinary.com/vimadoors/image/list/Highlighters.json',
      expect.anything(),
    );
  });

  it('offers a WhatsApp enquiry when a tag has no photos yet', async () => {
    stubTagList([]);
    renderPage('/products/fluted-doors');
    expect(
      await screen.findByText(/photos of our fluted doors are on their way/i),
    ).toBeInTheDocument();
  });

  it('skips the request for a collection without a tag', () => {
    const fetchMock = stubTagList([]);
    renderPage('/products/teak-doors');
    expect(screen.getByText(/photos of our teak doors are on their way/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ask on whatsapp/i })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/918106802929'),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls through to the 404 page for an unknown collection', () => {
    renderPage('/products/glass-doors');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
