'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULT_METAL, DEFAULT_STONE, type MetalId, type StoneId } from './options';

export type RingSelection = { metal: MetalId; stone: StoneId };

let selection: RingSelection = { metal: DEFAULT_METAL, stone: DEFAULT_STONE };
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => selection;

export function selectRing(next: Partial<RingSelection>) {
  selection = { ...selection, ...next };
  listeners.forEach((listener) => listener());
}

/** The ring the visitor configured. Shared by the 3D scene, the options panel and the booking form. */
export const useRingSelection = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
