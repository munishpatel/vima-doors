import { motion } from 'motion/react';
import { HIGHLIGHTS } from '@/data/gallery';

export default function HighlightsRow() {
  if (HIGHLIGHTS.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex gap-6 overflow-x-auto pb-1 md:gap-8"
    >
      {HIGHLIGHTS.map((highlight) => (
        <div
          key={highlight.id}
          className="flex shrink-0 flex-col items-center gap-2"
        >
          <div className="rounded-full border border-border/80 bg-gradient-to-tr from-stone-300 to-stone-200 p-[2px]">
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
        </div>
      ))}
    </motion.div>
  );
}
