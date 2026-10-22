'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Tracks how far the page has scrolled through a tall section (0 at its top, 1 at its end).
 * The value lives in a ref and in the `--progress` CSS variable, never in React state,
 * so scrolling does not re-render anything.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>, enabled = true) {
  const progress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled) {
      progress.current = 0;
      section?.style.setProperty('--progress', '0');
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const value = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      progress.current = value;
      section.style.setProperty('--progress', value.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef, enabled]);

  return progress;
}
