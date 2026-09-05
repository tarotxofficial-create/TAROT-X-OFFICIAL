import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../../utils/audioEngine';

export default function AntigravityCanvas({ activeZone = 0, scrollProgress = 0, onCardSelect }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cardsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const hoveredCardRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene & Engine Initialization ---
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.FogExp2(0x050508, 0.00045);

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000.0);
    cameraRef.current = camera;
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Lighting Pipeline ---
    // Overhead spotlight #1 with subtle flicker
    const spotlight = new THREE.SpotLight(0xffffff, 2.0);
    spotlight.position.set(0, 150, 100);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.8;
    scene.add(spotlight);

    // Cyan accent directional light
    const cyanLight = new THREE.DirectionalLight(0x66FCF1, 1.2);
    cyanLight.position.set(-100, 50, -200);
    scene.add(cyanLight);

    // Amber warning rim light
    const amberLight = new THREE.DirectionalLight(0xC5A059, 0.8);
    amberLight.position.set(100, -50, -400);
    scene.add(amberLight);

    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x111622, 0.9);
    scene.add(ambientLight);

    // --- 3. 78 Probability Cards (Zero-G Physics Entities) ---
    const cardGeometry = new THREE.BoxGeometry(4.5, 7.5, 0.12);
    const cardMaterials = [];
    const cards = [];

    // Helper: generate procedural card canvas texture
    const createCardTexture = (index, name, symbol) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 420;
      const ctx = canvas.getContext('2d');

      // Card Dark Titanium Background
      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, 256, 420);

      // Cyan Hairline Border
      ctx.strokeStyle = '#66FCF1';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 236, 400);

      // Inner Matrix Lines
      ctx.strokeStyle = 'rgba(102, 252, 241, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, 80); ctx.lineTo(246, 80);
      ctx.moveTo(10, 340); ctx.lineTo(246, 340);
      ctx.stroke();

      // Card Header
      ctx.fillStyle = '#66FCF1';
      ctx.font = 'bold 18px "Space Mono", monospace';
      ctx.fillText(`NODE #${String(index).padStart(2, '0')}`, 24, 52);

      // Center Symbol / Geometry
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(128, 210, 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#C5A059';
      ctx.font = '32px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(symbol || 'Ψ', 128, 222);

      // Bottom Name
      ctx.fillStyle = '#F8F9FA';
      ctx.font = 'bold 13px "Space Mono", monospace';
      ctx.fillText(name.toUpperCase(), 128, 375);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const cardNames = [
      { name: 'Sunk-Cost Vector', sym: '07' },
      { name: 'Structural Rupture', sym: '16' },
      { name: 'Deterministic Loop', sym: '21' },
      { name: 'Entropy Divergence', sym: 'Δ' },
      { name: 'Cognitive Blindspot', sym: 'Ø' },
      { name: 'Risk Asymmetry', sym: '∑' },
      { name: 'Escalation Trap', sym: 'Ω' },
      { name: 'Stochastic Echo', sym: 'λ' },
      { name: 'Leverage Axis', sym: 'X' },
      { name: 'Feedback Equilibrium', sym: '∞' },
    ];

    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    // Instantiate 78 physical zero-g cards distributed along the 5 orbital zones
    for (let i = 0; i < 78; i++) {
      const cardData = cardNames[i % cardNames.length];
      const texture = createCardTexture(i + 1, cardData.name, cardData.sym);
      
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.85,
        roughness: 0.25,
        emissive: new THREE.Color(0x050508),
        emissiveIntensity: 0.1,
      });
      cardMaterials.push(mat);

      const mesh = new THREE.Mesh(cardGeometry, mat);
      
      // Distribute along depth Z: 50 to -5800
      const spreadZ = (i / 78) * -5600 + 40;
      const spreadRadius = 25 + Math.random() * 45;
      const angle = (i * 137.5 * Math.PI) / 180; // Golden ratio spiral

      const basePos = new THREE.Vector3(
        Math.cos(angle) * spreadRadius,
        Math.sin(angle) * (spreadRadius * 0.6) + (Math.random() - 0.5) * 15,
        spreadZ
      );

      mesh.position.copy(basePos);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const cardObj = {
        mesh,
        basePos,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.003
        ),
        index: i + 1,
        name: cardData.name,
      };

      cards.push(cardObj);
      cardsGroup.add(mesh);
    }
    cardsRef.current = cards;

    // --- 4. Cyan Laser Connecting Vectors ---
    // Connect nearest card pairs with glowing cyan laser vector lines
    const linePositions = [];
    for (let i = 0; i < cards.length; i += 2) {
      if (i + 1 < cards.length) {
        linePositions.push(
          cards[i].mesh.position.x, cards[i].mesh.position.y, cards[i].mesh.position.z,
          cards[i + 1].mesh.position.x, cards[i + 1].mesh.position.y, cards[i + 1].mesh.position.z
        );
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x66FCF1,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const laserLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(laserLines);

    // --- 5. Central Holographic Ring Nodes ---
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const createHoloRing = (radius, z) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.3, radius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x66FCF1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = z;
      ringGroup.add(ringMesh);
      return ringMesh;
    };

    const ring1 = createHoloRing(40, -100);
    const ring2 = createHoloRing(65, -1200);
    const ring3 = createHoloRing(90, -3200);
    const ring4 = createHoloRing(120, -5000);

    // Space Dust Particle Field
    const dustCount = 1200;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 200;
      dustPositions[i + 1] = (Math.random() - 0.5) * 200;
      dustPositions[i + 2] = -Math.random() * 6000 + 100;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x66FCF1,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- 6. Event Handlers (Mouse Gravity Vector & Raycasting) ---
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    const handleClick = () => {
      if (hoveredCardRef.current && onCardSelect) {
        audioEngine.playMechanicalClick();
        onCardSelect(hoveredCardRef.current);
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // --- 7. Main Animation & Physics Loop ---
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse coordinates interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Spotlight subtle organic flicker
      spotlight.intensity = 1.8 + Math.sin(elapsed * 12) * 0.15 + (Math.random() - 0.5) * 0.08;

      // Smooth Camera Z-Depth interpolation based on continuous page scroll
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      
      // Target Z traverses smoothly from +80 down to -5200 as the user scrolls the page
      const targetZ = 80 - scrollRatio * 5200;

      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.x += (mouseRef.current.x * 14 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 12 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, camera.position.z - 150);

      // Rotate Holographic concentric rings
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;
      ring3.rotation.z += 0.002;
      ring4.rotation.z -= 0.003;

      // Zero-G Card Physics & Mouse Repulsion Vector
      const ray = raycasterRef.current;
      ray.setFromCamera(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        camera
      );

      const intersects = ray.intersectObjects(cards.map(c => c.mesh));
      if (intersects.length > 0) {
        const topHit = intersects[0].object;
        const matched = cards.find(c => c.mesh === topHit);
        if (matched && hoveredCardRef.current !== matched) {
          hoveredCardRef.current = matched;
          audioEngine.playMechanicalClick();
          matched.mesh.material.emissive.setHex(0x66FCF1);
          matched.mesh.material.emissiveIntensity = 0.5;
        }
      } else {
        if (hoveredCardRef.current) {
          hoveredCardRef.current.mesh.material.emissive.setHex(0x050508);
          hoveredCardRef.current.mesh.material.emissiveIntensity = 0.1;
          hoveredCardRef.current = null;
        }
      }

      // Physics update for cards
      cards.forEach((card, idx) => {
        // Micro-rotations
        card.mesh.rotation.x += card.rotSpeed.x;
        card.mesh.rotation.y += card.rotSpeed.y;
        card.mesh.rotation.z += card.rotSpeed.z;

        // Subtle zero-g drift
        card.mesh.position.add(card.velocity);

        // Tether back to base position if drifting too far
        const distFromBase = card.mesh.position.distanceTo(card.basePos);
        if (distFromBase > 18) {
          const pullBack = new THREE.Vector3().subVectors(card.basePos, card.mesh.position).normalize().multiplyScalar(0.04);
          card.velocity.add(pullBack);
        }

        // Apply damping (Zero-G resistance)
        card.velocity.multiplyScalar(0.985);

        // Mouse displacement force (if nearby camera plane)
        const dZ = Math.abs(card.mesh.position.z - camera.position.z);
        if (dZ < 200) {
          const screenPos = card.mesh.position.clone().project(camera);
          const distToMouse = Math.hypot(screenPos.x - mouseRef.current.x, screenPos.y - mouseRef.current.y);
          if (distToMouse < 0.25) {
            const pushDir = new THREE.Vector3(
              (screenPos.x - mouseRef.current.x) * 0.4,
              (screenPos.y - mouseRef.current.y) * 0.4,
              0.1
            );
            card.velocity.add(pushDir);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- 8. Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [activeZone]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  );
}
