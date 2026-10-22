import * as THREE from 'three';

export const BAND_INNER_RADIUS = 1;
export const BAND_THICKNESS = 0.16;
export const GEM_RADIUS = 0.45;
export const GEM_HEIGHT = 0.5;
/** Height of the gem's girdle above the ring center. */
export const GEM_GIRDLE_Y = BAND_INNER_RADIUS + BAND_THICKNESS + 0.45;

/**
 * Comfort-fit band. The ring lies in the XY plane (finger axis = Z), the head sits at +Y.
 * The cross-section is a squircle and the band narrows towards the head.
 */
export function createBandGeometry(segments = 192, profileSteps = 40): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const halfWidth = 0.19;

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const towardsHead = Math.pow((1 + Math.sin(theta)) / 2, 3);
    const taper = 1 - 0.5 * towardsHead;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    for (let j = 0; j < profileSteps; j++) {
      const phi = (j / profileSteps) * Math.PI * 2;
      const c = Math.cos(phi);
      const s = Math.sin(phi);
      const n = 4;
      const radial =
        BAND_INNER_RADIUS +
        BAND_THICKNESS / 2 +
        (BAND_THICKNESS / 2) * Math.sign(c) * Math.abs(c) ** (2 / n);
      const z = halfWidth * taper * Math.sign(s) * Math.abs(s) ** (2 / n);
      positions.push(radial * cos, radial * sin, z);
    }
  }

  for (let i = 0; i < segments; i++) {
    const nextI = (i + 1) % segments;
    for (let j = 0; j < profileSteps; j++) {
      const nextJ = (j + 1) % profileSteps;
      const a = i * profileSteps + j;
      const b = nextI * profileSteps + j;
      const c = nextI * profileSteps + nextJ;
      const d = i * profileSteps + nextJ;
      indices.push(a, d, b, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Round brilliant cut with flat facets. The girdle is at y = 0, the table points to +Y.
 * Rings of 16 vertices are joined by triangles; every other ring is rotated half a step,
 * which gives the usual kite and triangle facet pattern.
 */
export function createGemGeometry(): THREE.BufferGeometry {
  const R = GEM_RADIUS;
  const N = 16;
  const step = (Math.PI * 2) / N;

  type Ring = { r: number; y: number; offset: number };
  const crown: Ring[] = [
    { r: 0.56 * R, y: 0.16 * R * 2, offset: 0 },
    { r: 0.8 * R, y: 0.08 * R * 2, offset: 0.5 },
    { r: R, y: 0.014 * R * 2, offset: 0 },
  ];
  const pavilion: Ring[] = [
    { r: R, y: -0.014 * R * 2, offset: 0 },
    { r: 0.74 * R, y: -0.13 * R * 2, offset: 0.5 },
    { r: 0.4 * R, y: -0.28 * R * 2, offset: 0 },
  ];
  const tipY = -0.43 * R * 2;

  const ringPoints = ({ r, y, offset }: Ring) =>
    Array.from({ length: N }, (_, k) => {
      const a = (k + offset) * step;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });

  const triangles: THREE.Vector3[] = [];
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => triangles.push(a, b, c);

  const band = (
    upper: THREE.Vector3[],
    lower: THREE.Vector3[],
    upperOffset: number,
    lowerOffset: number,
  ) => {
    for (let k = 0; k < N; k++) {
      const u0 = upper[k]!;
      const u1 = upper[(k + 1) % N]!;
      const l0 = lower[k]!;
      const l1 = lower[(k + 1) % N]!;
      if (upperOffset === 0 && lowerOffset === 0.5) {
        // upper vertices k and k+1 enclose the lower vertex k (which sits half a step later)
        tri(u0, l0, u1);
        const lPrev = lower[(k + N - 1) % N]!;
        tri(u0, lPrev, l0);
      } else if (upperOffset === 0.5 && lowerOffset === 0) {
        tri(u0, l1, l0);
        tri(u0, u1, l1);
      } else {
        tri(u0, l0, l1);
        tri(u0, l1, u1);
      }
    }
  };

  const crownRings = crown.map(ringPoints);
  const pavRings = pavilion.map(ringPoints);

  // table cap
  const top = crownRings[0]!;
  const topCenter = new THREE.Vector3(0, crown[0]!.y, 0);
  for (let k = 0; k < N; k++) tri(topCenter, top[(k + 1) % N]!, top[k]!);

  // crown
  band(crownRings[0]!, crownRings[1]!, crown[0]!.offset, crown[1]!.offset);
  band(crownRings[1]!, crownRings[2]!, crown[1]!.offset, crown[2]!.offset);

  // girdle
  const girdleTop = crownRings[2]!;
  const girdleBottom = pavRings[0]!;
  for (let k = 0; k < N; k++) {
    const a = girdleTop[k]!;
    const b = girdleTop[(k + 1) % N]!;
    const c = girdleBottom[k]!;
    const d = girdleBottom[(k + 1) % N]!;
    tri(a, c, b);
    tri(b, c, d);
  }

  // pavilion
  band(pavRings[0]!, pavRings[1]!, pavilion[0]!.offset, pavilion[1]!.offset);
  band(pavRings[1]!, pavRings[2]!, pavilion[1]!.offset, pavilion[2]!.offset);
  const lowRing = pavRings[2]!;
  const tip = new THREE.Vector3(0, tipY, 0);
  for (let k = 0; k < N; k++) tri(tip, lowRing[k]!, lowRing[(k + 1) % N]!);

  // The gem is convex, so a face must point away from its center. Flip any that do not.
  const center = new THREE.Vector3(0, tipY / 2, 0);
  const normal = new THREE.Vector3();
  const centroid = new THREE.Vector3();
  for (let t = 0; t < triangles.length; t += 3) {
    const a = triangles[t]!;
    const b = triangles[t + 1]!;
    const c = triangles[t + 2]!;
    normal.crossVectors(b.clone().sub(a), c.clone().sub(a));
    centroid.copy(a).add(b).add(c).divideScalar(3).sub(center);
    if (normal.dot(centroid) < 0) {
      triangles[t + 1] = c;
      triangles[t + 2] = b;
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(triangles);
  geometry.computeVertexNormals();
  return geometry;
}

/** Thin stem that joins the tip of the stone to the band. Axis = Y, origin at the girdle. */
export function createStemGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector2(0.07, -0.46),
    new THREE.Vector2(0.06, -0.42),
    new THREE.Vector2(0.045, -0.37),
  ];
  return new THREE.LatheGeometry(points, 20);
}

/** Radius and height (relative to the girdle) of the gallery ring that sits just under the stone. */
export const GALLERY = { radius: 0.37, y: -0.13, tube: 0.022 };

/** The four spokes run from the stem to the gallery ring. Returns position, length and rotation. */
export function spokeTransforms(count = 4) {
  const from = new THREE.Vector3(0, -0.43, 0);
  return Array.from({ length: count }, (_, k) => {
    const angle = (k / count) * Math.PI * 2 + Math.PI / 4;
    const to = new THREE.Vector3(
      Math.cos(angle) * GALLERY.radius,
      GALLERY.y,
      Math.sin(angle) * GALLERY.radius,
    );
    const direction = to.clone().sub(from);
    const length = direction.length();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return {
      key: k,
      position: from.clone().lerp(to, 0.5).toArray() as [number, number, number],
      length,
      quaternion,
    };
  });
}
