'use client';

import {
  AccumulativeShadows,
  ContactShadows,
  Environment,
  RandomizedLight,
  useEnvironment,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { HDRI_URL } from '@/shared/config';
import { useLightScene, useReducedMotion } from '@/shared/lib';
import { SceneCanvas } from '@/shared/ui/scene-canvas';
import { RingMesh, useRingSelection } from '@/entities/ring';

const FAR = new THREE.Vector3(0, 0.5, 9.5);
const CLOSE = new THREE.Vector3(0.35, 1.95, 3.1);
const LOOK_FAR = new THREE.Vector3(0, 0.3, 0);
const LOOK_CLOSE = new THREE.Vector3(0, 1.62, 0);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Moves the camera from a full view of the ring to a close-up of the stone as the page scrolls. */
function CameraRig({ progress, still }: { progress: RefObject<number>; still: boolean }) {
  const camera = useThree((state) => state.camera);
  const pointer = useThree((state) => state.pointer);
  const aspect = useThree((state) => state.size.width / state.size.height);
  const position = useRef(new THREE.Vector3().copy(FAR));
  const look = useRef(new THREE.Vector3().copy(LOOK_FAR));
  const wanted = useRef(new THREE.Vector3());
  const wantedLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const t = still ? 0.25 : smooth(progress.current ?? 0);
    // Narrow screens need the camera further back so the ring and stone still fit the width.
    const fitFar = Math.max(1, 7.2 / aspect / FAR.z);
    const fitClose = Math.max(1, 2.8 / aspect / CLOSE.z);
    wanted.current.lerpVectors(FAR, CLOSE, t);
    wanted.current.z = THREE.MathUtils.lerp(FAR.z * fitFar, CLOSE.z * fitClose, t);
    wantedLook.current.lerpVectors(LOOK_FAR, LOOK_CLOSE, t);
    // On wide screens the ring sits to the right of the headline; the offset fades out as the camera closes in.
    const shift = aspect > 1.2 ? 1.5 * (1 - t) : 0;
    wanted.current.x -= shift;
    wantedLook.current.x -= shift;
    // On portrait screens the ring moves up to leave room for the text below it.
    if (aspect < 1) wantedLook.current.y -= 1.7 * (1 - t);
    if (!still) {
      wanted.current.x += pointer.x * 0.5 * (1 - t * 0.5);
      wanted.current.y += pointer.y * 0.25;
    }
    const k = 1 - Math.exp(-5 * delta);
    position.current.lerp(wanted.current, k);
    look.current.lerp(wantedLook.current, k);
    camera.position.copy(position.current);
    camera.lookAt(look.current);
  });
  return null;
}

function Turntable({ still, children }: { still: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current || still) return;
    group.current.rotation.y += delta * 0.22;
  });
  return (
    <group ref={group} rotation={[0, still ? 0.5 : 0, 0]}>
      {children}
    </group>
  );
}

type Props = { progress: RefObject<number> };

function HeroWorld({ progress }: Props) {
  const light = useLightScene();
  const reduced = useReducedMotion();
  const envMap = useEnvironment({ files: HDRI_URL });
  const { metal, stone } = useRingSelection();

  return (
    <>
      <color attach="background" args={['#ece9e3']} />
      <Environment map={envMap} />
      <CameraRig progress={progress} still={reduced} />
      <group>
        <Turntable still={reduced}>
          <RingMesh metalId={metal} stoneId={stone} envMap={envMap} light={light} />
        </Turntable>
        {light ? (
          <ContactShadows position={[0, -1.17, 0]} opacity={0.5} scale={9} blur={2.6} far={4} />
        ) : (
          <AccumulativeShadows
            position={[0, -1.17, 0]}
            temporal
            frames={80}
            alphaTest={0.9}
            opacity={0.9}
            scale={14}
          >
            <RandomizedLight
              amount={8}
              radius={6}
              ambient={0.5}
              position={[3, 9, -2.5]}
              bias={0.001}
              size={3}
            />
          </AccumulativeShadows>
        )}
      </group>
      {light ? null : (
        <EffectComposer>
          <Bloom luminanceThreshold={1.05} intensity={0.55} levels={8} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene({ progress }: Props) {
  return (
    <SceneCanvas camera={{ position: FAR.toArray(), fov: 30, near: 0.5, far: 40 }}>
      <HeroWorld progress={progress} />
    </SceneCanvas>
  );
}
