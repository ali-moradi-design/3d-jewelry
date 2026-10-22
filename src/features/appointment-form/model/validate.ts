export type AppointmentValues = {
  name: string;
  email: string;
  date: string;
  note: string;
};

export type AppointmentErrors = Partial<Record<keyof AppointmentValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** `today` is injected so tests do not depend on the clock. */
export function validateAppointment(values: AppointmentValues, today: string): AppointmentErrors {
  const errors: AppointmentErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.date) errors.date = 'Please choose a date.';
  else if (values.date < today) errors.date = 'Please choose a date in the future.';
  return errors;
}
