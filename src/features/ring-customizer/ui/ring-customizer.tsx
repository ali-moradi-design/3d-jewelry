'use client';

import { useId } from 'react';
import { formatPrice } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { METALS, STONES, priceOf, selectRing, useRingSelection } from '@/entities/ring';
import styles from './ring-customizer.module.css';

export function RingCustomizer() {
  const { metal, stone } = useRingSelection();
  const group = useId();
  const metalLabel = METALS.find((m) => m.id === metal)?.label;
  const stoneLabel = STONES.find((s) => s.id === stone)?.label;

  return (
    <div className={styles.root}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Metal <span className={styles.current}>{metalLabel}</span>
        </legend>
        <div className={styles.swatches}>
          {METALS.map((option) => (
            <label key={option.id} className={styles.swatch}>
              <input
                className={styles.input}
                type="radio"
                name={`${group}-metal`}
                value={option.id}
                checked={metal === option.id}
                onChange={() => selectRing({ metal: option.id })}
              />
              <span className={styles.dot} style={{ background: option.swatch }} />
              <span className="visually-hidden">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Stone <span className={styles.current}>{stoneLabel}</span>
        </legend>
        <div className={styles.chips}>
          {STONES.map((option) => (
            <label key={option.id} className={styles.chip}>
              <input
                className={styles.input}
                type="radio"
                name={`${group}-stone`}
                value={option.id}
                checked={stone === option.id}
                onChange={() => selectRing({ stone: option.id })}
              />
              <span className={styles.chipLabel}>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className={styles.price} aria-live="polite">
        <span data-testid="ring-price">{formatPrice(priceOf(metal, stone))}</span>
        <span className={styles.demo}>Demo price</span>
      </p>

      <Button href="#appointment">Reserve this ring</Button>
    </div>
  );
}
