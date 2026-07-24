import { useState } from 'react';
import { motion } from 'motion/react';
import { HIGHLIGHTS, Highlight } from '@/data/gallery';
import StoryViewer from './StoryViewer';

export default function HighlightsRow() {
  const [active, setActive] = useState<Highlight | null>(null);

  if (HIGHLIGHTS.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex gap-6 overflow-x-auto pb-1 md:gap-8"
      >
        {HIGHLIGHTS.map((highlight) => (
          <button
            key={highlight.id}
            type="button"
            onClick={() => setActive(highlight)}
            aria-label={`View ${highlight.label} highlights`}
            className="group flex shrink-0 flex-col items-center gap-2 focus-visible:outline-none"
          >
            <div className="rounded-full border border-border/80 bg-gradient-to-tr from-stone-300 to-stone-200 p-[2px] transition-transform duration-200 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2">
              <div className="rounded-full bg-background p-[3px]">
                <img
                  src={highlight.cover}
                  alt={`${highlight.label} story highlight`}
                  loading="lazy"
                  className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
                />
              </div>
            </div>
            <span className="max-w-[5.5rem] truncate text-xs text-foreground/80">
              {highlight.label}
            </span>
          </button>
        ))}
      </motion.div>

      <StoryViewer highlight={active} onClose={() => setActive(null)} />
    </>
  );
}
