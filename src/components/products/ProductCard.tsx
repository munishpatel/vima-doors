import { motion } from 'motion/react';
import { ArrowUpRight, FileDown } from 'lucide-react';

import { CATEGORY_BY_SLUG, type Product } from '@/data/products';
import DoorPlaceholder from './DoorPlaceholder';

export interface ProductCardProps {
  product: Product;
  onRequestQuote: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
        {label}
      </dt>
      <dd className="text-right text-[11.5px] leading-snug text-foreground/75">{value}</dd>
    </div>
  );
}

export default function ProductCard({
  product,
  onRequestQuote,
  onViewDetails,
}: ProductCardProps) {
  const category = CATEGORY_BY_SLUG[product.category];
  const { seed, spec } = product;
  const motif = category.motif;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="group flex flex-col border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(28,18,8,0.13)]"
    >
      {/* ── Imagery ─────────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* Front elevation, micro-zooms away on hover */}
        <DoorPlaceholder
          motif={motif}
          seed={seed}
          view="front"
          className="absolute inset-0 h-full w-full transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-0"
        />
        {/* Secondary angle: detail crop of the same drawing */}
        <DoorPlaceholder
          motif={motif}
          seed={seed}
          view="detail"
          className="absolute inset-0 h-full w-full scale-[1.06] opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
        />

        <span className="absolute left-3 top-3 bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/60 backdrop-blur-sm">
          {category.name}
        </span>
        <span className="absolute right-3 top-3 font-mono text-[9px] tracking-[0.12em] text-foreground/35">
          {product.code}
        </span>
        <span className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30">
          Photography pending
        </span>
      </div>

      {/* ── Copy and specs ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl leading-tight text-foreground">{product.name}</h3>

        <dl className="mt-3 divide-y divide-border border-y border-border">
          <SpecRow label="Core" value={spec.coreMaterial} />
          <SpecRow
            label="Thickness"
            value={spec.thickness.map((t) => `${t} mm`).join(' · ')}
          />
          <SpecRow label="Finish" value={spec.finishType} />
        </dl>

        <div className="mt-5 flex flex-1 items-end gap-2">
          <button
            type="button"
            onClick={() => onRequestQuote(product)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 bg-primary px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <FileDown size={12} />
            Request CAD / Quote
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            aria-label={`View details for ${product.name}`}
            className="inline-flex items-center justify-center gap-1.5 border border-border px-3 py-2.5 text-[10px] uppercase tracking-[0.14em] text-foreground/70 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
          >
            Details
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
