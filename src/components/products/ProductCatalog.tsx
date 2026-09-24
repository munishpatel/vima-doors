import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORIES,
  CATEGORY_BY_SLUG,
  PRODUCTS,
  SORT_OPTIONS,
  isCategorySlug,
  isSortKey,
  type Product,
  type SortKey,
} from '@/data/products';
import CategoryNav, { type CategoryFilter } from './CategoryNav';
import ProductCard from './ProductCard';
import ProductDetailDialog from './ProductDetailDialog';

const WA_NUMBER = '918106802929';

function quoteHref(product: Product): string {
  const message = `Hi Vima Doors, I'd like a CAD set and quote for ${product.name} (${product.code}).`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

const SORT_COMPARATORS: Record<SortKey, (a: Product, b: Product) => number> = {
  newest: (a, b) => b.releasedOn.localeCompare(a.releasedOn),
  popular: (a, b) => b.popularity - a.popularity,
  material: (a, b) =>
    a.spec.finishType.localeCompare(b.spec.finishType) ||
    a.spec.coreMaterial.localeCompare(b.spec.coreMaterial) ||
    a.name.localeCompare(b.name),
};

/** Fields a search query is matched against. */
function haystack(product: Product): string {
  return [
    product.name,
    product.code,
    CATEGORY_BY_SLUG[product.category].name,
    product.spec.coreMaterial,
    product.spec.finishType,
  ]
    .join(' ')
    .toLowerCase();
}

const COUNTS_BY_CATEGORY = PRODUCTS.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});

export default function ProductCatalog() {
  const [params, setParams] = useSearchParams();
  const gridTopRef = useRef<HTMLDivElement>(null);
  const [detail, setDetail] = useState<Product | null>(null);

  const categoryParam = params.get('category');
  const category: CategoryFilter = isCategorySlug(categoryParam) ? categoryParam : 'all';
  const sortParam = params.get('sort');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'newest';
  const query = params.get('q') ?? '';

  // Local mirror so typing stays responsive; the URL catches up on a debounce.
  const [queryDraft, setQueryDraft] = useState(query);
  useEffect(() => setQueryDraft(query), [query]);

  /**
   * All filter state lives in the URL so any view can be shared. Writes use
   * `replace` to keep the back button meaningful — it should leave the page,
   * not walk back through every keystroke.
   */
  const patchParams = useCallback(
    (changes: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  useEffect(() => {
    if (queryDraft === query) return;
    const id = window.setTimeout(() => patchParams({ q: queryDraft || null }), 250);
    return () => window.clearTimeout(id);
  }, [queryDraft, query, patchParams]);

  const handleCategoryChange = useCallback(
    (next: CategoryFilter) => {
      patchParams({ category: next === 'all' ? null : next });
      // Keep the grid in view when switching from far down the page.
      const top = gridTopRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) {
        gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [patchParams],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (needle === '' || haystack(p).includes(needle)),
    ).sort(SORT_COMPARATORS[sort]);
  }, [category, query, sort]);

  const activeCategory = category === 'all' ? null : CATEGORY_BY_SLUG[category];
  const filtersDirty = category !== 'all' || query !== '' || sort !== 'newest';

  return (
    <section id="collection" aria-labelledby="catalog-heading" className="scroll-mt-[84px] bg-background">
      <div className="container mx-auto px-6 pb-24 pt-16 md:pt-20 lg:px-10">
        {/* ── Section head ──────────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/70">
            The Catalog
          </span>
          <h2
            id="catalog-heading"
            className="mt-4 font-heading text-4xl leading-[1.1] text-foreground md:text-5xl"
          >
            {CATEGORIES.length} collections,
            <br />
            one standard of build.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            Browse by finish family. Every design here can be made to your
            opening, in any of the thicknesses listed.
          </p>
        </div>

        <CategoryNav
          active={category}
          counts={COUNTS_BY_CATEGORY}
          total={PRODUCTS.length}
          onChange={handleCategoryChange}
        />

        {/* ── Toolbar ───────────────────────────────────────────────── */}
        <div
          ref={gridTopRef}
          className="flex scroll-mt-32 flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="relative w-full md:max-w-xs">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/35"
            />
            <input
              type="search"
              value={queryDraft}
              onChange={(e) => setQueryDraft(e.target.value)}
              placeholder="Search by name, code or finish"
              aria-label="Search doors"
              className="w-full border border-border bg-card py-2.5 pl-9 pr-9 text-[13px] text-foreground placeholder:text-foreground/35 focus:border-foreground/30 focus:outline-none"
            />
            {queryDraft && (
              <button
                type="button"
                onClick={() => setQueryDraft('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-foreground/40 hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
              {visible.length} {visible.length === 1 ? 'design' : 'designs'}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-foreground/35" />
              <Select
                value={sort}
                onValueChange={(value) => patchParams({ sort: value === 'newest' ? null : value })}
              >
                <SelectTrigger
                  aria-label="Sort designs"
                  className="h-auto w-[170px] rounded-none border-border bg-card py-2.5 text-[12px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-[12px]">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Active category blurb ─────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          {activeCategory && (
            <motion.p
              key={activeCategory.slug}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mb-8 max-w-xl border-l-2 border-primary/40 pl-4 text-[13px] leading-relaxed text-foreground/60"
            >
              {activeCategory.tagline}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Grid ──────────────────────────────────────────────────── */}
        {visible.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRequestQuote={(p) => window.open(quoteHref(p), '_blank', 'noopener')}
                  onViewDetails={setDetail}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="font-heading text-2xl text-foreground">Nothing matches that yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] text-foreground/55">
              Try a different finish or clear the filters — and if you have a
              reference image, we can build to it.
            </p>
            {filtersDirty && (
              <button
                type="button"
                onClick={() => setParams({}, { replace: true })}
                className="mt-6 inline-flex items-center gap-2 border border-border px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-foreground/70 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <ProductDetailDialog
        product={detail}
        onOpenChange={(open) => !open && setDetail(null)}
        onRequestQuote={(p) => window.open(quoteHref(p), '_blank', 'noopener')}
      />
    </section>
  );
}
