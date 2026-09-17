import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Hand, Loader2, RotateCcw, Square } from 'lucide-react';

import {
  ANATOMY_PARTS,
  HOME_FRAMING,
  PART_BY_ID,
  type AnatomyPartId,
} from '@/data/doorAnatomy';
import { useRenderCapability } from '@/hooks/useRenderCapability';
import DoorDiagram2D from './DoorDiagram2D';

/** Everything that touches `three` sits behind this boundary. */
const DoorScene = lazy(() => import('./door3d/DoorScene'));

type ViewMode = '3d' | '2d';

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <Loader2 size={18} className="animate-spin text-primary/40" />
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/35">
        Preparing the door
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Spec card                                                          */
/* ------------------------------------------------------------------ */

function SpecCard({ activeId }: { activeId: AnatomyPartId | null }) {
  const part = activeId ? PART_BY_ID[activeId] : null;

  return (
    <AnimatePresence initial={false}>
      {part && (
        <motion.div
          key={part.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="overflow-hidden"
        >
          <div className="mt-6 grid gap-6 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-primary">{part.callout}</span>
                <h3 className="font-heading text-2xl leading-tight text-foreground">
                  {part.label}
                </h3>
              </div>
              <p className="mt-2.5 max-w-prose text-[13.5px] leading-relaxed text-foreground/65">
                {part.description}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden border border-border bg-border sm:grid-cols-4">
              {part.specs.map((spec) => (
                <div key={spec.label} className="bg-card px-3.5 py-3">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-[12.5px] leading-snug text-foreground/85">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function DoorAnatomyHero() {
  const { reducedMotion, webgl, lowPower, resolved } = useRenderCapability();

  const [activeId, setActiveId] = useState<AnatomyPartId | null>(null);
  const [hoverId, setHoverId] = useState<AnatomyPartId | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [mode, setMode] = useState<ViewMode>('3d');
  /** Null until the capability check has run, so we never flash the wrong view. */
  const [userMode, setUserMode] = useState<ViewMode | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Default to the flat elevation on weak or reduced-motion devices; an
  // explicit choice always wins.
  useEffect(() => {
    if (!resolved) return;
    setMode(userMode ?? (lowPower || reducedMotion ? '2d' : '3d'));
  }, [resolved, lowPower, reducedMotion, userMode]);

  // Mount the renderer only once the hero is on screen, and stop its render
  // loop again whenever it scrolls away.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const framing = useMemo(
    () => (activeId ? PART_BY_ID[activeId].camera : HOME_FRAMING),
    [activeId],
  );

  const select = useCallback((id: AnatomyPartId) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const deselect = useCallback(() => setActiveId(null), []);

  const reset = useCallback(() => {
    setActiveId(null);
    setHoverId(null);
    setResetKey((k) => k + 1);
  }, []);

  const show3d = mode === '3d' && webgl;

  return (
    <section aria-labelledby="anatomy-heading" className="relative w-full overflow-hidden">
      {/* Warm pool of light behind the door so the cream does not read flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 42%, rgba(193,142,74,0.16), transparent 70%)',
        }}
      />

      {/* ── Intro ───────────────────────────────────────────────────── */}
      <div className="container relative mx-auto max-w-3xl px-6 pt-14 text-center md:pt-16 lg:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/70">
          Anatomy of a Vima Door
        </span>
        <h2
          id="anatomy-heading"
          className="mt-5 font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-[3.4rem]"
        >
          Everything that matters
          <br className="hidden sm:block" /> is behind the face.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/60">
          Two doors can look identical in a showroom and behave nothing alike
          after one monsoon. Turn ours around and see what goes inside it.
        </p>
      </div>

      {/* ── Full-width stage ────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative mt-6 h-[58svh] min-h-[420px] w-full md:mt-8 md:h-[64svh] lg:h-[72svh] lg:min-h-[560px]"
      >
        {show3d ? (
          hasEntered ? (
            <Suspense fallback={<SceneSkeleton />}>
              <DoorScene
                activeId={activeId}
                hoverId={hoverId}
                framing={framing}
                resetKey={resetKey}
                reducedMotion={reducedMotion}
                paused={!inView}
                onSelect={select}
                onHoverChange={setHoverId}
                onDeselect={deselect}
              />
            </Suspense>
          ) : (
            <SceneSkeleton />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center py-4">
            <DoorDiagram2D
              activeId={activeId}
              hoverId={hoverId}
              onSelect={select}
              onHoverChange={setHoverId}
            />
          </div>
        )}

        {/* Hint */}
        <p className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/35 lg:left-10">
          <Hand size={11} />
          {show3d ? 'Drag to turn the door' : 'Tap a callout'}
        </p>

        {/* Controls */}
        <div className="absolute right-6 top-4 flex items-center gap-2 lg:right-10">
          {webgl && (
            <div
              role="group"
              aria-label="Door view"
              className="flex items-center border border-border bg-card/80 p-0.5 backdrop-blur-sm"
            >
              {(
                [
                  { value: '3d', label: '3D', icon: Box },
                  { value: '2d', label: '2D', icon: Square },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setUserMode(value)}
                  aria-pressed={mode === value}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                    mode === value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/55 hover:text-foreground'
                  }`}
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 border border-border bg-card/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/60 backdrop-blur-sm transition-colors duration-200 hover:border-foreground/30 hover:text-foreground"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </div>

      {/* ── Callout row + spec card ─────────────────────────────────── */}
      <div className="container relative mx-auto px-6 pb-16 md:pb-20 lg:px-10">
        {/* Accessible control surface for both the 3D and 2D views. */}
        <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ANATOMY_PARTS.map((part) => {
            const isActive = activeId === part.id;
            return (
              <li key={part.id} className="w-[220px] shrink-0 lg:w-auto">
                <button
                  type="button"
                  onClick={() => select(part.id)}
                  onMouseEnter={() => setHoverId(part.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(part.id)}
                  onBlur={() => setHoverId(null)}
                  aria-pressed={isActive}
                  className={`flex h-full w-full flex-col items-start border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    isActive
                      ? 'border-primary bg-primary/[0.06]'
                      : 'border-border bg-card hover:border-foreground/25'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] ${
                      isActive ? 'text-primary' : 'text-foreground/35'
                    }`}
                  >
                    {part.callout}
                  </span>
                  <span
                    className={`mt-2 text-[13px] leading-snug tracking-wide ${
                      isActive ? 'text-primary' : 'text-foreground/85'
                    }`}
                  >
                    {part.label}
                  </span>
                  <span className="mt-1.5 text-[11px] leading-snug text-foreground/45">
                    {part.summary}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <SpecCard activeId={activeId} />
      </div>
    </section>
  );
}
