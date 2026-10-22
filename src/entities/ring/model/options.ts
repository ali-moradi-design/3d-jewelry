export const BASE_PRICE = 4800;

export type Metal = {
  id: string;
  label: string;
  /** Linear-ish base reflectance color of the metal in the 3D scene. */
  color: string;
  /** Color of the swatch button in the UI. */
  swatch: string;
  roughness: number;
  priceDelta: number;
};

export const METALS = [
  {
    id: 'yellow-gold',
    label: 'Yellow gold',
    color: '#ffc457',
    swatch: '#e6b450',
    roughness: 0.14,
    priceDelta: 0,
  },
  {
    id: 'rose-gold',
    label: 'Rose gold',
    color: '#f3a58c',
    swatch: '#dd9f88',
    roughness: 0.14,
    priceDelta: 0,
  },
  {
    id: 'white-gold',
    label: 'White gold',
    color: '#efece6',
    swatch: '#e4e1db',
    roughness: 0.12,
    priceDelta: 200,
  },
  {
    id: 'platinum',
    label: 'Platinum',
    color: '#cfd3d8',
    swatch: '#b4b9c0',
    roughness: 0.2,
    priceDelta: 900,
  },
] as const satisfies readonly Metal[];

export type Stone = {
  id: string;
  label: string;
  /** Tint of the refraction material. */
  color: string;
  ior: number;
  aberration: number;
  priceDelta: number;
};

export const STONES = [
  { id: 'diamond', label: 'Diamond', color: '#ffffff', ior: 2.4, aberration: 0.02, priceDelta: 0 },
  {
    id: 'sapphire',
    label: 'Sapphire',
    color: '#2a4cc0',
    ior: 1.77,
    aberration: 0.01,
    priceDelta: -900,
  },
  {
    id: 'emerald',
    label: 'Emerald',
    color: '#12945a',
    ior: 1.58,
    aberration: 0.008,
    priceDelta: -500,
  },
  { id: 'ruby', label: 'Ruby', color: '#c4162f', ior: 1.77, aberration: 0.01, priceDelta: -300 },
] as const satisfies readonly Stone[];

export type MetalId = (typeof METALS)[number]['id'];
export type StoneId = (typeof STONES)[number]['id'];

export const DEFAULT_METAL: MetalId = 'white-gold';
export const DEFAULT_STONE: StoneId = 'diamond';

export const findMetal = (id: string): Metal => METALS.find((m) => m.id === id) ?? METALS[2];
export const findStone = (id: string): Stone => STONES.find((s) => s.id === id) ?? STONES[0];

export const priceOf = (metalId: string, stoneId: string): number =>
  BASE_PRICE + findMetal(metalId).priceDelta + findStone(stoneId).priceDelta;
