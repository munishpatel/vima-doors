import {
  createContext,
  memo,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

import type { AnatomyPartId } from '@/data/doorAnatomy';
import {
  WOOD_TONES,
  createBrassMaterial,
  createWoodMaterial,
  type Grain,
  type WoodMaterial,
} from './woodMaterial';

/* ------------------------------------------------------------------ */
/*  Per-part materials                                                 */
/* ------------------------------------------------------------------ */

interface PartMaterials {
  /** One material per grain direction: stiles run vertical, rails across. */
  wood: Record<Grain, THREE.MeshPhysicalMaterial>;
  metal: THREE.MeshPhysicalMaterial;
}

const MaterialContext = createContext<PartMaterials | null>(null);

export type PartVisualState = 'idle' | 'active' | 'muted';

interface PartProps {
  state: PartVisualState;
  /** Shifts the figure so adjacent members do not look like one board. */
  seed: number;
  children: ReactNode;
  /** Omitted for structural filler that should not respond to pointers. */
  onSelect?: () => void;
  onHoverChange?: (hovering: boolean) => void;
}

/**
 * Groups the members that make up one anatomy callout and animates their
 * appearance together.
 *
 * Selection is expressed physically rather than with an outline: the chosen
 * member gains a little exposure and a warm emissive lift while the rest fall
 * back, which keeps the frame looking like a photograph instead of a viewport.
 */
function Part({ state, seed, children, onSelect, onHoverChange }: PartProps) {
  const materials = useMemo<PartMaterials & { woodRefs: WoodMaterial[] }>(() => {
    const v = createWoodMaterial({ tone: WOOD_TONES.teak, grain: 'v', seed });
    const h = createWoodMaterial({ tone: WOOD_TONES.teak, grain: 'h', seed: seed + 4.3 });
    return {
      wood: { v: v.material, h: h.material },
      metal: createBrassMaterial(),
      woodRefs: [v, h],
    };
  }, [seed]);

  // 0 = natural, 1 = selected, -1 = pushed back.
  const level = useRef(0);

  useLayoutEffect(
    () => () => {
      materials.wood.v.dispose();
      materials.wood.h.dispose();
      materials.metal.dispose();
    },
    [materials],
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const goal = state === 'active' ? 1 : state === 'muted' ? -1 : 0;
    level.current = THREE.MathUtils.damp(level.current, goal, 6, delta);
    const t = level.current;

    for (const { uniforms } of materials.woodRefs) {
      uniforms.uHighlight.value = t;
    }
    materials.metal.emissiveIntensity = Math.max(t, 0) * 0.3;
    materials.metal.envMapIntensity = 1.8 + t * 0.6;
  });

  const interactive = Boolean(onSelect);

  return (
    <group
      onClick={
        interactive
          ? (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onSelect?.();
            }
          : undefined
      }
      onPointerOver={
        interactive
          ? (e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onHoverChange?.(true);
            }
          : undefined
      }
      onPointerOut={interactive ? () => onHoverChange?.(false) : undefined}
    >
      <MaterialContext.Provider value={materials}>{children}</MaterialContext.Provider>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number];

/**
 * Every member gets a small eased arris rather than a hard 90° edge. It is the
 * single biggest thing separating machined joinery from an untouched box: the
 * bevel catches a specular highlight along each edge.
 */
const Member = memo(function Member({
  args,
  position,
  grain = 'v',
}: {
  args: Vec3;
  position: Vec3;
  grain?: Grain;
}) {
  const materials = useContext(MaterialContext);
  // Keep the radius inside the thinnest dimension or the bevel self-intersects.
  const radius = Math.min(0.004, Math.min(...args) * 0.34);

  return (
    <RoundedBox
      args={args}
      position={position}
      radius={radius}
      smoothness={2}
      creaseAngle={0.4}
      castShadow
      receiveShadow
      material={materials?.wood[grain]}
    />
  );
});

/** Half-round reeding bead, axis vertical like the fibres. */
const Bead = memo(function Bead({
  radius,
  height,
  position,
}: {
  radius: number;
  height: number;
  position: Vec3;
}) {
  const materials = useContext(MaterialContext);
  return (
    <mesh position={position} castShadow receiveShadow material={materials?.wood.v}>
      <cylinderGeometry args={[radius, radius, height, 20, 1]} />
    </mesh>
  );
});

const CarvedRing = memo(function CarvedRing({
  radius,
  tube,
  position,
}: {
  radius: number;
  tube: number;
  position: Vec3;
}) {
  const materials = useContext(MaterialContext);
  return (
    <mesh position={position} castShadow receiveShadow material={materials?.wood.h}>
      <torusGeometry args={[radius, tube, 16, 64]} />
    </mesh>
  );
});

const MetalBox = memo(function MetalBox({ args, position }: { args: Vec3; position: Vec3 }) {
  const materials = useContext(MaterialContext);
  const radius = Math.min(0.0022, Math.min(...args) * 0.34);
  return (
    <RoundedBox
      args={args}
      position={position}
      radius={radius}
      smoothness={2}
      castShadow
      material={materials?.metal}
    />
  );
});

/** Cylinder laid on the Z axis, which is how all the furniture sits. */
const MetalDisc = memo(function MetalDisc({
  radius,
  depth,
  position,
}: {
  radius: number;
  depth: number;
  position: Vec3;
}) {
  const materials = useContext(MaterialContext);
  return (
    <mesh
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
      material={materials?.metal}
    >
      <cylinderGeometry args={[radius, radius, depth, 28, 1]} />
    </mesh>
  );
});

/* ------------------------------------------------------------------ */
/*  Geometry tables — metres, leaf centred on the origin               */
/* ------------------------------------------------------------------ */

interface Box {
  args: Vec3;
  position: Vec3;
  grain?: Grain;
}

const FRAME_MEMBERS: Box[] = [
  { args: [0.062, 2.18, 0.1], position: [-0.484, 0.04, 0], grain: 'v' }, // hinge-side chowkhat
  { args: [0.062, 2.18, 0.1], position: [0.484, 0.04, 0], grain: 'v' }, // strike-side chowkhat
  { args: [1.03, 0.062, 0.1], position: [0, 1.099, 0], grain: 'h' }, // head
  // Integral rebate, standing proud so its arris reads as the groove line.
  { args: [0.062, 2.12, 0.014], position: [-0.484, 0.01, -0.034], grain: 'v' },
  { args: [0.062, 2.12, 0.014], position: [0.484, 0.01, -0.034], grain: 'v' },
  { args: [1.03, 0.062, 0.014], position: [0, 1.099, -0.034], grain: 'h' },
  { args: [1.03, 0.016, 0.1], position: [0, -1.058, 0], grain: 'h' }, // sill
];

const STILE_RAIL_MEMBERS: Box[] = [
  { args: [0.12, 2.1, 0.045], position: [-0.39, 0, 0], grain: 'v' }, // hinge stile
  { args: [0.12, 2.1, 0.045], position: [0.39, 0, 0], grain: 'v' }, // lock stile
  { args: [0.66, 0.18, 0.045], position: [0, 0.96, 0], grain: 'h' }, // top rail
  { args: [0.66, 0.22, 0.045], position: [0, -0.05, 0], grain: 'h' }, // lock rail
  { args: [0.66, 0.24, 0.045], position: [0, -0.93, 0], grain: 'h' }, // bottom rail
];

/** The panels themselves are never a callout — they are the field. */
const PANEL_MEMBERS: Box[] = [
  { args: [0.66, 0.81, 0.022], position: [0, 0.465, 0], grain: 'v' },
  { args: [0.66, 0.65, 0.022], position: [0, -0.485, 0], grain: 'v' },
];

const REED_COUNT = 9;
const REEDS = Array.from({ length: REED_COUNT }, (_, i) => ({
  radius: 0.009,
  height: 0.7,
  position: [(i - (REED_COUNT - 1) / 2) * 0.068, 0.465, 0.013] as Vec3,
}));

/** Raised bolection moulding around the lower panel. */
const CARVING_MEMBERS: Box[] = [
  { args: [0.56, 0.03, 0.016], position: [0, -0.24, 0.008], grain: 'h' },
  { args: [0.56, 0.03, 0.016], position: [0, -0.73, 0.008], grain: 'h' },
  { args: [0.03, 0.49, 0.016], position: [-0.265, -0.485, 0.008], grain: 'v' },
  { args: [0.03, 0.49, 0.016], position: [0.265, -0.485, 0.008], grain: 'v' },
];

/** Nakashi rosette in the middle of the lower panel. */
const CARVED_RINGS = [
  { radius: 0.115, tube: 0.007, position: [0, -0.485, 0.012] as Vec3 },
  { radius: 0.078, tube: 0.006, position: [0, -0.485, 0.012] as Vec3 },
];

const HINGE_ROWS = [0.8, 0.0, -0.8];
const HINGE_PARTS: Box[] = HINGE_ROWS.flatMap((y): Box[] => [
  { args: [0.055, 0.16, 0.03], position: [-0.4225, y, 0] }, // leaf cup
  { args: [0.05, 0.14, 0.026], position: [-0.478, y, 0] }, // chowkhat plate
  { args: [0.042, 0.022, 0.02], position: [-0.45, y, 0] }, // arm link
]);

const LOCK_PARTS: Box[] = [
  { args: [0.008, 0.22, 0.026], position: [0.454, -0.05, 0] }, // forend plate
  { args: [0.02, 0.028, 0.018], position: [0.464, -0.008, 0] }, // latch bolt
  { args: [0.03, 0.022, 0.016], position: [0.469, -0.092, 0] }, // dead bolt
  { args: [0.135, 0.025, 0.023], position: [0.318, -0.05, 0.07] }, // lever, front
  { args: [0.135, 0.025, 0.023], position: [0.318, -0.05, -0.07] }, // lever, back
];

const LOCK_DISCS: { radius: number; depth: number; position: Vec3 }[] = [
  { radius: 0.031, depth: 0.01, position: [0.38, -0.05, 0.028] }, // lever rose
  { radius: 0.031, depth: 0.01, position: [0.38, -0.05, -0.028] },
  { radius: 0.011, depth: 0.05, position: [0.38, -0.05, 0.058] }, // spindle
  { radius: 0.011, depth: 0.05, position: [0.38, -0.05, -0.058] },
  { radius: 0.021, depth: 0.01, position: [0.38, -0.122, 0.028] }, // cylinder rose
  { radius: 0.021, depth: 0.01, position: [0.38, -0.122, -0.028] },
];

/* ------------------------------------------------------------------ */
/*  Model                                                              */
/* ------------------------------------------------------------------ */

export interface DoorModelProps {
  activeId: AnatomyPartId | null;
  hoverId: AnatomyPartId | null;
  onSelect: (id: AnatomyPartId) => void;
  onHoverChange: (id: AnatomyPartId | null) => void;
}

export default function DoorModel({
  activeId,
  hoverId,
  onSelect,
  onHoverChange,
}: DoorModelProps) {
  const focus = hoverId ?? activeId;
  const stateFor = (id: AnatomyPartId): PartVisualState => {
    if (!focus) return 'idle';
    return focus === id ? 'active' : 'muted';
  };

  const partProps = (id: AnatomyPartId, seed: number) => ({
    state: stateFor(id),
    seed,
    onSelect: () => onSelect(id),
    onHoverChange: (hovering: boolean) => onHoverChange(hovering ? id : null),
  });

  return (
    <group>
      <Part {...partProps('frame', 1.4)}>
        {FRAME_MEMBERS.map((m, i) => (
          <Member key={i} {...m} />
        ))}
      </Part>

      <Part {...partProps('stile-rail', 2.9)}>
        {STILE_RAIL_MEMBERS.map((m, i) => (
          <Member key={i} {...m} />
        ))}
      </Part>

      <Part state={focus ? 'muted' : 'idle'} seed={5.1}>
        {PANEL_MEMBERS.map((m, i) => (
          <Member key={i} {...m} />
        ))}
      </Part>

      <Part {...partProps('carving', 7.6)}>
        {REEDS.map((r, i) => (
          <Bead key={`reed-${i}`} {...r} />
        ))}
        {CARVING_MEMBERS.map((m, i) => (
          <Member key={`mould-${i}`} {...m} />
        ))}
        {CARVED_RINGS.map((r, i) => (
          <CarvedRing key={`ring-${i}`} {...r} />
        ))}
      </Part>

      <Part {...partProps('hinges', 9.2)}>
        {HINGE_PARTS.map((m, i) => (
          <MetalBox key={i} args={m.args} position={m.position} />
        ))}
      </Part>

      <Part {...partProps('lock', 11.8)}>
        {LOCK_PARTS.map((m, i) => (
          <MetalBox key={i} args={m.args} position={m.position} />
        ))}
        {LOCK_DISCS.map((d, i) => (
          <MetalDisc key={i} {...d} />
        ))}
      </Part>
    </group>
  );
}
