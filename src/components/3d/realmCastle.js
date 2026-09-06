import * as THREE from 'three';
import { createCastleWindowTexture, createArcaneCircleTexture, createStarTexture } from './textureGenerators';

export function createRealmCastle(scene, starSprite) {
  const group = new THREE.Group();
  scene.add(group);

  const sprite = starSprite || createStarTexture();

  // Castle Center Position
  const castleBaseZ = -4300;
  group.position.set(0, -10, castleBaseZ);

  // Materials
  const darkStoneMat = new THREE.MeshStandardMaterial({
    color: 0x090611,
    roughness: 0.85,
    metalness: 0.25,
    emissive: new THREE.Color(0x0a0416),
    emissiveIntensity: 0.2
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x160829,
    roughness: 0.6,
    metalness: 0.4,
    emissive: new THREE.Color(0x280e45),
    emissiveIntensity: 0.35
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.9,
    emissive: new THREE.Color(0x6b5311),
    emissiveIntensity: 0.4
  });

  const windowTexture = createCastleWindowTexture();
  const windowMat = new THREE.MeshBasicMaterial({
    map: windowTexture,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  // --- 1. Castle Crag / Mountain Pedestal ---
  const cragGeo = new THREE.ConeGeometry(90, 80, 8);
  const crag = new THREE.Mesh(cragGeo, darkStoneMat);
  crag.position.y = -40;
  group.add(crag);

  // --- 2. Central Grand Sanctum Spire ---
  const centralSpireGroup = new THREE.Group();
  group.add(centralSpireGroup);

  // Main tower shaft (hexagonal/octagonal)
  const mainShaftGeo = new THREE.CylinderGeometry(14, 18, 110, 8);
  const mainShaft = new THREE.Mesh(mainShaftGeo, darkStoneMat);
  mainShaft.position.y = 55;
  centralSpireGroup.add(mainShaft);

  // Stepped upper gallery
  const upperGalleryGeo = new THREE.CylinderGeometry(16, 13, 24, 8);
  const upperGallery = new THREE.Mesh(upperGalleryGeo, darkStoneMat);
  upperGallery.position.y = 118;
  centralSpireGroup.add(upperGallery);

  // Steep gothic conical roof
  const mainRoofGeo = new THREE.ConeGeometry(17, 75, 8);
  const mainRoof = new THREE.Mesh(mainRoofGeo, roofMat);
  mainRoof.position.y = 165;
  centralSpireGroup.add(mainRoof);

  // Apex Celestial Finial / Beacon Orb
  const apexGeo = new THREE.SphereGeometry(3.5, 16, 16);
  const apexMat = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const apexOrb = new THREE.Mesh(apexGeo, apexMat);
  apexOrb.position.y = 204;
  centralSpireGroup.add(apexOrb);

  // Flying Buttresses supporting central spire
  for (let b = 0; b < 4; b++) {
    const angle = (b / 4) * Math.PI * 2;
    const buttressGeo = new THREE.BoxGeometry(2.5, 55, 18);
    const buttress = new THREE.Mesh(buttressGeo, darkStoneMat);
    buttress.position.set(Math.cos(angle) * 22, 50, Math.sin(angle) * 22);
    buttress.rotation.y = angle;
    buttress.rotation.x = 0.22;
    centralSpireGroup.add(buttress);
  }

  // --- 3. Flanking Watchtowers & Turrets ---
  const turretConfigs = [
    { x: -38, z: -15, h: 85, r: 8, roofH: 45 },
    { x: 38, z: -15, h: 92, r: 8.5, roofH: 50 },
    { x: -28, z: 32, h: 70, r: 7.5, roofH: 40 },
    { x: 28, z: 32, h: 75, r: 7.5, roofH: 42 },
    { x: 0, z: 42, h: 60, r: 9, roofH: 35 } // Gatehouse tower
  ];

  turretConfigs.forEach((cfg) => {
    const turretGroup = new THREE.Group();
    turretGroup.position.set(cfg.x, 0, cfg.z);

    const shaftGeo = new THREE.CylinderGeometry(cfg.r * 0.9, cfg.r, cfg.h, 8);
    const shaft = new THREE.Mesh(shaftGeo, darkStoneMat);
    shaft.position.y = cfg.h / 2;
    turretGroup.add(shaft);

    const roofGeo = new THREE.ConeGeometry(cfg.r * 1.15, cfg.roofH, 8);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = cfg.h + cfg.roofH / 2;
    turretGroup.add(roof);

    // Connecting rampart curtain wall to central spire
    const wallGeo = new THREE.BoxGeometry(4, 40, 30);
    const wall = new THREE.Mesh(wallGeo, darkStoneMat);
    wall.position.set(-cfg.x * 0.45, 20, -cfg.z * 0.45);
    wall.lookAt(0, 20, 0);
    turretGroup.add(wall);

    group.add(turretGroup);
  });

  // --- 4. Glowing Stained-Glass Windows on Towers ---
  const windowPlates = [];
  const windowPositions = [
    // Central spire windows
    { x: 0, y: 55, z: 14.5, ry: 0, w: 7, h: 14 },
    { x: -10, y: 80, z: 10, ry: -Math.PI / 4, w: 6, h: 12 },
    { x: 10, y: 80, z: 10, ry: Math.PI / 4, w: 6, h: 12 },
    { x: 0, y: 118, z: 16.5, ry: 0, w: 7, h: 14 },
    // Flanking tower windows
    { x: -38, y: 55, z: -6.5, ry: 0, w: 5, h: 10 },
    { x: 38, y: 60, z: -6.5, ry: 0, w: 5, h: 10 },
    { x: -28, y: 45, z: 39.5, ry: 0, w: 5, h: 10 },
    { x: 28, y: 48, z: 39.5, ry: 0, w: 5, h: 10 },
    { x: 0, y: 35, z: 51.5, ry: 0, w: 6, h: 12 }, // Gatehouse portal
  ];

  windowPositions.forEach((wp) => {
    const winGeo = new THREE.PlaneGeometry(wp.w, wp.h);
    const winMesh = new THREE.Mesh(winGeo, windowMat);
    winMesh.position.set(wp.x, wp.y, wp.z);
    winMesh.rotation.y = wp.ry;
    group.add(winMesh);
    windowPlates.push(winMesh);
  });

  // --- 5. Massive Concentric Arcane Magic Circle / Sigil ---
  const arcaneCircleTexture = createArcaneCircleTexture();
  const magicCircleGeo = new THREE.PlaneGeometry(160, 160);
  const magicCircleMat = new THREE.MeshBasicMaterial({
    map: arcaneCircleTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const magicCircle = new THREE.Mesh(magicCircleGeo, magicCircleMat);
  // Positioned hovering majestically behind and above the central castle spire
  magicCircle.position.set(0, 150, -45);
  group.add(magicCircle);

  // Secondary counter-rotating inner runic ring
  const innerRingGeo = new THREE.RingGeometry(35, 38, 48);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x66fcf1,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.position.set(0, 150, -42);
  group.add(innerRing);

  // --- 6. Floating Arcane Crystal Obelisks ---
  const crystalGroup = new THREE.Group();
  group.add(crystalGroup);

  const crystalGeo = new THREE.OctahedronGeometry(5.5, 0);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: new THREE.Color(0xa855f7),
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.15,
    transparent: true,
    opacity: 0.9
  });

  const crystals = [];
  const crystalCount = 4;
  for (let c = 0; c < crystalCount; c++) {
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    const orbitRadius = 38;
    const angle = (c / crystalCount) * Math.PI * 2;
    crystal.position.set(
      Math.cos(angle) * orbitRadius,
      155,
      Math.sin(angle) * orbitRadius
    );
    crystalGroup.add(crystal);
    crystals.push({ mesh: crystal, baseAngle: angle, orbitRadius });
  }

  // --- 7. Swirling Arcane Energy Vortex (Double Helix) ---
  const vortexCount = 500;
  const vortexGeo = new THREE.BufferGeometry();
  const vortexPositions = new Float32Array(vortexCount * 3);
  const vortexColors = new Float32Array(vortexCount * 3);

  for (let v = 0; v < vortexCount; v++) {
    const v3 = v * 3;
    const t = v / vortexCount;
    const h = t * 210;
    const r = (1.0 - t * 0.75) * 35 + Math.random() * 6;
    const a = t * Math.PI * 10;

    vortexPositions[v3] = Math.cos(a) * r;
    vortexPositions[v3 + 1] = h;
    vortexPositions[v3 + 2] = Math.sin(a) * r;

    // Prismatic Arcane Palette: Gold to Magenta to Cyan
    if (v % 3 === 0) {
      vortexColors[v3] = 1.0;
      vortexColors[v3 + 1] = 0.82;
      vortexColors[v3 + 2] = 0.4;
    } else if (v % 3 === 1) {
      vortexColors[v3] = 0.85;
      vortexColors[v3 + 1] = 0.28;
      vortexColors[v3 + 2] = 0.94;
    } else {
      vortexColors[v3] = 0.4;
      vortexColors[v3 + 1] = 0.95;
      vortexColors[v3 + 2] = 1.0;
    }
  }

  vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
  vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));

  const vortexMat = new THREE.PointsMaterial({
    size: 4.0,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const vortexPoints = new THREE.Points(vortexGeo, vortexMat);
  group.add(vortexPoints);

  // --- 8. Update Loop ---
  return {
    group,
    apexPosition: new THREE.Vector3(0, 194, castleBaseZ),
    update: (elapsed, delta, scrollProgress) => {
      // Rotate arcane magic circle
      magicCircle.rotation.z = elapsed * 0.04;
      innerRing.rotation.z = -elapsed * 0.06;

      // Pulse beacon orb
      const beaconPulse = 1.0 + Math.sin(elapsed * 4.0) * 0.3;
      apexOrb.scale.setScalar(beaconPulse);

      // Orbit floating crystals around the spire
      crystals.forEach(({ mesh, baseAngle, orbitRadius }, i) => {
        const currentAngle = baseAngle + elapsed * 0.35;
        mesh.position.x = Math.cos(currentAngle) * orbitRadius;
        mesh.position.z = Math.sin(currentAngle) * orbitRadius;
        mesh.position.y = 155 + Math.sin(elapsed * 2.0 + i) * 6;
        mesh.rotation.x = elapsed * 0.8;
        mesh.rotation.y = elapsed * 0.6;
      });

      // Swirl the arcane energy vortex
      vortexPoints.rotation.y = elapsed * 0.8;

      // Flicker candlelight in windows
      windowPlates.forEach((w, idx) => {
        const flicker = 0.75 + Math.sin(elapsed * 5.0 + idx * 1.7) * 0.15 + (Math.random() - 0.5) * 0.05;
        w.material.opacity = flicker;
      });

      // Visibility Curve:
      // Fades in at 0.64 as clearing opens up.
      // Reaches peak majestic visibility at 0.72 - 0.85.
      // At 0.86+, camera reaches spire pinnacle and triggers the Supernova Bloom into galaxy.
      let castleOpacity = 0.0;
      if (scrollProgress < 0.62) {
        castleOpacity = 0.0;
        group.visible = false;
      } else if (scrollProgress < 0.72) {
        castleOpacity = (scrollProgress - 0.62) / 0.10;
        group.visible = true;
      } else if (scrollProgress < 0.88) {
        castleOpacity = 1.0;
        group.visible = true;
      } else {
        // Dissolving into pure starlight bloom
        castleOpacity = Math.max(1.0 - (scrollProgress - 0.88) / 0.09, 0.0);
        group.visible = castleOpacity > 0.01;
      }

      darkStoneMat.opacity = castleOpacity;
      roofMat.opacity = castleOpacity;
      magicCircleMat.opacity = castleOpacity * 0.85;
      vortexMat.opacity = castleOpacity * 0.8;
    }
  };
}
