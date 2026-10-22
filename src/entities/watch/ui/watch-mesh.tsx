'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createStrapGeometry } from '../lib/strap-geometry';
import { createCasebackTexture, createDialTexture } from '../lib/textures';

type Props = {
  envMap: THREE.Texture;
  /** Freeze the hands (prefers-reduced-motion). */
  still?: boolean;
};

const CASE_RADIUS = 1;
const CASE_HALF = 0.2;
const TAU = Math.PI * 2;

/** Pivot group: geometry grows from the center along +Y, then the group is rotated. */
function Hand({
  length,
  width,
  z,
  color,
  handRef,
  material,
}: {
  length: number;
  width: number;
  z: number;
  color?: string;
  handRef: React.RefObject<THREE.Group | null>;
  material?: THREE.Material;
}) {
  return (
    <group ref={handRef} position={[0, 0, z]}>
      <mesh position={[0, length / 2 - 0.08, 0]} material={material}>
        <boxGeometry args={[width, length, 0.012]} />
        {material ? null : <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />}
      </mesh>
    </group>
  );
}

/** An automatic wristwatch built from code. Face towards +Z, 12 o'clock at +Y, crown at +X. */
export function WatchMesh({ envMap, still = false }: Props) {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);

  const dial = useMemo(() => createDialTexture(), []);
  const caseback = useMemo(() => createCasebackTexture(), []);
  const strap = useMemo(() => createStrapGeometry(), []);

  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4d7db',
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1.2,
      }),
    [],
  );
  const polished = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e6e8ea',
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 1.3,
      }),
    [],
  );
  const leather = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a2417',
        metalness: 0,
        roughness: 0.55,
        envMapIntensity: 0.7,
      }),
    [],
  );
  const goldHands = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e4c27a',
        metalness: 1,
        roughness: 0.2,
        envMapIntensity: 1.2,
      }),
    [],
  );

  useEffect(() => {
    for (const m of [steel, polished, leather, goldHands]) {
      m.envMap = envMap;
      m.needsUpdate = true;
    }
  }, [envMap, steel, polished, leather, goldHands]);

  useEffect(
    () => () => {
      dial.dispose();
      caseback.dispose();
      strap.dispose();
      for (const m of [steel, polished, leather, goldHands]) m.dispose();
    },
    [dial, caseback, strap, steel, polished, leather, goldHands],
  );

  useFrame(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = still ? 35 : now.getSeconds() + ms / 1000;
    const m = still ? 8 + 35 / 60 : now.getMinutes() + s / 60;
    const h = still ? 10 + 8 / 60 : (now.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * TAU;
    if (minute.current) minute.current.rotation.z = -(m / 60) * TAU;
    if (hour.current) hour.current.rotation.z = -(h / 12) * TAU;
  });

  return (
    <group>
      {/* case */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <cylinderGeometry args={[CASE_RADIUS, CASE_RADIUS * 0.97, CASE_HALF * 2, 96]} />
      </mesh>
      <mesh position={[0, 0, CASE_HALF]} material={polished}>
        <torusGeometry args={[CASE_RADIUS * 0.93, 0.07, 24, 96]} />
      </mesh>

      {/* dial and crystal */}
      <mesh position={[0, 0, CASE_HALF + 0.004]}>
        <circleGeometry args={[CASE_RADIUS * 0.87, 96]} />
        <meshStandardMaterial map={dial} metalness={0.35} roughness={0.45} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, CASE_HALF + 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[CASE_RADIUS * 0.88, CASE_RADIUS * 0.88, 0.012, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          clearcoat={1}
          envMap={envMap}
          envMapIntensity={1.6}
          depthWrite={false}
        />
      </mesh>

      {/* hands */}
      <Hand handRef={hour} length={0.5} width={0.075} z={CASE_HALF + 0.012} material={goldHands} />
      <Hand
        handRef={minute}
        length={0.78}
        width={0.055}
        z={CASE_HALF + 0.02}
        material={goldHands}
      />
      <Hand handRef={second} length={0.84} width={0.016} z={CASE_HALF + 0.028} color="#c94a3a" />
      <mesh
        position={[0, 0, CASE_HALF + 0.034]}
        rotation={[Math.PI / 2, 0, 0]}
        material={goldHands}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.03, 24]} />
      </mesh>

      {/* case back */}
      <mesh position={[0, 0, -CASE_HALF - 0.004]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[CASE_RADIUS * 0.9, 96]} />
        <meshStandardMaterial map={caseback} metalness={0.9} roughness={0.35} envMapIntensity={1} />
      </mesh>

      {/* crown and pushers */}
      <mesh position={[CASE_RADIUS + 0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steel}>
        <cylinderGeometry args={[0.1, 0.1, 0.26, 32]} />
      </mesh>
      <mesh
        position={[CASE_RADIUS + 0.28, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={polished}
      >
        <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[
            Math.cos(side * 0.55) * (CASE_RADIUS + 0.06),
            Math.sin(side * 0.55) * (CASE_RADIUS + 0.06),
            0,
          ]}
          rotation={[0, 0, Math.PI / 2 + side * 0.55]}
          material={polished}
        >
          <cylinderGeometry args={[0.06, 0.06, 0.2, 20]} />
        </mesh>
      ))}

      {/* lugs */}
      {[-1, 1].flatMap((sy) =>
        [-1, 1].map((sx) => (
          <mesh
            key={`${sx}${sy}`}
            position={[sx * 0.56, sy * 1.05, -0.1]}
            rotation={[-sy * 0.42, 0, 0]}
            material={steel}
          >
            <boxGeometry args={[0.2, 0.46, 0.22]} />
          </mesh>
        )),
      )}

      {/* strap */}
      <mesh geometry={strap} material={leather} />
    </group>
  );
}
