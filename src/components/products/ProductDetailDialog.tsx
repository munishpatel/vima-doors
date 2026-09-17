import { ArrowUpRight } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CATEGORY_BY_SLUG, type Product } from '@/data/products';
import DoorPlaceholder from './DoorPlaceholder';

export interface ProductDetailDialogProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onRequestQuote: (product: Product) => void;
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });

export default function ProductDetailDialog({
  product,
  onOpenChange,
  onRequestQuote,
}: ProductDetailDialogProps) {
  const category = product ? CATEGORY_BY_SLUG[product.category] : null;

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        {product && category && (
          <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            <div className="relative aspect-[3/4] bg-muted md:aspect-auto">
              <DoorPlaceholder
                motif={category.motif}
                seed={product.seed}
                className="absolute inset-0 h-full w-full"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/30">
                Photography pending
              </span>
            </div>

            <div className="p-6 md:p-8">
              <DialogHeader className="space-y-0 text-left">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                  {category.name} &middot; {product.code}
                </span>
                <DialogTitle className="pt-2 font-heading text-3xl leading-tight">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="pt-2 text-[13px] leading-relaxed">
                  {category.tagline}
                </DialogDescription>
              </DialogHeader>

              <dl className="mt-6 divide-y divide-border border-y border-border">
                {[
                  { label: 'Core material', value: product.spec.coreMaterial },
                  {
                    label: 'Thickness',
                    value: product.spec.thickness.map((t) => `${t} mm`).join(' · '),
                  },
                  { label: 'Finish type', value: product.spec.finishType },
                  {
                    label: 'In catalog since',
                    value: DATE_FORMAT.format(new Date(product.releasedOn)),
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                      {row.label}
                    </dt>
                    <dd className="text-right text-[13px] text-foreground/80">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-[12px] leading-relaxed text-foreground/55">
                Every shutter is made to the opening. Send us the frame size and
                we will come back with a CAD set and a quote.
              </p>

              <button
                type="button"
                onClick={() => onRequestQuote(product)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                Request CAD / Quote
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
