export default function GuestStepper({ value, onChange, min = 1, max = 8 }) {
  return (
    <div className="stepper" role="group" aria-label="Guests">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease guests"
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase guests"
      >
        +
      </button>
    </div>
  );
}
