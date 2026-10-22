'use client';

import { ContactShadows, Environment, OrbitControls, useEnvironment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type ComponentRef, type RefObject } from 'react';
import * as THREE from 'three';
import { HDRI_URL } from '@/shared/config';
import { useReducedMotion } from '@/shared/lib';
import { SceneCanvas } from '@/shared/ui/scene-canvas';
import { WATCH_PARTS, WatchMesh, type WatchPartId } from '@/entities/watch';

const HOME = new THREE.Vector3(2.4, 0.6, 6.6);

/** Flies the camera to the chosen part until the visitor grabs the watch again. */
type Controls = ComponentRef<typeof OrbitControls>;

function FocusRig({
  focus,
  controls,
}: {
  focus: WatchPartId | null;
  controls: RefObject<Controls | null>;
}) {
  const camera = useThree((state) => state.camera);
  const reduced = useReducedMotion();
  const target = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const part = WATCH_PARTS.find((p) => p.id === focus);
    target.current = part ? new THREE.Vector3(...part.camera) : null;
    if (target.current && reduced) {
      camera.position.copy(target.current);
      controls.current?.update();
      target.current = null;
    }
  }, [focus, camera, controls, reduced]);

  useEffect(() => {
    const instance = controls.current;
    if (!instance) return;
    const release = () => {
      target.current = null;
    };
    instance.addEventListener('start', release);
    return () => instance.removeEventListener('start', release);
  }, [controls]);

  useFrame((_, delta) => {
    if (!target.current) return;
    camera.position.lerp(target.current, 1 - Math.exp(-4 * delta));
    controls.current?.update();
    if (camera.position.distanceTo(target.current) < 0.02) target.current = null;
  });
  return null;
}

function WatchWorld({ focus }: { focus: WatchPartId | null }) {
  const envMap = useEnvironment({ files: HDRI_URL });
  const reduced = useReducedMotion();
  const controls = useRef<Controls>(null);

  return (
    <>
      <color attach="background" args={['#161310']} />
      <Environment map={envMap} />
      <group rotation={[0.15, -0.35, 0.05]}>
        <WatchMesh envMap={envMap} still={reduced} />
      </group>
      <ContactShadows position={[0, -2.6, 0]} opacity={0.5} scale={12} blur={3} far={4} />
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        autoRotate={!reduced && focus === null}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
      <FocusRig focus={focus} controls={controls} />
    </>
  );
}

export default function WatchScene({ focus }: { focus: WatchPartId | null }) {
  return (
    <SceneCanvas shadows={false} camera={{ position: HOME.toArray(), fov: 28, near: 0.5, far: 60 }}>
      <WatchWorld focus={focus} />
    </SceneCanvas>
  );
}
