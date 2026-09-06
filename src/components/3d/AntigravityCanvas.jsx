import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../../utils/audioEngine';
import { createStarTexture } from './textureGenerators';
import { createRealmGalaxy } from './realmGalaxy';
import { createRealmWorld } from './realmWorld';
import { createRealmForest } from './realmForest';
import { createRealmCastle } from './realmCastle';
import { createRealmBloom } from './realmBloom';

export default function AntigravityCanvas({ onCardSelect }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const hoveredCardRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene & Renderer Initialization ---
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialBgColor = new THREE.Color(0x020106);
    scene.background = initialBgColor;
    scene.fog = new THREE.FogExp2(0x020106, 0.00035);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 14000.0);
    cameraRef.current = camera;
    camera.position.set(0, 0, 90);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    containerRef.current.appendChild(renderer.domElement);

    // Shared Star Sprite Texture
    const starSprite = createStarTexture();

    // --- 2. Multi-Realm Instantiation ---
    const realmGalaxy = createRealmGalaxy(scene, starSprite);
    const realmWorld = createRealmWorld(scene);
    const realmForest = createRealmForest(scene, starSprite);
    const realmCastle = createRealmCastle(scene, starSprite);
    const realmBloom = createRealmBloom(scene, starSprite);

    // --- 3. Dynamic Atmospheric & Celestial Lighting ---
    // Key Celestial Spotlight (tracks camera journey)
    const keySpotlight = new THREE.SpotLight(0xffe699, 1.2);
    keySpotlight.position.set(0, 150, 100);
    keySpotlight.angle = Math.PI / 3;
    keySpotlight.penumbra = 0.8;
    scene.add(keySpotlight);

    // Fill Light 1 (Cyan/Emerald/Violet)
    const fillLight1 = new THREE.DirectionalLight(0xd946ef, 0.7);
    fillLight1.position.set(-150, 80, -200);
    scene.add(fillLight1);

    // Fill Light 2 (Cyan/Azure)
    const fillLight2 = new THREE.DirectionalLight(0x06b6d4, 0.65);
    fillLight2.position.set(150, -60, -400);
    scene.add(fillLight2);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x0e081c, 0.55);
    scene.add(ambientLight);

    // --- 4. Catmull-Rom Smooth Camera & LookAt Trajectory ---
    // Smooth C2-continuous path through all 5 realms:
    // Cosmos (0.00-0.22) -> Orbit & World (0.22-0.42) -> Forest (0.42-0.66) -> Castle (0.66-0.88) -> Bloom & Galaxy (0.88-1.00)
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 90),         // 0.00: Deep Cosmos
      new THREE.Vector3(12, 18, -450),     // 0.12: Cosmic acceleration
      new THREE.Vector3(0, 14, -1120),     // 0.25: Approaching Living Earth
      new THREE.Vector3(-8, 6, -1480),     // 0.35: Entering Cloud Atmosphere
      new THREE.Vector3(0, -6, -1820),     // 0.44: Breaking through clouds to forest
      new THREE.Vector3(10, -16, -2400),   // 0.54: Forest canopy & fireflies
      new THREE.Vector3(-6, -18, -3100),   // 0.64: Runic forest trail
      new THREE.Vector3(0, 15, -3700),     // 0.74: Clearing reveals Gothic Castle
      new THREE.Vector3(0, 85, -4100),     // 0.82: Ascending Castle Spire
      new THREE.Vector3(0, 175, -4240),    // 0.90: Apex Beacon & Supernova threshold
      new THREE.Vector3(0, 240, -4550)     // 1.00: Cosmic Bloom Ascension into Galaxy
    ]);

    const lookPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -250),
      new THREE.Vector3(0, 10, -950),
      new THREE.Vector3(0, 10, -1500),    // Look at World Center
      new THREE.Vector3(0, -5, -1950),
      new THREE.Vector3(0, -18, -2600),
      new THREE.Vector3(0, -16, -3300),
      new THREE.Vector3(0, 45, -4300),    // Look up at Castle
      new THREE.Vector3(0, 140, -4300),
      new THREE.Vector3(0, 205, -4310),   // Look at Castle Apex Orb
      new THREE.Vector3(0, 280, -5300)    // Look into boundless rebirth Galaxy
    ]);

    // Color stops for seamless atmospheric mood shifts
    const colorStops = [
      { t: 0.00, bg: new THREE.Color(0x020106), fog: 0.00035, spot: 0xffe699, fill1: 0xd946ef, fill2: 0x06b6d4 }, // Cosmos
      { t: 0.26, bg: new THREE.Color(0x030a1c), fog: 0.00045, spot: 0x60a5fa, fill1: 0x06b6d4, fill2: 0x3b82f6 }, // Earth Orbit
      { t: 0.38, bg: new THREE.Color(0x05162a), fog: 0.00110, spot: 0x93c5fd, fill1: 0x38bdf8, fill2: 0x0284c7 }, // Cloud Entry
      { t: 0.54, bg: new THREE.Color(0x020c08), fog: 0.00085, spot: 0x34d399, fill1: 0x059669, fill2: 0xf59e0b }, // Dark Forest
      { t: 0.72, bg: new THREE.Color(0x070314), fog: 0.00055, spot: 0xfbbf24, fill1: 0xa855f7, fill2: 0x6366f1 }, // Castle Base
      { t: 0.86, bg: new THREE.Color(0x130628), fog: 0.00050, spot: 0xfde047, fill1: 0xc084fc, fill2: 0x38bdf8 }, // Castle Spire
      { t: 0.94, bg: new THREE.Color(0x280e42), fog: 0.00065, spot: 0xffedd5, fill1: 0xf472b6, fill2: 0x67e8f9 }, // Supernova Bloom
      { t: 1.00, bg: new THREE.Color(0x020106), fog: 0.00035, spot: 0xffe699, fill1: 0xd946ef, fill2: 0x06b6d4 }  // Galaxy Rebirth
    ];

    const getInterpolatedAtmosphere = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      let idx = 0;
      for (let i = 0; i < colorStops.length - 1; i++) {
        if (p >= colorStops[i].t && p <= colorStops[i + 1].t) {
          idx = i;
          break;
        }
      }
      const s1 = colorStops[idx];
      const s2 = colorStops[idx + 1];
      const span = s2.t - s1.t;
      const factor = span > 0 ? (p - s1.t) / span : 0;

      const bg = s1.bg.clone().lerp(s2.bg, factor);
      const fogDensity = THREE.MathUtils.lerp(s1.fog, s2.fog, factor);
      const spot = new THREE.Color(s1.spot).lerp(new THREE.Color(s2.spot), factor);
      const fill1 = new THREE.Color(s1.fill1).lerp(new THREE.Color(s2.fill1), factor);
      const fill2 = new THREE.Color(s1.fill2).lerp(new THREE.Color(s2.fill2), factor);

      return { bg, fogDensity, spot, fill1, fill2 };
    };

    // --- 5. Event Handlers & Precision Scroll Tracking ---
    const handleScroll = () => {
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const ratio = Math.min(Math.max(scrollY / docHeight, 0), 1);
      scrollRef.current.target = ratio;
    };

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleClick = () => {
      if (hoveredCardRef.current) {
        audioEngine.playMechanicalClick();
        if (onCardSelect) onCardSelect(hoveredCardRef.current);
      }
    };

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Initial scroll sync
    handleScroll();

    // --- 6. Main Animation Render Loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth damped scroll interpolation (cinematic glide)
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.07;
      const progress = scrollRef.current.current;

      // Smooth cursor parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update Camera along Catmull-Rom spline
      const camPoint = cameraPath.getPointAt(progress);
      const lookPoint = lookPath.getPointAt(progress);

      // Subtle mouse parallax tilt
      const parallaxX = mouseRef.current.x * 12;
      const parallaxY = mouseRef.current.y * 8;

      camera.position.set(
        camPoint.x + parallaxX,
        camPoint.y + parallaxY,
        camPoint.z
      );
      camera.lookAt(lookPoint.x, lookPoint.y, lookPoint.z);

      // Dynamic Atmospheric Fog & Lighting Updates
      const atmo = getInterpolatedAtmosphere(progress);
      scene.background = atmo.bg;
      scene.fog.color = atmo.bg;
      scene.fog.density = atmo.fogDensity;

      keySpotlight.color = atmo.spot;
      keySpotlight.position.set(camera.position.x, camera.position.y + 120, camera.position.z + 50);
      keySpotlight.target.position.copy(lookPoint);
      keySpotlight.target.updateMatrixWorld();

      fillLight1.color = atmo.fill1;
      fillLight1.position.set(camera.position.x - 120, camera.position.y + 60, camera.position.z - 200);

      fillLight2.color = atmo.fill2;
      fillLight2.position.set(camera.position.x + 120, camera.position.y - 40, camera.position.z - 300);

      // Update all 5 realms
      realmGalaxy.update(elapsed, delta, progress);
      realmWorld.update(elapsed, delta, progress);
      realmForest.update(elapsed, delta, progress);
      realmCastle.update(elapsed, delta, progress);
      realmBloom.update(elapsed, delta, progress);

      // Raycasting for Tarot Cards in Cosmos (Scroll < 0.28)
      if (progress < 0.28) {
        const ray = raycasterRef.current;
        ray.setFromCamera(new THREE.Vector2(mouseRef.current.x, mouseRef.current.y), camera);
        const intersects = ray.intersectObjects(realmGalaxy.cards.map((c) => c.mesh));

        if (intersects.length > 0) {
          const topHit = intersects[0].object;
          const matched = realmGalaxy.cards.find((c) => c.mesh === topHit);
          if (matched && hoveredCardRef.current !== matched) {
            hoveredCardRef.current = matched;
            audioEngine.playMechanicalClick();
            matched.mesh.material.emissive.setHex(0xd4af37);
            matched.mesh.material.emissiveIntensity = 0.8;
          }
        } else {
          if (hoveredCardRef.current) {
            hoveredCardRef.current.mesh.material.emissive.setHex(0x0e0618);
            hoveredCardRef.current.mesh.material.emissiveIntensity = 0.2;
            hoveredCardRef.current = null;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 7. Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [onCardSelect]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
    />
  );
}
