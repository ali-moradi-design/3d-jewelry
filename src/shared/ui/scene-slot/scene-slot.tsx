'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { SceneSlotContext } from './scene-slot-context';
import styles from './scene-slot.module.css';

type Props = {
  /** Text alternative for the whole 3D scene. */
  label: string;
  /** Poster shown until the first 3D frame is ready. */
  poster: string;
  /** Optional crop for narrow screens. */
  posterMobile?: string;
  /** The lazy-loaded scene element. It is only mounted once the slot is close to the screen. */
  children: ReactNode;
  /** Mount right after first paint instead of waiting for the slot to scroll near. */
  eager?: boolean;
  priority?: boolean;
};

export function SceneSlot({
  label,
  poster,
  posterMobile,
  children,
  eager = false,
  priority = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Mount the heavy scene once the slot is close to the screen; pause it when it leaves.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActivated(true);
      },
      { rootMargin: '300px' },
    );
    const visible = new IntersectionObserver(([entry]) =>
      setOnScreen(Boolean(entry?.isIntersecting)),
    );
    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!eager) return;
    // Let the first paint (text and poster) happen before the heavy 3D bundle starts.
    const id = window.setTimeout(() => setActivated(true), 50);
    return () => window.clearTimeout(id);
  }, [eager]);

  const markReady = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ visible: onScreen, markReady }), [onScreen, markReady]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="img"
      aria-label={label}
      data-scene-ready={ready}
    >
      <picture>
        {posterMobile ? <source media="(max-width: 767px)" srcSet={posterMobile} /> : null}
        {/* A plain <img> keeps the static export free of the image optimizer. */}
        <img
          className={`${styles.poster} ${ready ? styles.hidden : ''}`}
          src={poster}
          alt=""
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
      {activated ? (
        <SceneSlotContext.Provider value={value}>
          <div className={styles.canvas} aria-hidden="true">
            {children}
          </div>
        </SceneSlotContext.Provider>
      ) : null}
    </div>
  );
}
