'use client';

/**
 * HeroCanvas — Photorealistic Porsche 992 GT3 RS studio scene
 *
 * Model: /public/porsche/scene.gltf  (local, no CORS risk)
 *        scene.bin (28 MB), textures/ (75 PNGs)
 *        Source: Sketchfab — porsche_992_gt3_rs
 *
 * Pipeline:
 *   Environment preset="studio"  → HDRI dome for PBR paint/glass reflections
 *   ambientLight + spotLight(s)  → key + fill, shadows enabled
 *   ContactShadows               → soft shadow grounds car on white floor
 *   PresentationControls         → grab-to-spin mouse interaction
 *   Center                       → auto-centres model origin
 */

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  Center,
  ContactShadows,
  PresentationControls,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';

const MODEL = '/porsche/scene.gltf';

// Start fetching at module parse — safe because this file is browser-only
// (imported via dynamic(..., { ssr: false }) in HeroSection.tsx)
useGLTF.preload(MODEL);

// ─── Car ─────────────────────────────────────────────────────────────────────

function PorscheCar() {
  const { scene } = useGLTF(MODEL);
  const ref = useRef<THREE.Group>(null);

  // Gentle idle turntable — naturally pauses when user grabs with mouse
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.14;
  });

  return (
    <group ref={ref}>
      {/*
        Center auto-aligns the model's bounding box to origin.
        rotation Y = -PI/4 gives the classic 3/4 front-left presentation angle.
      */}
      <Center>
        <primitive
          object={scene}
          scale={1.9}
          rotation={[0, -Math.PI / 4, 0]}
        />
      </Center>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function StudioScene() {
  return (
    <>
      {/* Pure white studio background */}
      <color attach="background" args={['#ffffff']} />

      {/* Ambient fill — no absolute black areas on the body */}
      <ambientLight intensity={0.7} />

      {/* Key light — main shadow caster, simulates studio softbox */}
      <spotLight
        position={[5, 10, 5]}
        angle={0.18}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Rim / fill light from behind-left — lifts rear body detail */}
      <spotLight
        position={[-6, 5, -5]}
        angle={0.22}
        penumbra={1}
        intensity={0.45}
      />

      {/*
        Environment "studio" = a grey-white HDRI dome.
        background={false}: the dome is invisible but still provides
        the environment map used by PBR materials for reflections.
        This is what gives car paint and glass their realistic look.
      */}
      <Environment preset="studio" background={false} />

      {/*
        PresentationControls: user can drag to spin the model.
        polar limits prevent flipping upside-down.
        snap={false} = no spring-back, stays where user leaves it.
      */}
      <PresentationControls
        speed={1.5}
        global
        zoom={0.8}
        polar={[-0.1, Math.PI / 4]}
        azimuth={[-Infinity, Infinity]}
        snap={false}
      >
        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  color: '#18181b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                LOADING...
              </div>
            </Html>
          }
        >
          <PorscheCar />

          {/*
            ContactShadows must be INSIDE the same Suspense as the car
            because it suspends internally.
            position y=-0.05 sits just below the car's lowest point.
          */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.5}
            scale={15}
            blur={2.5}
            far={4}
            color="#b4b4b8"
          />
        </Suspense>
      </PresentationControls>
    </>
  );
}

// ─── Canvas root ─────────────────────────────────────────────────────────────

export default function HeroCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.8, 5], fov: 44 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <StudioScene />
    </Canvas>
  );
}
