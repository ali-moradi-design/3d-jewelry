'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { BRAND } from '@/shared/config';
import { useReducedMotion } from '@/shared/lib';
import { useScrollProgress } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { SceneSlot } from '@/shared/ui/scene-slot';
import styles from './hero.module.css';

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false });

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const progress = useScrollProgress(sectionRef, !reduced);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={styles.scene}>
          <SceneSlot
            label="A diamond solitaire ring slowly turning. As you scroll, the camera moves in on the stone."
            poster="/posters/hero.jpg"
            posterMobile="/posters/hero-mobile.jpg"
            eager
            priority
          >
            <HeroScene progress={progress} />
          </SceneSlot>
        </div>

        <div className={styles.intro} data-overlay>
          <p className={styles.eyebrow}>Fine jewelry &amp; timepieces</p>
          <h1 id="hero-title" className={styles.title}>
            Light, held
            <br />
            in <em>gold</em>.
          </h1>
          <p className={styles.lead}>
            Hand-finished rings and watches, made slowly. Turn the ring, change the metal and watch
            the stone catch the light.
          </p>
          <div className={styles.actions}>
            <Button href="#collection">Explore the collection</Button>
            <Button href="#appointment" variant="outline">
              Book an appointment
            </Button>
          </div>
        </div>

        <p className={styles.caption} aria-hidden="true" data-overlay>
          <span className={styles.captionLabel}>Brilliant cut</span>
          <span className={styles.captionText}>Fifty-eight facets, each one polished by hand.</span>
        </p>

        <p className={styles.hint} data-overlay>
          <span className={styles.hintScroll}>Scroll to move closer</span>
          <span>{BRAND.name}</span>
        </p>
      </div>
    </section>
  );
}
