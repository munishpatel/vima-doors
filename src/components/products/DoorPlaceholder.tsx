import { useMemo } from 'react';

import type { PlaceholderMotif } from '@/data/products';

/**
 * Stand-in artwork for product photography.
 *
 * Each category gets its own motif so the grid still communicates the design
 * language while the shoot is pending. Two viewBoxes over the same drawing
 * give us a full elevation and a zoomed detail crop, which is what the card
 * cross-fades between on hover.
 */

const PAPER = '#efe7da';
const BOARD = '#ded1bd';
const BOARD_DEEP = '#cdbda3';
const LINE = '#8a7457';
const BRASS = '#b08b4f';

/** Deterministic 0–1 sequence so a product's grain never reshuffles. */
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FACE = { x: 26, y: 10, w: 68, h: 142 };

function Motif({ motif, seed }: { motif: PlaceholderMotif; seed: number }) {
  const rand = useMemo(() => seeded(seed), [seed]);

  switch (motif) {
    case 'flute': {
      const count = 13;
      const gap = (FACE.w - 12) / (count - 1);
      return (
        <g stroke={LINE} strokeWidth="0.7" opacity="0.5">
          {Array.from({ length: count }, (_, i) => (
            <line
              key={i}
              x1={FACE.x + 6 + i * gap}
              y1={FACE.y + 8}
              x2={FACE.x + 6 + i * gap}
              y2={FACE.y + FACE.h - 8}
            />
          ))}
        </g>
      );
    }

    case 'inlay':
      return (
        <g fill="none">
          <rect
            x={FACE.x + 7}
            y={FACE.y + 7}
            width={FACE.w - 14}
            height={FACE.h - 14}
            stroke={BRASS}
            strokeWidth="1.1"
          />
          <line
            x1={FACE.x + 20}
            y1={FACE.y + 7}
            x2={FACE.x + 20}
            y2={FACE.y + FACE.h - 7}
            stroke={BRASS}
            strokeWidth="1.4"
          />
          <line
            x1={FACE.x + 24}
            y1={FACE.y + 7}
            x2={FACE.x + 24}
            y2={FACE.y + FACE.h - 7}
            stroke={BRASS}
            strokeWidth="0.6"
          />
        </g>
      );

    case 'highlight':
      return (
        <g fill="none" stroke={LINE} strokeWidth="1.2" opacity="0.6">
          <path d={`M ${FACE.x + 14} ${FACE.y + 18} L ${FACE.x + 14} ${FACE.y + 92}`} />
          <path
            d={`M ${FACE.x + 14} ${FACE.y + 92} L ${FACE.x + 44} ${FACE.y + 116}`}
            stroke={BRASS}
          />
          <path d={`M ${FACE.x + 44} ${FACE.y + 116} L ${FACE.x + 44} ${FACE.y + 132}`} />
        </g>
      );

    case 'cut-paste':
      return (
        <g>
          <rect
            x={FACE.x}
            y={FACE.y}
            width={FACE.w * 0.38}
            height={FACE.h}
            fill={BOARD_DEEP}
          />
          <rect
            x={FACE.x + FACE.w * 0.38}
            y={FACE.y + FACE.h * 0.3}
            width={FACE.w * 0.62}
            height={FACE.h * 0.26}
            fill={BOARD_DEEP}
            opacity="0.55"
          />
          <line
            x1={FACE.x + FACE.w * 0.38}
            y1={FACE.y}
            x2={FACE.x + FACE.w * 0.38}
            y2={FACE.y + FACE.h}
            stroke={LINE}
            strokeWidth="0.6"
          />
        </g>
      );

    case 'system':
      return (
        <g stroke={LINE} strokeWidth="0.8" opacity="0.45">
          {[0.22, 0.4, 0.58, 0.76].map((t) => (
            <line
              key={t}
              x1={FACE.x + 9}
              y1={FACE.y + FACE.h * t}
              x2={FACE.x + FACE.w - 9}
              y2={FACE.y + FACE.h * t}
            />
          ))}
        </g>
      );

    case 'heritage':
      return (
        <g fill="none" stroke={LINE} strokeWidth="0.7" opacity="0.6">
          {[
            [0.04, 0.26],
            [0.32, 0.26],
            [0.6, 0.34],
          ].flatMap(([top, h]) =>
            [0, 1].map((col) => (
              <rect
                key={`${top}-${col}`}
                x={FACE.x + 8 + col * ((FACE.w - 16) / 2 + 2)}
                y={FACE.y + 8 + FACE.h * top}
                width={(FACE.w - 18) / 2}
                height={FACE.h * h}
              />
            )),
          )}
        </g>
      );

    case 'grain':
    case 'book-match': {
      const mirrored = motif === 'book-match';
      const mid = FACE.x + FACE.w / 2;
      return (
        <g stroke={LINE} strokeWidth="0.5" fill="none" opacity="0.4">
          {Array.from({ length: 11 }, (_, i) => {
            const offset = 3 + i * 3.2;
            const bow = 4 + rand() * 7;
            const path = (dir: number) =>
              `M ${mid + dir * offset} ${FACE.y + 4}
               C ${mid + dir * (offset + bow)} ${FACE.y + FACE.h * 0.33},
                 ${mid + dir * (offset - bow * 0.6)} ${FACE.y + FACE.h * 0.68},
                 ${mid + dir * offset} ${FACE.y + FACE.h - 4}`;
            return (
              <g key={i}>
                <path d={path(1)} />
                <path d={path(mirrored ? -1 : 1)} transform={mirrored ? '' : `translate(${-offset * 2} 0)`} />
              </g>
            );
          })}
          {mirrored && (
            <line x1={mid} y1={FACE.y + 4} x2={mid} y2={FACE.y + FACE.h - 4} strokeWidth="0.7" />
          )}
        </g>
      );
    }

    case 'jaali': {
      const cols = 5;
      const rows = 7;
      const cw = (FACE.w - 22) / cols;
      const ch = (FACE.h * 0.44) / rows;
      return (
        <g fill="none" stroke={BRASS} strokeWidth="0.55" opacity="0.75">
          <path
            d={`M ${FACE.x + 11} ${FACE.y + 40}
                A ${FACE.w / 2 - 11} ${22} 0 0 1 ${FACE.x + FACE.w - 11} ${FACE.y + 40}`}
          />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={FACE.x + 11 + c * cw + 1}
                y={FACE.y + 46 + r * ch + 1}
                width={cw - 2}
                height={ch - 2}
                rx="0.8"
              />
            )),
          )}
          <circle cx={FACE.x + FACE.w / 2} cy={FACE.y + 26} r="4" />
        </g>
      );
    }
  }
}

