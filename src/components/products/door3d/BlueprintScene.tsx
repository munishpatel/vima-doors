import { useCallback, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Html, Line } from '@react-three/drei';

import {
  ANATOMY_PARTS,
  EXPLODE_OFFSETS,
  type AnatomyPartId,
  type CameraFraming,
} from '@/data/doorAnatomy';
import CameraRig, { type DragState } from './CameraRig';
import DoorModel from './DoorModel';
import StudioEnvironment from './StudioEnvironment';

/**
 * The same door as the installed half, pulled apart on a drafting grid.
 *
 * It breathes between assembled and exploded on a slow loop so the visitor
 * sees both states without touching anything: here is your door, here is
 * everything we put inside it. Hovering a part holds it open.
 */

type Vec3 = [number, number, number];

const THETA = 0.86;

/**
 * Wide panels slide the door right so the copy keeps the left third; tall
 * phone panels pull back and drop it under the copy instead.
 */
function framingFor(aspect: number): CameraFraming {
  if (aspect >= 0.95) {
    // Squarer panels pull back so the exploded parts clear the copy.
    const s = THREE.MathUtils.clamp(1.3 / aspect, 1, 1.35);
    // Offset along the camera's right vector, so the door lands right of centre.
    const k = 0.6 * s;
    return {
      target: [-Math.cos(THETA) * k, 0.2, Math.sin(THETA) * k],
      radius: 7.4 * s,
      phi: 1.4,
      theta: THETA,
    };
  }
  return { target: [0, 1.34, 0], radius: 10, phi: 1.42, theta: THETA };
}

const INK = '#8fb3cc';
const INK_LIT = '#f3d9a8';

/** Where each callout's label floats relative to its anchor. */
const LEADER: Record<AnatomyPartId, Vec3> = {
  frame: [-0.42, 0.3, 0],
  'stile-rail': [0.44, 0.34, 0],
  carving: [0.1, 0.52, 0.1],
  hinges: [-0.16, -0.8, 0.05],
  lock: [0.34, -0.3, 0.08],
};

/** Seconds per phase: assembled hold, open, exploded hold, close. */
const CYCLE = [1.6, 1.6, 4.4, 1.6];
const CYCLE_TOTAL = CYCLE.reduce((a, b) => a + b, 0);

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function explodeAt(time: number) {
  const t = time % CYCLE_TOTAL;
  const [hold0, open, hold1] = CYCLE;
  if (t < hold0) return 0;
  if (t < hold0 + open) return easeInOut((t - hold0) / open);
  if (t < hold0 + open + hold1) return 1;
  return 1 - easeInOut((t - hold0 - open - hold1) / CYCLE[3]);
}

function ResponsiveRig({
  autoOrbit,
  dragStateRef,
}: {
  autoOrbit: boolean;
  dragStateRef: RefObject<DragState>;
}) {
  const size = useThree((s) => s.size);
  // Bucketed so a resize drag does not re-aim the camera on every pixel.
  const aspect = Math.round((size.width / Math.max(size.height, 1)) * 20) / 20;
  const framing = useMemo(() => framingFor(aspect), [aspect]);
  return (
    <CameraRig framing={framing} resetKey={0} autoOrbit={autoOrbit} dragStateRef={dragStateRef} />
  );
}

/* ------------------------------------------------------------------ */
/*  Driver                                                             */
/* ------------------------------------------------------------------ */

function ExplodeDriver({
  explodeRef,
  holdOpen,
  animate,
}: {
  explodeRef: RefObject<number>;
  holdOpen: boolean;
  animate: boolean;
}) {
  const clock = useRef(0);
  useFrame((_, rawDelta) => {
    // Clamp so a backgrounded tab does not resume mid-cycle.
    const delta = Math.min(rawDelta, 0.1);
    if (!animate) {
      explodeRef.current = 1;
      return;
    }
    if (holdOpen) {
      explodeRef.current = THREE.MathUtils.damp(explodeRef.current, 1, 5, delta);
      // Resume from the start of the exploded hold, so letting go never snaps it shut.
      clock.current = CYCLE[0] + CYCLE[1];
      return;
    }
    clock.current += delta;
    explodeRef.current = explodeAt(clock.current);
  });
  return null;
}

