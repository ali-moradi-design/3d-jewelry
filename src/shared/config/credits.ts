export type Credit = {
  name: string;
  author: string;
  license: string;
  href: string;
  note: string;
};

/** Mirrors CREDITS.md. Keep both in sync. */
export const CREDITS: readonly Credit[] = [
  {
    name: 'pmndrs/examples (diamond-ring, bouncy-watch)',
    author: 'Paul Henschel and Poimandres contributors',
    license: 'MIT',
    href: 'https://github.com/pmndrs/examples',
    note: 'Starting point for the gem refraction, soft shadow and bloom setup. The example models are not used.',
  },
  {
    name: 'three.js',
    author: 'mrdoob and three.js authors',
    license: 'MIT',
    href: 'https://threejs.org',
    note: '3D engine.',
  },
  {
    name: 'React Three Fiber, drei, react-postprocessing',
    author: 'Poimandres',
    license: 'MIT',
    href: 'https://github.com/pmndrs',
    note: 'React renderer for three.js, helpers and effects.',
  },
  {
    name: 'postprocessing',
    author: 'Raoul van Rüschen',
    license: 'Zlib',
    href: 'https://github.com/pmndrs/postprocessing',
    note: 'Bloom and tone mapping.',
  },
  {
    name: 'Cormorant Garamond',
    author: 'Christian Thalmann (Catharsis Fonts)',
    license: 'SIL Open Font License 1.1',
    href: 'https://github.com/CatharsisFonts/Cormorant',
    note: 'Headline typeface.',
  },
  {
    name: 'Inter',
    author: 'Rasmus Andersson',
    license: 'SIL Open Font License 1.1',
    href: 'https://rsms.me/inter/',
    note: 'Interface typeface.',
  },
];

export const ORIGINAL_WORK =
  'The ring, the watch and the studio lighting are original work, generated in code for this demo. No third-party 3D models or HDRI images are used.';
