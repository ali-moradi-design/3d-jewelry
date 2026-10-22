'use client';

import dynamic from 'next/dynamic';
import { SectionHeading } from '@/shared/ui/section-heading';
import { SceneSlot } from '@/shared/ui/scene-slot';
import { RingCustomizer } from '@/features/ring-customizer';
import styles from './collection.module.css';

const CollectionScene = dynamic(() => import('./collection-scene'), { ssr: false });

export function Collection() {
  return (
    <section id="collection" className={styles.section} aria-labelledby="collection-title">
      <div className={styles.grid}>
        <div className={styles.stage}>
          <SceneSlot
            label="Interactive 3D view of the Aurel solitaire ring. Drag to turn it; the metal and stone follow your choices."
            poster="/posters/collection.jpg"
          >
            <CollectionScene />
          </SceneSlot>
          <p className={styles.hint} aria-hidden="true" data-overlay>
            Drag to turn
          </p>
        </div>
        <div className={styles.panel}>
          <SectionHeading
            id="collection-title"
            eyebrow="01 — The collection"
            title="The Aurel solitaire"
          />
          <p className={styles.copy}>
            A single round brilliant on a slim band that narrows towards the stone. Choose the metal
            and the stone and the ring in front of you changes with them.
          </p>
          <RingCustomizer />
        </div>
      </div>
    </section>
  );
}
