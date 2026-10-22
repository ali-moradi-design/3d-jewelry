import * as THREE from 'three';

const SIZE = 1024;

function makeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Dial artwork: sunburst, gold indices and the (fictional) brand name. */
export function createDialTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas();
  const c = SIZE / 2;

  const base = ctx.createRadialGradient(c, c, 20, c, c, c);
  base.addColorStop(0, '#2c4a40');
  base.addColorStop(1, '#10201b');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // sunburst
  ctx.save();
  ctx.translate(c, c);
  for (let i = 0; i < 180; i++) {
    ctx.rotate((Math.PI * 2) / 180);
    ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, c);
    ctx.stroke();
  }
  ctx.restore();

  // minute track
  ctx.save();
  ctx.translate(c, c);
  for (let i = 0; i < 60; i++) {
    ctx.rotate((Math.PI * 2) / 60);
    ctx.strokeStyle = '#d8c28c';
    ctx.lineWidth = i % 5 === 0 ? 0 : 3;
    ctx.beginPath();
    ctx.moveTo(0, -c * 0.93);
    ctx.lineTo(0, -c * 0.89);
    ctx.stroke();
  }
  // hour indices
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.fillStyle = '#e4cd94';
    ctx.fillRect(-9, -c * 0.9, 18, c * 0.17);
  }
  ctx.restore();

  ctx.fillStyle = '#e4cd94';
  ctx.textAlign = 'center';
  ctx.font = '500 62px "Cormorant Garamond", "Times New Roman", serif';
  ctx.letterSpacing = '16px';
  ctx.fillText('AURELUNE', c + 8, c - 150);
  ctx.font = '500 30px "Inter Variable", Arial, sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('AUTOMATIC', c + 5, c + 210);
  ctx.font = '400 24px "Inter Variable", Arial, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = 'rgba(228,205,148,0.75)';
  ctx.fillText('100 M · FICTIONAL', c + 3, c + 252);

  return toTexture(canvas);
}

/** Engraving on the case back. */
export function createCasebackTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas();
  const c = SIZE / 2;
  const grad = ctx.createRadialGradient(c, c, 40, c, c, c);
  grad.addColorStop(0, '#d9dce0');
  grad.addColorStop(1, '#aeb3b9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.strokeStyle = 'rgba(40,44,50,0.55)';
  ctx.lineWidth = 4;
  for (const r of [0.9, 0.62]) {
    ctx.beginPath();
    ctx.arc(c, c, c * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(30,34,40,0.8)';
  ctx.textAlign = 'center';
  ctx.font = '500 64px "Cormorant Garamond", "Times New Roman", serif';
  ctx.letterSpacing = '14px';
  ctx.fillText('AURELUNE', c + 7, c - 20);
  ctx.font = '500 34px "Inter Variable", Arial, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('No. 0001', c + 4, c + 50);
  ctx.font = '400 26px "Inter Variable", Arial, sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('STAINLESS STEEL · 100 M', c + 3, c + 100);
  ctx.fillText('A FICTIONAL WATCH', c + 3, c + 140);

  return toTexture(canvas);
}
