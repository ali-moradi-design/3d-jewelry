import { BRAND, CREDITS, ORIGINAL_WORK } from '@/shared/config';
import styles from './site-footer.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.notice}>{BRAND.notice}</p>
        <p className={styles.built}>Design and build by Ali Moradi.</p>
      </div>

      <section id="credits" aria-labelledby="credits-title" className={styles.credits}>
        <h2 id="credits-title" className={styles.creditsTitle}>
          Credits
        </h2>
        <p className={styles.original}>{ORIGINAL_WORK}</p>
        <ul className={styles.list}>
          {CREDITS.map((credit) => (
            <li key={credit.name}>
              <a href={credit.href} target="_blank" rel="noreferrer">
                {credit.name}
              </a>{' '}
              — {credit.author}, {credit.license}. {credit.note}
            </li>
          ))}
        </ul>
      </section>
    </footer>
  );
}
