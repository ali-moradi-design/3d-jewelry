import type { ReactNode } from 'react';
import styles from './section-heading.module.css';

type Props = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  tone?: 'light' | 'dark';
};

export function SectionHeading({ id, eyebrow, title, tone = 'light' }: Props) {
  return (
    <header className={`${styles.root} ${tone === 'dark' ? styles.dark : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
    </header>
  );
}
