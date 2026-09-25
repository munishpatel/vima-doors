import * as THREE from 'three';

/**
 * Procedural timber for the products hero.
 *
 * There is no wood texture in the repo and fetching one at runtime would put a
 * third-party asset on the critical path, so the grain is generated in the
 * shader instead. Working in object space rather than UV space matters here:
 * the door is built from boxes, and a UV-mapped plank would restart the grain
 * on every face. Object space makes each member behave like a solid piece of
 * timber with grain running through it, which is what it actually is.
 *
 * `MeshPhysicalMaterial` does the lighting; `onBeforeCompile` only replaces
 * albedo, roughness and the normal perturbation, so we keep real PBR,
 * environment reflections, clearcoat and shadows.
 */

export interface WoodTone {
  /** Earlywood — the pale, wide part of the growth ring. */
  early: string;
  /** Latewood — the narrow dark band. */
  late: string;
}

export const WOOD_TONES: Record<'teak' | 'walnut', WoodTone> = {
  /** Burma teak: golden brown, warm, fairly even. */
  teak: { early: '#a87c4a', late: '#6b4526' },
  /** Walnut veneer: deeper and cooler, stronger contrast between bands. */
  walnut: { early: '#956944', late: '#43291a' },
};

/** Direction the fibres run. Stiles are vertical, rails horizontal. */
export type Grain = 'v' | 'h';

const GRAIN_VECTORS: Record<Grain, THREE.Vector3> = {
  v: new THREE.Vector3(0, 1, 0),
  h: new THREE.Vector3(1, 0, 0),
};

const SHARED_FRAGMENT_PREAMBLE = /* glsl */ `
uniform vec3  uEarly;
uniform vec3  uLate;
uniform vec3  uGrainAxis;
uniform vec3  uSeed;
uniform float uRing;
uniform float uPith;
uniform float uWarp;
uniform float uFibre;
uniform float uContrast;
uniform float uPhase;
uniform float uBump;
uniform float uHighlight;
varying vec3 vWoodObjPos;
varying vec3 vWoodViewPos;

float vdHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vdNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(vdHash(i + vec3(0.0, 0.0, 0.0)), vdHash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(vdHash(i + vec3(0.0, 1.0, 0.0)), vdHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(vdHash(i + vec3(0.0, 0.0, 1.0)), vdHash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(vdHash(i + vec3(0.0, 1.0, 1.0)), vdHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}

/** Two octaves only, so the highest fibre frequency stays above a pixel. */
float vdFbm2(vec3 p) {
  return 0.66 * vdNoise(p) + 0.34 * vdNoise(p * 2.05);
}

float vdFbm(vec3 p) {
  float amp = 0.5;
  float sum = 0.0;
  for (int i = 0; i < 4; i++) {
    sum += amp * vdNoise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

/**
 * Growth rings, the way they fall on a sawn joinery member.
 *
 * Stiles and rails are rift-sawn for stability, so rings cross the face as
 * near-parallel lines that wander, not as the big arcs of a flat-sawn board.
 * A nearly-linear phase also has a predictable gradient, which is what lets
 * the derivative filter below actually kill aliasing.
 *
 * Two things matter and are easy to get wrong:
 *  - objPos is geometry-local, so the ring field is built from the local
 *    coordinate and the seed is applied only to the noise lookups. Letting the
 *    seed reach the curvature term inflates the phase gradient and every
 *    member ends up with a different effective ring spacing.
 *  - Ring spacing is tuned to what resolves on screen (~11 mm), not to
 *    botanical truth (~3 mm). At this camera distance real rings are
 *    sub-pixel, and the filter would correctly erase all of them.
 *
 * Distances are metres. x = latewood mask (0 pale, 1 dark), y = fibre.
 */
vec2 vdGrain(vec3 objPos) {
  vec3 axis = normalize(uGrainAxis);
  // Every member on this door presents its wide face to +Z.
  vec3 depthDir = vec3(0.0, 0.0, 1.0);
  vec3 acrossDir = normalize(cross(axis, depthDir));

  vec3 nz = objPos + uSeed;
  float along = dot(objPos, axis);
  float alongN = dot(nz, axis);
  vec2 perp = vec2(dot(objPos, acrossDir), dot(objPos, depthDir));
  vec2 perpN = vec2(dot(nz, acrossDir), dot(nz, depthDir));

  // Rings wander slowly as they travel down the board.
  float wander = (vdFbm(vec3(alongN * 1.1, perpN * 3.0)) - 0.5) * uWarp;
  // Gentle pith curvature: near-straight on a narrow stile, a soft arc across
  // a wide panel.
  float curve = perp.x * perp.x / (2.0 * uPith);
  float phase = (perp.x + curve + wander) * uRing + uPhase;

  // Ring widths are never uniform, so drift the phase with slow noise.
  phase += (vdFbm(vec3(alongN * 0.4, perpN * 1.6)) - 0.5) * 2.2;

  float tri = abs(fract(phase) * 2.0 - 1.0);
  // Narrow dark lines rather than a wide sine, which is what latewood is.
  float band = 1.0 - smoothstep(0.0, 0.45, tri);

  // Analytic filter: once a ring is thinner than a pixel, fade it out rather
  // than letting it alias into moire as the door turns.
  float aa = 1.0 - smoothstep(0.35, 0.9, fwidth(phase));
  band *= aa;

  // Fibres: hairline across the grain, stretched along it. Only one axis may
  // carry a high frequency — putting it on two in-plane axes at once turns the
  // noise into a basket weave rather than timber.
  float fibreInput = perpN.x * uFibre;
  float fibreAa = 1.0 - smoothstep(0.35, 0.9, fwidth(fibreInput));
  float fibre = vdFbm2(vec3(alongN * 1.2, fibreInput, perpN.y * 4.0));
  fibre = mix(0.5, fibre, fibreAa);

  // Slow tonal drift so no two areas of the board match exactly.
  float drift = vdFbm(vec3(alongN * 0.7, perpN * 1.0)) - 0.5;

  float mask = band * uContrast + (fibre - 0.5) * 0.16 + drift * 0.3 + 0.24;
  return vec2(clamp(mask, 0.0, 1.0), fibre);
}
`;

