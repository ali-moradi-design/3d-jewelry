'use client';

import { createContext, useContext } from 'react';

type SceneSlotState = {
  /** True while the slot is on screen; the canvas stops rendering when it is not. */
  visible: boolean;
  /** Called once the first frames are drawn, so the poster image can fade out. */
  markReady: () => void;
};

export const SceneSlotContext = createContext<SceneSlotState>({
  visible: true,
  markReady: () => {},
});

export const useSceneSlot = () => useContext(SceneSlotContext);
