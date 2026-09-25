'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/porsche/scene.gltf');

interface AnimatedCarProps {
  isNight: boolean;
  activeService: string | null;
}

export default function AnimatedCar({ isNight, activeService }: AnimatedCarProps) {
  const { scene } = useGLTF('/porsche/scene.gltf');
  const carGroup = useRef<THREE.Group>(null);
  const neonGroup = useRef<THREE.Group>(null);
  const [delayedService, setDelayedService] = useState<string | null>(null);

  // ПРИНУДИТЕЛЬНО ВЫКЛЮЧАЕМ СКРЫТЫЕ ТЕНИ МОДЕЛИ (ЭТО УБЬЕТ ЛАГИ)
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (activeService) {
      const timer = setTimeout(() => setDelayedService(activeService), 300);
      return () => clearTimeout(timer);
    } else {
      setDelayedService(null);
    }
  }, [activeService]);
  
  const targetL = useMemo(() => { const t = new THREE.Object3D(); t.position.set(0.78, 0.82, -10); return t; }, []);
  const targetR = useMemo(() => { const t = new THREE.Object3D(); t.position.set(-0.78, 0.82, -10); return t; }, []);
  const currentLookAt = useRef(new THREE.Vector3(0, -0.2, 0));

  useFrame((state, delta) => {
    const scrollContainer = document.getElementById('main-scroll-container');
    let progress = 0;
    
    if (scrollContainer && !delayedService) {
      const scrollTop = scrollContainer.scrollTop;
      const maxScroll = Math.max(1, scrollContainer.scrollHeight - scrollContainer.clientHeight);
      progress = scrollTop / maxScroll;
    }

    if (carGroup.current && !delayedService) {
      const startAngle = Math.PI * 0.75; 
      const targetRotationY = startAngle - (progress * Math.PI * 2);
      carGroup.current.rotation.y = THREE.MathUtils.damp(carGroup.current.rotation.y, targetRotationY, 4, delta);
      carGroup.current.position.y = -0.9;
    }

    if (isNight && neonGroup.current) {
      neonGroup.current.rotation.y += delta * 0.4;
    }

    const targetCamPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (delayedService === 'Логистика под ключ') {
      targetCamPos.set(-2.5, 0.5, 4.5);
      targetLook.set(-1.5, -0.2, 0); 
    } else if (delayedService === 'Таможенная очистка') {
      targetCamPos.set(-1.0, 3.8, 2.8); 
      targetLook.set(-2.0, -0.2, 0);
    } else if (delayedService === 'Эксклюзивный подбор') {
      targetCamPos.set(4.0, 1.5, -4.5);
      targetLook.set(2.0, 0.2, 0);
    } else {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const dist = isMobile
        ? (isNight ? 7.6 : 8.4)
        : (isNight ? 5.8 : 7.0);
      const camX = isMobile ? -0.35 : 0.0;
      const camY = isMobile ? 1.4 : 1.0;
      targetCamPos.set(camX, camY, dist);
      targetLook.set(isMobile ? 0.05 : 0.0, isMobile ? -0.22 : 0.2, 0);
    }
    
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetCamPos.x, 2.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamPos.y, 2.0, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamPos.z, 2.0, delta);
    
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLook.x, 2.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLook.y, 2.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLook.z, 2.5, delta);
    
    state.camera.lookAt(currentLookAt.current);
  });

  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(256, 256, 20, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.60)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.30)');
      gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.08)');
      gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0.01)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const currentScale = isMobile ? 1.0 : 1.15;

  return (
    <group>
      
      {isNight && (
        <group>
          <directionalLight position={[0, 2, 6]} intensity={2.0} color="#ffffff" />
          <group ref={neonGroup}>
            <pointLight position={[6, 2, 0]} intensity={30} color="#8be9fd" distance={40} />
            <pointLight position={[-6, 1.5, 0]} intensity={30} color="#ffb86c" distance={40} />
          </group>
        </group>
      )}

      <group ref={carGroup}>
        <group scale={currentScale}>
          <primitive object={scene} />
          
          {/* Передние фары (в темной теме) */}
          {isNight && (
            <group>
              <primitive object={targetL} />
              <primitive object={targetR} />
              
              <spotLight
                position={[0.78, 0.82, -2.07]}
                angle={0.4} penumbra={0.5} intensity={250}
                color="#ffffff" distance={40}
                target={targetL}
              />
              <spotLight
                position={[-0.78, 0.82, -2.07]}
                angle={0.4} penumbra={0.5} intensity={250}
                color="#ffffff" distance={40}
                target={targetR}
              />
            </group>
          )}

          {/* Задние фонари Porsche 911 GT3 (яркие и горящие в ночи, четкие днем) */}
          <group>
            {/* Непрерывная задняя светодиодная LED-полоса */}
            <mesh position={[0, 0.74, 1.96]}>
              <boxGeometry args={[1.36, 0.035, 0.04]} />
              <meshBasicMaterial color="#ff0022" toneMapped={false} />
            </mesh>
            {/* Левый и правый акцентные блоки задних фонарей */}
            <mesh position={[-0.62, 0.74, 1.96]}>
              <boxGeometry args={[0.22, 0.05, 0.04]} />
              <meshBasicMaterial color="#ff0022" toneMapped={false} />
            </mesh>
            <mesh position={[0.62, 0.74, 1.96]}>
              <boxGeometry args={[0.22, 0.05, 0.04]} />
              <meshBasicMaterial color="#ff0022" toneMapped={false} />
            </mesh>
            
            {/* Мощное точечное освещение задних фар */}
            <pointLight position={[0, 0.74, 2.10]} intensity={isNight ? 45 : 20} color="#ff0022" distance={5} />
            <pointLight position={[-0.6, 0.74, 2.05]} intensity={isNight ? 25 : 12} color="#ff0011" distance={3.5} />
            <pointLight position={[0.6, 0.74, 2.05]} intensity={isNight ? 25 : 12} color="#ff0011" distance={3.5} />
          </group>
        </group>
      </group>

      {/* Мягкая реалистичная тень прямо под автомобилем */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.89, 0]}>
        <planeGeometry args={[3.6, 5.6]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={isNight ? 0.75 : 0.40} depthWrite={false} />
      </mesh>
    </group>
  );
}
