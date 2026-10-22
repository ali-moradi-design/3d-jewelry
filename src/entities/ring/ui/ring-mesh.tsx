'use client';

/* eslint-disable react-hooks/immutability -- three.js materials are mutated imperatively (env map, per-frame color easing) on purpose. */

import { MeshRefractionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  GEM_GIRDLE_Y,
  createBandGeometry,
  createStemGeometry,
  GALLERY,
  spokeTransforms,
  createGemGeometry,
} from '../lib/geometry';
import { findMetal, findStone } from '../model/options';

type Props = {
  metalId: string;
  stoneId: string;
  envMap: THREE.Texture;
  /** Light mode: no chromatic aberration. */
  light?: boolean;
  castShadows?: boolean;
};

const PRONG_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

/** A solitaire ring built from code: squircle band, cup, four prongs and a round brilliant stone. */
export function RingMesh({ metalId, stoneId, envMap, light = false, castShadows = true }: Props) {
  const metal = findMetal(metalId);
  const stone = findStone(stoneId);

  const band = useMemo(() => createBandGeometry(), []);
  const gem = useMemo(() => createGemGeometry(), []);
  const stem = useMemo(() => createStemGeometry(), []);
  const spokes = useMemo(() => spokeTransforms(), []);
  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: metal.color,
        metalness: 1,
        roughness: metal.roughness,
        envMapIntensity: 1.25,
      }),
    // The material is created once; its color eases towards the chosen metal in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const target = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    metalMaterial.envMap = envMap;
    metalMaterial.needsUpdate = true;
  }, [metalMaterial, envMap]);

  useEffect(
    () => () => {
      band.dispose();
      gem.dispose();
      stem.dispose();
      metalMaterial.dispose();
    },
    [band, gem, stem, metalMaterial],
  );

  useFrame((_, delta) => {
    target.set(metal.color);
    metalMaterial.color.lerp(target, 1 - Math.exp(-8 * delta));
    metalMaterial.roughness = THREE.MathUtils.damp(
      metalMaterial.roughness,
      metal.roughness,
      8,
      delta,
    );
  });

  const prongRadius = 0.44;
  const prongLength = 0.36;

  return (
    <group>
      <mesh geometry={band} material={metalMaterial} castShadow={castShadows} receiveShadow />
      <group position={[0, GEM_GIRDLE_Y, 0]}>
        <mesh geometry={stem} material={metalMaterial} castShadow={castShadows} />
        <mesh
          material={metalMaterial}
          castShadow={castShadows}
          position={[0, GALLERY.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[GALLERY.radius, GALLERY.tube, 12, 48]} />
        </mesh>
        {spokes.map((spoke) => (
          <mesh
            key={spoke.key}
            material={metalMaterial}
            castShadow={castShadows}
            position={spoke.position}
            quaternion={spoke.quaternion}
          >
            <capsuleGeometry args={[0.016, spoke.length - 0.03, 4, 8]} />
          </mesh>
        ))}
        <mesh geometry={gem}>
          <MeshRefractionMaterial
            key={`${stone.id}-${light}`}
            envMap={envMap}
            ior={stone.ior}
            color={stone.color}
            bounces={3}
            aberrationStrength={light ? 0 : stone.aberration}
            fastChroma
            toneMapped={false}
          />
        </mesh>
        {PRONG_ANGLES.map((angle) => (
          <mesh
            key={angle}
            material={metalMaterial}
            castShadow={castShadows}
            position={[Math.cos(angle) * prongRadius, 0.03, Math.sin(angle) * prongRadius]}
            rotation={[-Math.sin(angle) * 0.2, 0, Math.cos(angle) * 0.2]}
          >
            <capsuleGeometry args={[0.032, prongLength, 6, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
