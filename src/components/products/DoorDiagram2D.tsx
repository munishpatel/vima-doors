import { ANATOMY_PARTS, type AnatomyPartId } from '@/data/doorAnatomy';

/**
 * Flat teak elevation used instead of WebGL on low-power devices, when the
 * user prefers reduced motion, or when they pick "2D" by hand.
 *
 * Same five callouts, same palette and same interaction contract as the 3D
 * scene, so the surrounding shell does not need to know which one is mounted.
 * Callouts are `aria-hidden` here too — the button row below the frame is the
 * accessible control surface for both modes.
 */

const TEAK_DARK = '#8a5a2c';
const TEAK = '#a8703a';
const TEAK_LIGHT = '#b98045';
const TEAK_LIT = '#cd9350';
const SHADOW = '#5d3a17';
const BRASS = '#b98b44';
const BRASS_LIT = '#e0ae5c';

const REEDS = Array.from({ length: 9 }, (_, i) => 35.5 + i * 3.7);
const HINGE_ROWS = [18, 51, 84];

export interface DoorDiagram2DProps {
  activeId: AnatomyPartId | null;
  hoverId: AnatomyPartId | null;
  onSelect: (id: AnatomyPartId) => void;
  onHoverChange: (id: AnatomyPartId | null) => void;
}

