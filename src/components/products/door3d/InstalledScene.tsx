import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';

import DoorModel, { DoorFrame } from './DoorModel';

/**
 * The finished door, hung in a room.
 *
 * The door itself is a photograph of a real Vima door, mapped onto a shutter
 * hung in the modelled chowkhat so the room's lighting and shadows fall
 * across both. The room
 * around it is kept deliberately quiet: limewashed wall, classical wall
 * mouldings, a polished ivory vitrified floor, and a console with a lamp so it
 * reads as somebody's home rather than a showroom. If the photo cannot be
 * loaded, the modelled teak door from the blueprint half stands in.
 */

type Vec3 = [number, number, number];

/** Top of the floor. The chowkhat sill bottoms out here. */
const FLOOR_Y = -1.066;
/** Face of the wall. The chowkhat stands a little proud of it. */
const WALL_Z = -0.02;

const WALL = '#dccbb3';
const MOULDING = '#e8dccb';
const SKIRTING = '#efe6d8';

/* ------------------------------------------------------------------ */
/*  Floor                                                              */
/* ------------------------------------------------------------------ */

/**
 * 600 × 1200 mm ivory tiles with a hairline grout. Generated rather than
 * fetched so there is no image request on the hero's critical path.
 */
function useTileTexture() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Two tiles across, one down: the texture repeats every 1.2 m square.
    const tiles: [number, number, number, number][] = [
      [0, 0, size / 2, size],
      [size / 2, 0, size / 2, size],
    ];
    tiles.forEach(([x, y, w, h], i) => {
      const tone = i === 0 ? 234 : 229;
      ctx.fillStyle = `rgb(${tone}, ${tone - 7}, ${tone - 18})`;
      ctx.fillRect(x, y, w, h);
      // Faint cloudy veining, the way a polished vitrified tile actually looks.
      for (let v = 0; v < 26; v++) {
        ctx.fillStyle = `rgba(160, 140, 115, ${0.02 + Math.random() * 0.03})`;
        ctx.beginPath();
        ctx.ellipse(
          x + Math.random() * w,
          y + Math.random() * h,
          10 + Math.random() * 60,
          4 + Math.random() * 18,
          Math.random() * Math.PI,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    });
    ctx.strokeStyle = 'rgba(120, 100, 80, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size / 2 - 2, size - 2);
    ctx.strokeRect(size / 2 + 1, 1, size / 2 - 2, size - 2);

    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(12 / 1.2, 8 / 1.2);
    t.anisotropy = 8;
    return t;
  }, []);

  useLayoutEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

function Floor() {
  const map = useTileTexture();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 3.5]} receiveShadow>
      <planeGeometry args={[12, 8]} />
      {/* Polished vitrified tile: low roughness picks up the lamp and the
          window as soft highlights without a second reflection pass. */}
      <meshStandardMaterial
        map={map ?? undefined}
        roughness={0.28}
        metalness={0}
        envMapIntensity={0.9}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Wall                                                               */
/* ------------------------------------------------------------------ */

function Painted({ args, position, color }: { args: Vec3; position: Vec3; color: string }) {
  return (
    <RoundedBox
      args={args}
      position={position}
      radius={Math.min(0.004, Math.min(...args) * 0.3)}
      smoothness={2}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.85} />
    </RoundedBox>
  );
}

/** A rectangular applied moulding, the classical wall-panel frame. */
function PanelMoulding({
  center,
  width,
  height,
}: {
  center: [number, number];
  width: number;
  height: number;
}) {
  const [cx, cy] = center;
  const t = 0.028; // moulding face
  const d = 0.014; // projection off the wall
  const z = WALL_Z + d / 2;
  return (
    <group>
      <Painted args={[width, t, d]} position={[cx, cy + height / 2, z]} color={MOULDING} />
      <Painted args={[width, t, d]} position={[cx, cy - height / 2, z]} color={MOULDING} />
      <Painted args={[t, height, d]} position={[cx - width / 2, cy, z]} color={MOULDING} />
      <Painted args={[t, height, d]} position={[cx + width / 2, cy, z]} color={MOULDING} />
    </group>
  );
}

