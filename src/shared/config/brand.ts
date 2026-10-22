export const BRAND = {
  name: 'Aurelune',
  tagline: 'Light, held in gold.',
  description:
    'Aurelune is a fictional fine jewelry and watch house. A portfolio demo of a 3D landing page: turn the ring, change the metal, explore the watch.',
  notice: 'Aurelune is a fictional brand made for a portfolio demo. Nothing here is for sale.',
} as const;

export const HDRI_URL = '/hdri/aurelune-studio.hdr';

export const NAV_LINKS = [
  { href: '#collection', label: 'Collection' },
  { href: '#watch', label: 'Watch' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#appointment', label: 'Appointment' },
] as const;

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
