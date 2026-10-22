import { BRAND, NAV_LINKS } from '@/shared/config';
import styles from './site-header.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header} data-overlay>
      <a className={styles.logo} href="#main" aria-label={`${BRAND.name}, back to top`}>
        {BRAND.name}
      </a>
      <nav aria-label="Main">
        <ul className={styles.list}>
          {NAV_LINKS.map((link) => (
            <li
              key={link.href}
              className={link.href === '#appointment' ? styles.always : styles.optional}
            >
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
