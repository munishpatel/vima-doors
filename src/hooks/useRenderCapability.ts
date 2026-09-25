import { useEffect, useState } from 'react';

export interface RenderCapability {
  /** User has asked the OS to reduce motion. */
  reducedMotion: boolean;
  /** WebGL can be created at all. When false there is no 3D option to offer. */
  webgl: boolean;
  /** WebGL is unavailable, or the device looks too weak to be worth it. */
  lowPower: boolean;
  /** True once the checks have run on the client. */
  resolved: boolean;
}

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

/**
 * Decides whether this device should get the WebGL hero or the 2D schematic.
 *
 * Runs once on mount rather than on every render: the answer cannot change
 * without a reload, apart from the reduced-motion preference, which we do
 * subscribe to because users flip it mid-session.
 */
export function useRenderCapability(): RenderCapability {
  const [state, setState] = useState<RenderCapability>({
    reducedMotion: false,
    webgl: true,
    lowPower: false,
    resolved: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as NavigatorHints;

    // Weak-device heuristics. Each on its own is a poor signal, so we only
    // bail out of WebGL when the device also reports a coarse pointer.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
    const littleMemory = (nav.deviceMemory ?? 8) <= 2;
    const saveData = nav.connection?.saveData === true;

    const webgl = detectWebGL();
    const lowPower =
      !webgl || saveData || (coarsePointer && (fewCores || littleMemory));

    const sync = () =>
      setState({ reducedMotion: motionQuery.matches, webgl, lowPower, resolved: true });

    sync();
    motionQuery.addEventListener('change', sync);
    return () => motionQuery.removeEventListener('change', sync);
  }, []);

  return state;
}