/** A group that rides along with one part as it explodes. */
function Follow({
  id,
  explodeRef,
  children,
}: {
  id: AnatomyPartId;
  explodeRef: RefObject<number>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const offset = EXPLODE_OFFSETS[id];
  useFrame(() => {
    const e = explodeRef.current;
    group.current?.position.set(offset[0] * e, offset[1] * e, offset[2] * e);
  });
  return <group ref={group}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/*  Callouts                                                           */
/* ------------------------------------------------------------------ */

function Callouts({
  explodeRef,
  hoverId,
}: {
  explodeRef: RefObject<number>;
  hoverId: AnatomyPartId | null;
}) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const leaders = useRef<(THREE.Group | null)[]>([]);

  // Callouts only make sense once the parts have come apart.
  useFrame(() => {
    const e = explodeRef.current;
    const opacity = THREE.MathUtils.smoothstep(e, 0.45, 0.9);
    for (const el of labels.current) {
      if (el) el.style.opacity = String(opacity);
    }
    for (const group of leaders.current) {
      if (group) group.visible = opacity > 0.02;
    }
  });

  return (
    <>
      {ANATOMY_PARTS.map((part, i) => {
        const leader = LEADER[part.id];
        const lit = hoverId === part.id;
        return (
          <Follow key={part.id} id={part.id} explodeRef={explodeRef}>
            <group
              ref={(g) => {
                leaders.current[i] = g;
              }}
            >
              <Line
                points={[
                  part.anchor,
                  [
                    part.anchor[0] + leader[0],
                    part.anchor[1] + leader[1],
                    part.anchor[2] + leader[2],
                  ],
                ]}
                color={lit ? INK_LIT : INK}
                lineWidth={1}
                transparent
                opacity={0.75}
              />
              <mesh position={part.anchor}>
                <sphereGeometry args={[0.012, 12, 12]} />
                <meshBasicMaterial color={lit ? INK_LIT : INK} toneMapped={false} />
              </mesh>
            </group>
            <Html
              position={[
                part.anchor[0] + leader[0],
                part.anchor[1] + leader[1],
                part.anchor[2] + leader[2],
              ]}
              center
              zIndexRange={[9, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className={`flex select-none items-center gap-1.5 whitespace-nowrap border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] backdrop-blur-sm transition-colors duration-300 ${
                  lit
                    ? 'border-[#f3d9a8]/70 bg-[#f3d9a8] text-[#1a1410]'
                    : 'border-[#8fb3cc]/40 bg-[#0f1820]/75 text-[#dbe7ef]'
                }`}
                style={{ opacity: 0 }}
              >
                <span className={lit ? 'text-[#7a4b1e]' : 'text-[#8fb3cc]'}>{part.callout}</span>
                {part.short}
              </div>
            </Html>
          </Follow>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Dimensions                                                         */
/* ------------------------------------------------------------------ */

function Dimension({
  from,
  to,
  tick,
  label,
}: {
  from: Vec3;
  to: Vec3;
  /** Direction the end ticks point, already scaled to length. */
  tick: Vec3;
  label: string;
}) {
  const mid: Vec3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const t = (p: Vec3, s: number): Vec3 => [
    p[0] + tick[0] * s,
    p[1] + tick[1] * s,
    p[2] + tick[2] * s,
  ];
  return (
    <group>
      <Line points={[from, to]} color={INK} lineWidth={0.8} transparent opacity={0.6} />
      <Line
        points={[t(from, -1), t(from, 1)]}
        color={INK}
        lineWidth={0.8}
        transparent
        opacity={0.6}
      />
      <Line points={[t(to, -1), t(to, 1)]} color={INK} lineWidth={0.8} transparent opacity={0.6} />
      <Html position={mid} center zIndexRange={[9, 0]} style={{ pointerEvents: 'none' }}>
        <span className="select-none whitespace-nowrap bg-[#0f1820] px-1.5 font-mono text-[9px] tracking-[0.18em] text-[#8fb3cc]">
          {label}
        </span>
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

export interface BlueprintSceneProps {
  paused: boolean;
  reducedMotion: boolean;
  hoverId: AnatomyPartId | null;
  onHoverChange: (id: AnatomyPartId | null) => void;
}

export default function BlueprintScene({
  paused,
  reducedMotion,
  hoverId,
  onHoverChange,
}: BlueprintSceneProps) {
  const explodeRef = useRef(reducedMotion ? 1 : 0);
  const dragState = useRef<DragState>({ dragging: false, moved: false });

  // A drag that ends over a part should not leave it highlighted.
  const handleHover = useCallback(
    (id: AnatomyPartId | null) => {
      if (dragState.current.dragging && id) return;
      onHoverChange(id);
    },
    [onHoverChange],
  );

  return (
    <Canvas
      shadows
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 60, position: [2, 1, 5] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      style={{ touchAction: 'pan-y', cursor: hoverId ? 'pointer' : 'grab' }}
      aria-hidden
    >
      <ResponsiveRig autoOrbit={!reducedMotion} dragStateRef={dragState} />
      <ExplodeDriver explodeRef={explodeRef} holdOpen={hoverId !== null} animate={!reducedMotion} />
      <StudioEnvironment />

      <Grid
        position={[0, -1.07, 0]}
        args={[12, 12]}
        cellSize={0.1}
        cellThickness={0.6}
        cellColor="#2a3c4a"
        sectionSize={0.5}
        sectionThickness={1}
        sectionColor="#3f5f75"
        fadeDistance={10}
        fadeStrength={1.6}
        infiniteGrid
      />

      <DoorModel
        activeId={null}
        hoverId={hoverId}
        explodeRef={explodeRef}
        onHoverChange={handleHover}
      />

      {/* Overall size, drawn on the chowkhat so it travels with it. */}
      <Follow id="frame" explodeRef={explodeRef}>
        <Dimension from={[0.66, -1.066, 0]} to={[0.66, 1.13, 0]} tick={[0.03, 0, 0]} label="2180" />
        <Dimension
          from={[-0.515, 1.28, 0]}
          to={[0.515, 1.28, 0]}
          tick={[0, 0.03, 0]}
          label="1030"
        />
      </Follow>

      <Callouts explodeRef={explodeRef} hoverId={hoverId} />
    </Canvas>
  );
}
