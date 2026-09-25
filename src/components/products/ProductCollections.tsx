import type { CSSProperties } from 'react';
import { motion } from 'motion/react';

import { mediaUrl } from '@/lib/cloudinary';

const CDN = 'https://res.cloudinary.com/vimadoors/image/upload';

/** A column is at most ~380 CSS px wide; 800px covers it at 2x. */
const TILE_TRANSFORM = 'f_auto,q_auto,w_800';

type Tile =
  | { kind: 'photo'; src: string; alt: string; /** width / height */ ratio: number }
  | {
      kind: 'card';
      title: string;
      subtitle?: string;
      body: string;
      tone: string;
      /** Pulled to the front of the grid below `lg`. */
      lead?: boolean;
    };

const DOORS_CARD: Tile = {
  kind: 'card',
  title: 'Doors',
  body: 'Discover quality doors that combine style, security, and durability today.',
  tone: '#e6e1da',
  lead: true,
};

const WPC_CARD: Tile = {
  kind: 'card',
  title: 'WPC',
  subtitle: 'Doors & Frames',
  body: 'Waterproof, termite-proof doors and frames, built for kitchens, bathrooms and humid spaces.',
  tone: '#cdd9da',
};

/**
 * Five masonry columns on desktop, mirroring the layout the design was drawn
 * from. Below `lg` the columns dissolve into a single two-up grid of
 * equal-height tiles, with the Doors card pulled to the front.
 */
const COLUMNS: Tile[][] = [
  [
    {
      kind: 'photo',
      src: `${CDN}/v1790276467/Jodhpur-Rasala-Door_qwosx4.webp`,
      alt: 'Honey teak panelled door beside a writing desk',
      ratio: 500 / 493,
    },
    {
      kind: 'photo',
      src: `${CDN}/v1790276469/Maharani-Collection_kpptyw.webp`,
      alt: 'Painted grey door with octagonal raised mouldings',
      ratio: 500 / 572,
    },
  ],
  [
    {
      kind: 'photo',
      src: `${CDN}/v1790276470/wd-furniture-hotspot-2-opt-636x1024_axlsun.webp`,
      alt: 'Teak entrance door with gold inlay and carved pilasters',
      ratio: 636 / 1024,
    },
    DOORS_CARD,
  ],
  [
    {
      kind: 'photo',
      src: `${CDN}/v1790276466/Jodhpur-Lancers-Door-Cat-768x878_rdhuib.webp`,
      alt: 'Dark wood door with diagonal cross panels in a modern living room',
      ratio: 768 / 878,
    },
    {
      kind: 'photo',
      src: `${CDN}/v1790276466/71VFr-uTFgL_dgmp2t.jpg`,
      alt: 'Wooden flush door with a geometric groove pattern',
      ratio: 1,
    },
  ],
  [
    WPC_CARD,
    {
      kind: 'photo',
      src: `${CDN}/v1790276471/WPC_door_im8ogr.webp`,
      alt: 'Walnut-finish WPC door with a square-groove motif in a bathroom',
      ratio: 500 / 795,
    },
  ],
  [
    {
      kind: 'photo',
      src: `${CDN}/v1790276472/WPC_Frame_oz4k58.jpg`,
      alt: 'WPC door frame profiles',
      ratio: 500 / 538,
    },
    {
      kind: 'photo',
      src: `${CDN}/v1790276473/WPC_starke_door_d360630bba_te1hz0.jpg`,
      alt: 'White WPC door with horizontal grooves',
      ratio: 1,
    },
  ],
];

const TILE_BASE =
  'relative overflow-hidden rounded-xl aspect-[4/5] lg:aspect-[var(--ratio)]';

function TileView({ tile }: { tile: Tile }) {
  if (tile.kind === 'card') {
    return (
      <div
        className={`flex flex-col justify-end rounded-xl p-4 sm:p-7 lg:px-8 lg:py-9 ${tile.lead ? 'max-lg:order-first' : ''}`}
        style={{ backgroundColor: tile.tone }}
      >
        <h3 className="font-heading text-[1.9rem] uppercase leading-none tracking-[0.02em] text-[#1e1a16] sm:text-[2.4rem]">
          {tile.title}
        </h3>
        {tile.subtitle && (
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] sm:text-[12px] sm:tracking-[0.16em] text-[#1e1a16]/70">
            {tile.subtitle}
          </p>
        )}
        <p className="mt-3 text-[12.5px] leading-[1.6] text-[#1e1a16]/65 sm:mt-4 sm:text-[14px] sm:leading-[1.75]">
          {tile.body}
        </p>
      </div>
    );
  }

  return (
    <figure
      className={`group ${TILE_BASE} bg-muted`}
      style={{ '--ratio': tile.ratio } as CSSProperties}
    >
      <img
        src={mediaUrl(tile.src, TILE_TRANSFORM)}
        alt={tile.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </figure>
  );
}

/**
 * Photo mosaic of the two product families — wooden doors and WPC doors &
 * frames. Carries the `#collection` anchor the banner's CTA scrolls to.
 */
export default function ProductCollections() {
  return (
    <section
      id="collection"
      aria-labelledby="collections-heading"
      className="scroll-mt-[84px] bg-background"
    >
      <div className="container mx-auto px-6 pb-24 pt-14 md:pt-20 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <h2
            id="collections-heading"
            className="font-heading text-[1.9rem] leading-tight text-foreground md:text-[2.4rem]"
          >
            Product Collections
          </h2>
          <p className="mt-3 text-[15px] text-foreground/60">
            Explore our wooden doors and WPC doors &amp; frames
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 lg:grid-cols-5 lg:items-start lg:gap-5">
          {COLUMNS.map((column, i) => (
            <div key={i} className="contents lg:flex lg:flex-col lg:gap-5">
              {column.map((tile) => (
                <TileView key={tile.kind === 'card' ? tile.title : tile.src} tile={tile} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
