import { ContactShadows, Environment, Lightformer } from '@react-three/drei';

/**
 * Three-point studio lighting, the way a door would actually be shot for a
 * catalogue: a large soft key from high front-left, a warm bounce card on one
 * side, a cooler fill on the other, and a dim rim behind to lift the edge of
 * the chowkhat off the background.
 *
 * The environment map is rendered from these lightformers in-process — drei
 * only downloads an HDR when you pass `preset` or `files`, and putting a
 * third-party asset on this page's critical path is not worth it.
 */
export default function StudioEnvironment() {
  return (
    <>
      <ambientLight intensity={0.45} />

      {/* Key light. Casts the self-shadowing that makes the reeding read. */}
      <directionalLight
        position={[2.4, 3.4, 3.0]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-1.5, 1.5, 2.0, -2.0, 0.1, 12]} />
      </directionalLight>

      {/* Fill, no shadow — it only lifts the shadow side. */}
      <directionalLight position={[-3.2, 1.6, -1.2]} intensity={0.5} color="#dfe8ff" />

      <Environment resolution={256} environmentIntensity={1.05}>
        <color attach="background" args={['#9a9083']} />
        {/* Softbox overhead */}
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#fff4e4"
          scale={[8, 5, 1]}
          position={[0, 4.2, 2.4]}
          rotation={[-Math.PI / 2.5, 0, 0]}
        />
        {/* Warm bounce card, camera left */}
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#ffd8a6"
          scale={[5, 5, 1]}
          position={[-3.6, 0.9, 1.2]}
          rotation={[0, Math.PI / 2, 0]}
        />
        {/* Cool fill, camera right */}
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#cfe0ff"
          scale={[5, 5, 1]}
          position={[3.6, 1.1, 0.6]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* Rim behind, separates the frame from the background */}
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#ffffff"
          scale={[6, 3, 1]}
          position={[0, 1.4, -3.2]}
        />
      </Environment>

      {/* Grounds the door without needing a visible floor. */}
      <ContactShadows
        position={[0, -1.068, 0]}
        scale={5.5}
        resolution={1024}
        opacity={0.5}
        blur={2.6}
        far={1.1}
        color="#3d2a16"
      />
    </>
  );
}
