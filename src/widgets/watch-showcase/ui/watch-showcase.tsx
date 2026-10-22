'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { formatPrice } from '@/shared/config';
import { SceneSlot } from '@/shared/ui/scene-slot';
import { SectionHeading } from '@/shared/ui/section-heading';
import { WATCH_PARTS, WATCH_PRICE, WATCH_SPECS, type WatchPartId } from '@/entities/watch';
import styles from './watch-showcase.module.css';

const WatchScene = dynamic(() => import('./watch-scene'), { ssr: false });

export function WatchShowcase() {
  const [focus, setFocus] = useState<WatchPartId | null>(null);
  const active = WATCH_PARTS.find((part) => part.id === focus);

  return (
    <section id="watch" className={styles.section} aria-labelledby="watch-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeading
            id="watch-title"
            eyebrow="02 — The watch"
            title="Meridian automatic"
            tone="dark"
          />
          <p className={styles.lead}>
            Drag to turn it over, or choose a part and the camera takes you there.
          </p>

          <div
            className={styles.parts}
            role="group"
            aria-label="Look closer at a part of the watch"
          >
            {WATCH_PARTS.map((part) => (
              <button
                key={part.id}
                type="button"
                className={styles.part}
                aria-pressed={focus === part.id}
                onClick={() => setFocus(focus === part.id ? null : part.id)}
              >
                {part.label}
              </button>
            ))}
          </div>

          <div className={styles.detail} aria-live="polite">
            <h3 className={styles.detailTitle}>
              {active?.title ?? 'Built to be turned in the hand'}
            </h3>
            <p className={styles.detailText}>
              {active?.text ??
                'A 40 mm steel case, a green sunburst dial and a leather strap. Pick a part above to look closer.'}
            </p>
          </div>

          <dl className={styles.specs}>
            {WATCH_SPECS.map((spec) => (
              <div key={spec.label} className={styles.spec}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.price}>
            {formatPrice(WATCH_PRICE)} <span>Demo price</span>
          </p>
        </div>

        <div className={styles.stage}>
          <SceneSlot
            label="Interactive 3D view of the Meridian automatic watch. Drag to turn it; the buttons beside it move the camera to the dial, crown, strap or case back."
            poster="/posters/watch.jpg"
          >
            <WatchScene focus={focus} />
          </SceneSlot>
        </div>
      </div>
    </section>
  );
}
