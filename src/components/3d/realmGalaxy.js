import * as THREE from 'three';
import { createStarTexture } from './textureGenerators';

export function createRealmGalaxy(scene, starSprite) {
  const group = new THREE.Group();
  scene.add(group);

  const sprite = starSprite || createStarTexture();

  // --- 1. Spiral Galaxy Particle Cloud ---
  const galaxyParams = {
    count: 7000,
    arms: 4,
    radius: 520,
    spin: 1.5,
    randomness: 0.55,
    power: 3.2,
    insideColor: '#ffe082', // Radiant golden core
    midColor: '#d946ef',    // Deep cosmic magenta
    outsideColor: '#06b6d4' // Ethereal outer cyan
  };

  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPositions = new Float32Array(galaxyParams.count * 3);
  const galaxyColors = new Float32Array(galaxyParams.count * 3);

  const colorInside = new THREE.Color(galaxyParams.insideColor);
  const colorMid = new THREE.Color(galaxyParams.midColor);
  const colorOutside = new THREE.Color(galaxyParams.outsideColor);

  for (let i = 0; i < galaxyParams.count; i++) {
    const i3 = i * 3;
    const r = Math.random() * galaxyParams.radius;
    const spinAngle = r * galaxyParams.spin * 0.015;
    const armAngle = ((i % galaxyParams.arms) * (Math.PI * 2)) / galaxyParams.arms;

    const randomX = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;
    const randomY = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * (r * 0.6);
    const randomZ = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;

    // Distributed around the initial cosmos zone
    const zPos = (Math.random() - 0.5) * 1600 - 300;

    galaxyPositions[i3] = Math.cos(armAngle + spinAngle) * r + randomX;
    galaxyPositions[i3 + 1] = (Math.sin(armAngle + spinAngle) * (r * 0.5)) + randomY;
    galaxyPositions[i3 + 2] = zPos + randomZ * 0.4;

    const mixedColor = colorInside.clone();
    if (r < galaxyParams.radius * 0.4) {
      mixedColor.lerp(colorMid, r / (galaxyParams.radius * 0.4));
    } else {
      mixedColor.copy(colorMid).lerp(colorOutside, (r - galaxyParams.radius * 0.4) / (galaxyParams.radius * 0.6));
    }
    mixedColor.multiplyScalar(0.8 + Math.random() * 0.5);

    galaxyColors[i3] = mixedColor.r;
    galaxyColors[i3 + 1] = mixedColor.g;
    galaxyColors[i3 + 2] = mixedColor.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 3.4,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
  group.add(galaxyPoints);

  // --- 2. Deep Field Starfield ---
  const starfieldGeo = new THREE.BufferGeometry();
  const starCount = 2500;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 3500;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 3000;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 7000 - 1500;

    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.7, 0.7 + Math.random() * 0.3);
    starColors[i3] = c.r;
    starColors[i3 + 1] = c.g;
    starColors[i3 + 2] = c.b;
  }

  starfieldGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starfieldGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starfieldMat = new THREE.PointsMaterial({
    size: 2.2,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starfieldPoints = new THREE.Points(starfieldGeo, starfieldMat);
  group.add(starfieldPoints);

  // --- 3. Constellations Network ---
  const constellationsData = [
    {
      nodes: [[0, 35, 10], [-18, 15, 0], [18, 15, 0], [-10, -10, 5], [10, -10, 5], [0, -25, 10]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4]]
    },
    {
      nodes: [[-60, 20, -450], [-45, 35, -460], [-30, 28, -470], [-15, 40, -450], [-18, 5, -465], [-35, -10, -480], [-55, -5, -455]],
      edges: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [6, 0]]
    },
    {
      nodes: [[20, 30, -850], [50, 30, -860], [60, 0, -870], [45, -25, -890], [15, -25, -880], [5, 5, -865], [35, 5, -870]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6]]
    }
  ];

  const constLinesPositions = [];
  const constStarsPositions = [];

  constellationsData.forEach((c) => {
    c.nodes.forEach((n) => constStarsPositions.push(n[0], n[1], n[2]));
    c.edges.forEach(([from, to]) => {
      const p1 = c.nodes[from];
      const p2 = c.nodes[to];
      if (p1 && p2) {
        constLinesPositions.push(p1[0], p1[1], p1[2]);
        constLinesPositions.push(p2[0], p2[1], p2[2]);
      }
    });
  });

  const constLinesGeo = new THREE.BufferGeometry();
  constLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(constLinesPositions, 3));
  const constLinesMat = new THREE.LineBasicMaterial({
    color: 0x66fcf1,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const constLinesMesh = new THREE.LineSegments(constLinesGeo, constLinesMat);
  group.add(constLinesMesh);

  const constStarsGeo = new THREE.BufferGeometry();
  constStarsGeo.setAttribute('position', new THREE.Float32BufferAttribute(constStarsPositions, 3));
  const constStarsMat = new THREE.PointsMaterial({
    size: 4.8,
    map: sprite,
    color: 0xffd166,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const constStarsMesh = new THREE.Points(constStarsGeo, constStarsMat);
  group.add(constStarsMesh);

  // --- 4. Comets / Shooting Stars ---
  const comets = [];
  for (let i = 0; i < 3; i++) {
    const length = 45;
    const cometGeo = new THREE.BufferGeometry();
    cometGeo.setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-length, -length * 0.4, -length * 0.7)
    ]);
    const cometMat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? 0x06b6d4 : 0xffd166,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const cometMesh = new THREE.Line(cometGeo, cometMat);
    const reset = (m) => {
      m.position.set(
        (Math.random() - 0.5) * 350 + 80,
        (Math.random() - 0.5) * 250 + 60,
        -Math.random() * 1200 + 40
      );
      m.userData = {
        vx: -3.0 - Math.random() * 3.5,
        vy: -1.5 - Math.random() * 2.0,
        vz: -2.0 - Math.random() * 2.5
      };
    };
    reset(cometMesh);
    group.add(cometMesh);
    comets.push({ mesh: cometMesh, reset });
  }

  // --- 5. Floating Tarot Arcana Cards ---
  const cardGeometry = new THREE.BoxGeometry(4.8, 8.0, 0.14);
  const cards = [];

  const createCardTex = (name, sym, arc) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#060712';
    ctx.fillRect(0, 0, 256, 420);

    // Gold radiant border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, 236, 400);

    ctx.strokeStyle = 'rgba(102, 252, 241, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, 224, 388);

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 13px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`TAROT X · ${arc}`, 128, 45);

    // Mandala circle
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.beginPath();
    ctx.arc(128, 205, 55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.font = '36px serif';
    ctx.fillText(sym, 128, 218);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px serif';
    ctx.fillText(name.toUpperCase(), 128, 365);

    return new THREE.CanvasTexture(canvas);
  };

  const archetypes = [
    { name: 'The Star', sym: '★', arc: 'MAJOR XVII' },
    { name: 'The Sun', sym: '☉', arc: 'MAJOR XIX' },
    { name: 'The Moon', sym: '☽', arc: 'MAJOR XVIII' },
    { name: 'The Magician', sym: '∞', arc: 'MAJOR I' },
    { name: 'High Priestess', sym: 'Ψ', arc: 'MAJOR II' },
    { name: 'Wheel of Fortune', sym: '☸', arc: 'MAJOR X' },
    { name: 'The Chariot', sym: '▲', arc: 'MAJOR VII' },
    { name: 'The Empress', sym: '♀', arc: 'MAJOR III' },
  ];

  for (let i = 0; i < 24; i++) {
    const arch = archetypes[i % archetypes.length];
    const tex = createCardTex(arch.name, arch.sym, arch.arc);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.85,
      roughness: 0.25,
      emissive: new THREE.Color(0x0e0618),
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(cardGeometry, mat);

    const angle = (i * 137.5 * Math.PI) / 180;
    const radius = 30 + Math.random() * 45;
    const z = (i / 24) * -1200 + 40;

    const basePos = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * (radius * 0.6),
      z
    );
    mesh.position.copy(basePos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    cards.push({
      mesh,
      basePos,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.004
      )
    });
    group.add(mesh);
  }

  // --- 6. Update Loop ---
  return {
    group,
    cards,
    update: (elapsed, delta, scrollProgress) => {
      // Rotate galaxy slowly
      galaxyPoints.rotation.z = elapsed * 0.025;
      constLinesMesh.rotation.z = elapsed * 0.01;
      constStarsMesh.rotation.z = elapsed * 0.01;

      // Twinkle constellation stars
      const scale = 1.0 + Math.sin(elapsed * 2.5) * 0.15;
      constStarsMat.size = 4.8 * scale;

      // Update comets
      comets.forEach(({ mesh, reset }) => {
        mesh.position.x += mesh.userData.vx;
        mesh.position.y += mesh.userData.vy;
        mesh.position.z += mesh.userData.vz;
        if (mesh.position.x < -350 || mesh.position.y < -250 || mesh.position.z < -1600) {
          reset(mesh);
        }
      });

      // Animate floating cards
      cards.forEach((card) => {
        card.mesh.rotation.x += card.rotSpeed.x;
        card.mesh.rotation.y += card.rotSpeed.y;
        card.mesh.rotation.z += card.rotSpeed.z;
        card.mesh.position.add(card.velocity);

        const dist = card.mesh.position.distanceTo(card.basePos);
        if (dist > 15) {
          const pull = new THREE.Vector3().subVectors(card.basePos, card.mesh.position).normalize().multiplyScalar(0.04);
          card.velocity.add(pull);
        }
        card.velocity.multiplyScalar(0.98);
      });

      // Opacity / Visibility management based on scroll progress:
      // High at cosmos (0.00 -> 0.22), gently dims as approaching planet (0.22 -> 0.40),
      // re-emerges during Act 5 Bloom (0.86 -> 1.00)
      let galaxyOpacity = 0.75;
      if (scrollProgress < 0.22) {
        galaxyOpacity = 0.75;
      } else if (scrollProgress < 0.40) {
        galaxyOpacity = THREE.MathUtils.lerp(0.75, 0.15, (scrollProgress - 0.22) / 0.18);
      } else if (scrollProgress < 0.82) {
        galaxyOpacity = 0.15;
      } else {
        // Blooming back into galaxy
        galaxyOpacity = THREE.MathUtils.lerp(0.15, 0.85, (scrollProgress - 0.82) / 0.18);
      }
      galaxyMat.opacity = galaxyOpacity;
      starfieldMat.opacity = Math.min(galaxyOpacity + 0.1, 0.7);
    }
  };
}
