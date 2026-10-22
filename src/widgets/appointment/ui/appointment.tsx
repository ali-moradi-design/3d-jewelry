import { SectionHeading } from '@/shared/ui/section-heading';
import { AppointmentForm } from '@/features/appointment-form';
import styles from './appointment.module.css';

export function Appointment() {
  return (
    <section id="appointment" className={styles.section} aria-labelledby="appointment-title">
      <div className={styles.grid}>
        <div>
          <SectionHeading
            id="appointment-title"
            eyebrow="04 — Visit us"
            title="Book an appointment"
          />
          <p className={styles.copy}>
            Private viewings, one client at a time. Tell us which piece caught your eye and when you
            would like to come in.
          </p>
          <address className={styles.address}>
            12 Rue de la Lune
            <br />
            Paris, France
            <br />
            <span>(a made-up address)</span>
          </address>
        </div>
        <AppointmentForm />
      </div>
    </section>
  );
}