export default function DoorDiagram2D({
  activeId,
  hoverId,
  onSelect,
  onHoverChange,
}: DoorDiagram2DProps) {
  const focus = hoverId ?? activeId;

  /** Muting is done with group opacity so the cream page washes the part back. */
  const dim = (id: AnatomyPartId) => (focus && focus !== id ? 0.4 : 1);
  const timber = (id: AnatomyPartId, base: string) => (focus === id ? TEAK_LIT : base);
  const brass = (id: AnatomyPartId) => (focus === id ? BRASS_LIT : BRASS);

  const hit = (id: AnatomyPartId) => ({
    className: 'cursor-pointer',
    onClick: () => onSelect(id),
    onPointerEnter: () => onHoverChange(id),
    onPointerLeave: () => onHoverChange(null),
    opacity: dim(id),
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      role="img"
      aria-label="Teak door elevation labelled with the chowkhat, stile and rail construction, carving, kabza and lock."
    >
      <defs>
        {/* Grain: turbulence stretched along the fibre direction. Low frequency
            on the fibre axis gives long streaks, high frequency across them. */}
        <filter id="vd-grain-v" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.38 0.012" numOctaves="5" seed="9" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28
                    0 0 0 0 0.16
                    0 0 0 0 0.06
                    0.85 0.25 0 0 -0.12"
          />
        </filter>
        <filter id="vd-grain-h" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.38" numOctaves="5" seed="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.28
                    0 0 0 0 0.16
                    0 0 0 0 0.06
                    0.85 0.25 0 0 -0.12"
          />
        </filter>
        <linearGradient id="vd-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
        <clipPath id="vd-leaf">
          <rect x="29.5" y="5.5" width="41" height="91.5" />
        </clipPath>
      </defs>

      {/* Contact shadow on the floor */}
      <ellipse cx="50" cy="97.6" rx="26" ry="1.5" fill={SHADOW} opacity="0.22" />

      {/* 01 — chowkhat */}
      <g {...hit('frame')}>
        <rect x="26" y="2" width="48" height="95" fill={timber('frame', TEAK_DARK)} />
        <rect x="26" y="2" width="48" height="95" filter="url(#vd-grain-v)" opacity="0.5" />
        {/* Rebate shadow where the shutter seats */}
        <rect x="29" y="5" width="42" height="92" fill={SHADOW} opacity="0.55" />
      </g>

      {/* 02 — stiles and rails */}
      <g {...hit('stile-rail')}>
        <rect x="29.5" y="5.5" width="41" height="91.5" fill={timber('stile-rail', TEAK)} />
        <g clipPath="url(#vd-leaf)">
          <rect x="29.5" y="5.5" width="5" height="91.5" filter="url(#vd-grain-v)" opacity="0.45" />
          <rect x="65.5" y="5.5" width="5" height="91.5" filter="url(#vd-grain-v)" opacity="0.45" />
          <rect x="34.5" y="5.5" width="31" height="8" filter="url(#vd-grain-h)" opacity="0.45" />
          <rect x="34.5" y="50" width="31" height="10" filter="url(#vd-grain-h)" opacity="0.45" />
          <rect x="34.5" y="86" width="31" height="11" filter="url(#vd-grain-h)" opacity="0.45" />
        </g>
        {/* Arris highlights along each member */}
        <g stroke="#e4b87c" strokeWidth="0.25" opacity="0.5">
          <line x1="34.6" y1="13.5" x2="34.6" y2="86" />
          <line x1="65.4" y1="13.5" x2="65.4" y2="86" />
        </g>
        <g stroke={SHADOW} strokeWidth="0.3" opacity="0.4">
          <line x1="34.4" y1="13.5" x2="65.6" y2="13.5" />
          <line x1="34.4" y1="50" x2="65.6" y2="50" />
          <line x1="34.4" y1="60" x2="65.6" y2="60" />
          <line x1="34.4" y1="86" x2="65.6" y2="86" />
        </g>
      </g>

      {/* 03 — carving / nakashi */}
      <g {...hit('carving')}>
        {/* Reeded upper panel */}
        <rect x="34.5" y="13.5" width="31" height="36.5" fill={timber('carving', TEAK_LIGHT)} />
        <rect x="34.5" y="13.5" width="31" height="36.5" filter="url(#vd-grain-v)" opacity="0.4" />
        {REEDS.map((x) => (
          <g key={x}>
            <rect x={x - 1.3} y="15.5" width="2.6" height="32.5" fill="#000" opacity="0.13" />
            <rect x={x - 0.45} y="15.5" width="0.9" height="32.5" fill="#f0c88c" opacity="0.5" />
          </g>
        ))}
        {/* Lower panel with bolection moulding and a nakashi rosette */}
        <rect x="34.5" y="60" width="31" height="26" fill={timber('carving', TEAK_LIGHT)} />
        <rect x="34.5" y="60" width="31" height="26" filter="url(#vd-grain-v)" opacity="0.4" />
        <rect
          x="37.5"
          y="63"
          width="25"
          height="20"
          fill="none"
          stroke={SHADOW}
          strokeWidth="0.9"
          opacity="0.45"
        />
        <rect
          x="38.2"
          y="63.7"
          width="25"
          height="20"
          fill="none"
          stroke="#f0c88c"
          strokeWidth="0.4"
          opacity="0.45"
        />
        <g fill="none" stroke={SHADOW} strokeWidth="0.8" opacity="0.5">
          <circle cx="50" cy="73" r="5.4" />
          <circle cx="50" cy="73" r="3.6" />
        </g>
        <g fill="none" stroke="#f0c88c" strokeWidth="0.35" opacity="0.5">
          <circle cx="50" cy="72.6" r="5.4" />
          <circle cx="50" cy="72.6" r="3.6" />
        </g>
      </g>

      {/* Overall sheen across the shutter, sells the polish */}
      <rect
        x="29.5"
        y="5.5"
        width="41"
        height="91.5"
        fill="url(#vd-sheen)"
        pointerEvents="none"
      />

      {/* 04 — kabza */}
      <g {...hit('hinges')}>
        {HINGE_ROWS.map((y) => (
          <g key={y}>
            <rect x="27.8" y={y} width="3.6" height="6" rx="0.5" fill={brass('hinges')} />
            <rect x="27.8" y={y} width="3.6" height="2" rx="0.5" fill="#fff" opacity="0.28" />
          </g>
        ))}
      </g>

      {/* 05 — lock and handle */}
      <g {...hit('lock')}>
        <rect x="69.6" y="50.5" width="1.4" height="9" rx="0.4" fill={brass('lock')} />
        <circle cx="64" cy="55" r="2.6" fill={brass('lock')} />
        <circle cx="64" cy="54.4" r="2.6" fill="#fff" opacity="0.22" />
        <rect x="56" y="54.1" width="8.2" height="1.8" rx="0.9" fill={brass('lock')} />
        <circle cx="64" cy="61.5" r="1.6" fill={brass('lock')} />
      </g>

      {/* Callouts */}
      {ANATOMY_PARTS.map((part) => {
        const [cx, cy] = part.anchor2d;
        const [lx, ly] = part.leader2d;
        const lit = focus === part.id;
        return (
          <g
            key={part.id}
            aria-hidden
            className="cursor-pointer"
            onClick={() => onSelect(part.id)}
            onPointerEnter={() => onHoverChange(part.id)}
            onPointerLeave={() => onHoverChange(null)}
            opacity={focus && !lit ? 0.45 : 1}
          >
            <line x1={cx} y1={cy} x2={lx} y2={ly} stroke={SHADOW} strokeWidth="0.3" opacity="0.5" />
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill={lit ? SHADOW : '#f6efe3'}
              stroke={SHADOW}
              strokeWidth="0.4"
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="3.6"
              fontFamily="var(--font-mono)"
              fill={lit ? '#f6efe3' : SHADOW}
            >
              {part.callout}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
