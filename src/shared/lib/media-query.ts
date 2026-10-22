'use client';

import { useSyncExternalStore } from 'react';

const subscribeTo = (query: string) => (onChange: () => void) => {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

/** Reads a CSS media query. The server snapshot is `false`, so first paint matches the static HTML. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Small or touch-first screens get the light 3D version (lower DPR, fewer effects). */
export const useLightScene = () => useMediaQuery('(max-width: 767px), (pointer: coarse)');
