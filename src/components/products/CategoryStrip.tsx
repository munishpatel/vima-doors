import { useEffect, useRef, type ComponentRef } from 'react';
import { NavLink } from 'react-router-dom';

import { CATEGORIES, type CategorySlug } from '@/data/products';
import CategoryIcon from './CategoryIcon';

/**
 * Thin strip of every collection above a category page's cover. It scrolls
 * sideways on narrow screens, keeping the current collection in view.
 */
export default function CategoryStrip({ active }: { active: CategorySlug }) {
  const activeRef = useRef<ComponentRef<'a'>>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [active]);

  return (
    <nav aria-label="Door collections" className="border-b border-border bg-card">
      <div className="container mx-auto px-6 lg:px-10">
        <ul className="-mx-3 flex overflow-x-auto [scrollbar-width:none] xl:justify-between [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => (
            <li key={category.slug} className="shrink-0">
              <NavLink
                to={`/products/${category.slug}`}
                ref={category.slug === active ? activeRef : undefined}
                className={({ isActive }) =>
                  // Active: the logo's green, with a rule along the strip's bottom edge.
                  `relative flex items-center gap-2 whitespace-nowrap px-3 py-3.5 text-[14px] transition-colors duration-200 ${
                    isActive
                      ? 'font-semibold text-[#0f5c3a] after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#0f5c3a]'
                      : 'text-foreground/75 hover:text-foreground'
                  }`
                }
              >
                <CategoryIcon motif={category.motif} className="h-[18px] w-[15px] shrink-0" />
                {category.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
