import type { ProductCategory } from '@/data/products';
import { mediaUrl } from '@/lib/cloudinary';

/**
 * Cover banners are shot at 2000 × 342, with the doors standing at 18–33% of
 * the width and bare wall to their right for the title.
 */
const COVER_RATIO = 2000 / 342;
/** Where the doors sit, as a share of the photo's width. */
const DOORS_CENTRE = 0.255;
const TITLE_START = 0.36;
/** Horizontal focus when a narrow screen crops the banner: keeps the doors in frame. */
const FOCUS_X = 0.22;

/**
 * The banner is a size container, and everything inside is laid out on a
 * "photo" box that covers it the way `object-fit: cover` would. Positions on
 * that box are photo percentages, so the title clears the doors at any crop.
 */
const PHOTO_W = `max(100cqw, 100cqh * ${COVER_RATIO})`;
const PHOTO_LEFT = `calc((100cqw - ${PHOTO_W}) * ${FOCUS_X})`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";

/** Until a collection's cover is shot: its door, framed, against a painted wall. */
function ComposedCover({ category }: { category: ProductCategory }) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: category.wall }}>
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />
      {/* Skirting line, with the floor a shade darker below it. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3.5%] bg-black/10" />
      <div aria-hidden className="absolute inset-x-0 bottom-[3.5%] h-px bg-white/55" />
      <div
        className="absolute bottom-0 top-[7%] bg-[#5b3e2b] shadow-[0_12px_28px_rgba(30,20,10,0.35)]"
        style={{
          width: '40cqh',
          left: `calc(${DOORS_CENTRE * 100}% - 20cqh)`,
          padding: '2.2cqh 2.2cqh 0',
        }}
      >
        <img
          src={mediaUrl(category.image, 'f_auto,q_auto,h_600')}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default function CategoryCover({ category }: { category: ProductCategory }) {
  return (
    <div
      className="relative h-[180px] overflow-hidden sm:h-[220px] lg:h-auto lg:aspect-[2000/342]"
      style={{ containerType: 'size', backgroundColor: category.wall }}
    >
      <div className="absolute inset-y-0" style={{ width: PHOTO_W, left: PHOTO_LEFT }}>
        {category.cover ? (
          <img
            src={category.cover}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <ComposedCover category={category} />
        )}
      </div>

      <div
        className="absolute inset-y-0 right-4 flex items-center"
        style={{ left: `calc(${PHOTO_LEFT} + ${PHOTO_W} * ${TITLE_START})` }}
      >
        <h1
          className="font-heading font-semibold leading-[1.02] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.18)]"
          style={{ fontSize: 'min(24cqh, 8.5cqw)' }}
        >
          {category.title}
        </h1>
      </div>
    </div>
  );
}
