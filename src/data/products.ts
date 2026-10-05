/**
 * Door collections: picture tiles on `/products`, and a page each at
 * `/products/<slug>`.
 *
 * Each category carries a Cloudinary tile photo, plus a `motif` that
 * `DoorPlaceholder` draws as a schematic elevation if the photo fails to load.
 */

/** Also the category page's URL segment: `/products/<slug>`. */
export type CategorySlug =
  | 'fluted-doors'
  | 'gold-pati-doors'
  | 'highlighter-doors'
  | 'laminate-cut-paste-doors'
  | 'nova-v25-doors'
  | 'vintage-collection'
  | 'teak-doors'
  | 'veneer-doors'
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
  /** Display name shown on the tile and in the category strip. */
  name: string;
  /** Heading on the category page's cover. */
  title: string;
  /** Label for each design on the category page, numbered after it ("Fluted 01"). */
  designName: string;
  /** Catalogue code prefix. When set, designs are labelled by code ("VD-01") instead. */
  designCode?: string;
  motif: PlaceholderMotif;
  /** Cloudinary delivery URL for the category tile. The motif stands in if it fails. */
  image: string;
  /**
   * Photographed cover banner (a wide shot of the doors against a wall). Until
   * one is shot, the page composes a cover from `image` on a `wall` of this tone.
   */
  cover?: string;
  wall: string;
  /**
   * Cloudinary tag the category page lists its designs from. Tag an upload
   * with it and it appears on the page; filename numbers set the order.
   */
  tag?: string;
  /** Fixed design images, listed instead of `tag` (e.g. cut from a catalogue PDF). */
  designs?: string[];
}

const CDN = 'https://res.cloudinary.com/vimadoors/image/upload';

/**
 * NOVA V25 designs, cut from the NOVA catalogue PDF by the CDN rather than
 * uploaded one by one: `pg_N` renders page N as an image (1240x1754 px),
 * `c_crop` cuts out one door with its frame, and the pad squares it to 3:4 on
 * the card colour. Pages 2-11 hold two doors each, VD-01 to VD-20 in order;
 * pages 2-4 sit ~15px further up and left than the rest. If the PDF is
 * replaced with a new layout, these offsets need re-measuring.
 */
const NOVA_PDF = 'v1790527649/VIMA_Catalouge_NOVA_u2o2z4.jpg';
const NOVA_DESIGNS = Array.from({ length: 10 }, (_, i) => i + 2).flatMap((page) => {
  const [left, right, top] = page <= 4 ? [75, 659, 374] : [89, 670, 379];
  return [left, right].map(
    (x) =>
      `${CDN}/pg_${page},c_crop,x_${x},y_${top},w_508,h_1052/c_pad,ar_3:4,b_rgb:f5efe5/${NOVA_PDF}`,
  );
});

export const CATEGORIES: ProductCategory[] = [
  {
    slug: 'fluted-doors',
    name: 'Fluted',
    title: 'Fluted Doors',
    designName: 'Fluted',
    motif: 'flute',
    image: `${CDN}/v1785105089/DOOR-01_zqybcy.png`,
    tag: 'Fluted',
    wall: '#a99a86',
  },
  {
    slug: 'gold-pati-doors',
    name: 'Gold Pati',
    title: 'Gold Pati Doors',
    designName: 'Gold Pati',
    motif: 'inlay',
    image: `${CDN}/v1785105089/GOLDPATTI-01_fu5r62.png`,
    tag: 'Gold Patti',
    wall: '#8f9ea3',
  },
  {
    slug: 'highlighter-doors',
    name: 'Highlighters',
    title: 'Highlighter Doors',
    designName: 'Highlighter',
    motif: 'highlight',
    image: `${CDN}/v1785105089/DESIGN-01_jutrwm.png`,
    tag: 'Highlighters',
    wall: '#b09c86',
  },
  {
    slug: 'laminate-cut-paste-doors',
    name: 'Laminate Cut Paste',
    title: 'Laminate Cut Paste Doors',
    designName: 'Cut Paste',
    motif: 'cut-paste',
    image: `${CDN}/v1785105090/LAMINATE-02_nvdyk4.png`,
    tag: 'Laminate Cut Paste',
    wall: '#9fa99b',
  },
  {
    slug: 'nova-v25-doors',
    name: 'NOVA V25',
    title: 'NOVA V25 Doors',
    designName: 'NOVA V25',
    designCode: 'VD',
    motif: 'system',
    image: `${CDN}/v1785105090/MEMBRANE-01_bgnpg3.webp`,
    designs: NOVA_DESIGNS,
    wall: '#a4a8a6',
  },
  {
    slug: 'vintage-collection',
    name: 'Vintage Collection',
    title: 'Vintage Collection',
    designName: 'Vintage',
    motif: 'heritage',
    image: `${CDN}/v1785105090/LAMINATE-01_rp03mn.png`,
    tag: 'Vintage',
    wall: '#a39883',
  },
  {
    slug: 'teak-doors',
    name: 'Teak',
    title: 'Teak Doors',
    designName: 'Teak',
    motif: 'grain',
    image: `${CDN}/v1785105090/TEAK-01_btvt99.webp`,
    tag: 'Teak',
    wall: '#9aa89a',
  },
  {
    slug: 'veneer-doors',
    name: 'Veneer',
    title: 'Veneer Doors',
    designName: 'Veneer',
    motif: 'book-match',
    image: `${CDN}/v1785105090/VENEER-01_bo3ahd.webp`,
    cover: '/assets/covers/veneer-doors.webp',
    wall: '#a7b59b',
  },
  {
    slug: 'pooja-doors',
    name: 'Pooja Doors',
    title: 'Pooja Doors',
    designName: 'Pooja Door',
    motif: 'jaali',
    image: `${CDN}/v1785105090/PPOJA-01_lolxew.webp`,
    wall: '#b3a086',
  },
];

export const CATEGORY_BY_SLUG: Record<CategorySlug, ProductCategory> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, ProductCategory>;

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return value !== undefined && Object.hasOwn(CATEGORY_BY_SLUG, value);
}
