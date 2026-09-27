import { useQuery } from '@tanstack/react-query';
import { BookOpen, Download } from 'lucide-react';

import { listByTag, mediaUrl } from '@/lib/cloudinary';

const WHATSAPP_CATALOGUE = 'https://wa.me/c/918106802929';

/** Cloudinary tag on the catalogue PDF. Re-tag a new PDF to replace it. */
const CATALOGUE_TAG = 'Catelogue';

/** A page of the PDF, rendered to an image by Cloudinary. */
function pageImage(pdf: string, page: number): string {
  return mediaUrl(pdf, `pg_${page},f_auto,q_auto,w_360`).replace(/\.pdf$/i, '.jpg');
}

/**
 * Dark green strip offering the catalogue: browse it in the WhatsApp
 * catalogue, or open the PDF tagged on Cloudinary in a new tab, where the
 * browser's viewer offers the download. Its cover and first page fan out on
 * the left, rendered from the same PDF.
 */
export default function CatalogueBanner() {
  const { data } = useQuery({
    queryKey: ['cloudinary-tag', CATALOGUE_TAG],
    queryFn: ({ signal }) => listByTag(CATALOGUE_TAG, signal),
  });
  const pdf = data?.[0];

  return (
    <section
      aria-labelledby="catalogue-heading"
      className="relative overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(120% 160% at 18% 0%, #15603d 0%, #0c3f28 48%, #072a1a 100%)',
      }}
    >
      <div className="container mx-auto px-6 py-12 md:py-14 lg:px-10">
        <div className="relative border border-white/25 px-6 py-10 text-center sm:px-10 md:py-12 lg:pl-[24%] lg:pr-[6%]">
          {pdf && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-[3%] top-1/2 hidden h-[128%] -translate-y-1/2 lg:block"
            >
              <img
                src={pageImage(pdf, 2)}
                alt=""
                loading="lazy"
                className="absolute left-0 top-[6%] h-full w-auto -rotate-[16deg] shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
              />
              <img
                src={pageImage(pdf, 1)}
                alt=""
                loading="lazy"
                className="relative left-[42%] h-full w-auto -rotate-[5deg] shadow-[0_22px_48px_rgba(0,0,0,0.5)]"
              />
            </div>
          )}

          <h2
            id="catalogue-heading"
            className="font-heading text-[2rem] leading-tight md:text-[2.6rem]"
          >
            Download Our Latest Catalogue
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75">
            Explore the latest Vima Doors designs and finishes. Browse the full catalogue on
            WhatsApp, or download it as a PDF to keep.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_CATALOGUE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-white/60 px-6 py-3 text-[14px] font-medium transition-colors hover:bg-white/10"
            >
              <BookOpen size={16} aria-hidden />
              View on WhatsApp
            </a>
            {pdf && (
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-[14px] font-semibold text-[#0f5c3a] transition-opacity hover:opacity-90"
              >
                <Download size={16} aria-hidden />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
