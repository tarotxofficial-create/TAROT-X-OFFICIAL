import * as THREE from 'three';

/**
 * Procedural Star / Glow Sprite Texture
 */
export function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 235, 175, 0.9)');
  grad.addColorStop(0.45, 'rgba(199, 125, 255, 0.45)');
  grad.addColorStop(0.75, 'rgba(6, 182, 212, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Earth / Terra Texture with continents, glowing cyber-ley lines and city clusters
 */
export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep Indigo/Sapphire Ocean Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#040b17');
  oceanGrad.addColorStop(0.5, '#07162c');
  oceanGrad.addColorStop(1, '#040b17');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Ocean Bathymetric current ripples
  ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
  for (let y = 0; y < 512; y += 8) {
    ctx.fillRect(0, y, 1024, 2);
  }

  // Continent Blobs (Procedural landmass clusters)
  const continentCenters = [
    { x: 260, y: 190, r: 85, color: '#0f382a' }, // North America
    { x: 330, y: 340, r: 70, color: '#0d3224' }, // South America
    { x: 530, y: 170, r: 75, color: '#134432' }, // Europe
    { x: 550, y: 300, r: 90, color: '#113d2d' }, // Africa
    { x: 740, y: 190, r: 120, color: '#124231' }, // Asia
    { x: 830, y: 370, r: 55, color: '#0e3627' }, // Australia
  ];

  continentCenters.forEach(({ x, y, r, color }) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Secondary organic lobes for realistic coastlines
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const subDist = r * 0.75 + Math.sin(i * 3.7) * (r * 0.3);
      const subR = r * 0.45;
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * subDist,
        y + Math.sin(angle) * subDist,
        subR,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  });

  // Coastline Glow (Cyan shelf)
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(102, 252, 241, 0.35)';
  continentCenters.forEach(({ x, y, r }) => {
    ctx.beginPath();
    ctx.arc(x, y, r + 4, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Glowing Golden & Cyan Mystical Ley Lines / City Nodes
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 1.2;
  const nodes = [];
  continentCenters.forEach((c) => {
    for (let n = 0; n < 8; n++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (c.r * 0.85);
      const nx = c.x + Math.cos(angle) * dist;
      const ny = c.y + Math.sin(angle) * dist;
      nodes.push({ x: nx, y: ny });

      // Glowing city point
      ctx.fillStyle = Math.random() > 0.4 ? '#ffd166' : '#66fcf1';
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Connect ley lines between nodes
  ctx.beginPath();
  for (let i = 0; i < nodes.length - 1; i++) {
    if (Math.random() > 0.45) {
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
    }
  }
  ctx.stroke();

  // Polar Ice Caps
  ctx.fillStyle = 'rgba(220, 245, 255, 0.85)';
  ctx.fillRect(0, 0, 1024, 30);
  ctx.fillRect(0, 482, 1024, 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Earth Cloud Texture with swirling atmospheric storms
 */
export function createEarthCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1024, 512);

  // Swirling cloud ribbons
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const length = 80 + Math.random() * 200;
    const height = 15 + Math.random() * 35;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, length);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(230, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, length, height, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Spiral storm vortex / hurricane
  const vortexX = 400;
  const vortexY = 220;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  for (let a = 0; a < Math.PI * 6; a += 0.2) {
    const r = a * 6;
    const px = vortexX + Math.cos(a) * r;
    const py = vortexY + Math.sin(a) * (r * 0.6);
    if (a === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Glowing Ancient Celtic/Tarot Forest Rune Texture
 */
export function createRuneTexture(symbol = 'ᚦ') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 128, 128);

  // Outer radiant rune ring
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed ring
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(64, 64, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Rune glyph center
  ctx.font = 'bold 54px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#6ee7b7';
  ctx.shadowColor = '#059669';
  ctx.shadowBlur = 20;
  ctx.fillText(symbol, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Castle Stained-Glass Window Texture with glowing golden amber candlelight
 */
export function createCastleWindowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark stone arch background
  ctx.fillStyle = '#060309';
  ctx.fillRect(0, 0, 128, 256);

  // Arched gothic window
  ctx.beginPath();
  ctx.moveTo(24, 230);
  ctx.lineTo(24, 100);
  ctx.arc(64, 100, 40, Math.PI, 0, false);
  ctx.lineTo(104, 230);
  ctx.closePath();

  // Warm golden amber interior candlelight radiance
  const grad = ctx.createRadialGradient(64, 140, 5, 64, 140, 80);
  grad.addColorStop(0, '#fff4cc');
  grad.addColorStop(0.3, '#f59e0b');
  grad.addColorStop(0.7, '#d97706');
  grad.addColorStop(1, '#78350f');
  ctx.fillStyle = grad;
  ctx.fill();

  // Stained-glass tracery lead lines
  ctx.strokeStyle = '#060309';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Window mullions (cross bars)
  ctx.beginPath();
  ctx.moveTo(64, 60);
  ctx.lineTo(64, 230);
  ctx.moveTo(24, 150);
  ctx.lineTo(104, 150);
  ctx.moveTo(24, 190);
  ctx.lineTo(104, 190);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Massive Concentric Arcane Magic Circle / Sigil Texture
 */
export function createArcaneCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ffd166';
  ctx.shadowBlur = 18;

  // Outer primary ring
  ctx.beginPath();
  ctx.arc(cx, cy, 235, 0, Math.PI * 2);
  ctx.stroke();

  // Second inner ring with tick marks
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 210, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 210, cy + Math.sin(a) * 210);
    ctx.lineTo(cx + Math.cos(a) * 235, cy + Math.sin(a) * 235);
    ctx.stroke();
  }

  // Cyan mystical ring
  ctx.strokeStyle = 'rgba(102, 252, 241, 0.85)';
  ctx.shadowColor = '#66fcf1';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 170, 0, Math.PI * 2);
  ctx.stroke();

  // Sacred Geometry: Inscribed Hexagram (Star of David / Solomon Sigil)
  ctx.lineWidth = 2;
  const drawTriangle = (offset) => {
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const a = offset + (k * Math.PI * 2) / 3;
      const x = cx + Math.cos(a) * 165;
      const y = cy + Math.sin(a) * 165;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };
  drawTriangle(-Math.PI / 2);
  drawTriangle(Math.PI / 2);

  // Inner mystic circle
  ctx.strokeStyle = '#c084fc';
  ctx.shadowColor = '#c084fc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 85, 0, Math.PI * 2);
  ctx.stroke();

  // Center Tarot Star
  ctx.font = 'bold 50px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd166';
  ctx.shadowColor = '#ffd166';
  ctx.shadowBlur = 25;
  ctx.fillText('✦', cx, cy);

  // Mystic Glyphs along the ring
  const glyphs = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '🜂', '🜄', '🜁', '🜃', '∞'];
  ctx.font = 'bold 22px serif';
  ctx.fillStyle = '#66fcf1';
  for (let g = 0; g < glyphs.length; g++) {
    const a = (g / glyphs.length) * Math.PI * 2;
    const gx = cx + Math.cos(a) * 190;
    const gy = cy + Math.sin(a) * 190;
    ctx.fillText(glyphs[g], gx, gy);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