export interface DoorPlaceholderProps {
  motif: PlaceholderMotif;
  seed: number;
  /** `detail` reuses the same drawing through a tighter viewBox. */
  view?: 'front' | 'detail';
  className?: string;
}

export default function DoorPlaceholder({
  motif,
  seed,
  view = 'front',
  className,
}: DoorPlaceholderProps) {
  const viewBox = view === 'front' ? '0 0 120 162' : '38 34 52 70';

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="0" y="0" width="120" height="162" fill={PAPER} />

      {/* Jamb and reveal, so the leaf sits in an opening rather than floating */}
      <rect
        x={FACE.x - 5}
        y={FACE.y - 5}
        width={FACE.w + 10}
        height={FACE.h + 5}
        fill={BOARD_DEEP}
        opacity="0.5"
      />
      <rect x={FACE.x} y={FACE.y} width={FACE.w} height={FACE.h} fill={BOARD} />

      <Motif motif={motif} seed={seed} />

      {/* Stiles read on every door regardless of motif */}
      <g stroke={LINE} strokeWidth="0.4" opacity="0.35">
        <line x1={FACE.x + 6} y1={FACE.y} x2={FACE.x + 6} y2={FACE.y + FACE.h} />
        <line
          x1={FACE.x + FACE.w - 6}
          y1={FACE.y}
          x2={FACE.x + FACE.w - 6}
          y2={FACE.y + FACE.h}
        />
      </g>

      {/* Lever */}
      <g>
        <circle cx={FACE.x + FACE.w - 11} cy={FACE.y + FACE.h * 0.52} r="2.4" fill={BRASS} />
        <rect
          x={FACE.x + FACE.w - 22}
          y={FACE.y + FACE.h * 0.52 - 0.9}
          width="11"
          height="1.8"
          rx="0.9"
          fill={BRASS}
        />
      </g>

      {/* Contact shadow */}
      <rect x={FACE.x - 5} y={FACE.y + FACE.h} width={FACE.w + 10} height="3" fill={LINE} opacity="0.18" />
    </svg>
  );
}
