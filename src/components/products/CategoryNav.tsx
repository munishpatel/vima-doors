import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

import { CATEGORIES, type CategorySlug } from '@/data/products';

export type CategoryFilter = CategorySlug | 'all';

export interface CategoryNavProps {
  active: CategoryFilter;
  counts: Record<string, number>;
  total: number;
  onChange: (next: CategoryFilter) => void;
}

/**
 * Sticky pill navigation.
 *
 * Offsets clear the fixed site header (60px mobile / 84px desktop). The active
 * pill is scrolled into view on change so deep-linking to `?category=veneer`
 * does not leave the selection off the right edge on a phone.
 */
export default function CategoryNav({ active, counts, total, onChange }: CategoryNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    const list = listRef.current;
    if (!el || !list) return;
    const elBox = el.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (elBox.left < listBox.left || elBox.right > listBox.right) {
      list.scrollTo({
        left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [active]);

  const items: { value: CategoryFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All Doors', count: total },
    ...CATEGORIES.map((c) => ({
      value: c.slug as CategoryFilter,
      label: c.name,
      count: counts[c.slug] ?? 0,
    })),
  ];

  return (
    <div className="sticky top-[60px] z-30 -mx-6 border-y border-border bg-background/85 backdrop-blur-md md:top-[84px] lg:-mx-10">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Door categories"
        className="container mx-auto flex gap-1 overflow-x-auto px-6 py-3 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.value === active;
          return (
            <button
              key={item.value}
              ref={isActive ? activeRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.value)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                isActive
                  ? 'text-primary-foreground'
                  : 'text-foreground/55 hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {item.label}
                <span className={isActive ? 'text-primary-foreground/60' : 'text-foreground/30'}>
                  {item.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
