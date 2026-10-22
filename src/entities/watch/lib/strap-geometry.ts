import * as THREE from 'three';

/**
 * A leather strap loop. The watch face looks along +Z with 12 o'clock at +Y; the loop wraps
 * behind the case like a wrist cross-section and is `width` wide along X.
 */
export function createStrapGeometry(width = 0.98): THREE.BufferGeometry {
  const semiY = 1.5;
  const semiZ = 1.05;
  const centerZ = -1.05;
  const thickness = 0.085;
  const steps = 96;

  const outer = new THREE.Shape();
  const inner = new THREE.Path();
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const ox = Math.cos(a) * (semiY + thickness);
    const oy = centerZ + Math.sin(a) * (semiZ + thickness);
    const ix = Math.cos(a) * semiY;
    const iy = centerZ + Math.sin(a) * semiZ;
    if (i === 0) {
      outer.moveTo(ox, oy);
      inner.moveTo(ix, iy);
    } else {
      outer.lineTo(ox, oy);
      inner.lineTo(ix, iy);
    }
  }
  outer.holes.push(inner);

  const geometry = new THREE.ExtrudeGeometry(outer, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
    curveSegments: 1,
    steps: 1,
  });
  // shape (x, y, extrude-z) -> world (extrude-z - width/2, x, y)
  geometry.applyMatrix4(
    new THREE.Matrix4().set(0, 0, 1, -width / 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1),
  );
  geometry.computeVertexNormals();
  return geometry;
}
