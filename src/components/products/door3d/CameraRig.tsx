import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import type { CameraFraming } from '@/data/doorAnatomy';

export interface DragState {
  dragging: boolean;
  /** Set once the pointer travels far enough that this is a drag, not a click. */
  moved: boolean;
}

export interface CameraRigProps {
  framing: CameraFraming;
  /** Bumping this re-applies `framing` even when the object is unchanged. */
  resetKey: number;
  /** Auto-orbit only runs while nothing is selected. */
  autoOrbit: boolean;
  /** Shared with the model so a drag that ends over a part is not a click. */
  dragStateRef: RefObject<DragState>;
  onUserOrbit?: () => void;
}

const ORBIT_SPEED = 0.055; // rad/s
const IDLE_DELAY_MS = 2200;
const DRAG_THRESHOLD_PX = 5;
const PHI_MIN = 0.42;
const PHI_MAX = Math.PI - 0.42;

/** Shortest equivalent angle to `to`, expressed relative to `from`. */
function nearestAngle(from: number, to: number): number {
  return from + Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

/**
 * Owns the camera completely: spherical orbit state, pointer drag, idle
 * auto-orbit and eased transitions into a part's framing.
 *
 * Rolling our own rather than reaching for OrbitControls avoids the usual
 * fight between a controls instance and programmatic camera moves — here both
 * write to the same goal, so a drag mid-transition simply takes over.
 */
export default function CameraRig({
  framing,
  resetKey,
  autoOrbit,
  dragStateRef,
  onUserOrbit,
}: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const domElement = useThree((s) => s.gl.domElement);

  const current = useRef({ theta: framing.theta, phi: framing.phi, radius: framing.radius });
  const goal = useRef({ theta: framing.theta, phi: framing.phi, radius: framing.radius });
  // Seeded from the initial framing and then mutated in place; later framing
  // changes are picked up by the effect below, not by re-creating these.
  const currentTarget = useRef(new THREE.Vector3(...framing.target)).current;
  const goalTarget = useRef(new THREE.Vector3(...framing.target)).current;
  const spherical = useMemo(() => new THREE.Spherical(), []);
  const resumeAt = useRef(0);

  // Adopt a new framing. Theta is rewritten relative to where the camera
  // already is so it never takes the long way around the door.
  useLayoutEffect(() => {
    goal.current.theta = nearestAngle(current.current.theta, framing.theta);
    goal.current.phi = framing.phi;
    goal.current.radius = framing.radius;
    goalTarget.set(...framing.target);
    resumeAt.current = 0;
  }, [framing, resetKey, goalTarget]);

  // Place the camera before the first painted frame.
  useLayoutEffect(() => {
    spherical.set(current.current.radius, current.current.phi, current.current.theta);
    camera.position.setFromSpherical(spherical).add(currentTarget);
    camera.lookAt(currentTarget);
    // Run once: later updates belong to useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const drag = dragStateRef.current;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (pointerId !== null || e.button > 0) return;
      pointerId = e.pointerId;
      lastX = startX = e.clientX;
      lastY = startY = e.clientY;
      drag.dragging = true;
      drag.moved = false;
      domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (Math.hypot(e.clientX - startX, e.clientY - startY) > DRAG_THRESHOLD_PX) {
        drag.moved = true;
      }

      goal.current.theta -= dx * 0.006;
      // Touch drags stay horizontal so a vertical swipe still scrolls the
      // page — the canvas sets `touch-action: pan-y` to match.
      if (e.pointerType !== 'touch') {
        goal.current.phi = THREE.MathUtils.clamp(
          goal.current.phi - dy * 0.005,
          PHI_MIN,
          PHI_MAX,
        );
      }
      resumeAt.current = performance.now() + IDLE_DELAY_MS;
      if (drag.moved) onUserOrbit?.();
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      drag.dragging = false;
      resumeAt.current = performance.now() + IDLE_DELAY_MS;
      if (domElement.hasPointerCapture(e.pointerId)) {
        domElement.releasePointerCapture(e.pointerId);
      }
    };

    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', endDrag);
    domElement.addEventListener('pointercancel', endDrag);
    return () => {
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', endDrag);
      domElement.removeEventListener('pointercancel', endDrag);
      drag.dragging = false;
      drag.moved = false;
    };
  }, [domElement, dragStateRef, onUserOrbit]);

  useFrame((_, rawDelta) => {
    // Clamp so a backgrounded tab does not resume with one enormous step.
    const delta = Math.min(rawDelta, 0.05);

    const idle = !dragStateRef.current.dragging && performance.now() >= resumeAt.current;
    if (autoOrbit && idle) {
      goal.current.theta += ORBIT_SPEED * delta;
    }

    current.current.theta = THREE.MathUtils.damp(
      current.current.theta,
      goal.current.theta,
      4.5,
      delta,
    );
    current.current.phi = THREE.MathUtils.damp(
      current.current.phi,
      goal.current.phi,
      4.5,
      delta,
    );
    current.current.radius = THREE.MathUtils.damp(
      current.current.radius,
      goal.current.radius,
      3.4,
      delta,
    );
    currentTarget.lerp(goalTarget, 1 - Math.exp(-4 * delta));

    spherical.set(current.current.radius, current.current.phi, current.current.theta);
    camera.position.setFromSpherical(spherical).add(currentTarget);
    camera.lookAt(currentTarget);
  });

  return null;
}
