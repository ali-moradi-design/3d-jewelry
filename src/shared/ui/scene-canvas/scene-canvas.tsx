'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { useLightScene } from '@/shared/lib';
import { useSceneSlot } from '../scene-slot';

/** Waits for a few rendered frames, then tells the slot to hide its poster. */
function ReadySignal() {
  const { markReady } = useSceneSlot();
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) markReady();
  });
  return null;
}

type Props = {
  children: ReactNode;
  camera?: ComponentProps<typeof Canvas>['camera'];
  shadows?: boolean;
};

export function SceneCanvas({ children, camera, shadows = true }: Props) {
  const { visible } = useSceneSlot();
  const light = useLightScene();

  return (
    <Canvas
      shadows={shadows && !light}
      dpr={light ? [1, 1.5] : [1, 2]}
      frameloop={visible ? 'always' : 'never'}
      camera={camera}
      gl={{ antialias: !light, powerPreference: 'high-performance' }}
    >
      <ReadySignal />
      {children}
    </Canvas>
  );
}
