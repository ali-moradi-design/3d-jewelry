import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './button.module.css';

type Variant = 'solid' | 'outline' | 'outline-light';

type CommonProps = { variant?: Variant };
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'solid', className, ...rest } = props;
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  if (typeof rest.href === 'string') {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes} />;
  }
  return (
    <button
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    />
  );
}
