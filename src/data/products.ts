/**
 * Product catalog source of truth.
 *
 * Product photography is not shot yet, so every product carries a `placeholder`
 * descriptor instead of an image URL. (Categories do have a tile photo.) `DoorPlaceholder` turns that descriptor
 * into a schematic elevation, which keeps the grid legible (and on-brand)
 * until real imagery replaces it. Swapping in photos later means adding an
 * `images: string[]` field and branching inside `ProductCard`.
 */

export type CategorySlug =
  | 'fluted'
  | 'gold-pati'
  | 'highlighters'
  | 'laminate-cut-paste'
  | 'nova-v25'
  | 'vintage-collection'
  | 'teak'
  | 'veneer'
  | 'pooja-doors';

/** Drives which schematic the placeholder draws. One motif per design language. */
export type PlaceholderMotif =
  | 'flute'
  | 'inlay'
  | 'highlight'
  | 'cut-paste'
  | 'system'
  | 'heritage'
  | 'grain'
  | 'book-match'
  | 'jaali';

export interface ProductCategory {
  slug: CategorySlug;
  /** Display name used in the pill nav and section headings. */
  name: string;
  /** One-line editorial descriptor shown under the section heading. */
  tagline: string;
  motif: PlaceholderMotif;
  /** Cloudinary delivery URL for the category tile. The motif stands in if it fails. */
  image: string;
}

const CDN = 'https://res.cloudinary.com/vimadoors/image/upload';

export interface ProductSpec {
  coreMaterial: string;
  /** Available shutter thicknesses, in millimetres. */
  thickness: number[];
  finishType: string;
}

export interface Product {
  id: string;
  /** Internal SKU shown on the card — dealers order by code. */
  code: string;
  name: string;
  category: CategorySlug;
  spec: ProductSpec;
  /** ISO date the design entered the catalog. Drives the "Newest" sort. */
  releasedOn: string;
  /** 0–100 relative demand score. Drives the "Popular" sort. */
  popularity: number;
  /** Deterministic seed so a product's placeholder never reshuffles. */
  seed: number;
}

export const CATEGORIES: ProductCategory[] = [
  {
    slug: 'fluted',
    name: 'Fluted',
    tagline: 'Vertical reeding milled to a fixed pitch, so the face reads as rhythm before it reads as door.',
    motif: 'flute',
    image: `${CDN}/v1785105089/DOOR-01_zqybcy.png`,
  },
  {
    slug: 'gold-pati',
    name: 'Gold Pati',
    tagline: 'Brass pati inlaid along the grain and levelled flush with the finish coat.',
    motif: 'inlay',
    image: `${CDN}/v1785105089/GOLDPATTI-01_fu5r62.png`,
  },
  {
    slug: 'highlighters',
    name: 'Highlighters',
    tagline: 'A single CNC relief cut, placed to catch the room’s primary light source.',
    motif: 'highlight',
    image: `${CDN}/v1785105089/DESIGN-01_jutrwm.png`,
  },
  {
    slug: 'laminate-cut-paste',
    name: 'Laminate Cut Paste',
    tagline: 'Contrasting laminates cut and seam-matched by hand into one continuous face.',
    motif: 'cut-paste',
    image: `${CDN}/v1785105090/LAMINATE-02_nvdyk4.png`,
  },
  {
    slug: 'nova-v25',
    name: 'NOVA V25',
    tagline: 'Our 25 mm engineered shutter system — flush, light, and dimensionally stable.',
    motif: 'system',
    image: `${CDN}/v1785105090/MEMBRANE-01_bgnpg3.webp`,
  },
  {
    slug: 'vintage-collection',
    name: 'Vintage Collection',
    tagline: 'Heritage stile-and-rail profiles, re-cut on modern tooling to modern tolerances.',
    motif: 'heritage',
    image: `${CDN}/v1785105090/LAMINATE-01_rp03mn.png`,
  },
  {
    slug: 'teak',
    name: 'Teak',
    tagline: 'Quarter-sawn Burma and Indian teak, seasoned in-house before it is ever cut.',
    motif: 'grain',
    image: `${CDN}/v1785105090/TEAK-01_btvt99.webp`,
  },
  {
    slug: 'veneer',
    name: 'Veneer',
    tagline: 'Book-matched natural veneer laid over an engineered core that will not move.',
    motif: 'book-match',
    image: `${CDN}/v1785105090/VENEER-01_bo3ahd.webp`,
  },
  {
    slug: 'pooja-doors',
    name: 'Pooja Doors',
    tagline: 'Pierced jaali, bell detail, and brass accents cut for the prayer room.',
    motif: 'jaali',
    image: `${CDN}/v1785105090/PPOJA-01_lolxew.webp`,
  },
];

