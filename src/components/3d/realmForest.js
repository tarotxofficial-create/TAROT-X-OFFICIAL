import * as THREE from 'three';
import { createRuneTexture, createStarTexture } from './textureGenerators';

export function createRealmForest(scene, starSprite) {
  const group = new THREE.Group();
  scene.add(group);

  const sprite = starSprite || createStarTexture();

  // --- 1. Forest Floor Terrain Mesh with Undulations ---
  const terrainGeo = new THREE.PlaneGeometry(350, 1400, 32, 64);
  const posAttr = terrainGeo.attributes.position;
  // Create organic rolling hills along the forest floor
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    // Displace z (which becomes vertical Y when rotated)
    const zOffset = Math.sin(x * 0.05) * Math.cos(y * 0.02) * 8 + (Math.random() - 0.5) * 1.5;
    posAttr.setZ(i, zOffset);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x05130b,
    roughness: 0.9,
    metalness: 0.1,
    emissive: new THREE.Color(0x020805),
    emissiveIntensity: 0.2
  });

  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.set(0, -32, -2800);
  group.add(terrain);

  // --- 2. Glowing Ancient Runic Stone Circles ---
  const runeGroup = new THREE.Group();
  group.add(runeGroup);

  const runeSymbols = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ'];
  const runePlates = [];

  for (let r = 0; r < 8; r++) {
    const runeTex = createRuneTexture(runeSymbols[r % runeSymbols.length]);
    const runeGeo = new THREE.CircleGeometry(9, 32);
    const runeMat = new THREE.MeshBasicMaterial({
      map: runeTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const runeMesh = new THREE.Mesh(runeGeo, runeMat);
    runeMesh.rotation.x = -Math.PI / 2;

    // Placed periodically along the center forest path
    const zPos = -2250 - r * 140;
    const xPos = Math.sin(r * 1.2) * 18;
    runeMesh.position.set(xPos, -31.5, zPos);

    runeGroup.add(runeMesh);
    runePlates.push(runeMesh);
  }

  // --- 3. Procedural Gnarled Ancient Silhouette Trees ---
  const treeGroup = new THREE.Group();
  group.add(treeGroup);

  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x070b09,
    roughness: 0.95,
    metalness: 0.05
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x081f12,
    roughness: 0.8,
    metalness: 0.1,
    emissive: new THREE.Color(0x062816),
    emissiveIntensity: 0.25,
    transparent: true,
    opacity: 0.92
  });

  // Helper to build a single gnarled gothic tree
  const createAncientTree = (x, z, scale = 1.0, leanAngle = 0) => {
    const tree = new THREE.Group();
    tree.position.set(x, -32, z);
    tree.scale.setScalar(scale);
    tree.rotation.z = leanAngle;

    // Main gnarled trunk
    const trunkGeo = new THREE.CylinderGeometry(2.2, 4.5, 55, 10);
    const trunk = new THREE.Mesh(trunkGeo, barkMat);
    trunk.position.y = 27.5;
    tree.add(trunk);

    // Primary twisted arching branches
    const branchConfigs = [
      { y: 35, len: 26, r: 1.4, rx: 0.4, rz: -0.65 },
      { y: 42, len: 24, r: 1.2, rx: -0.5, rz: 0.7 },
      { y: 48, len: 20, r: 1.0, rx: 0.3, rz: 0.4 },
      { y: 52, len: 18, r: 0.9, rx: -0.3, rz: -0.5 },
    ];

    branchConfigs.forEach((b) => {
      const branchGeo = new THREE.CylinderGeometry(b.r * 0.4, b.r, b.len, 8);
      const branch = new THREE.Mesh(branchGeo, barkMat);
      branch.position.set(0, b.y, 0);
      branch.rotation.set(b.rx, 0, b.rz);
      branch.translateY(b.len / 2);
      tree.add(branch);

      // Dark foliage puff / moss cluster at branch tip
      const foliageGeo = new THREE.DodecahedronGeometry(8.5, 1);
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.copy(branch.position);
      foliage.translateY(b.len * 0.85);
      tree.add(foliage);
    });

    return tree;
  };

  // Populate trees flanking the trail
  const treePositions = [
    // Left flank
    { x: -45, z: -2250, s: 1.1, lean: 0.08 },
    { x: -35, z: -2420, s: 1.25, lean: 0.12 },
    { x: -55, z: -2580, s: 1.4, lean: 0.05 },
    { x: -38, z: -2740, s: 1.2, lean: 0.15 },
    { x: -48, z: -2900, s: 1.35, lean: 0.1 },
    { x: -32, z: -3080, s: 1.15, lean: 0.07 },
    { x: -50, z: -3260, s: 1.3, lean: 0.12 },
    // Right flank
    { x: 42, z: -2280, s: 1.15, lean: -0.09 },
    { x: 36, z: -2460, s: 1.3, lean: -0.14 },
    { x: 52, z: -2620, s: 1.2, lean: -0.06 },
    { x: 35, z: -2790, s: 1.4, lean: -0.12 },
    { x: 50, z: -2950, s: 1.25, lean: -0.08 },
    { x: 38, z: -3120, s: 1.35, lean: -0.15 },
    { x: 46, z: -3300, s: 1.2, lean: -0.1 }
  ];

  treePositions.forEach((tp) => {
    const t = createAncientTree(tp.x, tp.z, tp.s, tp.lean);
    treeGroup.add(t);
  });

  // --- 4. Ancient Standing Stones / Menhirs ---
  const stoneGroup = new THREE.Group();
  group.add(stoneGroup);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x111c16,
    roughness: 0.85,
    metalness: 0.15
  });

  const stonePositions = [
    { x: -22, z: -2350, r: 0.3 },
    { x: 20, z: -2520, r: -0.4 },
    { x: -25, z: -2840, r: 0.5 },
    { x: 24, z: -3020, r: -0.25 },
  ];

  stonePositions.forEach((sp) => {
    const menhirGeo = new THREE.CylinderGeometry(2.2, 3.5, 22, 6);
    const menhir = new THREE.Mesh(menhirGeo, stoneMat);
    menhir.position.set(sp.x, -21, sp.z);
    menhir.rotation.y = sp.r;
    menhir.rotation.z = (Math.random() - 0.5) * 0.15;
    stoneGroup.add(menhir);
  });

  // --- 5. Bioluminescent Will-o'-the-Wisps & Fireflies ---
  const wispCount = 450;
  const wispGeo = new THREE.BufferGeometry();
  const wispPositions = new Float32Array(wispCount * 3);
  const wispColors = new Float32Array(wispCount * 3);
  const wispInitial = [];

  for (let i = 0; i < wispCount; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 160;
    const y = -26 + Math.random() * 45;
    const z = -2200 - Math.random() * 1200;

    wispPositions[i3] = x;
    wispPositions[i3 + 1] = y;
    wispPositions[i3 + 2] = z;

    wispInitial.push({
      baseX: x,
      baseY: y,
      baseZ: z,
      freqX: 1.0 + Math.random() * 2.0,
      freqY: 1.2 + Math.random() * 2.5,
      amp: 3.0 + Math.random() * 6.0,
      phase: Math.random() * Math.PI * 2
    });

    // Palette: Emerald (#10b981), Cyan (#06b6d4), Warm Amber fairy light (#fbbf24)
    const choice = Math.random();
    if (choice < 0.55) {
      // Emerald
      wispColors[i3] = 0.06;
      wispColors[i3 + 1] = 0.85;
      wispColors[i3 + 2] = 0.5;
    } else if (choice < 0.85) {
      // Cyan
      wispColors[i3] = 0.02;
      wispColors[i3 + 1] = 0.75;
      wispColors[i3 + 2] = 0.9;
    } else {
      // Warm Amber
      wispColors[i3] = 0.98;
      wispColors[i3 + 1] = 0.75;
      wispColors[i3 + 2] = 0.15;
    }
  }

  wispGeo.setAttribute('position', new THREE.BufferAttribute(wispPositions, 3));
  wispGeo.setAttribute('color', new THREE.BufferAttribute(wispColors, 3));

  const wispMat = new THREE.PointsMaterial({
    size: 5.5,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const willOWisps = new THREE.Points(wispGeo, wispMat);
  group.add(willOWisps);

  // --- 6. Volumetric Moonlight God Ray Cones ---
  const rayGroup = new THREE.Group();
  group.add(rayGroup);

  const rayCount = 4;
  for (let i = 0; i < rayCount; i++) {
    const rayGeo = new THREE.ConeGeometry(35, 120, 16, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.position.set(
      (i % 2 === 0 ? -1 : 1) * (30 + i * 8),
      35,
      -2400 - i * 260
    );
    rayMesh.rotation.x = Math.PI / 6;
    rayMesh.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.25;
    rayGroup.add(rayMesh);
  }

  // --- 7. Update Loop ---
  return {
    group,
    update: (elapsed, delta, scrollProgress) => {
      // Animate Will-o'-the-wisps with organic bobbing motion
      const pAttr = wispGeo.attributes.position;
      for (let i = 0; i < wispCount; i++) {
        const init = wispInitial[i];
        const newX = init.baseX + Math.sin(elapsed * init.freqX + init.phase) * init.amp;
        const newY = init.baseY + Math.cos(elapsed * init.freqY + init.phase) * (init.amp * 0.7);
        pAttr.setXYZ(i, newX, newY, init.baseZ);
      }
      pAttr.needsUpdate = true;

      // Pulse ground rune plates
      runePlates.forEach((mesh, idx) => {
        const pulse = 0.6 + Math.sin(elapsed * 2.2 + idx * 0.8) * 0.35;
        mesh.material.opacity = pulse;
      });

      // Visibility Curve:
      // Begins fading in at 0.38 as camera breaks through planetary clouds.
      // Full immersion during 0.44 - 0.66.
      // Forest parts and opens into clearing for the castle at 0.66 - 0.72.
      let forestOpacity = 0.0;
      if (scrollProgress < 0.36) {
        forestOpacity = 0.0;
        group.visible = false;
      } else if (scrollProgress < 0.44) {
        forestOpacity = (scrollProgress - 0.36) / 0.08;
        group.visible = true;
      } else if (scrollProgress < 0.66) {
        forestOpacity = 1.0;
        group.visible = true;
      } else if (scrollProgress < 0.74) {
        forestOpacity = 1.0 - (scrollProgress - 0.66) / 0.08;
        group.visible = true;
      } else {
        forestOpacity = 0.0;
        group.visible = false;
      }

      terrainMat.opacity = forestOpacity;
      foliageMat.opacity = forestOpacity * 0.92;
      wispMat.opacity = forestOpacity * 0.85;
    }
  };
}
