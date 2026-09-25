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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ПРИНУДИТЕЛЬНО ВЫКЛЮЧАЕМ СКРЫТЫЕ ТЕНИ МОДЕЛИ (ЭТО УБЬЕТ ЛАГИ)
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);
  
  const targetL = useMemo(() => { const t = new THREE.Object3D(); t.position.set(0.78, 0.82, -10); return t; }, []);
  const targetR = useMemo(() => { const t = new THREE.Object3D(); t.position.set(-0.78, 0.82, -10); return t; }, []);
  const currentLookAt = useRef(new THREE.Vector3(0, -0.2, 0));

  useFrame((state, delta) => {
    const scrollContainer = document.getElementById('main-scroll-container');
    const scrollY = (typeof window !== 'undefined' ? (window.pageYOffset || window.scrollY) : 0) || (scrollContainer ? scrollContainer.scrollTop : 0);
    const scrollHeight = (typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0) || (scrollContainer ? scrollContainer.scrollHeight : 0);
    const clientHeight = (typeof window !== 'undefined' ? window.innerHeight : 0) || (scrollContainer ? scrollContainer.clientHeight : 0);
    
    let progress = 0;
    if (isMobile) {
      // На мобиле 7 карточек услуг занимают расширенный диапазон скролла
      const mobileActiveRange = Math.min(Math.max(1, scrollHeight - clientHeight), window.innerHeight * 4.2);
      progress = Math.min(1.2, scrollY / Math.max(1, mobileActiveRange));
    } else {
      // На десктопе 7 секций услуг занимают диапазон скролла 7 * innerHeight
      const desktopActiveRange = window.innerHeight * 7;
      progress = Math.min(1.0, scrollY / Math.max(1, desktopActiveRange));
    }

    if (carGroup.current) {
      const startAngle = Math.PI * 0.75; 
      const targetRotationY = startAngle - (progress * Math.PI * 2);
      const rotDamping = isMobile ? 3.5 : 2.2;
      carGroup.current.rotation.y = THREE.MathUtils.damp(carGroup.current.rotation.y, targetRotationY, rotDamping, delta);
      carGroup.current.position.y = -0.9;
    }

    if (isNight && neonGroup.current) {
      neonGroup.current.rotation.y += delta * 0.4;
    }

    const targetCamPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (!isMobile && activeService) {
      // Киноэффект: эффектный подлет камеры к деталям машины при клике на услугу на ПК
      if (activeService === 'Логистика под ключ') {
        // Фокус на переднее крыло, колесный диск и воздухозаборники
        targetCamPos.set(1.4, 0.40, 2.9);
        targetLook.set(0.3, -0.15, 0.2);
      } else if (activeService === 'Таможенная очистка') {
        // Фокус на капот, фары и герб Porsche крупным планом
        targetCamPos.set(1.1, 0.70, 2.7);
        targetLook.set(0.2, 0.05, 0.3);
      } else if (activeService === 'Эксклюзивный подбор') {
        // Динамичный ракурс три четверти спереди
        targetCamPos.set(1.7, 0.55, 2.6);
        targetLook.set(0.4, 0.0, 0);
      } else if (activeService === 'Прокат премиум-авто') {
        // Задняя часть: спойлер GT3 и горящая LED-полоса фонарей
        targetCamPos.set(1.3, 0.75, -2.7);
        targetLook.set(0.3, 0.1, 0);
      } else if (activeService === 'Детейлинг и защита') {
        // Макро-ракурс на зеркальный глянец кузова и изгибы профиля
        targetCamPos.set(1.5, 0.35, 2.3);
        targetLook.set(0.4, -0.1, 0.2);
      } else if (activeService === 'Тюнинг и стайлинг') {
        // Спортивный низкий ракурс на диффузор и сдвоенный выхлоп
        targetCamPos.set(1.3, 0.28, -2.6);
        targetLook.set(0.3, -0.2, 0);
      } else if (activeService === 'Лизинг и Trade-In') {
        // Полный солидный профиль кузова
        targetCamPos.set(1.9, 0.50, 2.6);
        targetLook.set(0.5, 0.0, 0);
      } else {
        targetCamPos.set(1.5, 0.65, 3.0);
        targetLook.set(0.4, 0.0, 0);
      }
    } else {
      // Стандартный ракурс: на ПК машина крупная, солидная и центрированная
      const dist = isMobile ? 6.2 : 4.3;
      const camY = isMobile ? 0.95 : 0.65;
      targetCamPos.set(0, camY, dist);
      targetLook.set(0, 0.05, 0);
    }
    
    const camDamping = (!isMobile && activeService) ? 2.8 : 2.2;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetCamPos.x, camDamping, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamPos.y, camDamping, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamPos.z, camDamping, delta);
    
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

  const currentScale = isMobile ? 1.05 : 1.70;

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
        <planeGeometry args={[isMobile ? 3.5 : 3.6, isMobile ? 5.4 : 5.6]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={isNight ? 0.75 : 0.40} depthWrite={false} />
      </mesh>
    </group>
  );
}
