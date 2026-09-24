import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowLeftRight, Hand, PencilRuler } from 'lucide-react';

import { ANATOMY_PARTS, type AnatomyPartId } from '@/data/doorAnatomy';
import { useRenderCapability } from '@/hooks/useRenderCapability';
import { mediaUrl } from '@/lib/cloudinary';
import DoorDiagram2D from './DoorDiagram2D';

/** Everything that touches `three` sits behind these boundaries. */
const InstalledScene = lazy(() => import('./door3d/InstalledScene'));
const BlueprintScene = lazy(() => import('./door3d/BlueprintScene'));

const CUSTOM_DESIGN_HREF =
  'https://wa.me/918106802929?text=' +
  encodeURIComponent("Hi, I'd like Vima Doors to build a door to my own design.");

const WALL = '#dccbb3';

/**
 * A fluted Vima door, cut out of its product photo at the CDN. `e_trim` drops
 * the outer white border; the photo still has a pale panel to the door's right
 * and a strip of floor beneath it, so a relative crop then keeps only the
 * door: the left 65% and top 92% of the trimmed frame, just inside its edges.
 */
const DOOR_PHOTO = mediaUrl(
  'https://res.cloudinary.com/vimadoors/image/upload/v1790272377/Fluted_1_oulo1t.jpg',
  'e_trim:20:white/c_crop,g_north_west,w_0.65,h_0.92/f_jpg,q_auto,w_1024',
);
const BLUEPRINT_BG = 'radial-gradient(90% 70% at 55% 45%, #1c2a36 0%, #121c25 55%, #0c1319 100%)';
/** Fine 10 mm grid with a heavier 50 mm section line, like drafting film. */
const BLUEPRINT_GRID = [
  'linear-gradient(rgba(143,179,204,0.07) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(143,179,204,0.07) 1px, transparent 1px)',
  'linear-gradient(rgba(143,179,204,0.12) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(143,179,204,0.12) 1px, transparent 1px)',
].join(', ');

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15 + i * 0.1,
      ease: 'easeOut' as const,
    },
  }),
};

function scrollToCollection() {
  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ------------------------------------------------------------------ */
/*  2D fallbacks                                                       */
/* ------------------------------------------------------------------ */

/** The installed half without WebGL: painted wall, floor line, the door photo. */
function InstalledFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(180deg, #e3d4be 0%, ${WALL} 79.6%, #efe6d8 79.6%, #efe6d8 80.4%, #e9e1d4 80.4%, #ded3c3 100%)`,
      }}
    >
      <img
        src={DOOR_PHOTO}
        alt="A fluted Vima door installed in a home"
        className="absolute bottom-[19.6%] left-1/2 h-[36%] -translate-x-1/2 object-contain drop-shadow-[0_12px_18px_rgba(40,25,10,0.25)] md:left-auto md:right-[18%] md:h-[66%] md:translate-x-0"
      />
    </div>
  );
}

