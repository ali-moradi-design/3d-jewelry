'use client';

import {
  ContactShadows,
  Environment,
  PresentationControls,
  useEnvironment,
} from '@react-three/drei';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { HDRI_URL } from '@/shared/config';
import { useLightScene, useReducedMotion } from '@/shared/lib';
import { SceneCanvas } from '@/shared/ui/scene-canvas';
import { RingMesh, useRingSelection } from '@/entities/ring';

function CollectionWorld() {
  const light = useLightScene();
  const reduced = useReducedMotion();
  const envMap = useEnvironment({ files: HDRI_URL });
  const { metal, stone } = useRingSelection();

  return (
    <>
      <color attach="background" args={['#ece9e3']} />
      <Environment map={envMap} />
      <PresentationControls
        global
        snap
        speed={1.4}
        zoom={1}
        rotation={[0, reduced ? 0.4 : -0.5, 0]}
        polar={[-0.25, 0.35]}
        azimuth={[-Math.PI / 1.6, Math.PI / 1.6]}
      >
        <group position={[0, -0.2, 0]}>
          <RingMesh
            metalId={metal}
            stoneId={stone}
            envMap={envMap}
            light={light}
            castShadows={false}
          />
        </group>
      </PresentationControls>
      <ContactShadows position={[0, -1.55, 0]} opacity={0.45} scale={9} blur={2.8} far={3.5} />
      {light ? null : (
        <EffectComposer>
          <Bloom luminanceThreshold={1.05} intensity={0.5} levels={8} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </>
  );
}

export default function CollectionScene() {
  return (
    <SceneCanvas shadows={false} camera={{ position: [0, 0.55, 7.8], fov: 30, near: 0.5, far: 40 }}>
      <CollectionWorld />
    </SceneCanvas>
  );
}
