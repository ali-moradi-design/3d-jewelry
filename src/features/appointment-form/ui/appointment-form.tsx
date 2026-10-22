'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/ui/button';
import { findMetal, findStone, useRingSelection } from '@/entities/ring';
import {
  validateAppointment,
  type AppointmentErrors,
  type AppointmentValues,
} from '../model/validate';
import styles from './appointment-form.module.css';

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AppointmentForm() {
  const ring = useRingSelection();
  const [values, setValues] = useState<AppointmentValues>({
    name: '',
    email: '',
    date: '',
    note: '',
  });
  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [sent, setSent] = useState(false);

  const interest = `${findMetal(ring.metal).label} Aurel solitaire with a ${findStone(ring.stone).label.toLowerCase()}`;

  const update = (key: keyof AppointmentValues) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateAppointment(values, todayIso());
    setErrors(found);
    // Demo only: nothing is sent anywhere.
    if (Object.keys(found).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.done} role="status">
        <h3 className={styles.doneTitle}>Thank you, {values.name.trim()}.</h3>
        <p>
          This is a demo, so nothing was sent. In a real shop we would now confirm a private viewing
          of the {interest} on {values.date}.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Start again
        </Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <p className={styles.interest}>
        <span>Interested in</span> {interest}
      </p>

      <Field label="Name" error={errors.name}>
        {(props) => (
          <input
            {...props}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
          />
        )}
      </Field>
      <Field label="Email" error={errors.email}>
        {(props) => (
          <input
            {...props}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
          />
        )}
      </Field>
      <Field label="Preferred date" error={errors.date}>
        {(props) => (
          <input
            {...props}
            type="date"
            min={todayIso()}
            value={values.date}
            onChange={update('date')}
          />
        )}
      </Field>
      <Field label="Anything we should know? (optional)">
        {(props) => <textarea {...props} rows={3} value={values.note} onChange={update('note')} />}
      </Field>

      <Button type="submit">Request a visit</Button>
      <p className={styles.fine}>Demo form: nothing is sent or stored.</p>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: (props: {
    id: string;
    name: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const id = `appointment-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const errorId = `${id}-error`;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        name: id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