/** The blueprint half without WebGL: the labelled elevation on a drafting sheet. */
function BlueprintFallback() {
  return (
    <div className="absolute bottom-[5%] left-1/2 top-[56%] aspect-square -translate-x-1/2 bg-[#f3ebdf] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:bottom-[12%] md:left-auto md:right-[7%] md:top-[14%] md:aspect-[2/3] md:translate-x-0 md:p-3">
      <DoorDiagram2D />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Banner                                                             */
/* ------------------------------------------------------------------ */

export default function ProductsHero() {
  const { reducedMotion, webgl, lowPower, resolved } = useRenderCapability();
  const [hoverId, setHoverId] = useState<AnatomyPartId | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Stop both render loops whenever the banner scrolls away.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px 0px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show3d = resolved && webgl && !lowPower;
  const show2d = resolved && !show3d;
  const paused = !inView;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="products-hero-heading"
      className="relative isolate -mt-6 grid w-full md:mt-0 xl:h-[clamp(540px,40vw,760px)] xl:grid-cols-2"
    >
      {/* ── Left: the finished door, installed ───────────────────────── */}
      <div
        className="relative h-[580px] overflow-hidden md:h-[520px] xl:h-full"
        style={{ background: WALL }}
      >
        {show3d && (
          <Suspense fallback={null}>
            <div className="absolute inset-0">
              <InstalledScene
                doorPhoto={DOOR_PHOTO}
                paused={paused}
                reducedMotion={reducedMotion}
              />
            </div>
          </Suspense>
        )}
        {show2d && <InstalledFallback />}

        {/* Soft limewash scrim so the headline always sits on clean wall. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#efe4d3]/90 via-[#efe4d3]/30 to-transparent md:bg-gradient-to-r md:from-[#efe4d3]/85 md:via-[#efe4d3]/30 md:via-30% md:to-transparent md:to-50%"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-8 md:inset-y-0 md:flex md:max-w-[56%] md:flex-col md:justify-center md:pl-10 md:pr-0 md:pt-0 lg:pl-12 xl:pl-16">
          <motion.span
            custom={0}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#7a4b1e]"
          >
            01 — In your home
          </motion.span>
          <motion.h1
            id="products-hero-heading"
            custom={1}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-3 font-heading text-[2.3rem] leading-[1.04] text-[#2a1c12] md:text-[2.8rem] lg:mt-4 xl:text-[3rem] 2xl:text-[3.4rem]"
          >
            Luxury Wooden Doors <span className="block text-[#7a4b1e]">by Vima Doors</span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-3 max-w-[20rem] text-[13.5px] leading-relaxed text-[#2a1c12]/70 lg:mt-5 lg:text-[15px]"
          >
            Hand-finished and hung true — this is how a Vima door looks once it is home.
          </motion.p>
          <motion.div
            custom={3}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-5 lg:mt-8"
          >
            <button
              type="button"
              onClick={scrollToCollection}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12.5px] font-semibold tracking-wide text-[#2a1c12] shadow-[0_10px_30px_rgba(60,38,16,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(60,38,16,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Browse Our Collection
              <ArrowDown size={14} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Right: the same door, pulled apart ───────────────────────── */}
      <div
        className="relative h-[620px] overflow-hidden md:h-[540px] xl:h-full"
        style={{ background: BLUEPRINT_BG }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: BLUEPRINT_GRID,
            backgroundSize: '16px 16px, 16px 16px, 80px 80px, 80px 80px',
            maskImage: 'radial-gradient(85% 80% at 55% 50%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(85% 80% at 55% 50%, #000 40%, transparent 100%)',
          }}
        />

        {show3d && (
          <Suspense fallback={null}>
            <div className="absolute inset-0">
              <BlueprintScene
                paused={paused}
                reducedMotion={reducedMotion}
                hoverId={hoverId}
                onHoverChange={setHoverId}
              />
            </div>
          </Suspense>
        )}
        {show2d && <BlueprintFallback />}

        {/* Drafting-sheet crop marks */}
        <div aria-hidden className="pointer-events-none absolute inset-4 md:inset-6">
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ].map((pos) => (
            <span key={pos} className={`absolute h-4 w-4 border-[#8fb3cc]/40 ${pos}`} />
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 top-0 max-w-md px-6 pt-8 md:max-w-[50%] md:pl-10 md:pt-12 lg:pl-12 xl:pl-14">
          <motion.span
            custom={1}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[#8fb3cc]"
          >
            <PencilRuler size={12} />
            02 — Your design, engineered
          </motion.span>
          <motion.h2
            custom={2}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-3 font-heading text-[2rem] leading-[1.05] text-[#f3ebdf] md:text-[2.4rem] lg:mt-4 xl:text-[2.5rem] 2xl:text-[3rem]"
          >
            <span className="block whitespace-nowrap">You imagine it.</span>{' '}
            <span className="block whitespace-nowrap text-[#f3d9a8]">We build it.</span>
          </motion.h2>
          <motion.p
            custom={3}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-3 max-w-[19rem] text-[13px] leading-relaxed text-[#dbe7ef]/70 lg:mt-4 lg:text-[14px] xl:max-w-[16rem] 2xl:max-w-[19rem]"
          >
            Bring us a sketch, a photo or just an idea. We draw every member, choose the timber and
            build it to your design.
          </motion.p>
          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="visible"
            className="mt-5 lg:mt-7"
          >
            <a
              href={CUSTOM_DESIGN_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[#f3d9a8]/60 px-5 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#f3d9a8] transition-colors duration-300 hover:bg-[#f3d9a8] hover:text-[#1a1410] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3d9a8]"
            >
              Share Your Design
            </a>
          </motion.div>
        </div>

        {/* Parts, as text, for anyone not looking at the canvas. */}
        <ul className="sr-only">
          {ANATOMY_PARTS.map((part) => (
            <li key={part.id}>
              {part.label}: {part.summary}
            </li>
          ))}
        </ul>

        {show3d && (
          <p className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8fb3cc]/60 sm:flex md:bottom-9 md:right-10">
            <Hand size={11} />
            Drag to turn · hover a part
          </p>
        )}

        {/* Title strip, like the corner of a working drawing. */}
        <dl
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-6 hidden border border-[#8fb3cc]/30 font-mono text-[8.5px] uppercase tracking-[0.16em] md:bottom-9 md:left-10 md:flex lg:left-12 xl:left-14"
        >
          {[
            ['Client', 'Your home'],
            ['Maker', 'Vima Doors'],
            ['Units', 'mm'],
          ].map(([k, v], i) => (
            <div key={k} className={`flex ${i > 0 ? 'border-l border-[#8fb3cc]/30' : ''}`}>
              <dt className="px-2 py-1 text-[#8fb3cc]/50">{k}</dt>
              <dd className="py-1 pr-2 text-[#dbe7ef]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Seam: one door, two views ────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-10 hidden h-full -translate-x-1/2 xl:block"
      >
        <div className="h-full w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#f3ebdf] text-[#7a4b1e] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <ArrowLeftRight size={18} />
        </div>
      </div>
    </section>
  );
}
