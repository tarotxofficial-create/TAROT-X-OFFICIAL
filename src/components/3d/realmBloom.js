import * as THREE from 'three';
import { createStarTexture } from './textureGenerators';

export function createRealmBloom(scene, starSprite) {
  const group = new THREE.Group();
  scene.add(group);

  const sprite = starSprite || createStarTexture();

  // Position at apex of Castle (where the magical explosion happens)
  const bloomCenter = new THREE.Vector3(0, 194, -4300);
  group.position.copy(bloomCenter);

  // --- 1. Supernova Core Orb ---
  const coreGeo = new THREE.SphereGeometry(15, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xfff3c4,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // --- 2. Expanding Shockwave Rings ---
  const rings = [];
  const ringColors = [0xffd166, 0xd946ef, 0x66fcf1, 0xffffff];

  for (let r = 0; r < 4; r++) {
    const ringGeo = new THREE.RingGeometry(8, 14, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: ringColors[r],
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2 + (r * 0.2);
    ringMesh.rotation.y = (r * 0.3);
    group.add(ringMesh);
    rings.push({ mesh: ringMesh, speed: 1.2 + r * 0.4, baseScale: 1.0 });
  }

  // --- 3. Radial Starlight Warp Streaks / Hyperspace Ray Lines ---
  const streakCount = 320;
  const streakPositions = [];
  const streakColors = [];

  for (let s = 0; s < streakCount; s++) {
    // Generate random spherical direction
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;

    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    const innerDist = 20 + Math.random() * 40;
    const streakLength = 60 + Math.random() * 120;

    const p1 = dir.clone().multiplyScalar(innerDist);
    const p2 = dir.clone().multiplyScalar(innerDist + streakLength);

    streakPositions.push(p1.x, p1.y, p1.z);
    streakPositions.push(p2.x, p2.y, p2.z);

    const c = s % 2 === 0 ? new THREE.Color(0xffd166) : new THREE.Color(0x66fcf1);
    streakColors.push(c.r, c.g, c.b);
    streakColors.push(c.r * 0.5, c.g * 0.5, c.b * 0.5);
  }

  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute('position', new THREE.Float32BufferAttribute(streakPositions, 3));
  streakGeo.setAttribute('color', new THREE.Float32BufferAttribute(streakColors, 3));

  const streakMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  group.add(streaks);

  // --- 4. Stardust Bloom Particles ---
  const dustCount = 2200;
  const dustGeo = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  const dustVelocities = [];

  for (let d = 0; d < dustCount; d++) {
    const d3 = d * 3;
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 220;

    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );

    dustPositions[d3] = dir.x * 10;
    dustPositions[d3 + 1] = dir.y * 10;
    dustPositions[d3 + 2] = dir.z * 10;

    dustVelocities.push(dir.multiplyScalar(speed));

    const palette = [0xffd166, 0xd946ef, 0x06b6d4, 0xffffff];
    const col = new THREE.Color(palette[d % palette.length]);
    dustColors[d3] = col.r;
    dustColors[d3 + 1] = col.g;
    dustColors[d3 + 2] = col.b;
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

  const dustMat = new THREE.PointsMaterial({
    size: 4.5,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const dustMesh = new THREE.Points(dustGeo, dustMat);
  group.add(dustMesh);

  // --- 5. Rebirth Galaxy Field (Seamless Loop Horizon) ---
  // Positioned as an expansive starry canopy ascending beyond the bloom
  const rebirthGeo = new THREE.BufferGeometry();
  const rebirthCount = 3500;
  const rebirthPositions = new Float32Array(rebirthCount * 3);
  const rebirthColors = new Float32Array(rebirthCount * 3);

  for (let b = 0; b < rebirthCount; b++) {
    const b3 = b * 3;
    const angle = b * 0.15;
    const r = Math.pow(Math.random(), 2.0) * 450 + 20;
    rebirthPositions[b3] = Math.cos(angle) * r;
    rebirthPositions[b3 + 1] = Math.sin(angle) * (r * 0.6) + (Math.random() - 0.5) * 40;
    rebirthPositions[b3 + 2] = (Math.random() - 0.5) * 800 - 300;

    const col = new THREE.Color();
    col.setHSL(0.75 + Math.random() * 0.25, 0.85, 0.7);
    rebirthColors[b3] = col.r;
    rebirthColors[b3 + 1] = col.g;
    rebirthColors[b3 + 2] = col.b;
  }

  rebirthGeo.setAttribute('position', new THREE.BufferAttribute(rebirthPositions, 3));
  rebirthGeo.setAttribute('color', new THREE.BufferAttribute(rebirthColors, 3));

  const rebirthMat = new THREE.PointsMaterial({
    size: 3.8,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const rebirthPoints = new THREE.Points(rebirthGeo, rebirthMat);
  group.add(rebirthPoints);

  // --- 6. Update Loop ---
  return {
    group,
    update: (elapsed, delta, scrollProgress) => {
      // Rotate bloom elements
      streaks.rotation.z = elapsed * 0.1;
      rebirthPoints.rotation.z = elapsed * 0.03;

      // Bloom begins at 0.84, explodes at 0.90 - 0.95, emerges into galaxy at 0.96 - 1.00
      let bloomProgress = 0.0;
      if (scrollProgress >= 0.84) {
        bloomProgress = Math.min((scrollProgress - 0.84) / 0.16, 1.0);
        group.visible = true;
      } else {
        group.visible = false;
        return;
      }

      // Core scaling
      const coreScale = 1.0 + bloomProgress * 18.0;
      coreMesh.scale.setScalar(coreScale);

      // Core opacity pulses and then dissolves into galaxy
      let coreOpacity = 0.0;
      if (bloomProgress < 0.45) {
        coreOpacity = (bloomProgress / 0.45) * 0.95;
      } else if (bloomProgress < 0.8) {
        coreOpacity = 0.95;
      } else {
        coreOpacity = (1.0 - (bloomProgress - 0.8) / 0.2) * 0.95;
      }
      coreMat.opacity = coreOpacity;

      // Shockwave rings expanding
      rings.forEach(({ mesh, speed }, idx) => {
        const ringT = (bloomProgress * 2.5 * speed + elapsed * 0.3) % 1.0;
        const ringScale = 1.0 + ringT * 28.0;
        mesh.scale.setScalar(ringScale);
        mesh.material.opacity = (1.0 - ringT) * Math.min(bloomProgress * 2.0, 0.85);
      });

      // Streaks opacity
      streakMat.opacity = Math.sin(bloomProgress * Math.PI) * 0.85;

      // Dust particles expansion
      const dAttr = dustGeo.attributes.position;
      for (let d = 0; d < dustCount; d++) {
        const d3 = d * 3;
        const v = dustVelocities[d];
        const expandFactor = bloomProgress * 1.8;
        dAttr.setXYZ(
          d,
          v.x * expandFactor,
          v.y * expandFactor,
          v.z * expandFactor
        );
      }
      dAttr.needsUpdate = true;
      dustMat.opacity = Math.sin(bloomProgress * Math.PI) * 0.9;

      // Rebirth Galaxy field:
      // Becomes brilliant as bloom reaches maximum expansion (0.75+ bloomProgress, scroll 0.94 - 1.00)
      let rebirthOpacity = 0.0;
      if (bloomProgress > 0.4) {
        rebirthOpacity = (bloomProgress - 0.4) / 0.6;
      }
      rebirthMat.opacity = rebirthOpacity * 0.9;
    }
  };
}
