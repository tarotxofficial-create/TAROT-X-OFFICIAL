import * as THREE from 'three';
import { createEarthTexture, createEarthCloudTexture } from './textureGenerators';

export function createRealmWorld(scene) {
  const group = new THREE.Group();
  scene.add(group);

  // World Center Position along the descent trajectory
  const worldPos = new THREE.Vector3(0, 10, -1500);
  group.position.copy(worldPos);

  const earthRadius = 125;

  // --- 1. Living Earth / Terra Sphere ---
  const earthTexture = createEarthTexture();
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 48);
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.45,
    metalness: 0.25,
    emissive: new THREE.Color(0x0a1e36),
    emissiveIntensity: 0.35,
    bumpScale: 0.8
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.rotation.x = 0.28; // Planetary axial tilt (23.5 deg)
  group.add(earthMesh);

  // --- 2. Swirling Atmospheric Cloud Layer ---
  const cloudTexture = createEarthCloudTexture();
  const cloudGeo = new THREE.SphereGeometry(earthRadius + 2.5, 48, 36);
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  cloudMesh.rotation.x = 0.28;
  group.add(cloudMesh);

  // --- 3. Luminous Atmospheric Corona / Fresnel Rim ---
  const coronaGeo = new THREE.SphereGeometry(earthRadius + 8.0, 36, 32);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  group.add(coronaMesh);

  // --- 4. Polar Aurora Borealis & Australis Rings ---
  const createAuroraRing = (radius, yOffset, colorHex) => {
    const auroraGeo = new THREE.TorusGeometry(radius, 3.5, 12, 64);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(auroraGeo, auroraMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yOffset;
    return ring;
  };

  const northAurora = createAuroraRing(42, earthRadius * 0.88, 0x10b981);
  const southAurora = createAuroraRing(38, -earthRadius * 0.88, 0x06b6d4);
  earthMesh.add(northAurora);
  earthMesh.add(southAurora);

  // --- 5. Celestial Astrolabe / Orbital Coordinate Rings ---
  const astrolabeGroup = new THREE.Group();
  group.add(astrolabeGroup);

  const ring1Geo = new THREE.TorusGeometry(earthRadius * 1.55, 1.2, 8, 80);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.8;
  astrolabeGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(earthRadius * 1.75, 1.0, 8, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x66fcf1,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 3.5;
  ring2.rotation.x = Math.PI / 4.2;
  astrolabeGroup.add(ring2);

  // --- 6. Atmospheric Entry Cloud Penetration Wisps ---
  // Positioned along the path where the camera approaches and plunges through
  const wispsGroup = new THREE.Group();
  scene.add(wispsGroup);

  const wispCount = 650;
  const wispGeo = new THREE.BufferGeometry();
  const wispPositions = new Float32Array(wispCount * 3);
  const wispColors = new Float32Array(wispCount * 3);

  for (let i = 0; i < wispCount; i++) {
    const i3 = i * 3;
    // Concentrated in the path Z: -1250 to -1650
    wispPositions[i3] = (Math.random() - 0.5) * 260;
    wispPositions[i3 + 1] = (Math.random() - 0.5) * 180 + 10;
    wispPositions[i3 + 2] = -1250 - Math.random() * 420;

    // Soft cyan-white-indigo misty tones
    const tone = Math.random();
    if (tone < 0.5) {
      wispColors[i3] = 0.85;
      wispColors[i3 + 1] = 0.95;
      wispColors[i3 + 2] = 1.0;
    } else {
      wispColors[i3] = 0.4;
      wispColors[i3 + 1] = 0.8;
      wispColors[i3 + 2] = 0.95;
    }
  }

  wispGeo.setAttribute('position', new THREE.BufferAttribute(wispPositions, 3));
  wispGeo.setAttribute('color', new THREE.BufferAttribute(wispColors, 3));

  const wispMat = new THREE.PointsMaterial({
    size: 9.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.0, // Driven dynamically during atmospheric entry
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const wispPoints = new THREE.Points(wispGeo, wispMat);
  wispsGroup.add(wispPoints);

  // --- 7. Update Loop ---
  return {
    group,
    wispsGroup,
    worldPos,
    update: (elapsed, delta, scrollProgress) => {
      // Rotation of the living planet
      earthMesh.rotation.y = elapsed * 0.04;
      cloudMesh.rotation.y = elapsed * 0.055; // Clouds drift slightly faster

      // Counter-rotating astrolabe rings
      ring1.rotation.z = elapsed * 0.03;
      ring2.rotation.z = -elapsed * 0.025;

      // Aurora pulsating glow
      const auroraPulse = 0.35 + Math.sin(elapsed * 2.0) * 0.15;
      northAurora.material.opacity = auroraPulse;
      southAurora.material.opacity = auroraPulse;

      // Visibility curve:
      // Starts appearing at scroll ~0.10, fully visible at ~0.22 - 0.36,
      // as camera plunges into the clouds at 0.36 - 0.44, it dissolves as we enter forest terrain
      let worldScale = 1.0;
      let worldOpacity = 0.0;

      if (scrollProgress < 0.10) {
        worldOpacity = 0.0;
        group.visible = false;
      } else if (scrollProgress < 0.22) {
        worldOpacity = (scrollProgress - 0.10) / 0.12;
        group.visible = true;
      } else if (scrollProgress < 0.38) {
        worldOpacity = 1.0;
        group.visible = true;
      } else if (scrollProgress < 0.46) {
        // Diving through clouds
        const dive = (scrollProgress - 0.38) / 0.08;
        worldOpacity = THREE.MathUtils.lerp(1.0, 0.0, dive);
        worldScale = THREE.MathUtils.lerp(1.0, 1.4, dive);
        group.visible = true;
      } else {
        worldOpacity = 0.0;
        group.visible = false;
      }

      group.scale.setScalar(worldScale);
      earthMat.opacity = worldOpacity;
      cloudMat.opacity = worldOpacity * 0.65;
      coronaMat.opacity = worldOpacity * 0.28;
      ring1Mat.opacity = worldOpacity * 0.55;
      ring2Mat.opacity = worldOpacity * 0.45;

      // Atmospheric entry cloud wisps:
      // Peak right around scroll 0.32 - 0.42 as camera rushes into the clouds
      let wispOpacity = 0.0;
      if (scrollProgress >= 0.28 && scrollProgress <= 0.44) {
        const peak = 0.36;
        if (scrollProgress < peak) {
          wispOpacity = (scrollProgress - 0.28) / (peak - 0.28);
        } else {
          wispOpacity = 1.0 - (scrollProgress - peak) / (0.44 - peak);
        }
        wispsGroup.visible = true;
      } else {
        wispsGroup.visible = false;
      }
      wispMat.opacity = wispOpacity * 0.75;
      wispPoints.rotation.z = elapsed * 0.02;
    }
  };
}