export const CATEGORY_BY_SLUG: Record<CategorySlug, ProductCategory> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, ProductCategory>;

export const PRODUCTS: Product[] = [
  // ── Fluted ────────────────────────────────────────────────────────────────
  {
    id: 'flt-204',
    code: 'FLT-204',
    name: 'Reed Full Height',
    category: 'fluted',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [32, 35], finishType: 'Matte PU' },
    releasedOn: '2026-07-14',
    popularity: 94,
    seed: 11,
  },
  {
    id: 'flt-208',
    code: 'FLT-208',
    name: 'Reed Half Break',
    category: 'fluted',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [32, 35, 38], finishType: 'Suede laminate' },
    releasedOn: '2026-05-02',
    popularity: 81,
    seed: 12,
  },
  {
    id: 'flt-215',
    code: 'FLT-215',
    name: 'Wide Reed Oak',
    category: 'fluted',
    spec: { coreMaterial: 'Engineered pine core', thickness: [35, 38], finishType: 'Natural oil' },
    releasedOn: '2026-02-19',
    popularity: 72,
    seed: 13,
  },
  {
    id: 'flt-221',
    code: 'FLT-221',
    name: 'Micro Reed Charcoal',
    category: 'fluted',
    spec: { coreMaterial: 'MDF + honeycomb', thickness: [30, 32], finishType: 'Matte PU' },
    releasedOn: '2025-11-08',
    popularity: 66,
    seed: 14,
  },

  // ── Gold Pati ─────────────────────────────────────────────────────────────
  {
    id: 'gpt-301',
    code: 'GPT-301',
    name: 'Single Pati Vertical',
    category: 'gold-pati',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [32, 35], finishType: 'Brass inlay + matte PU' },
    releasedOn: '2026-08-21',
    popularity: 90,
    seed: 21,
  },
  {
    id: 'gpt-307',
    code: 'GPT-307',
    name: 'Twin Pati Border',
    category: 'gold-pati',
    spec: { coreMaterial: 'Marine ply core', thickness: [35, 38], finishType: 'Brass inlay + gloss PU' },
    releasedOn: '2026-04-11',
    popularity: 77,
    seed: 22,
  },
  {
    id: 'gpt-312',
    code: 'GPT-312',
    name: 'Pati Grid Nine',
    category: 'gold-pati',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [35], finishType: 'Brass inlay + suede laminate' },
    releasedOn: '2025-12-03',
    popularity: 64,
    seed: 23,
  },

  // ── Highlighters ──────────────────────────────────────────────────────────
  {
    id: 'hlt-410',
    code: 'HLT-410',
    name: 'Offset Groove',
    category: 'highlighters',
    spec: { coreMaterial: 'MDF + honeycomb', thickness: [30, 32], finishType: 'Matte PU' },
    releasedOn: '2026-09-01',
    popularity: 88,
    seed: 31,
  },
  {
    id: 'hlt-416',
    code: 'HLT-416',
    name: 'Chevron Relief',
    category: 'highlighters',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [32, 35], finishType: 'Gloss laminate' },
    releasedOn: '2026-06-17',
    popularity: 74,
    seed: 32,
  },
  {
    id: 'hlt-422',
    code: 'HLT-422',
    name: 'Corner Cut Accent',
    category: 'highlighters',
    spec: { coreMaterial: 'Engineered pine core', thickness: [32], finishType: 'Melamine' },
    releasedOn: '2026-01-26',
    popularity: 59,
    seed: 33,
  },

  // ── Laminate Cut Paste ────────────────────────────────────────────────────
  {
    id: 'lcp-505',
    code: 'LCP-505',
    name: 'Two Tone Split',
    category: 'laminate-cut-paste',
    spec: { coreMaterial: 'Marine ply core', thickness: [30, 32, 35], finishType: 'Suede laminate' },
    releasedOn: '2026-08-05',
    popularity: 86,
    seed: 41,
  },
  {
    id: 'lcp-511',
    code: 'LCP-511',
    name: 'Inset Block Walnut',
    category: 'laminate-cut-paste',
    spec: { coreMaterial: 'Hardwood frame + HDF skin', thickness: [32, 35], finishType: 'Gloss laminate' },
    releasedOn: '2026-03-30',
    popularity: 71,
    seed: 42,
  },
  {
    id: 'lcp-518',
    code: 'LCP-518',
    name: 'Banded Horizon',
    category: 'laminate-cut-paste',
    spec: { coreMaterial: 'MDF + honeycomb', thickness: [30, 32], finishType: 'Suede laminate' },
    releasedOn: '2025-10-22',
    popularity: 62,
    seed: 43,
  },
  {
    id: 'lcp-524',
    code: 'LCP-524',
    name: 'Mitred Frame Paste',
    category: 'laminate-cut-paste',
    spec: { coreMaterial: 'Marine ply core', thickness: [35, 38], finishType: 'Matte laminate' },
    releasedOn: '2025-08-14',
    popularity: 55,
    seed: 44,
  },

  // ── NOVA V25 ──────────────────────────────────────────────────────────────
  {
    id: 'nva-v25-01',
    code: 'NVA-2501',
    name: 'V25 Flush Plain',
    category: 'nova-v25',
    spec: { coreMaterial: 'WPC core', thickness: [25], finishType: 'Matte PU' },
    releasedOn: '2026-09-09',
    popularity: 92,
    seed: 51,
  },
  {
    id: 'nva-v25-04',
    code: 'NVA-2504',
    name: 'V25 Groove Four',
    category: 'nova-v25',
    spec: { coreMaterial: 'WPC core', thickness: [25], finishType: 'Suede laminate' },
    releasedOn: '2026-07-02',
    popularity: 79,
    seed: 52,
  },
  {
    id: 'nva-v25-09',
    code: 'NVA-2509',
    name: 'V25 Louvre Vent',
    category: 'nova-v25',
    spec: { coreMaterial: 'WPC core', thickness: [25], finishType: 'Melamine' },
    releasedOn: '2026-04-25',
    popularity: 68,
    seed: 53,
  },

  // ── Vintage Collection ────────────────────────────────────────────────────
  {
    id: 'vnt-601',
    code: 'VNT-601',
    name: 'Six Panel Colonial',
    category: 'vintage-collection',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [38, 45], finishType: 'Hand-polished wax' },
    releasedOn: '2026-06-06',
    popularity: 83,
    seed: 61,
  },
  {
    id: 'vnt-608',
    code: 'VNT-608',
    name: 'Arched Light Two',
    category: 'vintage-collection',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [38, 45], finishType: 'Natural oil' },
    releasedOn: '2026-02-02',
    popularity: 70,
    seed: 62,
  },
  {
    id: 'vnt-614',
    code: 'VNT-614',
    name: 'Beaded Rail Classic',
    category: 'vintage-collection',
    spec: { coreMaterial: 'Engineered pine core', thickness: [35, 38], finishType: 'Matte PU' },
    releasedOn: '2025-09-18',
    popularity: 57,
    seed: 63,
  },

  // ── Teak ──────────────────────────────────────────────────────────────────
  {
    id: 'tek-701',
    code: 'TEK-701',
    name: 'Burma Plank Solid',
    category: 'teak',
    spec: { coreMaterial: 'Solid Burma teak', thickness: [45, 50], finishType: 'Natural oil' },
    releasedOn: '2026-08-28',
    popularity: 96,
    seed: 71,
  },
  {
    id: 'tek-706',
    code: 'TEK-706',
    name: 'Indian Teak Frame',
    category: 'teak',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [38, 45], finishType: 'Hand-polished wax' },
    releasedOn: '2026-05-19',
    popularity: 85,
    seed: 72,
  },
  {
    id: 'tek-713',
    code: 'TEK-713',
    name: 'Teak Ledge Entry',
    category: 'teak',
    spec: { coreMaterial: 'Solid Burma teak', thickness: [50], finishType: 'Exterior PU' },
    releasedOn: '2026-01-09',
    popularity: 73,
    seed: 73,
  },
  {
    id: 'tek-719',
    code: 'TEK-719',
    name: 'Teak Slim Stile',
    category: 'teak',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [35, 38], finishType: 'Matte PU' },
    releasedOn: '2025-11-27',
    popularity: 61,
    seed: 74,
  },

  // ── Veneer ────────────────────────────────────────────────────────────────
  {
    id: 'vnr-801',
    code: 'VNR-801',
    name: 'Book Match Walnut',
    category: 'veneer',
    spec: { coreMaterial: 'Engineered pine core', thickness: [32, 35], finishType: 'Matte PU' },
    releasedOn: '2026-07-23',
    popularity: 89,
    seed: 81,
  },
  {
    id: 'vnr-807',
    code: 'VNR-807',
    name: 'Crown Cut Oak',
    category: 'veneer',
    spec: { coreMaterial: 'Marine ply core', thickness: [32, 35, 38], finishType: 'Natural oil' },
    releasedOn: '2026-03-12',
    popularity: 76,
    seed: 82,
  },
  {
    id: 'vnr-813',
    code: 'VNR-813',
    name: 'Quarter Cut Ash',
    category: 'veneer',
    spec: { coreMaterial: 'Engineered pine core', thickness: [32, 35], finishType: 'Gloss PU' },
    releasedOn: '2025-12-15',
    popularity: 63,
    seed: 83,
  },

  // ── Pooja Doors ───────────────────────────────────────────────────────────
  {
    id: 'pja-901',
    code: 'PJA-901',
    name: 'Jaali Bell Double',
    category: 'pooja-doors',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [32, 35], finishType: 'Brass inlay + natural oil' },
    releasedOn: '2026-08-12',
    popularity: 91,
    seed: 91,
  },
  {
    id: 'pja-906',
    code: 'PJA-906',
    name: 'Kalash Arch Panel',
    category: 'pooja-doors',
    spec: { coreMaterial: 'Solid Indian teak', thickness: [32, 35], finishType: 'Hand-polished wax' },
    releasedOn: '2026-04-04',
    popularity: 78,
    seed: 92,
  },
  {
    id: 'pja-912',
    code: 'PJA-912',
    name: 'Pierced Lotus Grille',
    category: 'pooja-doors',
    spec: { coreMaterial: 'Marine ply core', thickness: [30, 32], finishType: 'Brass inlay + matte PU' },
    releasedOn: '2025-10-01',
    popularity: 60,
    seed: 93,
  },
];

// ── Sorting ─────────────────────────────────────────────────────────────────

export type SortKey = 'newest' | 'popular' | 'material';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'material', label: 'Finish / Material' },
];

export function isSortKey(value: string | null): value is SortKey {
  return value === 'newest' || value === 'popular' || value === 'material';
}

export function isCategorySlug(value: string | null): value is CategorySlug {
  return value !== null && value in CATEGORY_BY_SLUG;
}
