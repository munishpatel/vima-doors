import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import CatalogueBanner from '@/components/products/CatalogueBanner';
import CategoryCover from '@/components/products/CategoryCover';
import CategoryStrip from '@/components/products/CategoryStrip';
import { CATEGORY_BY_SLUG, isCategorySlug, type ProductCategory } from '@/data/products';
import { listByTag, mediaUrl } from '@/lib/cloudinary';
import NotFoundPage from './_404';

/**
 * Pads every photo to 3:4 at the CDN, filling with its own backdrop colour,
 * so taller shots sit in the same card as the rest without cropping the door.
 */
const DESIGN_TRANSFORM = 'f_auto,q_auto,c_pad,ar_3:4,b_auto,w_600';

const WA_NUMBER = '918106802929';

const GRID = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4';

function DesignGrid({ category }: { category: ProductCategory }) {
  const { tag } = category;
  const { data: designs = [], isPending } = useQuery({
    queryKey: ['cloudinary-tag', tag],
    queryFn: ({ signal }) => listByTag(tag!, signal),
    enabled: tag !== undefined,
  });

  if (tag !== undefined && isPending) {
    return (
      <ul aria-busy="true" aria-label="Loading designs" className={`mt-10 ${GRID}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="rounded-xl bg-card p-2.5 ring-1 ring-black/5 sm:p-4">
            <div className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
          </li>
        ))}
      </ul>
    );
  }

  if (designs.length === 0) {
    const message = `Hi Vima Doors, I'd like to see your ${category.title} designs.`;
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="font-heading text-2xl text-foreground">
          Photos of our {category.title.toLowerCase()} are on their way.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-foreground/60">
          Message us and we will send you the current designs.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ask on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="mb-5 text-[14px] text-foreground/60">
        {designs.length} {designs.length === 1 ? 'design' : 'designs'}
      </p>
      <ul className={GRID}>
        {designs.map((src, i) => {
          const name = `${category.designName} ${String(i + 1).padStart(2, '0')}`;
          return (
            <li
              key={src}
              className="group rounded-xl bg-card p-2.5 shadow-[0_8px_24px_rgba(60,38,16,0.06)] ring-1 ring-black/5 sm:p-4"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={mediaUrl(src, DESIGN_TRANSFORM)}
                  alt={`${name} door`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 pb-1 text-center text-[14px] font-medium text-foreground sm:text-[15px]">
                {name}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function ProductCategoryPage() {
  const { slug } = useParams();
  if (!isCategorySlug(slug)) return <NotFoundPage />;

  const category = CATEGORY_BY_SLUG[slug];

  return (
    <>
      <title>{`${category.title} | Vima Doors`}</title>
      <meta
        name="description"
        content={`Browse ${category.title} by Vima Doors — made to measure in our own factory, or built to your design.`}
      />

      <CategoryStrip active={category.slug} />
      <CategoryCover category={category} />

      <section aria-label={`${category.title} designs`} className="bg-background">
        <div className="container mx-auto px-6 pb-24 pt-8 md:pt-10 lg:px-10">
          <DesignGrid category={category} />
        </div>
      </section>

      <CatalogueBanner />
    </>
  );
}
