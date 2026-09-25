'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import AnimatedCar from './AnimatedCar';

interface CarCanvasProps {
  isNight: boolean;
  activeService: string | null;
}

export default function CarCanvas({ isNight, activeService }: CarCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      camera={{ position: [0, 1.5, 7.0], fov: 32 }}
    >
      <ambientLight intensity={isNight ? 0.3 : 0.6} />
      <directionalLight
        position={[5, 3, -5]}
        intensity={isNight ? 0.8 : 1.5}
        color={isNight ? '#8be9fd' : '#ffffff'}
      />
      <directionalLight
        position={[-6, 7, -2]}
        intensity={isNight ? 1.0 : 2.5}
        color={isNight ? '#e0f2fe' : '#ffffff'}
      />
      <Environment preset={isNight ? 'night' : 'city'} environmentIntensity={isNight ? 0.2 : 0.8} />

      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center justify-center pointer-events-none select-none">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-500/20 border-t-[#ffb86c] animate-spin" />
            </div>
          </Html>
        }
      >
        <AnimatedCar isNight={isNight} theme={isNight ? 'dark' : 'light'} activeService={activeService} />
      </Suspense>
    </Canvas>
  );
}
