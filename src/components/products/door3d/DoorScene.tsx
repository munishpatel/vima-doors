import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import type { AnatomyPartId, CameraFraming } from '@/data/doorAnatomy';
import AnnotationPins from './AnnotationPins';
import CameraRig, { type DragState } from './CameraRig';
import DoorModel from './DoorModel';
import StudioEnvironment from './StudioEnvironment';

export interface DoorSceneProps {
  activeId: AnatomyPartId | null;
  hoverId: AnatomyPartId | null;
  framing: CameraFraming;
  resetKey: number;
  reducedMotion: boolean;
  /** Stops the render loop while the hero is scrolled out of view. */
  paused: boolean;
  onSelect: (id: AnatomyPartId) => void;
  onHoverChange: (id: AnatomyPartId | null) => void;
  onDeselect: () => void;
}

/**
 * The WebGL boundary. Everything that imports `three` lives under this file so
 * `React.lazy` can keep the whole renderer out of the initial bundle.
 */
export default function DoorScene({
  activeId,
  hoverId,
  framing,
  resetKey,
  reducedMotion,
  paused,
  onSelect,
  onHoverChange,
  onDeselect,
}: DoorSceneProps) {
  const dragState = useRef<DragState>({ dragging: false, moved: false });

  // A drag that happens to finish over a part is not a selection.
  const selectIfNotDragging = useCallback(
    (id: AnatomyPartId) => {
      if (dragState.current.moved) return;
      onSelect(id);
    },
    [onSelect],
  );

  const handleMissed = useCallback(() => {
    if (dragState.current.moved) return;
    onDeselect();
  }, [onDeselect]);

  return (
    <Canvas
      shadows
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 60, position: [2, 1, 3] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
      }}
      onPointerMissed={handleMissed}
      // Vertical swipes stay with the page; the rig only reads horizontal
      // movement from touch pointers.
      style={{ touchAction: 'pan-y', cursor: hoverId ? 'pointer' : 'grab' }}
    >
      <CameraRig
        framing={framing}
        resetKey={resetKey}
        autoOrbit={activeId === null}
        dragStateRef={dragState}
      />
      <StudioEnvironment />
      <DoorModel
        activeId={activeId}
        hoverId={hoverId}
        onSelect={selectIfNotDragging}
        onHoverChange={onHoverChange}
      />
      <AnnotationPins
        activeId={activeId}
        hoverId={hoverId}
        onSelect={selectIfNotDragging}
        onHoverChange={onHoverChange}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
