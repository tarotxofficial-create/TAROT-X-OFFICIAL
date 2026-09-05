import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioEngine } from '../../utils/audioEngine';

export default function AntigravityCanvas({ onCardSelect }) {
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

    // --- 1. Scene & Engine Setup ---
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Deep cosmic violet-black void
    scene.background = new THREE.Color(0x04030a);
    scene.fog = new THREE.FogExp2(0x060512, 0.0003);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 12000.0);
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
    renderer.toneMappingExposure = 1.35;

    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Vibrant Celestial Lighting Pipeline ---
    // Overhead golden celestial spotlight
    const goldSpotlight = new THREE.SpotLight(0xffe699, 2.5);
    goldSpotlight.position.set(0, 200, 150);
    goldSpotlight.angle = Math.PI / 3;
    goldSpotlight.penumbra = 0.8;
    scene.add(goldSpotlight);

    // Cosmic Magenta/Violet directional light (Nebula glow)
    const nebulaLight1 = new THREE.DirectionalLight(0xd946ef, 1.8);
    nebulaLight1.position.set(-150, 100, -300);
    scene.add(nebulaLight1);

    // Ethereal Cyan/Turquoise directional light (Stellar beam)
    const nebulaLight2 = new THREE.DirectionalLight(0x06b6d4, 1.8);
    nebulaLight2.position.set(150, -100, -500);
    scene.add(nebulaLight2);

    // Deep Indigo/Purple ambient fill
    const ambientLight = new THREE.AmbientLight(0x1e1238, 1.4);
    scene.add(ambientLight);

    // --- 3. Circular Star Sprite Generator ---
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 230, 150, 0.85)');
      grad.addColorStop(0.55, 'rgba(138, 43, 226, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    };
    const starSprite = createStarTexture();

    // --- 4. Spiral Galaxy & Vibrant Nebula Particle System ---
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const galaxyParams = {
      count: 7500,
      arms: 4,
      radius: 480,
      spin: 1.4,
      randomness: 0.55,
      power: 3.5,
      insideColor: '#ffd166', // Core warm golden light
      midColor: '#c77dff',    // Mid vivid cosmic violet
      outsideColor: '#00f5d4' // Outer arms ethereal cyan
    };

    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyParams.count * 3);
    const galaxyColors = new Float32Array(galaxyParams.count * 3);

    const colorInside = new THREE.Color(galaxyParams.insideColor);
    const colorMid = new THREE.Color(galaxyParams.midColor);
    const colorOutside = new THREE.Color(galaxyParams.outsideColor);

    for (let i = 0; i < galaxyParams.count; i++) {
      const i3 = i * 3;
      
      // Golden spiral radius
      const r = Math.random() * galaxyParams.radius;
      const spinAngle = r * galaxyParams.spin * 0.015;
      const armAngle = ((i % galaxyParams.arms) * (Math.PI * 2)) / galaxyParams.arms;

      // Organic dispersion
      const randomX = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;
      const randomY = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * (r * 0.6);
      const randomZ = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;

      // Stretch along Z depth for continuous scrolling immersion
      const zOffset = (Math.random() - 0.5) * 5800 - 2400;

      galaxyPositions[i3] = Math.cos(armAngle + spinAngle) * r + randomX;
      galaxyPositions[i3 + 1] = (Math.sin(armAngle + spinAngle) * (r * 0.5)) + randomY;
      galaxyPositions[i3 + 2] = zOffset + randomZ * 0.4;

      // Blend colors based on distance from galactic core
      const mixedColor = colorInside.clone();
      if (r < galaxyParams.radius * 0.4) {
        mixedColor.lerp(colorMid, r / (galaxyParams.radius * 0.4));
      } else {
        mixedColor.copy(colorMid).lerp(colorOutside, (r - galaxyParams.radius * 0.4) / (galaxyParams.radius * 0.6));
      }

      // Add random brightness variation
      mixedColor.multiplyScalar(0.8 + Math.random() * 0.5);

      galaxyColors[i3] = mixedColor.r;
      galaxyColors[i3 + 1] = mixedColor.g;
      galaxyColors[i3 + 2] = mixedColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 4.5,
      map: starSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyStars = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyGroup.add(galaxyStars);

    // --- 5. Interstellar Constellations & Vector Star Lines ---
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // 6 Constellations mapped along the scroll path:
    // 1. The Star (Sirius Core)
    // 2. The Chariot (Auriga / Big Dipper)
    // 3. The Wheel of Fortune (Cosmic Hexagram)
    // 4. Cassiopeia (The Queen of Cups)
    // 5. Orion (The Hunter / Magician)
    // 6. The Phoenix (Ascension)
    const constellationsData = [
      {
        center: [0, 20, 20],
        nodes: [
          [0, 35, 20], [-18, 15, 10], [18, 15, 10], [-10, -10, 15], [10, -10, 15], [0, -25, 20]
        ],
        edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4]]
      },
      {
        center: [-40, -15, -900],
        nodes: [
          [-60, 10, -880], [-45, 25, -900], [-30, 18, -910], [-15, 30, -890],
          [-18, -5, -905], [-35, -20, -920], [-55, -15, -895]
        ],
        edges: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 0]]
      },
      {
        center: [35, 20, -2100],
        nodes: [
          [20, 40, -2080], [50, 40, -2090], [60, 10, -2100],
          [45, -15, -2120], [15, -15, -2110], [5, 15, -2095], [35, 15, -2100]
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6]]
      },
      {
        center: [-30, 25, -3400],
        nodes: [
          [-55, 35, -3380], [-40, 15, -3390], [-25, 40, -3410], [-10, 20, -3420], [5, 38, -3400]
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4]]
      },
      {
        center: [30, -10, -4600],
        nodes: [
          [15, 20, -4580], [45, 25, -4590], [25, 0, -4600], [30, 0, -4605], [35, 0, -4600],
          [18, -25, -4610], [48, -20, -4620]
        ],
        edges: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1], [5, 6]]
      }
    ];

    const constellationLinesPositions = [];
    const constellationStarPositions = [];

    constellationsData.forEach((c) => {
      // Add star points
      c.nodes.forEach((n) => {
        constellationStarPositions.push(n[0], n[1], n[2]);
      });

      // Add connection lines
      c.edges.forEach(([from, to]) => {
        const p1 = c.nodes[from];
        const p2 = c.nodes[to];
        if (p1 && p2) {
          constellationLinesPositions.push(p1[0], p1[1], p1[2]);
          constellationLinesPositions.push(p2[0], p2[1], p2[2]);
        }
      });
    });

    // Glowing Constellation Lines
    const constLinesGeo = new THREE.BufferGeometry();
    constLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(constellationLinesPositions, 3));
    const constLinesMat = new THREE.LineBasicMaterial({
      color: 0x66fcf1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const constellationLinesMesh = new THREE.LineSegments(constLinesGeo, constLinesMat);
    constellationGroup.add(constellationLinesMesh);

    // Glowing Anchor Constellation Stars
    const constStarsGeo = new THREE.BufferGeometry();
    constStarsGeo.setAttribute('position', new THREE.Float32BufferAttribute(constellationStarPositions, 3));
    const constStarsMat = new THREE.PointsMaterial({
      size: 7.5,
      map: starSprite,
      color: 0xffd166,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const constellationStarsMesh = new THREE.Points(constStarsGeo, constStarsMat);
    constellationGroup.add(constellationStarsMesh);

    // --- 6. Shooting Stars / Cosmic Comets ---
    const comets = [];
    const cometCount = 4;
    for (let i = 0; i < cometCount; i++) {
      const cometGeo = new THREE.BufferGeometry();
      const length = 40 + Math.random() * 30;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-length, -length * 0.5, -length * 0.8)
      ];
      cometGeo.setFromPoints(points);

      const cometMat = new THREE.LineBasicMaterial({
        color: Math.random() > 0.5 ? 0x00f5d4 : 0xffd166,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const cometMesh = new THREE.Line(cometGeo, cometMat);
      
      const resetComet = (mesh) => {
        mesh.position.set(
          (Math.random() - 0.5) * 300 + 100,
          (Math.random() - 0.5) * 200 + 100,
          -Math.random() * 4500
        );
        mesh.userData = {
          speedX: -2.5 - Math.random() * 3.5,
          speedY: -1.2 - Math.random() * 2.0,
          speedZ: -2.0 - Math.random() * 3.0,
          alive: true
        };
      };

      resetComet(cometMesh);
      scene.add(cometMesh);
      comets.push({ mesh: cometMesh, reset: resetComet });
    }

    // --- 7. Floating Celestial Tarot Arcana Cards (78 Cards) ---
    const cardGeometry = new THREE.BoxGeometry(4.8, 8.0, 0.14);
    const cards = [];

    // Helper: generate celestial gold tarot card texture
    const createCelestialCardTexture = (index, name, symbol, arcana) => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      // Deep Midnight Obsidian Canvas
      ctx.fillStyle = '#06070f';
      ctx.fillRect(0, 0, 300, 500);

      // Gold Foil Radiant Frame
      const gradBorder = ctx.createLinearGradient(0, 0, 300, 500);
      gradBorder.addColorStop(0, '#f9ecc8');
      gradBorder.addColorStop(0.3, '#d4af37');
      gradBorder.addColorStop(0.7, '#8a2be2');
      gradBorder.addColorStop(1, '#66fcf1');

      ctx.strokeStyle = gradBorder;
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, 276, 476);

      // Inner Intricate Borders
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, 260, 460);

      // Corner flourishes
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(16, 16, 8, 8);
      ctx.fillRect(276, 16, 8, 8);
      ctx.fillRect(16, 476, 8, 8);
      ctx.fillRect(276, 476, 8, 8);

      // Top Header Arcana & Number
      ctx.fillStyle = '#f9ecc8';
      ctx.font = 'bold 16px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`TAROT X · ${arcana}`, 150, 50);

      ctx.fillStyle = '#66fcf1';
      ctx.font = 'bold 12px "Space Mono", monospace';
      ctx.fillText(`NO. ${String(index).padStart(2, '0')}`, 150, 72);

      // Center Sacred Geometric Mandala / Ring
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(150, 250, 68, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(102, 252, 241, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(150, 250, 85, 0, Math.PI * 2);
      ctx.stroke();

      // Sunburst / Star Ray Lines
      for (let a = 0; a < 8; a++) {
        const rad = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(150 + Math.cos(rad) * 68, 250 + Math.sin(rad) * 68);
        ctx.lineTo(150 + Math.cos(rad) * 85, 250 + Math.sin(rad) * 85);
        ctx.stroke();
      }

      // Center Mystic Symbol
      ctx.fillStyle = '#ffd166';
      ctx.font = '38px "Cinzel", serif';
      ctx.fillText(symbol || '✦', 150, 264);

      // Bottom Card Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Cinzel", serif';
      ctx.fillText(name.toUpperCase(), 150, 435);

      ctx.fillStyle = '#d4af37';
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillText('INTUITIVE ORACLE', 150, 458);

      return new THREE.CanvasTexture(canvas);
    };

    const majorArcanaArchetypes = [
      { name: 'The Star', sym: '★', arc: 'MAJOR XVII' },
      { name: 'The Sun', sym: '☉', arc: 'MAJOR XIX' },
      { name: 'The Moon', sym: '☽', arc: 'MAJOR XVIII' },
      { name: 'The Magician', sym: '∞', arc: 'MAJOR I' },
      { name: 'High Priestess', sym: 'Ψ', arc: 'MAJOR II' },
      { name: 'Wheel of Fortune', sym: '☸', arc: 'MAJOR X' },
      { name: 'The Chariot', sym: '▲', arc: 'MAJOR VII' },
      { name: 'The Empress', sym: '♀', arc: 'MAJOR III' },
      { name: 'The Hermit', sym: '🏮', arc: 'MAJOR IX' },
      { name: 'The World', sym: '🪐', arc: 'MAJOR XXI' },
      { name: 'Ace of Cups', sym: '🜄', arc: 'MINOR CUPS' },
      { name: 'Ace of Swords', sym: '🜁', arc: 'MINOR SWORDS' },
    ];

    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    // Instantiate 78 physical zero-g cards distributed along the 5800px depth
    for (let i = 0; i < 78; i++) {
      const arch = majorArcanaArchetypes[i % majorArcanaArchetypes.length];
      const texture = createCelestialCardTexture(i + 1, arch.name, arch.sym, arch.arc);

      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.9,
        roughness: 0.2,
        emissive: new THREE.Color(0x1a0f30),
        emissiveIntensity: 0.35,
      });

      const mesh = new THREE.Mesh(cardGeometry, mat);

      // Distributed in spiral zero-gravity cosmic arms
      const spreadZ = (i / 78) * -5600 + 40;
      const spreadRadius = 32 + Math.random() * 50;
      const angle = (i * 137.5 * Math.PI) / 180;

      const basePos = new THREE.Vector3(
        Math.cos(angle) * spreadRadius,
        Math.sin(angle) * (spreadRadius * 0.6) + (Math.random() - 0.5) * 20,
        spreadZ
      );

      mesh.position.copy(basePos);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      cards.push({
        mesh,
        basePos,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.06
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.004
        ),
        index: i + 1,
        name: arch.name
      });

      cardsGroup.add(mesh);
    }
    cardsRef.current = cards;

    // --- 8. Event Handlers ---
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // --- 9. Main Animation Loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Rotate galaxy slowly
      galaxyGroup.rotation.z = elapsed * 0.02;
      constellationGroup.rotation.z = elapsed * 0.008;

      // Twinkle constellation star sizes
      const constellationScale = 1.0 + Math.sin(elapsed * 4) * 0.15;
      constStarsMat.size = 7.5 * constellationScale;

      // Pulse spotlight subtly like a distant pulsar
      goldSpotlight.intensity = 2.2 + Math.sin(elapsed * 2.5) * 0.4;

      // Camera Z-Depth interpolation tracking continuous page scroll
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollRatio = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
      const targetZ = 90 - scrollRatio * 5200;

      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.x += (mouseRef.current.x * 16 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 14 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, camera.position.z - 160);

      // Animate Shooting Stars / Comets
      comets.forEach(({ mesh, reset }) => {
        mesh.position.x += mesh.userData.speedX;
        mesh.position.y += mesh.userData.speedY;
        mesh.position.z += mesh.userData.speedZ;

        // If comet exits visible screen boundary, respawn it
        if (mesh.position.x < -300 || mesh.position.y < -200) {
          reset(mesh);
        }
      });

      // Zero-G Card Physics & Mouse Repulsion
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
          matched.mesh.material.emissive.setHex(0xd4af37);
          matched.mesh.material.emissiveIntensity = 0.8;
        }
      } else {
        if (hoveredCardRef.current) {
          hoveredCardRef.current.mesh.material.emissive.setHex(0x1a0f30);
          hoveredCardRef.current.mesh.material.emissiveIntensity = 0.35;
          hoveredCardRef.current = null;
        }
      }

      // Physics loop for cards
      cards.forEach((card) => {
        card.mesh.rotation.x += card.rotSpeed.x;
        card.mesh.rotation.y += card.rotSpeed.y;
        card.mesh.rotation.z += card.rotSpeed.z;

        card.mesh.position.add(card.velocity);

        // Tether back to base position in zero-g
        const distFromBase = card.mesh.position.distanceTo(card.basePos);
        if (distFromBase > 20) {
          const pullBack = new THREE.Vector3().subVectors(card.basePos, card.mesh.position).normalize().multiplyScalar(0.05);
          card.velocity.add(pullBack);
        }

        // Resistance damping
        card.velocity.multiplyScalar(0.985);

        // Repulsive gravity vector from cursor
        const dZ = Math.abs(card.mesh.position.z - camera.position.z);
        if (dZ < 220) {
          const screenPos = card.mesh.position.clone().project(camera);
          const distToMouse = Math.hypot(screenPos.x - mouseRef.current.x, screenPos.y - mouseRef.current.y);
          if (distToMouse < 0.28) {
            const pushDir = new THREE.Vector3(
              (screenPos.x - mouseRef.current.x) * 0.45,
              (screenPos.y - mouseRef.current.y) * 0.45,
              0.12
            );
            card.velocity.add(pushDir);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. Cleanup ---
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
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
    />
  );
}
