import { useState } from "react";
import styles from "./RatingControl.module.css";

interface RatingControlProps {
  value: number | null;
  disabled?: boolean;
  isSubmitting?: boolean;
  onChange: (value: number) => void;
}

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

function RatingControl({
  value,
  disabled = false,
  isSubmitting = false,
  onChange,
}: RatingControlProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const displayedValue = hoveredValue ?? value ?? 0;
  const isDisabled = disabled || isSubmitting;

  return (
    <fieldset className={styles.fieldset} disabled={isDisabled}>
      <legend className={styles.legend}>Your rating</legend>

      <div className={styles.stars} onMouseLeave={() => setHoveredValue(null)}>
        {RATING_VALUES.map((ratingValue) => {
          const isActive = ratingValue <= displayedValue;

          return (
            <button
              key={ratingValue}
              className={[
                styles.starButton,
                isActive ? styles.active : "",
              ].join(" ")}
              type="button"
              aria-label={`Rate ${ratingValue} out of 5`}
              aria-pressed={value === ratingValue}
              disabled={isDisabled}
              onMouseEnter={() => setHoveredValue(ratingValue)}
              onFocus={() => setHoveredValue(ratingValue)}
              onBlur={() => setHoveredValue(null)}
              onClick={() => onChange(ratingValue)}
            >
              <span aria-hidden="true">★</span>
            </button>
          );
        })}
      </div>

      <p className={styles.status} aria-live="polite">
        {isSubmitting
          ? "Saving rating..."
          : value === null
            ? "You have not rated this recipe yet."
            : `Your rating: ${value} out of 5`}
      </p>
    </fieldset>
  );
}

export default RatingControl;