function Wall() {
  const skirtH = 0.11;
  const skirtD = 0.016;
  const skirtY = FLOOR_Y + skirtH / 2;
  // Stops short of the chowkhat either side.
  const skirtLen = 5.4;
  const skirtX = 0.515 + skirtLen / 2;

  return (
    <group>
      <mesh position={[0, 1.4, WALL_Z]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>

      <Painted
        args={[skirtLen, skirtH, skirtD]}
        position={[-skirtX, skirtY, WALL_Z + skirtD / 2]}
        color={SKIRTING}
      />
      <Painted
        args={[skirtLen, skirtH, skirtD]}
        position={[skirtX, skirtY, WALL_Z + skirtD / 2]}
        color={SKIRTING}
      />

      {/* Dado rail, broken by the door like it would be on site. */}
      <Painted
        args={[skirtLen, 0.03, 0.02]}
        position={[-skirtX, -0.2, WALL_Z + 0.01]}
        color={MOULDING}
      />
      <Painted
        args={[skirtLen, 0.03, 0.02]}
        position={[skirtX, -0.2, WALL_Z + 0.01]}
        color={MOULDING}
      />

      {/* Panel mouldings above and below the dado, each side. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <PanelMoulding center={[side * 1.18, 0.62]} width={0.9} height={1.22} />
          <PanelMoulding center={[side * 1.18, -0.6]} width={0.9} height={0.6} />
          <PanelMoulding center={[side * 2.22, 0.62]} width={0.9} height={1.22} />
          <PanelMoulding center={[side * 2.22, -0.6]} width={0.9} height={0.6} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Door                                                               */
/* ------------------------------------------------------------------ */

/**
 * The clear opening inside `DoorFrame`'s chowkhat (inner jamb faces at
 * ±0.453 m, sill top at -1.05 m, head soffit at 1.068 m), less a 3 mm
 * shutter gap all round except at the sill.
 */
const LEAF = { width: 0.9, height: 2.112, bottom: -1.05 };
const LEAF_DEPTH = 0.045;
/** Shaves a hair off every edge so no trace of the photo's background survives the crop. */
const EDGE_INSET = 0.006;

/**
 * Crops the texture like CSS `object-fit: cover`, so the photo fills the
 * shutter exactly without stretching whatever its proportions.
 */
function coverTexture(texture: THREE.Texture) {
  const image = texture.image as { width: number; height: number };
  const usable = 1 - EDGE_INSET * 2;
  const photoAspect = image.width / image.height;
  const leafAspect = LEAF.width / LEAF.height;
  let rx = usable;
  let ry = usable;
  if (photoAspect > leafAspect) rx *= leafAspect / photoAspect;
  else ry *= photoAspect / leafAspect;
  texture.repeat.set(rx, ry);
  texture.offset.set((1 - rx) / 2, (1 - ry) / 2);
}

function PhotoDoor({ url }: { url: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  useEffect(() => {
    let loaded: THREE.Texture | null = null;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (t) => {
        if (cancelled) return t.dispose();
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, maxAnisotropy);
        coverTexture(t);
        loaded = t;
        setTexture(t);
      },
      undefined,
      () => !cancelled && setFailed(true),
    );
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [url, maxAnisotropy]);

  if (failed) return <DoorModel activeId={null} hoverId={null} />;

  return (
    <group>
      {/* The chowkhat from the modelled door, so the photo is hung, not propped. */}
      <DoorFrame />
      {texture && (
        <mesh position={[0, LEAF.bottom + LEAF.height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[LEAF.width, LEAF.height, LEAF_DEPTH]} />
          {/* Box faces run +x, -x, +y, -y, +z, -z; only the front carries the photo. */}
          {[0, 1, 2, 3].map((i) => (
            <meshStandardMaterial
              key={i}
              attach={`material-${i}`}
              color="#5b3c25"
              roughness={0.6}
            />
          ))}
          <meshStandardMaterial attach="material-4" map={texture} roughness={0.5} />
          <meshStandardMaterial attach="material-5" color="#5b3c25" roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Console, lamp and vase                                             */
/* ------------------------------------------------------------------ */

function lathe(profile: [number, number][], segments = 40) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

function Console() {
  const x = 1.2;
  const topY = FLOOR_Y + 0.78;
  const depth = 0.34;
  const z = WALL_Z + depth / 2 + 0.01;

  const vase = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.05, 0],
        [0.075, 0.05],
        [0.08, 0.12],
        [0.06, 0.2],
        [0.028, 0.26],
        [0.03, 0.3],
        [0, 0.3],
      ]),
    [],
  );
  const lampBase = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.07, 0],
        [0.075, 0.02],
        [0.09, 0.12],
        [0.07, 0.24],
        [0.02, 0.28],
        [0.012, 0.3],
        [0, 0.3],
      ]),
    [],
  );
  useLayoutEffect(
    () => () => {
      vase.dispose();
      lampBase.dispose();
    },
    [vase, lampBase],
  );

  const lampX = x + 0.2;
  const shadeY = topY + 0.42;

  return (
    <group>
      {/* Walnut top and two slab legs */}
      <RoundedBox
        args={[0.82, 0.04, depth]}
        position={[x, topY, z]}
        radius={0.008}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a3222" roughness={0.45} />
      </RoundedBox>
      {[-0.37, 0.37].map((dx) => (
        <RoundedBox
          key={dx}
          args={[0.04, 0.76, depth - 0.02]}
          position={[x + dx, FLOOR_Y + 0.38, z]}
          radius={0.006}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#4a3222" roughness={0.5} />
        </RoundedBox>
      ))}
      {/* Low shelf */}
      <RoundedBox
        args={[0.7, 0.025, depth - 0.04]}
        position={[x, FLOOR_Y + 0.16, z]}
        radius={0.006}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a3222" roughness={0.5} />
      </RoundedBox>

      {/* Ceramic vase with a few dried stems */}
      <mesh geometry={vase} position={[x - 0.2, topY + 0.02, z]} castShadow>
        <meshStandardMaterial color="#c9b79c" roughness={0.6} />
      </mesh>
      {[
        [0.1, 0.62, 0.06],
        [-0.12, 0.7, -0.04],
        [0.02, 0.8, 0.0],
      ].map(([tilt, len, twist], i) => (
        <mesh
          key={i}
          position={[
            x - 0.2 + Math.sin(tilt) * len * 0.5,
            topY + 0.3 + (Math.cos(tilt) * len) / 2,
            z + twist,
          ]}
          rotation={[twist, 0, -tilt]}
          castShadow
        >
          <cylinderGeometry args={[0.003, 0.004, len, 5]} />
          <meshStandardMaterial color="#6f5a3e" roughness={0.9} />
        </mesh>
      ))}

      {/* Table lamp: brass-and-stone base, linen shade, warm bulb */}
      <mesh geometry={lampBase} position={[lampX, topY + 0.02, z]} castShadow>
        <meshStandardMaterial color="#b48b4b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[lampX, shadeY, z]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 40, 1, true]} />
        <meshStandardMaterial
          color="#f3e6cf"
          emissive="#ffc27a"
          emissiveIntensity={0.9}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        position={[lampX, shadeY - 0.02, z]}
        color="#ffb766"
        intensity={1.6}
        distance={2.6}
        decay={2}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Lighting                                                           */
/* ------------------------------------------------------------------ */

function RoomLighting() {
  const spot = useRef<THREE.SpotLight>(null);
  const scene = useThree((s) => s.scene);

  // A spotlight aims at its `target`, which has to live in the scene graph.
  useLayoutEffect(() => {
    const light = spot.current;
    if (!light) return;
    light.target.position.set(0, -0.2, WALL_Z);
    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene]);

  return (
    <>
      <hemisphereLight args={['#fff3e2', '#b89c7c', 0.55]} />

      {/* Late-afternoon window light from high camera-left. */}
      <directionalLight
        position={[-3.2, 3.6, 3.4]}
        intensity={1.5}
        color="#ffe7c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-3, 3, 2.4, -2.4, 0.1, 14]} />
      </directionalLight>

      {/* Ceiling downlight washing the door, the way you would light it at home. */}
      <spotLight
        ref={spot}
        position={[0, 2.6, 0.9]}
        angle={0.5}
        penumbra={0.9}
        intensity={9}
        distance={6}
        decay={1.6}
        color="#ffd9a8"
      />

      <Environment resolution={128} environmentIntensity={0.7}>
        <color attach="background" args={['#b9a58a']} />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#fff1dc"
          scale={[8, 4, 1]}
          position={[0, 4, 2.5]}
          rotation={[-Math.PI / 2.4, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffd6a0"
          scale={[4, 4, 1]}
          position={[-3.6, 1, 1.5]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#ffe9cf"
          scale={[4, 4, 1]}
          position={[3.6, 1, 1]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera                                                             */
/* ------------------------------------------------------------------ */

/**
 * Frames the door for whatever box the panel happens to be. Wide panels put
 * the door right of centre so the headline has clear wall to sit on; tall,
 * narrow ones (phones) centre it and push it down under the copy.
 */
function FramedCamera({ parallax }: { parallax: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const target = useMemo(() => new THREE.Vector3(), []);
  const base = useMemo(() => new THREE.Vector3(), []);
  const eased = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const wide = aspect >= 1;
    // Vertical extent to show, metres.
    // Squarer panels pull back a little so the door clears the headline.
    const span = wide ? 3.05 * THREE.MathUtils.clamp(1.3 / aspect, 1, 1.3) : 5;
    const distance = span / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const visibleWidth = span * aspect;

    const tx = wide ? -visibleWidth * 0.22 : 0;
    const ty = wide ? 0.12 : 1.13;
    target.set(tx, ty, 0);
    base.set(tx + 0.18, ty - 0.05, distance);

    camera.position.copy(base);
    camera.lookAt(target);
  }, [size, camera, target, base]);

  useFrame((state, rawDelta) => {
    if (!parallax) return;
    const delta = Math.min(rawDelta, 0.05);
    eased.current.x = THREE.MathUtils.damp(eased.current.x, state.pointer.x, 2.2, delta);
    eased.current.y = THREE.MathUtils.damp(eased.current.y, state.pointer.y, 2.2, delta);
    camera.position.set(base.x + eased.current.x * 0.22, base.y + eased.current.y * 0.08, base.z);
    camera.lookAt(target);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

export interface InstalledSceneProps {
  /** Photo of the finished door, already trimmed to the door's edges. */
  doorPhoto: string;
  paused: boolean;
  reducedMotion: boolean;
}

export default function InstalledScene({ doorPhoto, paused, reducedMotion }: InstalledSceneProps) {
  return (
    <Canvas
      shadows
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.5]}
      camera={{ fov: 30, near: 0.1, far: 40, position: [0, 0, 6] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden
    >
      <color attach="background" args={[WALL]} />
      <fog attach="fog" args={[WALL, 9, 16]} />
      <FramedCamera parallax={!reducedMotion} />
      <RoomLighting />
      <Wall />
      <Floor />
      <Console />
      <PhotoDoor url={doorPhoto} />
    </Canvas>
  );
}
