import { Fragment } from 'react';
import { Html, Line } from '@react-three/drei';

import { ANATOMY_PARTS, type AnatomyPartId } from '@/data/doorAnatomy';

/**
 * Where each callout floats relative to its anchor. Purely a composition
 * concern — kept here rather than in the data file so the numbers can be
 * nudged without touching the 2D fallback.
 */
const LEADER_OFFSET: Record<AnatomyPartId, [number, number, number]> = {
  frame: [-0.34, 0.17, 0.1],
  'stile-rail': [0.36, 0.2, 0.12],
  carving: [0.0, 0.3, 0.24],
  hinges: [-0.36, 0.1, 0.12],
  lock: [0.3, -0.19, 0.16],
};

const LEADER_COLOR = '#8a6a43';
const LEADER_COLOR_LIT = '#4a2f18';

export interface AnnotationPinsProps {
  activeId: AnatomyPartId | null;
  hoverId: AnatomyPartId | null;
  onSelect: (id: AnatomyPartId) => void;
  onHoverChange: (id: AnatomyPartId | null) => void;
  /** Suppresses the idle attract pulse. */
  reducedMotion: boolean;
}

/**
 * Callout pins, rendered as DOM through `drei/Html` so the type stays crisp at
 * any camera distance.
 *
 * The pins are hidden from assistive tech on purpose: `DoorAnatomyHero`
 * renders the same five parts as a real button group below the canvas, which
 * gives keyboard and screen-reader users one unambiguous control surface
 * instead of two competing sets of tab stops.
 */
export default function AnnotationPins({
  activeId,
  hoverId,
  onSelect,
  onHoverChange,
  reducedMotion,
}: AnnotationPinsProps) {
  return (
    <>
      {ANATOMY_PARTS.map((part) => {
        const offset = LEADER_OFFSET[part.id];
        const tip: [number, number, number] = [
          part.anchor[0] + offset[0],
          part.anchor[1] + offset[1],
          part.anchor[2] + offset[2],
        ];
        const isActive = activeId === part.id;
        const isHover = hoverId === part.id;
        const lit = isActive || isHover;
        const muted = Boolean(activeId ?? hoverId) && !lit;

        return (
          <Fragment key={part.id}>
            <Line
              points={[part.anchor, tip]}
              color={lit ? LEADER_COLOR_LIT : LEADER_COLOR}
              lineWidth={lit ? 1.5 : 1}
              transparent
              opacity={muted ? 0.2 : 0.55}
            />
            {/* `Html` sizes its wrapper to the content, so the button's box is
                the only part of the canvas that stops an orbit drag. The label
                is therefore positioned out of flow rather than sitting in the
                button's flex row, where its invisible width would swallow
                drags alongside every pin. */}
            <Html position={tip} center zIndexRange={[20, 0]}>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => onSelect(part.id)}
                onPointerEnter={() => onHoverChange(part.id)}
                onPointerLeave={() => onHoverChange(null)}
                className={[
                  'group relative flex select-none items-center',
                  'transition-opacity duration-300',
                  muted ? 'opacity-45' : 'opacity-100',
                ].join(' ')}
              >
                <span className="relative flex h-7 w-7 items-center justify-center">
                  {!reducedMotion && !activeId && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/25" />
                  )}
                  <span
                    className={[
                      'relative flex h-7 w-7 items-center justify-center rounded-full',
                      'font-mono text-[10px] shadow-[0_2px_10px_rgba(60,38,16,0.28)]',
                      'transition-all duration-300',
                      lit
                        ? 'scale-110 bg-primary text-primary-foreground'
                        : 'border border-primary/25 bg-background/90 text-primary backdrop-blur-sm',
                    ].join(' ')}
                  >
                    {part.callout}
                  </span>
                </span>

                <span
                  className={[
                    'pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2',
                    'whitespace-nowrap rounded-sm bg-background/92 px-2.5 py-1 shadow-[0_2px_10px_rgba(60,38,16,0.18)]',
                    'text-[10px] uppercase tracking-[0.16em] text-foreground/80 backdrop-blur-sm',
                    'transition-opacity duration-300',
                    lit ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                >
                  {part.label}
                </span>
              </button>
            </Html>
          </Fragment>
        );
      })}
    </>
  );
}
