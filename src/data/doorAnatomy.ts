/**
 * Anatomy hotspots for the products hero.
 *
 * Labels carry both the English term and the term the Indian door trade
 * actually uses on site — chowkhat, nakashi, kabza — because that is what a
 * customer will have heard from their carpenter or contractor.
 *
 * This file is deliberately free of any `three` import so the section shell,
 * the 2D fallback diagram and the banner's text list can all read it without
 * pulling the 3D bundle in. Camera framing is expressed in plain spherical
 * numbers; `CameraRig` is the only thing that turns them into a THREE.Spherical.
 */

export type AnatomyPartId = 'frame' | 'stile-rail' | 'carving' | 'hinges' | 'lock';

export interface CameraFraming {
  /** Look-at point, world space. */
  target: [number, number, number];
  /** Distance from target. */
  radius: number;
  /** Polar angle from +Y, radians. PI/2 is eye level. */
  phi: number;
  /** Azimuth from +Z toward +X, radians. */
  theta: number;
}

/**
 * Exploded-view travel for each callout, metres. The leaf (stiles, rails and
 * panels) stays put and everything else pulls away from it: the chowkhat
 * backwards, the carving forwards, the hardware out to its own side.
 */
export const EXPLODE_OFFSETS: Record<AnatomyPartId, [number, number, number]> = {
  frame: [0, 0, -0.75],
  'stile-rail': [0, 0, 0],
  carving: [0, 0, 0.45],
  hinges: [-0.22, 0, 0.22],
  lock: [0.36, 0, 0.32],
};

export interface AnatomyPart {
  id: AnatomyPartId;
  /** Two-digit callout number. */
  callout: string;
  label: string;
  /** One or two words, for the blueprint callout tags. */
  short: string;
  /** One line, shown when the part is hovered in the banner. */
  summary: string;
  description: string;
  specs: { label: string; value: string }[];
  /** World-space anchor for the 3D callout. */
  anchor: [number, number, number];
  /** Callout position in the 2D fallback SVG's 0–100 viewBox space. */
  anchor2d: [number, number];
  /** Point on the drawing the 2D leader line runs to. */
  leader2d: [number, number];
}


export const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'frame',
    callout: '01',
    label: 'Doorframe / Chowkhat',
    short: 'Chowkhat',
    summary: 'Seasoned hardwood chowkhat, rebated for the shutter',
    description:
      'The chowkhat carries every load the shutter puts into the wall. Ours is seasoned hardwood, machined with a continuous rebate so the door seats against one unbroken face — not a stop patti nailed on afterwards. Treated against termite before it leaves the works.',
    specs: [
      { label: 'Section', value: '100 × 62 mm' },
      { label: 'Timber', value: 'Seasoned sal or teak' },
      { label: 'Rebate', value: '12 mm integral' },
      { label: 'Fixing', value: 'M8 sleeve anchor × 6' },
    ],
    anchor: [-0.49, 1.09, 0.08],
    anchor2d: [11, 10],
    leader2d: [27.5, 6],
  },
  {
    id: 'stile-rail',
    callout: '02',
    label: 'Stile & Rail',
    short: 'Stile & Rail',
    summary: 'Mortise-and-tenon core that will not sag or rack',
    description:
      'Stiles run the full height and the rails tenon into them, so the shutter resists racking on its own before any veneer goes on. The lock rail is deepened to take a mortise case without cutting into anything structural. Timber is kiln-seasoned, which is what stops a door swelling shut in the monsoon.',
    specs: [
      { label: 'Stile width', value: '120 mm' },
      { label: 'Lock rail', value: '220 mm' },
      { label: 'Joint', value: 'Twin mortise & tenon' },
      { label: 'Moisture', value: 'Kiln-seasoned, 8–10%' },
    ],
    anchor: [0.39, 0.42, 0.035],
    anchor2d: [89, 46],
    leader2d: [68, 40],
  },
  {
    id: 'carving',
    callout: '03',
    label: 'Carving / Nakashi',
    short: 'Nakashi',
    summary: 'CNC-cut reeding and nakashi, finished by hand',
    description:
      'Reeding and nakashi work are cut on a 3-axis router from the same program every time — that is what lets a repeat order match one placed two years ago. Edges are broken by hand before polish so the grain is never left sharp.',
    specs: [
      { label: 'Reed pitch', value: '42 mm' },
      { label: 'Cut depth', value: '6 mm' },
      { label: 'Tooling', value: '3-axis CNC, 8 mm ball' },
      { label: 'Polish', value: 'Matte PU, 3 coats' },
    ],
    anchor: [0.0, 0.66, 0.05],
    anchor2d: [89, 20],
    leader2d: [56, 28],
  },
  {
    id: 'hinges',
    callout: '04',
    label: 'Hinges / Kabza',
    short: 'Kabza',
    summary: 'Fully concealed 3D-adjustable kabza, rated to 80 kg',
    description:
      'Concealed kabza keep the closed face completely clean — no knuckles breaking the chowkhat line. Three axes of adjustment mean the reveal can be corrected on site without re-cutting the mortise, which matters when plaster is never quite plumb.',
    specs: [
      { label: 'Type', value: 'Concealed, 3D adjustable' },
      { label: 'Load', value: '80 kg on 3 kabza' },
      { label: 'Opening', value: '180°' },
      { label: 'Finish', value: 'Satin nickel' },
    ],
    anchor: [-0.45, 0.78, 0.03],
    anchor2d: [11, 44],
    leader2d: [30, 51],
  },
  {
    id: 'lock',
    callout: '05',
    label: 'Lock & Handle',
    short: 'Mortise Lock',
    summary: 'Full mortise case with a solid brass lever',
    description:
      'A mortise case sits inside the lock rail rather than a tubular latch bored through it, so the hardware is as solid as the door. The lever is solid brass on a 52 mm rose, sized to the stile rather than the other way round.',
    specs: [
      { label: 'Case', value: '72 mm centres, 60 mm backset' },
      { label: 'Cylinder', value: 'Euro profile, 6-pin' },
      { label: 'Lever', value: 'Solid brass, 52 mm rose' },
      { label: 'Tested', value: '200,000 cycles' },
    ],
    anchor: [0.38, -0.05, 0.11],
    anchor2d: [89, 72],
    leader2d: [71, 55],
  },
];
