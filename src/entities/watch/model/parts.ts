export type WatchPartId = 'dial' | 'crown' | 'strap' | 'caseback';

export type WatchPart = {
  id: WatchPartId;
  label: string;
  title: string;
  text: string;
  /** Where the camera moves to look at this part. */
  camera: readonly [number, number, number];
};

export const WATCH_PARTS: readonly WatchPart[] = [
  {
    id: 'dial',
    label: 'Dial',
    title: 'A dial that holds the light',
    text: 'Deep green sunburst finish, gold-tone indices and a sweeping second hand driven by the automatic movement.',
    camera: [0, 0.3, 6.4],
  },
  {
    id: 'crown',
    label: 'Crown',
    title: 'A signed, screw-down crown',
    text: 'Wind it, set the time, then lock it down. The knurled edge gives your fingers something to hold.',
    camera: [6.2, 0.9, 2.6],
  },
  {
    id: 'strap',
    label: 'Strap',
    title: 'Hand-stitched calf leather',
    text: 'Vegetable-tanned leather that softens and darkens with wear, on a quick-release spring bar.',
    camera: [-3.6, -2.6, 4.6],
  },
  {
    id: 'caseback',
    label: 'Case back',
    title: 'Numbered on the back',
    text: 'Every watch is engraved with its serial number. This one is number 0001 of a collection that does not exist.',
    camera: [0.5, 0.4, -6.4],
  },
] as const;

export const WATCH_SPECS = [
  { label: 'Case', value: '40 mm, steel' },
  { label: 'Movement', value: 'Automatic' },
  { label: 'Water resistance', value: '100 m' },
  { label: 'Strap', value: 'Calf leather' },
] as const;

export const WATCH_PRICE = 3200;
