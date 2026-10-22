import { SectionHeading } from '@/shared/ui/section-heading';
import styles from './craftsmanship.module.css';

const STEPS = [
  {
    numeral: 'I',
    title: 'Design',
    text: 'A sketch, a wax model and a first render on screen before any metal is cut.',
  },
  {
    numeral: 'II',
    title: 'Casting',
    text: 'The metal is poured into the mold and the rough form is freed by hand.',
  },
  {
    numeral: 'III',
    title: 'Setting',
    text: 'Every stone is set under a loupe, one prong at a time.',
  },
  {
    numeral: 'IV',
    title: 'Polish',
    text: 'A last hand finish, a full inspection and a signed certificate.',
  },
] as const;

export function Craftsmanship() {
  return (
    <section id="atelier" className={styles.section} aria-labelledby="atelier-title">
      <div className={styles.inner}>
        <SectionHeading
          id="atelier-title"
          eyebrow="03 — Craftsmanship"
          title="Four stages, one piece"
        />
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.numeral} aria-hidden="true">
                {step.numeral}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
        <blockquote className={styles.quote}>
          <p>“A good ring is finished when you stop noticing the work and only see the light.”</p>
          <footer>The Aurelune atelier (fictional)</footer>
        </blockquote>
      </div>
    </section>
  );
}