const VERTEX_PREAMBLE = /* glsl */ `
varying vec3 vWoodObjPos;
varying vec3 vWoodViewPos;
`;

export interface WoodUniforms {
  uEarly: { value: THREE.Color };
  uLate: { value: THREE.Color };
  uGrainAxis: { value: THREE.Vector3 };
  uSeed: { value: THREE.Vector3 };
  /** Growth rings per metre. 92 is a ring roughly every 11 mm. */
  uRing: { value: number };
  /** Pith curvature radius, metres. Larger is a straighter figure. */
  uPith: { value: number };
  /** How far a ring wanders along the board, metres. */
  uWarp: { value: number };
  /** Fibre frequency across the grain, per metre. */
  uFibre: { value: number };
  /** Strength of the dark latewood banding. */
  uContrast: { value: number };
  /** Ring phase offset, so adjacent boards do not line up. */
  uPhase: { value: number };
  uBump: { value: number };
  /** -1 pushes the member back, 0 is natural, 1 lifts it for selection. */
  uHighlight: { value: number };
}

export interface WoodMaterial {
  material: THREE.MeshPhysicalMaterial;
  uniforms: WoodUniforms;
}

export interface CreateWoodOptions {
  tone: WoodTone;
  grain: Grain;
  /** Varies the figure so no two members look like the same board. */
  seed: number;
  /** Growth rings per metre. Lower is a wider, calmer figure. */
  ringsPerMetre?: number;
}

export function createWoodMaterial({
  tone,
  grain,
  seed,
  ringsPerMetre = 92,
}: CreateWoodOptions): WoodMaterial {
  const uniforms: WoodUniforms = {
    uEarly: { value: new THREE.Color(tone.early) },
    uLate: { value: new THREE.Color(tone.late) },
    uGrainAxis: { value: GRAIN_VECTORS[grain].clone() },
    uSeed: { value: new THREE.Vector3(seed * 0.31, seed * 0.17, seed * 0.23) },
    uRing: { value: ringsPerMetre },
    uPith: { value: 0.9 },
    uWarp: { value: 0.014 },
    uFibre: { value: 46 },
    uContrast: { value: 0.52 },
    uPhase: { value: seed * 7.3 },
    uBump: { value: 0.006 },
    uHighlight: { value: 0 },
  };

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0,
    // A polished PU finish, not bare timber.
    clearcoat: 0.22,
    clearcoatRoughness: 0.4,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_PREAMBLE}`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vWoodObjPos = position;
        vWoodViewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${SHARED_FRAGMENT_PREAMBLE}`)
      // Computed before the first use so the values stay in scope for the
      // albedo, roughness and normal stages further down main().
      .replace(
        '#include <logdepthbuf_fragment>',
        `#include <logdepthbuf_fragment>
        vec2  vdG      = vdGrain(vWoodObjPos);
        float vdBand   = vdG.x;
        float vdFibre  = vdG.y;
        vec3  vdWood   = mix(uEarly, uLate, vdBand) * (0.9 + 0.2 * vdFibre);
        float vdHeight = vdBand * 0.7 + vdFibre * 0.3;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        diffuseColor.rgb = vdWood * (1.0 + 0.22 * uHighlight);`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.38, 0.62, vdBand);`,
      )
      // Bump the shading normal straight off the grain height. This is
      // three's own perturbNormalArb, inlined because we have a procedural
      // height rather than a bump texture.
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          vec3 dPdx = dFdx(vWoodViewPos);
          vec3 dPdy = dFdy(vWoodViewPos);
          float dHdx = dFdx(vdHeight);
          float dHdy = dFdy(vdHeight);
          vec3 nRef = normalize(normal);
          vec3 r1 = cross(dPdy, nRef);
          vec3 r2 = cross(nRef, dPdx);
          float det = dot(dPdx, r1);
          vec3 grad = sign(det) * (dHdx * r1 + dHdy * r2);
          normal = normalize(abs(det) * nRef - uBump * grad);
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += vdWood * max(uHighlight, 0.0) * 0.1;`,
      );
  };

  // Every wood material compiles to the same program, so pin the cache key
  // rather than letting three hash the (identical) closure source each time.
  material.customProgramCacheKey = () => 'vima-wood-v1';

  return { material, uniforms };
}

/** Antique brass for the kabza and the lock furniture. */
export function createBrassMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d8ab5c'),
    metalness: 0.92,
    roughness: 0.26,
    envMapIntensity: 1.8,
    // Driven by `emissiveIntensity` when the part is selected.
    emissive: new THREE.Color('#cfa255'),
    emissiveIntensity: 0,
  });
}
