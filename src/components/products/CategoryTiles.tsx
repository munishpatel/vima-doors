import { useState } from 'react';

import { CATEGORIES, type ProductCategory } from '@/data/products';
import { mediaUrl } from '@/lib/cloudinary';
import DoorPlaceholder from './DoorPlaceholder';

/** Portrait tile, sized for the widest a tile ever gets (~300 CSS px at 2x). */
const TILE_TRANSFORM = 'f_auto,q_auto,w_640';

/** A different painted wall behind each door, so the row reads as many rooms. */
const WALLS = [
  '#e6dac8',
  '#d9c7ab',
  '#e9e2d6',
  '#d8cdbd',
  '#e4d2bb',
  '#dcd5c9',
  '#e8d9c3',
  '#d6c4ab',
  '#e3dccf',
];

function Tile({
  category,
  wall,
  seed,
  onSelect,
}: {
  category: ProductCategory;
  wall: string;
  seed: number;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Browse ${category.name} doors`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-md text-left shadow-[0_10px_30px_rgba(60,38,16,0.08)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(60,38,16,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {failed ? (
        <DoorPlaceholder
          motif={category.motif}
          seed={seed}
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(180deg, ${wall} 0%, ${wall} 84%, #b89572 84%, #9c7a58 100%)`,
          }}
        >
          {/* Skirting, so the door stands in a room rather than on a swatch. */}
          <div aria-hidden className="absolute inset-x-0 top-[81%] h-[3%] bg-[#f3ece1]" />
          <img
            src={mediaUrl(category.image, TILE_TRANSFORM)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-x-[14%] bottom-[15%] top-[8%] h-[77%] w-[72%] object-contain object-bottom drop-shadow-[0_10px_14px_rgba(40,25,10,0.28)]"
          />
        </div>
      )}

      <span className="absolute left-1/2 top-1/2 w-max max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-center text-[13px] font-semibold leading-tight sm:px-5 sm:text-[14px] tracking-wide text-[#2a1c12] shadow-[0_6px_20px_rgba(40,25,10,0.16)] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground md:text-[15px] xl:whitespace-nowrap">
        {category.name}
      </span>
    </button>
  );
}

/** Picture tiles for each collection. Choosing one scrolls to the product collections below. */
export default function CategoryTiles() {
  const select = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    // Nine collections: 2-up on phones, a 3 × 3 block on tablets, 5 + 4 on desktop.
    <ul className="flex flex-wrap justify-center gap-4 md:gap-5">
      {CATEGORIES.map((category, i) => (
        <li
          key={category.slug}
          className="w-[calc((100%-1rem)/2)] md:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-5rem)/5)]"
        >
          <Tile category={category} wall={WALLS[i % WALLS.length]} seed={i + 1} onSelect={select} />
        </li>
      ))}
    </ul>
  );
}
