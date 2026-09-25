'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

useGLTF.preload('/porsche/scene.gltf');

interface AnimatedCarProps {
  isNight: boolean;
  activeService: string | null;
}

export default function AnimatedCar({ isNight, activeService }: AnimatedCarProps) {
  const { scene } = useGLTF('/porsche/scene.gltf');
  const carGroup = useRef<THREE.Group>(null);
  const carBodyRef = useRef<THREE.Group>(null);
  const neonGroup = useRef<THREE.Group>(null);
  const [delayedService, setDelayedService] = useState<string | null>(null);
  const isFirstMount = useRef(true);

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

  // Плавный благородный выезд (1.4с, power2.out) без yoyo
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (carBodyRef.current) {
        carBodyRef.current.position.set(0, 0, isNight ? -0.15 : 0);
      }
      return;
    }

    if (carBodyRef.current) {
      gsap.killTweensOf(carBodyRef.current.position);
      gsap.to(carBodyRef.current.position, {
        z: isNight ? -0.15 : 0,
        duration: 1.4,
        ease: 'power2.out',
      });
    }
  }, [isNight]);
  
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

    if (carGroup.current) {
      carGroup.current.position.set(0, -0.75, 0);
      if (!delayedService) {
        const startAngle = Math.PI * 0.75; 
        const targetRotationY = startAngle - (progress * Math.PI * 2);
        carGroup.current.rotation.y = THREE.MathUtils.damp(carGroup.current.rotation.y, targetRotationY, 4, delta);
      }
    }

    if (isNight && neonGroup.current) {
      neonGroup.current.rotation.y += delta * 0.4;
    }

    const targetCamPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (delayedService === 'Логистика под ключ') {
      targetCamPos.set(-2.5, 0.65, 4.5);
      targetLook.set(-1.5, -0.05, 0); 
    } else if (delayedService === 'Таможенная очистка') {
      targetCamPos.set(-1.0, 3.95, 2.8); 
      targetLook.set(-2.0, -0.05, 0);
    } else if (delayedService === 'Эксклюзивный подбор') {
      targetCamPos.set(4.0, 1.65, -4.5);
      targetLook.set(2.0, 0.35, 0);
    } else if (delayedService === 'Прокат премиум-авто') {
      targetCamPos.set(4.2, 0.95, 2.5);
      targetLook.set(1.5, 0.05, 0);
    } else if (delayedService === 'Детейлинг и защита') {
      targetCamPos.set(-1.2, 0.75, 2.8);
      targetLook.set(-0.5, 0.15, 0.5);
    } else if (delayedService === 'Тюнинг и стайлинг') {
      targetCamPos.set(-2.8, 0.55, -3.5);
      targetLook.set(-1.0, -0.05, -1.0);
    } else if (delayedService === 'Лизинг и Trade-In') {
      targetCamPos.set(2.5, 3.35, 3.5);
      targetLook.set(0.5, 0.35, 0);
    } else {
      targetCamPos.set(0, 0.95, 6.8);
      targetLook.set(0, 0.1, 0);
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
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

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
        <group ref={carBodyRef}>
          <primitive object={scene} scale={1.15} />
          
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

              <mesh position={[-0.3, 0.69, 2.67]}>
                <boxGeometry args={[0.4, 0.05, 0.05]} />
                <meshBasicMaterial color="#ff0000" toneMapped={false} />
              </mesh>
              <mesh position={[0.3, 0.69, 2.67]}>
                <boxGeometry args={[0.4, 0.05, 0.05]} />
                <meshBasicMaterial color="#ff0000" toneMapped={false} />
              </mesh>
              
              <pointLight position={[0, 0.69, 2.8]} intensity={8} color="#ff0000" distance={3} />
            </group>
          )}
        </group>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.74, 0]}>
        <planeGeometry args={[5, 10]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={isNight ? 0.9 : 0.7} depthWrite={false} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.745, 2]}>
        <planeGeometry args={[8, 12]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={isNight ? 0.6 : 0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}
