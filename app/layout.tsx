import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@/app/styles/globals.css';
import { BRAND } from '@/shared/config/brand';

export const metadata: Metadata = {
  title: `${BRAND.name} — Fine jewelry & timepieces (demo)`,
  description: BRAND.description,
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#f0efec',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
